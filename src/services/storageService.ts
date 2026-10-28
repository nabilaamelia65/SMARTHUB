import {
  AuditLog,
  LessonSchedule,
  LessonSession,
  OrganizationPosition,
  PicketSchedule,
  SchoolClass,
  SchoolRule,
  SchoolSettings,
  SchoolTask,
  StaffAttendance,
  Student,
  StudentTaskStatus,
  Subject,
  TeachingAssignment,
  UserProfile,
} from '../types';
import {
  initialClasses,
  initialLessonSchedules,
  initialLessonSessions,
  initialOrganizationPositions,
  initialPicketSchedules,
  initialSchoolRules,
  initialSchoolSettings,
  initialStaffAttendances,
  initialStudents,
  initialStudentTaskStatuses,
  initialSubjects,
  initialTasks,
  initialTeachingAssignments,
  initialUsers,
} from '../data/mockData';
import { determineStaffAttendanceStatus } from '../utils/schoolLogic';

const STORAGE_KEYS = {
  USERS: 'schoolhub_users',
  CLASSES: 'schoolhub_classes',
  STUDENTS: 'schoolhub_students',
  SUBJECTS: 'schoolhub_subjects',
  ASSIGNMENTS: 'schoolhub_teaching_assignments',
  SCHEDULES: 'schoolhub_lesson_schedules',
  SESSIONS: 'schoolhub_lesson_sessions',
  TASKS: 'schoolhub_tasks',
  TASK_STATUSES: 'schoolhub_student_task_statuses',
  STAFF_ATTENDANCE: 'schoolhub_staff_attendance',
  PICKET: 'schoolhub_picket_schedules',
  ORGANIZATION: 'schoolhub_organization',
  RULES: 'schoolhub_rules',
  SETTINGS: 'schoolhub_settings',
  AUDIT: 'schoolhub_audit_logs',
};

type Listener = () => void;

