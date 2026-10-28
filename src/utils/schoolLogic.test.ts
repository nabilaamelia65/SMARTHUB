import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateClassQrCode,
  canUserAccessClass,
  checkScheduleConflict,
  isIncompleteTask,
  summarizeTaskStatuses,
  calculateAttendanceMetrics,
  validateCsvTaskRow,
  determineStaffAttendanceStatus,
} from './schoolLogic';
import {
  SchoolClass,
  UserProfile,
  TeachingAssignment,
  LessonSchedule,
  StudentTaskStatus,
  StudentAttendanceRecord,
} from '../types';

const mockClasses: SchoolClass[] = [
  {
    id: 'class-7a',
    grade: 'VII',
    name: 'VII-A',
    academicYear: '2025/2026',
    homeroomTeacherId: 'user-wali-7a',
    homeroomTeacherName: 'Dra. Hj. Siti Rahmawati, M.Pd.',
    qrIdentifier: 'CLASS-VII-A-2026',
    capacity: 32,
    roomName: 'Ruang 7.1',
  },
  {
    id: 'class-8a',
    grade: 'VIII',
    name: 'VIII-A',
    academicYear: '2025/2026',
    homeroomTeacherId: 'user-wali-8a',
    homeroomTeacherName: 'Ahmad Fauzi, S.Pd., M.Si.',
    qrIdentifier: 'CLASS-VIII-A-2026',
    capacity: 32,
    roomName: 'Ruang 8.1',
  },
];

test('validateClassQrCode returns class for valid code', () => {
  const result = validateClassQrCode('CLASS-VII-A-2026', mockClasses);
  assert.equal(result.isValid, true);
  assert.equal(result.schoolClass?.id, 'class-7a');
});

test('validateClassQrCode returns error for unknown code', () => {
  const result = validateClassQrCode('CLASS-UNKNOWN-9999', mockClasses);
  assert.equal(result.isValid, false);
  assert.match(result.errorMessage || '', /tidak terdaftar/);
});

test('canUserAccessClass grants admin full access', () => {
  const adminUser: UserProfile = {
    id: 'user-admin',
    nipOrId: 'ADM001',
    username: 'admin',
    fullName: 'Administrator Sekolah',
    email: 'admin@school.sch.id',
    position: 'Operator SIMS',
    workUnit: 'Tata Usaha',
    roles: ['admin'],
    isActive: true,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  };
  const access = canUserAccessClass(adminUser, 'class-7a', []);
  assert.equal(access.hasAccess, true);
});

test('canUserAccessClass grants homeroom teacher access to their own class only', () => {
  const homeroomUser: UserProfile = {
    id: 'user-wali-7a',
    nipOrId: '197505121999032001',
    username: 'siti.rahmawati',
    fullName: 'Dra. Hj. Siti Rahmawati, M.Pd.',
    email: 'siti@school.sch.id',
    position: 'Guru Madya & Wali Kelas VII-A',
    workUnit: 'Tenaga Pendidik',
    roles: ['wali_kelas', 'guru_mapel'],
    homeroomClassId: 'class-7a',
    isActive: true,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  };
  const ownClass = canUserAccessClass(homeroomUser, 'class-7a', []);
  assert.equal(ownClass.hasAccess, true);

  const otherClass = canUserAccessClass(homeroomUser, 'class-8a', []);
  assert.equal(otherClass.hasAccess, false);
});

test('checkScheduleConflict detects teacher conflict on identical day and time', () => {
  const existingSchedules: LessonSchedule[] = [
    {
      id: 'sched-1',
      classId: 'class-7a',
      className: 'VII-A',
      subjectId: 'sub-mtk',
      subjectName: 'Matematika',
      teacherId: 'teacher-1',
      teacherName: 'Budi Santoso, M.Pd.',
      dayOfWeek: 'Senin',
      periodNumber: 1,
      startTime: '07:30',
      endTime: '09:00',
      roomName: 'Ruang 7.1',
      academicYear: '2025/2026',
    },
  ];

  // Try assigning same teacher to class 8A at the same time
  const conflict = checkScheduleConflict(
    {
      dayOfWeek: 'Senin',
      periodNumber: 1,
      startTime: '07:30',
      endTime: '09:00',
      classId: 'class-8a',
      teacherId: 'teacher-1',
    },
    existingSchedules
  );

  assert.equal(conflict.hasConflict, true);
  assert.equal(conflict.conflictType, 'teacher');
});

