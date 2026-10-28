export type UserRole =
  | 'admin'
  | 'kepala_sekolah'
  | 'wakasek_kurikulum'
  | 'wakasek_kesiswaan'
  | 'wakasek_humas'
  | 'wakasek_sarpras'
  | 'wali_kelas'
  | 'guru_mapel'
  | 'staf_tu'
  | 'staf_kebersihan'
  | 'staf_keamanan'
  | 'staf_koperasi';

export interface UserProfile {
  id: string;
  nipOrId: string;
  username: string;
  fullName: string;
  academicTitle?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  position: string;
  workUnit: string;
  roles: UserRole[];
  homeroomClassId?: string; // If user is wali kelas
  teachingSubjectIds?: string[]; // If user is guru mapel
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  fullName: string;
  gender: 'L' | 'P';
  classId: string;
  absentNumber: number;
  birthDate?: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
  isActive: boolean;
}

export interface SchoolClass {
  id: string;
  grade: 'VII' | 'VIII' | 'IX';
  name: string; // e.g. "VII-A"
  academicYear: string; // e.g. "2025/2026"
  homeroomTeacherId: string;
  homeroomTeacherName: string;
  qrIdentifier: string; // e.g. "CLASS-VII-A-2026"
  capacity: number;
  roomName: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string; // e.g. "Matematika", "Bahasa Indonesia"
  category: 'Wajib' | 'Pilihan' | 'Muatan Lokal';
  weeklyHours: number;
}

export interface TeachingAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  academicTitle?: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  academicYear: string;
}

export interface LessonSchedule {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  dayOfWeek: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  periodNumber: number; // Jam ke-1, 2, dll
  startTime: string; // "07:30"
  endTime: string; // "09:00"
  roomName: string;
  academicYear: string;
}

export type StudentAttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa' | 'Dispensasi';

export interface StudentAttendanceRecord {
  studentId: string;
  studentName: string;
  nis: string;
  absentNumber: number;
  gender: 'L' | 'P';
  status: StudentAttendanceStatus;
  note?: string;
}

export interface LessonSession {
  id: string;
  scheduleId: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  topic: string;
  activityDescription: string;
  additionalNotes?: string;
  attendance: StudentAttendanceRecord[];
  isSubmitted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus =
  | 'belum_mengerjakan'
  | 'sedang_mengerjakan'
  | 'sudah_mengumpulkan'
  | 'perlu_perbaikan'
  | 'tuntas';

export interface StudentTaskStatus {
  id: string;
  taskId: string;
  studentId: string;
  studentName: string;
  absentNumber: number;
  nis: string;
  status: TaskStatus;
  grade?: number;
  notes?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface SchoolTask {
  id: string;
  title: string;
  description: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  teacherTitle?: string;
  assignedDate: string;
  dueDate: string;
  maxScore?: number;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
}

export type StaffAttendanceStatus =
  | 'Hadir'
  | 'Terlambat'
  | 'Izin'
  | 'Sakit'
  | 'Cuti'
  | 'Dinas Luar'
  | 'Tidak Hadir';

export interface StaffAttendance {
  id: string;
  userId: string;
  nipOrId: string;
  userName: string;
  position: string;
  workUnit: string;
  date: string; // YYYY-MM-DD
  checkInTime?: string; // HH:mm:ss
  checkOutTime?: string; // HH:mm:ss
  status: StaffAttendanceStatus;
  notes?: string;
  isCorrected?: boolean;
  correctionReason?: string;
  correctedBy?: string;
  correctedAt?: string;
  createdAt: string;
}

export interface PicketSchedule {
  id: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  staffId: string;
  staffName: string;
  staffPosition: string;
  taskType: 'Piket Gerbang & Kehadiran' | 'Piket KBM & Ketertiban' | 'Piket UKS & Kebersihan' | 'Piket Umum';
  timeSlot: string; // e.g. "06:30 - 15:00"
  location: string;
  notes?: string;
}

export interface OrganizationPosition {
  id: string;
  title: string;
  level: number; // 1 for Kepala Sekolah, 2 for Wakasek, 3 for Guru/Wali Kelas, 4 for Staf
  parentId?: string;
  holderName: string;
  holderNip: string;
  holderTitle?: string;
  workUnit: string;
  responsibilities: string[];
}

export interface SchoolRule {
  id: string;
  category: 'Ketentuan Umum' | 'Kedisiplinan' | 'Kehadiran' | 'Kegiatan Pembelajaran' | 'Penggunaan Fasilitas' | 'Tanggung Jawab dan Perilaku';
  title: string;
  description: string;
  pointsRule?: number; // poin pelanggaran jika ada
  sanction?: string;
  effectiveDate: string;
  version: string;
  updatedAt: string;
  updatedBy: string;
  isDemo: boolean;
}

export interface SchoolSettings {
  schoolName: string;
  npsn: string;
  schoolLevel: string; // "SMP / MTs"
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  address: string;
  headmasterName: string;
  headmasterNip: string;
  contactEmail: string;
  contactPhone: string;
  workStartHour: string; // "07:00"
  lateThresholdHour: string; // "07:15"
  workEndHour: string; // "15:00"
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
}
