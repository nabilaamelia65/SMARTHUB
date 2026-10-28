import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  QrCode,
  ClipboardList,
  ShieldAlert,
  Building,
  Activity,
  FileText,
} from 'lucide-react';
import { summarizeTaskStatuses, isIncompleteTask } from '../../utils/schoolLogic';

export const DashboardView: React.FC<{ onNavigate: (view: string) => void }> = ({
  onNavigate,
}) => {
  const { currentUser, activeRole } = useAuth();

  const role = activeRole || currentUser?.roles[0] || 'wali_kelas';

  // Read live data from storage
  const users = storageService.getUsers();
  const classes = storageService.getClasses();
  const students = storageService.getStudents();
  const subjects = storageService.getSubjects();
  const schedules = storageService.getLessonSchedules();
  const sessions = storageService.getLessonSessions();
  const tasks = storageService.getTasks();
  const taskStatuses = storageService.getStudentTaskStatuses();
  const staffAttendances = storageService.getStaffAttendances();
  const pickets = storageService.getPicketSchedules();
  const auditLogs = storageService.getAuditLogs();
  const settings = storageService.getSettings();

  const todayStr = '2026-10-28';
  const todayDayName = 'Rabu';

  // Calculations
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalStaff = users.length;
  const totalSubjects = subjects.length;

  const staffPresentToday = staffAttendances.filter((a) => a.date === todayStr);
  const presentCount = staffPresentToday.filter((a) => a.status === 'Hadir').length;
  const lateCount = staffPresentToday.filter((a) => a.status === 'Terlambat').length;

  // Wali Kelas specific data
  const homeroomClass = classes.find((c) => c.id === currentUser?.homeroomClassId) || classes[0];
  const homeroomStudents = students.filter((s) => s.classId === homeroomClass?.id);
  const homeroomTasks = tasks.filter((t) => t.classId === homeroomClass?.id);
  const homeroomStatuses = taskStatuses.filter((ts) =>
    homeroomStudents.some((s) => s.id === ts.studentId)
  );
  const homeroomIncompleteStatuses = homeroomStatuses.filter((ts) => isIncompleteTask(ts.status));
  const homeroomTaskSummary = summarizeTaskStatuses(homeroomStatuses);

  // Guru Mapel specific data
  const myTeachingSchedules = schedules.filter((s) => s.teacherId === currentUser?.id);
  const myTodaySchedules = myTeachingSchedules.filter((s) => s.dayOfWeek === todayDayName);
  const myTasks = tasks.filter((t) => t.teacherId === currentUser?.id);

  // Personal staff attendance today
  const myAttendanceToday = staffAttendances.find(
    (a) => a.userId === currentUser?.id && a.date === todayStr
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-slate-900 via-slate-900 to-emerald-950/60 rounded-2xl p-6 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-linear-to-l from-emerald-600/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Portal Akademik & SIMS MTsN 1 Kartanegara
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Selamat Datang, {currentUser?.fullName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {settings.schoolName} • Tahun Ajaran {settings.academicYear} Semester {settings.semester}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(role === 'wali_kelas' || role === 'admin' || role === 'kepala_sekolah') && (
              <button
                onClick={() => onNavigate('scan-qr')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/30 transition cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                Scan QR Kelas
              </button>
            )}

            {(role === 'guru_mapel' || role === 'wali_kelas') && (
              <button
                onClick={() => onNavigate('absensi-pembelajaran')}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-teal-600/30 transition cursor-pointer"
              >
                <ClipboardList className="w-4 h-4" />
                Isi Absensi & KBM
              </button>
            )}

            <button
              onClick={() => onNavigate('absensi-personel')}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              <Clock className="w-4 h-4 text-emerald-400" />
              Presensi Personel
            </button>
          </div>
        </div>
      </div>

      {/* VIEW BASED ON ROLE */}

      {/* 1. KEPALA SEKOLAH / WAKASEK VIEW */}
      {(role === 'kepala_sekolah' || role.startsWith('wakasek')) && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total Siswa (Rombel VII-IX)
                </p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{totalStudents}</h3>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> 6 Rombel Aktif
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Guru & Tenaga Kependidikan
                </p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{totalStaff}</h3>
                <p className="text-[11px] text-slate-500 mt-1">Pendidik & Kependidikan</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Presensi PTK Hari Ini
                </p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  {presentCount + lateCount} / {totalStaff}
                </h3>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">
                  {presentCount} tepat waktu, {lateCount} terlambat
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Sesi KBM Terjadwal
                </p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{schedules.length}</h3>
                <p className="text-[11px] text-blue-600 font-medium mt-1">
                  {sessions.length} sesi telah diabsen
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Leadership Monitoring Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Class overview */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  Rombongan Belajar & Wali Kelas (Kelas VII, VIII, IX)
                </h3>
                <button
                  onClick={() => onNavigate('wali-kelas')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  Semua Rombel <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {classes.map((c) => {
                  const studentCount = students.filter((s) => s.classId === c.id).length;
                  return (
                    <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded mr-2">
                          {c.name}
                        </span>
                        <span className="text-slate-600 font-medium">{c.homeroomTeacherName}</span>
                      </div>
                      <div className="text-slate-500 font-mono">
                        {studentCount} Siswa • {c.roomName.split('(')[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Picket & Today's Duty */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Petugas Piket Sekolah Hari Ini ({todayDayName})
                </h3>
                <button
                  onClick={() => onNavigate('jadwal-piket')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  Jadwal Lengkap <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {pickets
                  .filter((p) => p.date === todayStr)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{p.staffName}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {p.taskType} • {p.location}
                        </div>
                      </div>
                      <span className="bg-teal-50 text-teal-700 border border-teal-200 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                        {p.timeSlot}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. WALI KELAS VIEW */}
      {role === 'wali_kelas' && (
        <div className="space-y-6">
          {/* Homeroom Focus Card */}
          <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="bg-blue-100 text-blue-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  Tanggung Jawab Perwalian Anda
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Kelas {homeroomClass?.name} ({homeroomClass?.roomName})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Wali Kelas: {homeroomClass?.homeroomTeacherName} • Kode QR: <code className="font-mono text-blue-700 font-bold">{homeroomClass?.qrIdentifier}</code>
                </p>
              </div>

              <button
                onClick={() => onNavigate('scan-qr')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer self-start sm:self-auto"
              >
                <QrCode className="w-4 h-4" />
                Buka Lembar Kelas Lengkap
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-center">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Jumlah Siswa</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{homeroomStudents.length}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <p className="text-xs text-amber-700 font-medium">Tugas Belum Tuntas</p>
                <p className="text-2xl font-black text-amber-900 mt-1">
                  {homeroomIncompleteStatuses.length}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <p className="text-xs text-emerald-700 font-medium">Ketuntasan Tugas</p>
                <p className="text-2xl font-black text-emerald-900 mt-1">
                  {homeroomTaskSummary.completionRate}%
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl">
                <p className="text-xs text-indigo-700 font-medium">Mata Pelajaran Aktif</p>
                <p className="text-2xl font-black text-indigo-900 mt-1">
                  {new Set(homeroomTasks.map((t) => t.subjectId)).size || 3}
                </p>
              </div>
            </div>
          </div>

          {/* Incomplete Tasks Monitoring Alert List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Daftar Siswa dengan Tugas Belum Tuntas (Monitoring Wali Kelas)
                </h3>
                <p className="text-xs text-slate-500">
                  Data langsung bersumber dari laporan guru mata pelajaran
                </p>
              </div>
              <button
                onClick={() => onNavigate('laporan-tugas')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                Lihat Semua Tugas
              </button>
            </div>

            {homeroomIncompleteStatuses.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                Seluruh siswa di kelas {homeroomClass?.name} telah menuntaskan tugas.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">No. Absen</th>
                      <th className="py-2.5 px-3">Nama Siswa</th>
                      <th className="py-2.5 px-3">NIS</th>
                      <th className="py-2.5 px-3">Mata Pelajaran & Tugas</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Catatan Guru</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {homeroomIncompleteStatuses.map((st) => {
                      const task = tasks.find((t) => t.id === st.taskId);
                      return (
                        <tr key={st.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                            #{st.absentNumber}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {st.studentName}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">{st.nis}</td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-blue-900">{task?.subjectName}</span>
                            <span className="block text-[11px] text-slate-500">{task?.title}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                st.status === 'belum_mengerjakan'
                                  ? 'bg-rose-100 text-rose-800'
                                  : st.status === 'perlu_perbaikan'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {st.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 italic">
                            {st.notes || 'Belum mengumpulkan'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. GURU MATA PELAJARAN VIEW */}
      {role === 'guru_mapel' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs font-medium text-slate-500 uppercase">Jadwal Mengajar Anda</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {myTeachingSchedules.length} Sesi
              </h3>
              <p className="text-[11px] text-blue-600 font-semibold mt-1">
                {myTodaySchedules.length} Sesi Hari Ini ({todayDayName})
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs font-medium text-slate-500 uppercase">Tugas Diberikan</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{myTasks.length} Tugas</h3>
              <p className="text-[11px] text-slate-500 mt-1">Semester Aktif</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-xs font-medium text-slate-500 uppercase">Aksi Cepat KBM</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => onNavigate('absensi-pembelajaran')}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-xl"
                >
                  Isi Presensi Kelas
                </button>
              </div>
            </div>
          </div>

          {/* Today's Teaching Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Jadwal Mengajar Anda Hari Ini ({todayDayName})
            </h3>

            {myTodaySchedules.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                Tidak ada jadwal mengajar tetap pada hari {todayDayName}.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myTodaySchedules.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-blue-900 bg-white border border-blue-200 px-2 py-0.5 rounded text-[11px]">
                        Kelas {s.className}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">{s.subjectName}</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Jam: {s.startTime} - {s.endTime} • {s.roomName}
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate('absensi-pembelajaran')}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                    >
                      Buka KBM
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TENAGA KEPENDIDIKAN (STAF TU / SATPAM / KEBERSIHAN / KOPERASI) VIEW */}
      {(role.startsWith('staf_') || role === 'staf_tu') && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Status Presensi Pribadi Anda Hari Ini
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Tanggal: {todayStr} • Aturan Masuk: {settings.workStartHour} (Toleransi s/d{' '}
              {settings.lateThresholdHour} WIB)
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500">Status Kehadiran Hari Ini:</span>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  {myAttendanceToday ? (
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {myAttendanceToday.status} (Masuk: {myAttendanceToday.checkInTime || '-'})
                    </span>
                  ) : (
                    <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      Belum Melakukan Presensi Masuk
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onNavigate('absensi-personel')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                Buka Menu Presensi Personel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ADMIN / OPERATOR VIEW */}
      {role === 'admin' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500">Akun Pengguna</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{users.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500">Total Siswa</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{students.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500">Rombongan Belajar</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{classes.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500">Jadwal Pelajaran</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{schedules.length}</p>
            </div>
          </div>

          {/* Master Data Completion Status & Audit Log */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Status Kelengkapan Data Master</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <span>Data Rombel (Kelas VII, VIII, IX)</span>
                  <span className="font-bold">Lengkap ({classes.length} Rombel)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <span>Penugasan Wali Kelas</span>
                  <span className="font-bold">100% Terisi</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <span>Mata Pelajaran Kurikulum</span>
                  <span className="font-bold">{subjects.length} Mapel Terdaftar</span>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => onNavigate('manajemen-data')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs"
                >
                  Buka Manajemen Data Master (CRUD)
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Riwayat Aktivitas Sistem (Audit Log)</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto text-xs divide-y divide-slate-100">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{log.userName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
