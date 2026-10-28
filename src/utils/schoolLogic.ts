import {
  LessonSchedule,
  SchoolClass,
  StudentAttendanceRecord,
  StudentTaskStatus,
  TeachingAssignment,
  UserProfile,
} from '../types';

/**
 * Validates a scanned QR Code identifier for classes.
 * Format standard: CLASS-[GRADE]-[SECTION]-[YEAR] (e.g. CLASS-VII-A-2026)
 */
export function validateClassQrCode(
  scannedCode: string,
  classes: SchoolClass[]
): { isValid: boolean; schoolClass?: SchoolClass; errorMessage?: string } {
  if (!scannedCode || typeof scannedCode !== 'string') {
    return { isValid: false, errorMessage: 'Kode QR kosong atau tidak valid.' };
  }

  const cleaned = scannedCode.trim();
  const match = classes.find((c) => c.qrIdentifier === cleaned);

  if (!match) {
    return {
      isValid: false,
      errorMessage: `Kode QR "${cleaned}" tidak terdaftar dalam basis data kelas aktif tahun ajaran ini.`,
    };
  }

  return { isValid: true, schoolClass: match };
}

/**
 * Checks whether a user has permission to view or manage a specific class.
 * Admin, Kepala Sekolah, Wakasek Kurikulum, & Wakasek Kesiswaan have school-wide oversight.
 * Wali Kelas has access to their homeroom class.
 * Guru Mapel has access if they teach that class.
 */
export function canUserAccessClass(
  user: UserProfile,
  classId: string,
  teachingAssignments: TeachingAssignment[]
): { hasAccess: boolean; reason?: string } {
  if (!user || !user.isActive) {
    return { hasAccess: false, reason: 'Pengguna tidak aktif.' };
  }

  // School leadership & administrators
  const leadershipRoles = [
    'admin',
    'kepala_sekolah',
    'wakasek_kurikulum',
    'wakasek_kesiswaan',
    'wakasek_humas',
    'wakasek_sarpras',
  ];

  if (user.roles.some((r) => leadershipRoles.includes(r))) {
    return { hasAccess: true, reason: 'Akses pimpinan / administrator' };
  }

  // Homeroom teacher (Wali Kelas)
  if (user.roles.includes('wali_kelas') && user.homeroomClassId === classId) {
    return { hasAccess: true, reason: 'Akses wali kelas' };
  }

  // Subject teacher assigned to this class
  const isAssigned = teachingAssignments.some(
    (ta) => ta.teacherId === user.id && ta.classId === classId
  );
  if (isAssigned) {
    return { hasAccess: true, reason: 'Akses guru mata pelajaran' };
  }

  return {
    hasAccess: false,
    reason: 'Anda tidak memiliki hak akses sebagai wali kelas atau guru pengampu di kelas ini.',
  };
}

/**
 * Detects schedule collisions:
 * 1. Guru cannot teach 2 classes at the same day & time/period.
 * 2. Class cannot have 2 different lessons at the same day & time/period.
 */
export function checkScheduleConflict(
  candidate: {
    dayOfWeek: string;
    periodNumber: number;
    startTime: string;
    endTime: string;
    classId: string;
    teacherId: string;
  },
  existingSchedules: LessonSchedule[],
  excludeScheduleId?: string
): { hasConflict: boolean; conflictType?: 'teacher' | 'class'; conflictMessage?: string } {
  for (const item of existingSchedules) {
    if (excludeScheduleId && item.id === excludeScheduleId) {
      continue;
    }

    if (item.dayOfWeek === candidate.dayOfWeek) {
      // Check time or period overlap
      const periodOverlap = item.periodNumber === candidate.periodNumber;
      const timeOverlap =
        candidate.startTime < item.endTime && candidate.endTime > item.startTime;

      if (periodOverlap || timeOverlap) {
        // Teacher conflict: Same teacher teaching two different places
        if (item.teacherId === candidate.teacherId && item.classId !== candidate.classId) {
          return {
            hasConflict: true,
            conflictType: 'teacher',
            conflictMessage: `Benturan Jadwal Guru: Guru ini sudah dijadwalkan mengajar di ${item.className} pada hari ${item.dayOfWeek} jam ${item.startTime}-${item.endTime} (Jam ke-${item.periodNumber}).`,
          };
        }

        // Class conflict: Class has 2 lessons simultaneously
        if (item.classId === candidate.classId) {
          return {
            hasConflict: true,
            conflictType: 'class',
            conflictMessage: `Benturan Jadwal Kelas: Kelas ${item.className} sudah memiliki jadwal pelajaran ${item.subjectName} pada hari ${item.dayOfWeek} jam ${item.startTime}-${item.endTime}.`,
          };
        }
      }
    }
  }

  return { hasConflict: false };
}

/**
 * Determines incomplete tasks for monitoring.
 * Statuses considered incomplete: belum_mengerjakan, sedang_mengerjakan, perlu_perbaikan.
 */