test('checkScheduleConflict allows different teacher and different class without conflict', () => {
  const existingSchedules: LessonSchedule[] = [
    {
      id: 'sched-1',
      classId: 'class-7a',
      className: 'VII-A',
      subjectId: 'sub-mtk',
      subjectName: 'Matematika',
      teacherId: 'teacher-1',
      teacherName: 'Budi Santoso, M.Pd.',
      dayOfWeek: 'Senin',
      periodNumber: 1,
      startTime: '07:30',
      endTime: '09:00',
      roomName: 'Ruang 7.1',
      academicYear: '2025/2026',
    },
  ];

  const noConflict = checkScheduleConflict(
    {
      dayOfWeek: 'Senin',
      periodNumber: 1,
      startTime: '07:30',
      endTime: '09:00',
      classId: 'class-8a',
      teacherId: 'teacher-2',
    },
    existingSchedules
  );

  assert.equal(noConflict.hasConflict, false);
});

test('isIncompleteTask identifies incomplete task statuses properly', () => {
  assert.equal(isIncompleteTask('belum_mengerjakan'), true);
  assert.equal(isIncompleteTask('sedang_mengerjakan'), true);
  assert.equal(isIncompleteTask('perlu_perbaikan'), true);
  assert.equal(isIncompleteTask('sudah_mengumpulkan'), false);
  assert.equal(isIncompleteTask('tuntas'), false);
});

test('summarizeTaskStatuses aggregates correctly', () => {
  const sampleStatuses: StudentTaskStatus[] = [
    {
      id: '1',
      taskId: 't1',
      studentId: 's1',
      studentName: 'Andi',
      absentNumber: 1,
      nis: '1001',
      status: 'tuntas',
      updatedAt: '2025-01-01',
      updatedBy: 'Guru',
    },
    {
      id: '2',
      taskId: 't1',
      studentId: 's2',
      studentName: 'Budi',
      absentNumber: 2,
      nis: '1002',
      status: 'belum_mengerjakan',
      updatedAt: '2025-01-01',
      updatedBy: 'Guru',
    },
    {
      id: '3',
      taskId: 't1',
      studentId: 's3',
      studentName: 'Citra',
      absentNumber: 3,
      nis: '1003',
      status: 'perlu_perbaikan',
      updatedAt: '2025-01-01',
      updatedBy: 'Guru',
    },
  ];

  const summary = summarizeTaskStatuses(sampleStatuses);
  assert.equal(summary.total, 3);
  assert.equal(summary.completed, 1);
  assert.equal(summary.incomplete, 2);
  assert.equal(summary.completionRate, 33);
});

test('calculateAttendanceMetrics computes accurate percentage', () => {
  const records: StudentAttendanceRecord[] = [
    { studentId: '1', studentName: 'A', nis: '1', absentNumber: 1, gender: 'L', status: 'Hadir' },
    { studentId: '2', studentName: 'B', nis: '2', absentNumber: 2, gender: 'P', status: 'Hadir' },
    { studentId: '3', studentName: 'C', nis: '3', absentNumber: 3, gender: 'L', status: 'Izin' },
    { studentId: '4', studentName: 'D', nis: '4', absentNumber: 4, gender: 'P', status: 'Sakit' },
  ];

  const metrics = calculateAttendanceMetrics(records);
  assert.equal(metrics.total, 4);
  assert.equal(metrics.present, 2);
  assert.equal(metrics.presencePercentage, 50);
});

test('validateCsvTaskRow rejects missing or invalid NIS', () => {
  const validNis = ['1001', '1002'];
  const res = validateCsvTaskRow({ nis: '9999', status: 'tuntas' }, validNis);
  assert.equal(res.isValid, false);
  assert.match(res.error || '', /tidak terdaftar/);
});

test('determineStaffAttendanceStatus flags late check in', () => {
  assert.equal(determineStaffAttendanceStatus('07:10', '07:15'), 'Hadir');
  assert.equal(determineStaffAttendanceStatus('07:25', '07:15'), 'Terlambat');
});