class StorageService {
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.ensureInitialized();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('Storage listener error:', err);
      }
    });
  }

  private ensureInitialized() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(initialClasses));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initialStudents));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(initialSubjects));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(initialTeachingAssignments));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SCHEDULES)) {
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(initialLessonSchedules));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(initialLessonSessions));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASK_STATUSES)) {
      localStorage.setItem(STORAGE_KEYS.TASK_STATUSES, JSON.stringify(initialStudentTaskStatuses));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STAFF_ATTENDANCE)) {
      localStorage.setItem(STORAGE_KEYS.STAFF_ATTENDANCE, JSON.stringify(initialStaffAttendances));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PICKET)) {
      localStorage.setItem(STORAGE_KEYS.PICKET, JSON.stringify(initialPicketSchedules));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORGANIZATION)) {
      localStorage.setItem(STORAGE_KEYS.ORGANIZATION, JSON.stringify(initialOrganizationPositions));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RULES)) {
      localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(initialSchoolRules));
    }
    const currentStoredSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!currentStoredSettings || currentStoredSettings.includes('TELADAN')) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSchoolSettings));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
      const initialAudit: AuditLog[] = [
        {
          id: 'log-init',
          timestamp: new Date().toISOString(),
          userId: 'system',
          userName: 'System Bootstrapper',
          action: 'INIT_SYSTEM',
          module: 'Core',
          details: 'Inisialisasi data demonstrasi master SCHOOLHUB berhasil.',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(initialAudit));
    }
  }

  private getItem<T>(key: string, fallback: T): T {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify();
    } catch (err) {
      console.error(`Failed to save to ${key}:`, err);
    }
  }

  // --- Reset to Demo ---
  public resetToDemo(): void {
    localStorage.clear();
    this.ensureInitialized();
    this.notify();
  }

  // --- School Settings ---
  public getSettings(): SchoolSettings {
    return this.getItem(STORAGE_KEYS.SETTINGS, initialSchoolSettings);
  }

  public saveSettings(settings: SchoolSettings, actorName = 'Admin'): void {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
    this.addAuditLog(actorName, 'UPDATE_SETTINGS', 'Pengaturan', 'Memperbarui identitas dan jam kerja sekolah');
  }

  // --- Users ---
  public getUsers(): UserProfile[] {
    return this.getItem(STORAGE_KEYS.USERS, initialUsers);
  }

  public getUserById(id: string): UserProfile | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  public saveUser(user: UserProfile, actorName = 'Admin'): void {
    const list = this.getUsers();
    const idx = list.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      list[idx] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...user, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.setItem(STORAGE_KEYS.USERS, list);
    this.addAuditLog(actorName, idx >= 0 ? 'UPDATE_USER' : 'CREATE_USER', 'Akun Pengguna', `Menyimpan data pengguna ${user.fullName}`);
  }

  public deleteUser(id: string, actorName = 'Admin'): void {
    const list = this.getUsers().filter((u) => u.id !== id);
    this.setItem(STORAGE_KEYS.USERS, list);
    this.addAuditLog(actorName, 'DELETE_USER', 'Akun Pengguna', `Menghapus akun ID: ${id}`);
  }

  // --- Classes ---
  public getClasses(): SchoolClass[] {
    return this.getItem(STORAGE_KEYS.CLASSES, initialClasses);
  }

  public getClassById(id: string): SchoolClass | undefined {
    return this.getClasses().find((c) => c.id === id);
  }

  public saveClass(schoolClass: SchoolClass, actorName = 'Admin'): void {
    const list = this.getClasses();
    const idx = list.findIndex((c) => c.id === schoolClass.id);
    if (idx >= 0) {
      list[idx] = schoolClass;
    } else {
      list.push(schoolClass);
    }
    this.setItem(STORAGE_KEYS.CLASSES, list);
    this.addAuditLog(actorName, idx >= 0 ? 'UPDATE_CLASS' : 'CREATE_CLASS', 'Data Kelas', `Menyimpan rombel ${schoolClass.name}`);
  }

  // --- Students ---
  public getStudents(): Student[] {
    return this.getItem(STORAGE_KEYS.STUDENTS, initialStudents);
  }

  public getStudentsByClass(classId: string): Student[] {
    return this.getStudents()
      .filter((s) => s.classId === classId && s.isActive)
      .sort((a, b) => a.absentNumber - b.absentNumber);
  }

  public saveStudent(student: Student, actorName = 'Admin'): void {
    const list = this.getStudents();
    const idx = list.findIndex((s) => s.id === student.id);
    if (idx >= 0) {
      list[idx] = student;
    } else {
      list.push(student);
    }
    this.setItem(STORAGE_KEYS.STUDENTS, list);
    this.addAuditLog(actorName, idx >= 0 ? 'UPDATE_STUDENT' : 'CREATE_STUDENT', 'Data Siswa', `Menyimpan siswa ${student.fullName}`);
  }

  public deleteStudent(id: string, actorName = 'Admin'): void {
    const list = this.getStudents().filter((s) => s.id !== id);
    this.setItem(STORAGE_KEYS.STUDENTS, list);
    this.addAuditLog(actorName, 'DELETE_STUDENT', 'Data Siswa', `Menghapus siswa ID: ${id}`);
  }

  // --- Subjects ---
  public getSubjects(): Subject[] {
    return this.getItem(STORAGE_KEYS.SUBJECTS, initialSubjects);
  }

  public saveSubject(subject: Subject, actorName = 'Admin'): void {
    const list = this.getSubjects();
    const idx = list.findIndex((s) => s.id === subject.id);
    if (idx >= 0) {
      list[idx] = subject;
    } else {
      list.push(subject);
    }
    this.setItem(STORAGE_KEYS.SUBJECTS, list);
    this.addAuditLog(actorName, idx >= 0 ? 'UPDATE_SUBJECT' : 'CREATE_SUBJECT', 'Mata Pelajaran', `Menyimpan mapel ${subject.name}`);
  }

  // --- Teaching Assignments ---
  public getTeachingAssignments(): TeachingAssignment[] {
    return this.getItem(STORAGE_KEYS.ASSIGNMENTS, initialTeachingAssignments);
  }

  public saveTeachingAssignment(assignment: TeachingAssignment, actorName = 'Admin'): void {
    const list = this.getTeachingAssignments();
    const idx = list.findIndex((a) => a.id === assignment.id);
    if (idx >= 0) {
      list[idx] = assignment;
    } else {
      list.push(assignment);
    }
    this.setItem(STORAGE_KEYS.ASSIGNMENTS, list);
    this.addAuditLog(actorName, 'UPDATE_ASSIGNMENT', 'Penugasan Guru', `Menetapkan pengampu ${assignment.subjectName} di ${assignment.className}`);
  }

  // --- Lesson Schedules ---
  public getLessonSchedules(): LessonSchedule[] {
    return this.getItem(STORAGE_KEYS.SCHEDULES, initialLessonSchedules);
  }

  public saveLessonSchedule(schedule: LessonSchedule, actorName = 'Admin'): void {
    const list = this.getLessonSchedules();
    const idx = list.findIndex((s) => s.id === schedule.id);
    if (idx >= 0) {
      list[idx] = schedule;
    } else {
      list.push(schedule);
    }
    this.setItem(STORAGE_KEYS.SCHEDULES, list);
    this.addAuditLog(actorName, idx >= 0 ? 'UPDATE_SCHEDULE' : 'CREATE_SCHEDULE', 'Jadwal Pelajaran', `Menyimpan jadwal ${schedule.subjectName} kelas ${schedule.className} hari ${schedule.dayOfWeek}`);
  }

  public deleteLessonSchedule(id: string, actorName = 'Admin'): void {
    const list = this.getLessonSchedules().filter((s) => s.id !== id);
    this.setItem(STORAGE_KEYS.SCHEDULES, list);
    this.addAuditLog(actorName, 'DELETE_SCHEDULE', 'Jadwal Pelajaran', `Menghapus jadwal ID: ${id}`);
  }

  // --- Lesson Sessions (Attendance & Notes) ---
  public getLessonSessions(): LessonSession[] {
    return this.getItem(STORAGE_KEYS.SESSIONS, initialLessonSessions);
  }

  public saveLessonSession(session: LessonSession, actorName = 'Guru'): void {
    const list = this.getLessonSessions();
    const idx = list.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      list[idx] = { ...session, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...session, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.setItem(STORAGE_KEYS.SESSIONS, list);
    this.addAuditLog(
      actorName,
      idx >= 0 ? 'UPDATE_LESSON_SESSION' : 'RECORD_LESSON_SESSION',
      'Absensi & Pembelajaran',
      `Menyimpan absensi & materi KBM kelas ${session.className} - ${session.subjectName} tanggal ${session.date}`
    );
  }

  // --- Tasks ---
  public getTasks(): SchoolTask[] {
    return this.getItem(STORAGE_KEYS.TASKS, initialTasks);
  }

  public saveTask(task: SchoolTask, actorName = 'Guru'): void {
    const list = this.getTasks();
    const idx = list.findIndex((t) => t.id === task.id);
    const isNew = idx < 0;

    if (isNew) {
      list.push(task);
      // Auto-populate task status for each student in the class with initial 'belum_mengerjakan'
      const students = this.getStudentsByClass(task.classId);
      const statuses = this.getStudentTaskStatuses();
      for (const s of students) {
        statuses.push({
          id: `sts-${task.id}-${s.id}`,
          taskId: task.id,
          studentId: s.id,
          studentName: s.fullName,
          absentNumber: s.absentNumber,
          nis: s.nis,
          status: 'belum_mengerjakan',
          updatedAt: new Date().toISOString(),
          updatedBy: actorName,
        });
      }
      this.setItem(STORAGE_KEYS.TASK_STATUSES, statuses);
    } else {
      list[idx] = { ...task, updatedAt: new Date().toISOString() };
    }

    this.setItem(STORAGE_KEYS.TASKS, list);
    this.addAuditLog(
      actorName,
      isNew ? 'CREATE_TASK' : 'UPDATE_TASK',
      'Laporan Tugas',
      `Menyimpan tugas "${task.title}" kelas ${task.className}`
    );
  }

  public deleteTask(id: string, actorName = 'Guru'): void {
    const list = this.getTasks().filter((t) => t.id !== id);
    this.setItem(STORAGE_KEYS.TASKS, list);
    // Remove statuses
    const statuses = this.getStudentTaskStatuses().filter((st) => st.taskId !== id);
    this.setItem(STORAGE_KEYS.TASK_STATUSES, statuses);
    this.addAuditLog(actorName, 'DELETE_TASK', 'Laporan Tugas', `Menghapus tugas ID: ${id}`);
  }

  // --- Student Task Statuses ---
  public getStudentTaskStatuses(): StudentTaskStatus[] {
    return this.getItem(STORAGE_KEYS.TASK_STATUSES, initialStudentTaskStatuses);
  }

  public getTaskStatusesByTask(taskId: string): StudentTaskStatus[] {
    return this.getStudentTaskStatuses().filter((st) => st.taskId === taskId);
  }

  public updateStudentTaskStatus(
    statusId: string,
    updates: Partial<StudentTaskStatus>,
    actorName = 'Guru'
  ): void {
    const list = this.getStudentTaskStatuses();
    const idx = list.findIndex((st) => st.id === statusId);
    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: actorName,
      };
      this.setItem(STORAGE_KEYS.TASK_STATUSES, list);
      this.addAuditLog(
        actorName,
        'UPDATE_TASK_STATUS',
        'Laporan Tugas',
        `Memperbarui status tugas siswa ${list[idx].studentName} menjadi ${list[idx].status}`
      );
    }
  }

  public batchUpdateTaskStatuses(
    taskId: string,
    records: Array<{ nis: string; status: StudentTaskStatus['status']; grade?: number; notes?: string }>,
    actorName = 'Guru'
  ): { updatedCount: number; errors: string[] } {
    const list = this.getStudentTaskStatuses();
    let updatedCount = 0;
    const errors: string[] = [];

    for (const rec of records) {
      const idx = list.findIndex((st) => st.taskId === taskId && st.nis === rec.nis);
      if (idx >= 0) {
        list[idx] = {
          ...list[idx],
          status: rec.status,
          grade: rec.grade !== undefined ? rec.grade : list[idx].grade,
          notes: rec.notes !== undefined ? rec.notes : list[idx].notes,
          updatedAt: new Date().toISOString(),
          updatedBy: actorName,
        };
        updatedCount++;
      } else {
        errors.push(`Siswa dengan NIS ${rec.nis} tidak ditemukan di tugas ini.`);
      }
    }

    if (updatedCount > 0) {
      this.setItem(STORAGE_KEYS.TASK_STATUSES, list);
      this.addAuditLog(
        actorName,
        'IMPORT_TASK_CSV',
        'Laporan Tugas',
        `Impor status tugas massal: ${updatedCount} siswa berhasil diperbarui.`
      );
    }

    return { updatedCount, errors };
  }

  // --- Staff Attendance ---
  public getStaffAttendances(): StaffAttendance[] {
    return this.getItem(STORAGE_KEYS.STAFF_ATTENDANCE, initialStaffAttendances);
  }

  public getStaffAttendanceToday(userId: string, date: string): StaffAttendance | undefined {
    return this.getStaffAttendances().find((a) => a.userId === userId && a.date === date);
  }

  public recordStaffCheckIn(user: UserProfile, date: string, timeStr: string): { success: boolean; message: string; record?: StaffAttendance } {
    const existing = this.getStaffAttendanceToday(user.id, date);
    if (existing && existing.checkInTime) {
      return { success: false, message: 'Anda sudah melakukan presensi masuk hari ini!' };
    }

    const settings = this.getSettings();
    const status = determineStaffAttendanceStatus(timeStr.slice(0, 5), settings.lateThresholdHour);

    const newRecord: StaffAttendance = existing || {
      id: `att-${Date.now()}`,
      userId: user.id,
      nipOrId: user.nipOrId,
      userName: user.fullName,
      position: user.position,
      workUnit: user.workUnit,
      date,
      status,
      createdAt: new Date().toISOString(),
    };

    newRecord.checkInTime = timeStr;
    newRecord.status = status;

    const list = this.getStaffAttendances();
    const idx = list.findIndex((a) => a.id === newRecord.id);
    if (idx >= 0) {
      list[idx] = newRecord;
    } else {
      list.unshift(newRecord);
    }

    this.setItem(STORAGE_KEYS.STAFF_ATTENDANCE, list);
    this.addAuditLog(user.fullName, 'STAFF_CHECK_IN', 'Absensi Personel', `Presensi masuk ${timeStr} (Status: ${status})`);

    return { success: true, message: `Presensi masuk tercatat: ${timeStr} (${status})`, record: newRecord };
  }

  public recordStaffCheckOut(user: UserProfile, date: string, timeStr: string): { success: boolean; message: string } {
    const existing = this.getStaffAttendanceToday(user.id, date);
    if (!existing || !existing.checkInTime) {
      return { success: false, message: 'Anda belum melakukan presensi masuk hari ini!' };
    }
    if (existing.checkOutTime) {
      return { success: false, message: 'Anda sudah melakukan presensi pulang hari ini!' };
    }

    existing.checkOutTime = timeStr;
    const list = this.getStaffAttendances();
    const idx = list.findIndex((a) => a.id === existing.id);
    if (idx >= 0) {
      list[idx] = existing;
      this.setItem(STORAGE_KEYS.STAFF_ATTENDANCE, list);
      this.addAuditLog(user.fullName, 'STAFF_CHECK_OUT', 'Absensi Personel', `Presensi pulang tercatat ${timeStr}`);
      return { success: true, message: `Presensi pulang tercatat: ${timeStr}` };
    }
    return { success: false, message: 'Data absensi tidak ditemukan.' };
  }

  public correctStaffAttendance(
    recordId: string,
    updates: Partial<StaffAttendance>,
    reason: string,
    adminName: string
  ): void {
    const list = this.getStaffAttendances();
    const idx = list.findIndex((a) => a.id === recordId);
    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        ...updates,
        isCorrected: true,
        correctionReason: reason,
        correctedBy: adminName,
        correctedAt: new Date().toISOString(),
      };
      this.setItem(STORAGE_KEYS.STAFF_ATTENDANCE, list);
      this.addAuditLog(adminName, 'CORRECT_STAFF_ATTENDANCE', 'Absensi Personel', `Koreksi absensi ${list[idx].userName}: ${reason}`);
    }
  }

  // --- Picket Schedules ---
  public getPicketSchedules(): PicketSchedule[] {
    return this.getItem(STORAGE_KEYS.PICKET, initialPicketSchedules);
  }

  public savePicketSchedule(picket: PicketSchedule, actorName = 'Admin'): void {
    const list = this.getPicketSchedules();
    const idx = list.findIndex((p) => p.id === picket.id);
    if (idx >= 0) {
      list[idx] = picket;
    } else {
      list.push(picket);
    }
    this.setItem(STORAGE_KEYS.PICKET, list);
    this.addAuditLog(actorName, idx >= 0 ? 'UPDATE_PICKET' : 'CREATE_PICKET', 'Jadwal Piket', `Menyimpan jadwal piket ${picket.staffName}`);
  }

  public deletePicketSchedule(id: string, actorName = 'Admin'): void {
    const list = this.getPicketSchedules().filter((p) => p.id !== id);
    this.setItem(STORAGE_KEYS.PICKET, list);
    this.addAuditLog(actorName, 'DELETE_PICKET', 'Jadwal Piket', `Menghapus jadwal piket ID: ${id}`);
  }

  // --- Organization Positions ---
  public getOrganizationPositions(): OrganizationPosition[] {
    return this.getItem(STORAGE_KEYS.ORGANIZATION, initialOrganizationPositions);
  }

  public saveOrganizationPosition(position: OrganizationPosition, actorName = 'Admin'): void {
    const list = this.getOrganizationPositions();
    const idx = list.findIndex((o) => o.id === position.id);
    if (idx >= 0) {
      list[idx] = position;
    } else {
      list.push(position);
    }
    this.setItem(STORAGE_KEYS.ORGANIZATION, list);
    this.addAuditLog(actorName, 'UPDATE_ORG_STRUCTURE', 'Struktur Organisasi', `Menyimpan jabatan ${position.title} (${position.holderName})`);
  }

  // --- School Rules ---
  public getSchoolRules(): SchoolRule[] {
    return this.getItem(STORAGE_KEYS.RULES, initialSchoolRules);
  }

  public saveSchoolRule(rule: SchoolRule, actorName = 'Admin'): void {
    const list = this.getSchoolRules();
    const idx = list.findIndex((r) => r.id === rule.id);
    if (idx >= 0) {
      list[idx] = { ...rule, updatedAt: new Date().toISOString(), updatedBy: actorName };
    } else {
      list.push({ ...rule, updatedAt: new Date().toISOString(), updatedBy: actorName });
    }
    this.setItem(STORAGE_KEYS.RULES, list);
    this.addAuditLog(actorName, idx >= 0 ? 'UPDATE_RULE' : 'CREATE_RULE', 'Tata Tertib', `Menyimpan aturan: ${rule.title}`);
  }

  public deleteSchoolRule(id: string, actorName = 'Admin'): void {
    const list = this.getSchoolRules().filter((r) => r.id !== id);
    this.setItem(STORAGE_KEYS.RULES, list);
    this.addAuditLog(actorName, 'DELETE_RULE', 'Tata Tertib', `Menghapus aturan ID: ${id}`);
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return this.getItem(STORAGE_KEYS.AUDIT, []);
  }

  public addAuditLog(userName: string, action: string, module: string, details: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      userId: userName,
      userName,
      action,
      module,
      details,
    };
    logs.unshift(newLog);
    // Keep max 200 logs
    if (logs.length > 200) logs.length = 200;
    this.setItem(STORAGE_KEYS.AUDIT, logs);
  }
}

export const storageService = new StorageService();