export function isIncompleteTask(status: StudentTaskStatus['status']): boolean {
  return (
    status === 'belum_mengerjakan' ||
    status === 'sedang_mengerjakan' ||
    status === 'perlu_perbaikan'
  );
}

/**
 * Computes summary of task completions.
 */
export function summarizeTaskStatuses(statuses: StudentTaskStatus[]): {
  total: number;
  completed: number;
  incomplete: number;
  completionRate: number;
  breakdown: Record<StudentTaskStatus['status'], number>;
} {
  const breakdown: Record<StudentTaskStatus['status'], number> = {
    belum_mengerjakan: 0,
    sedang_mengerjakan: 0,
    sudah_mengumpulkan: 0,
    perlu_perbaikan: 0,
    tuntas: 0,
  };

  for (const s of statuses) {
    if (breakdown[s.status] !== undefined) {
      breakdown[s.status]++;
    }
  }

  const total = statuses.length;
  // 'tuntas' and 'sudah_mengumpulkan' can be considered submitted/done
  const completed = breakdown.tuntas + breakdown.sudah_mengumpulkan;
  const incomplete = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, incomplete, completionRate, breakdown };
}

/**
 * Calculates attendance rates from attendance records.
 */
export function calculateAttendanceMetrics(records: StudentAttendanceRecord[]): {
  total: number;
  present: number;
  excused: number;
  sick: number;
  absent: number;
  dispensation: number;
  presencePercentage: number;
} {
  let present = 0;
  let excused = 0;
  let sick = 0;
  let absent = 0;
  let dispensation = 0;

  for (const r of records) {
    if (r.status === 'Hadir') present++;
    else if (r.status === 'Izin') excused++;
    else if (r.status === 'Sakit') sick++;
    else if (r.status === 'Alpa') absent++;
    else if (r.status === 'Dispensasi') dispensation++;
  }

  const total = records.length;
  const effectivePresent = present + dispensation;
  const presencePercentage = total > 0 ? Math.round((effectivePresent / total) * 100) : 0;

  return {
    total,
    present,
    excused,
    sick,
    absent,
    dispensation,
    presencePercentage,
  };
}

/**
 * Validates a CSV row for task submission import.
 * Expected columns: nis, nama, status, nilai, catatan
 */
export function validateCsvTaskRow(
  row: Record<string, string>,
  validNisList: string[]
): { isValid: boolean; error?: string; parsedData?: { nis: string; status: StudentTaskStatus['status']; grade?: number; notes?: string } } {
  const nis = (row.nis || row.NIS || '').trim();
  if (!nis) {
    return { isValid: false, error: 'NIS tidak boleh kosong.' };
  }

  if (!validNisList.includes(nis)) {
    return { isValid: false, error: `NIS "${nis}" tidak terdaftar dalam kelas ini.` };
  }

  const rawStatus = (row.status || row.Status || '').trim().toLowerCase();
  let status: StudentTaskStatus['status'] = 'belum_mengerjakan';

  if (rawStatus === 'tuntas' || rawStatus === 'selesai' || rawStatus === 'lunas') {
    status = 'tuntas';
  } else if (rawStatus === 'sudah mengumpulkan' || rawStatus === 'dikumpulkan' || rawStatus === 'sudah_mengumpulkan') {
    status = 'sudah_mengumpulkan';
  } else if (rawStatus === 'sedang mengerjakan' || rawStatus === 'proses' || rawStatus === 'sedang_mengerjakan') {
    status = 'sedang_mengerjakan';
  } else if (rawStatus === 'perlu perbaikan' || rawStatus === 'revisi' || rawStatus === 'perlu_perbaikan') {
    status = 'perlu_perbaikan';
  } else if (rawStatus === 'belum' || rawStatus === 'belum mengerjakan' || rawStatus === 'belum_mengerjakan') {
    status = 'belum_mengerjakan';
  } else if (rawStatus !== '') {
    return {
      isValid: false,
      error: `Status "${rawStatus}" tidak valid. Pilihan: tuntas, sudah mengumpulkan, sedang mengerjakan, perlu perbaikan, belum mengerjakan.`,
    };
  }

  let grade: number | undefined = undefined;
  const gradeStr = (row.nilai || row.Nilai || '').trim();
  if (gradeStr !== '') {
    const parsedGrade = Number(gradeStr);
    if (isNaN(parsedGrade) || parsedGrade < 0 || parsedGrade > 100) {
      return { isValid: false, error: `Nilai "${gradeStr}" harus angka antara 0 - 100.` };
    }
    grade = parsedGrade;
  }

  const notes = (row.catatan || row.Catatan || '').trim();

  return {
    isValid: true,
    parsedData: { nis, status, grade, notes },
  };
}

/**
 * Determines staff attendance status based on check-in time and threshold.
 */
export function determineStaffAttendanceStatus(
  checkInTimeStr: string, // "HH:mm"
  lateThresholdStr: string = '07:15' // "HH:mm"
): 'Hadir' | 'Terlambat' {
  if (!checkInTimeStr) return 'Hadir';
  return checkInTimeStr > lateThresholdStr ? 'Terlambat' : 'Hadir';
}
