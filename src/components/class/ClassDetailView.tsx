import React, { useState } from 'react';
import { SchoolClass, Student, TeachingAssignment, StudentTaskStatus, SchoolTask, LessonSchedule } from '../../types';
import { storageService } from '../../services/storageService';
import {
  Users,
  GraduationCap,
  Calendar,
  AlertCircle,
  Search,
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  Clock,
  Filter,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { isIncompleteTask, summarizeTaskStatuses } from '../../utils/schoolLogic';

interface ClassDetailViewProps {
  schoolClass: SchoolClass;
  onBack?: () => void;
}

type TabType = 'ringkasan' | 'siswa' | 'guru' | 'tugas' | 'jadwal';

export const ClassDetailView: React.FC<ClassDetailViewProps> = ({ schoolClass, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('ringkasan');

  // Load class-specific data from storage
  const students = storageService.getStudentsByClass(schoolClass.id);
  const teachingAssignments = storageService.getTeachingAssignments().filter((ta) => ta.classId === schoolClass.id);
  const tasks = storageService.getTasks().filter((t) => t.classId === schoolClass.id);
  const allTaskStatuses = storageService.getStudentTaskStatuses();
  const schedules = storageService.getLessonSchedules().filter((s) => s.classId === schoolClass.id);

  // Student filter & search
  const [studentSearch, setStudentSearch] = useState('');
  const [studentSortOrder, setStudentSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredStudents = students
    .filter(
      (s) =>
        s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.nis.includes(studentSearch)
    )
    .sort((a, b) =>
      studentSortOrder === 'asc'
        ? a.absentNumber - b.absentNumber
        : b.absentNumber - a.absentNumber
    );

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;

  // Teacher filter & search
  const [teacherSearch, setTeacherSearch] = useState('');
  const filteredTeachers = teachingAssignments.filter(
    (ta) =>
      ta.teacherName.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      ta.subjectName.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      (ta.academicTitle && ta.academicTitle.toLowerCase().includes(teacherSearch.toLowerCase()))
  );

  // Task filter & search
  const [taskSubjectFilter, setTaskSubjectFilter] = useState('ALL');
  const [taskStatusFilter, setTaskStatusFilter] = useState('ALL');
  const [taskSearch, setTaskSearch] = useState('');

  // Extract all task statuses belonging to this class's students
  const classTaskStatuses = allTaskStatuses.filter((ts) =>
    students.some((s) => s.id === ts.studentId)
  );

  const incompleteStatuses = classTaskStatuses.filter((ts) => isIncompleteTask(ts.status));
  const taskSummary = summarizeTaskStatuses(classTaskStatuses);

  const filteredTaskStatuses = classTaskStatuses.filter((ts) => {
    const parentTask = tasks.find((t) => t.id === ts.taskId);
    if (taskSubjectFilter !== 'ALL' && parentTask?.subjectName !== taskSubjectFilter) return false;
    if (taskStatusFilter !== 'ALL' && ts.status !== taskStatusFilter) return false;
    if (
      taskSearch &&
      !ts.studentName.toLowerCase().includes(taskSearch.toLowerCase()) &&
      !parentTask?.title.toLowerCase().includes(taskSearch.toLowerCase()) &&
      !parentTask?.teacherName.toLowerCase().includes(taskSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Class Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="mt-1 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                title="Kembali ke pemindaian QR"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-0.5 rounded-lg">
                  KELAS {schoolClass.name}
                </span>
                <span className="text-xs text-slate-500 font-medium">Tingkat {schoolClass.grade}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-mono">T.A. {schoolClass.academicYear}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {schoolClass.roomName}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Wali Kelas: <span className="font-semibold text-slate-900">{schoolClass.homeroomTeacherName}</span> • Identifier QR:{' '}
                <code className="bg-slate-100 text-blue-700 font-mono font-bold px-1.5 py-0.5 rounded">
                  {schoolClass.qrIdentifier}
                </code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-3 py-1.5 rounded-xl">
              {students.length} Peserta Didik Aktif
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex overflow-x-auto border-b border-slate-200 space-x-1 sm:space-x-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ringkasan')}
            className={`py-2.5 px-3.5 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'ringkasan'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ringkasan
          </button>
          <button
            onClick={() => setActiveTab('siswa')}
            className={`py-2.5 px-3.5 border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'siswa'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Data Peserta Didik ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('guru')}
            className={`py-2.5 px-3.5 border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guru'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Guru Pengampu ({teachingAssignments.length})
          </button>
          <button
            onClick={() => setActiveTab('tugas')}
            className={`py-2.5 px-3.5 border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tugas'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Tugas Belum Tuntas
            {incompleteStatuses.length > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {incompleteStatuses.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`py-2.5 px-3.5 border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'jadwal'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Jadwal Pelajaran ({schedules.length})
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}

      {/* TAB 1: RINGKASAN */}
      {activeTab === 'ringkasan' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500">Total Peserta Didik</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{students.length}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                L: {students.filter((s) => s.gender === 'L').length} | P:{' '}
                {students.filter((s) => s.gender === 'P').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500">Guru Pengampu</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{teachingAssignments.length}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Mata Pelajaran Aktif</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs text-amber-700 font-semibold">Tugas Belum Tuntas</span>
              <p className="text-2xl font-black text-amber-800 mt-1">{incompleteStatuses.length}</p>
              <p className="text-[11px] text-amber-600 mt-0.5">Perlu perhatian wali kelas</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs text-emerald-700 font-semibold">Ketuntasan Tugas</span>
              <p className="text-2xl font-black text-emerald-800 mt-1">
                {taskSummary.completionRate}%
              </p>
              <p className="text-[11px] text-emerald-600 mt-0.5">
                {taskSummary.completed} dari {taskSummary.total} status
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Informasi Rombongan Belajar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Nama Rombel:</span>
                  <span className="font-semibold text-slate-800">Kelas {schoolClass.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Tingkat Kurikulum:</span>
                  <span className="font-semibold text-slate-800">Fase D (Tingkat {schoolClass.grade})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Lokasi Ruang Kelas:</span>
                  <span className="font-semibold text-slate-800">{schoolClass.roomName}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Wali Kelas Resmi:</span>
                  <span className="font-semibold text-slate-800">{schoolClass.homeroomTeacherName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Kapasitas Maksimal:</span>
                  <span className="font-semibold text-slate-800">{schoolClass.capacity} Siswa</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Pengenal QR Terdaftar:</span>
                  <span className="font-mono font-bold text-blue-700">{schoolClass.qrIdentifier}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATA PESERTA DIDIK */}
      {activeTab === 'siswa' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama siswa atau NIS..."
                value={studentSearch}
                onChange={(e) => {
                  setStudentSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStudentSortOrder(studentSortOrder === 'asc' ? 'desc' : 'asc')}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                Urut No. Absen ({studentSortOrder === 'asc' ? '1 → 10' : '10 → 1'})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">No. Absen</th>
                  <th className="py-2.5 px-3">NIS</th>
                  <th className="py-2.5 px-3">NISN</th>
                  <th className="py-2.5 px-3">Nama Lengkap</th>
                  <th className="py-2.5 px-3">L/P</th>
                  <th className="py-2.5 px-3">Tugas Belum Tuntas</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-slate-400">
                      Tidak ditemukan siswa dengan kata kunci "{studentSearch}".
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((s) => {
                    const studentIncomplete = incompleteStatuses.filter(
                      (st) => st.studentId === s.id
                    );
                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                          {s.absentNumber}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{s.nis}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-400">{s.nisn || '-'}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{s.fullName}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              s.gender === 'L'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-pink-100 text-pink-800'
                            }`}
                          >
                            {s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {studentIncomplete.length > 0 ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {studentIncomplete.length} Tugas
                            </span>
                          ) : (
                            <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Tuntas
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                            Aktif
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span>
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, filteredStudents.length)} dari{' '}
                {filteredStudents.length} siswa
              </span>
              <div className="flex gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-40"
                >
                  Sebelumnya
                </button>
                <span className="px-2.5 py-1 font-bold text-slate-800">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-40"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GURU PENGAMPU */}
      {activeTab === 'guru' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama guru pengampu beserta gelar atau mapel..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Nama Lengkap & Gelar Resmi</th>
                  <th className="py-2.5 px-3">Mata Pelajaran</th>
                  <th className="py-2.5 px-3">Kelas Diampu</th>
                  <th className="py-2.5 px-3">Jadwal Mengajar di Kelas Ini</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-400">
                      Tidak ada penugasan guru yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((ta) => {
                    const classSchedules = schedules.filter(
                      (s) => s.teacherId === ta.teacherId && s.subjectId === ta.subjectId
                    );
                    return (
                      <tr key={ta.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {ta.teacherName}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                            {ta.subjectName}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">{ta.className}</td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {classSchedules.length > 0 ? (
                            classSchedules.map((cs) => (
                              <span
                                key={cs.id}
                                className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded mr-1 text-[11px] font-mono"
                              >
                                {cs.dayOfWeek} ({cs.startTime}-{cs.endTime})
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic">Belum dijadwalkan</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                            SK Resmi Aktif
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TUGAS BELUM TUNTAS */}
      {activeTab === 'tugas' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Pemantauan Ketuntasan Tugas Peserta Didik
              </h3>
              <p className="text-xs text-slate-500">
                Wali kelas memiliki akses pemantauan komprehensif terhadap tugas yang dilaporkan guru mapel.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-hidden"
              >
                <option value="ALL">Semua Status</option>
                <option value="belum_mengerjakan">Belum Mengerjakan</option>
                <option value="sedang_mengerjakan">Sedang Mengerjakan</option>
                <option value="perlu_perbaikan">Perlu Perbaikan</option>
                <option value="sudah_mengumpulkan">Sudah Mengumpulkan</option>
                <option value="tuntas">Tuntas</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari siswa/tugas..."
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-48 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">No. Absen</th>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3">Mata Pelajaran & Judul Tugas</th>
                  <th className="py-2.5 px-3">Guru Pengampu & Gelar</th>
                  <th className="py-2.5 px-3">Tenggat Waktu</th>
                  <th className="py-2.5 px-3">Status Pengerjaan</th>
                  <th className="py-2.5 px-3">Nilai</th>
                  <th className="py-2.5 px-3">Catatan / Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTaskStatuses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-slate-400">
                      Tidak ada catatan tugas dengan kriteria filter saat ini.
                    </td>
                  </tr>
                ) : (
                  filteredTaskStatuses.map((st) => {
                    const task = tasks.find((t) => t.id === st.taskId);
                    return (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                          #{st.absentNumber}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{st.studentName}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-blue-900">{task?.subjectName}</span>
                          <span className="block text-[11px] text-slate-500">{task?.title}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{task?.teacherName}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                          {task?.dueDate}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              st.status === 'tuntas'
                                ? 'bg-emerald-100 text-emerald-800'
                                : st.status === 'sudah_mengumpulkan'
                                ? 'bg-blue-100 text-blue-800'
                                : st.status === 'perlu_perbaikan'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {st.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                          {st.grade !== undefined ? st.grade : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 italic max-w-xs truncate">
                          {st.notes || '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: JADWAL PELAJARAN */}
      {activeTab === 'jadwal' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">
            Jadwal Pelajaran Mingguan Kelas {schoolClass.name}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {schedules.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                    {s.dayOfWeek}
                  </span>
                  <span className="font-mono text-slate-500 font-semibold">
                    {s.startTime} - {s.endTime}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{s.subjectName}</h4>
                <p className="text-slate-600 font-medium">{s.teacherName}</p>
                <p className="text-[11px] text-slate-400">{s.roomName}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
