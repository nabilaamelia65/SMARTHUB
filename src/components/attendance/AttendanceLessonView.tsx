import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import {
  LessonSession,
  LessonSchedule,
  StudentAttendanceStatus,
  StudentAttendanceRecord,
} from '../../types';
import { calculateAttendanceMetrics } from '../../utils/schoolLogic';
import {
  ClipboardCheck,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Save,
  Users,
  Check,
  X,
  History,
  FileText,
} from 'lucide-react';

export const AttendanceLessonView: React.FC = () => {
  const { currentUser } = useAuth();
  const schedules = storageService.getLessonSchedules();
  const classes = storageService.getClasses();
  const students = storageService.getStudents();
  const recordedSessions = storageService.getLessonSessions();

  // Filter schedules that the teacher teaches (or all if admin/kepsek)
  const isLeaderOrAdmin =
    currentUser?.roles.some((r) => ['admin', 'kepala_sekolah', 'wakasek_kurikulum'].includes(r));
  const availableSchedules = isLeaderOrAdmin
    ? schedules
    : schedules.filter((s) => s.teacherId === currentUser?.id);

  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(
    availableSchedules[0]?.id || ''
  );
  const [sessionDate, setSessionDate] = useState('2026-10-28');
  const [topic, setTopic] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [attendanceList, setAttendanceList] = useState<StudentAttendanceRecord[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'riwayat'>('input');
  const [showBulkConfirmModal, setShowBulkConfirmModal] = useState(false);

  // When schedule or date changes, load existing session or prepare new attendance roster
  React.useEffect(() => {
    if (!selectedScheduleId) return;

    const schedule = schedules.find((s) => s.id === selectedScheduleId);
    if (!schedule) return;

    // Check if session was already recorded
    const existing = recordedSessions.find(
      (rs) => rs.scheduleId === selectedScheduleId && rs.date === sessionDate
    );

    if (existing) {
      setTopic(existing.topic);
      setActivityDescription(existing.activityDescription);
      setAdditionalNotes(existing.additionalNotes || '');
      setAttendanceList(existing.attendance);
    } else {
      // Prepare new roster from class students
      const classStudents = storageService.getStudentsByClass(schedule.classId);
      const newAttendance: StudentAttendanceRecord[] = classStudents.map((cs) => ({
        studentId: cs.id,
        studentName: cs.fullName,
        nis: cs.nis,
        absentNumber: cs.absentNumber,
        gender: cs.gender,
        status: 'Hadir', // Default initial status
        note: '',
      }));
      setAttendanceList(newAttendance);
      setTopic('');
      setActivityDescription('');
      setAdditionalNotes('');
    }
  }, [selectedScheduleId, sessionDate, recordedSessions]);

  const selectedSchedule = schedules.find((s) => s.id === selectedScheduleId);

  const handleStatusChange = (studentId: string, status: StudentAttendanceStatus) => {
    setAttendanceList((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, status } : item))
    );
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setAttendanceList((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, note } : item))
    );
  };

  const handleMarkAllPresent = () => {
    setAttendanceList((prev) => prev.map((item) => ({ ...item, status: 'Hadir' })));
    setShowBulkConfirmModal(false);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveErrorMsg(null);
    setSaveSuccessMsg(null);

    if (!selectedSchedule) {
      setSaveErrorMsg('Pilih jadwal KBM terlebih dahulu.');
      return;
    }

    if (!topic.trim()) {
      setSaveErrorMsg('Materi / topik pembelajaran wajib diisi.');
      return;
    }

    if (!activityDescription.trim()) {
      setSaveErrorMsg('Deskripsi kegiatan pembelajaran wajib diisi.');
      return;
    }

    // Check duplicate session
    const existingId = recordedSessions.find(
      (rs) => rs.scheduleId === selectedSchedule.id && rs.date === sessionDate
    )?.id;

    const newSession: LessonSession = {
      id: existingId || `session-${Date.now()}`,
      scheduleId: selectedSchedule.id,
      classId: selectedSchedule.classId,
      className: selectedSchedule.className,
      subjectId: selectedSchedule.subjectId,
      subjectName: selectedSchedule.subjectName,
      teacherId: selectedSchedule.teacherId,
      teacherName: selectedSchedule.teacherName,
      date: sessionDate,
      startTime: selectedSchedule.startTime,
      endTime: selectedSchedule.endTime,
      topic: topic.trim(),
      activityDescription: activityDescription.trim(),
      additionalNotes: additionalNotes.trim() || undefined,
      attendance: attendanceList,
      isSubmitted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.saveLessonSession(newSession, currentUser?.fullName || 'Guru');
    setSaveSuccessMsg(
      `Presensi siswa dan catatan materi kelas ${selectedSchedule.className} (${selectedSchedule.subjectName}) berhasil disimpan persisten!`
    );
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const metrics = calculateAttendanceMetrics(attendanceList);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-teal-100 text-teal-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Jurnal Mengajar & Presensi KBM
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Absensi Siswa & Catatan Pembelajaran
          </h2>
          <p className="text-xs text-slate-500">
            Terhubung langsung dengan jadwal pelajaran, daftar siswa rombel, dan jurnal guru
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('input')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'input'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            Input Presensi & Materi
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'riwayat'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            Riwayat Jurnal KBM ({recordedSessions.length})
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{saveSuccessMsg}</span>
        </div>
      )}

      {saveErrorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800 animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-semibold">{saveErrorMsg}</span>
        </div>
      )}

      {activeTab === 'input' && (
        <form onSubmit={handleSaveSession} className="space-y-6">
          {/* Schedule & Date Selector Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Pilih Sesi Pembelajaran</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Pilih Jadwal Mengajar:
                </label>
                <select
                  value={selectedScheduleId}
                  onChange={(e) => setSelectedScheduleId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
                >
                  {availableSchedules.map((s) => (
                    <option key={s.id} value={s.id}>
                      Kelas {s.className} • {s.subjectName} ({s.dayOfWeek} {s.startTime}-{s.endTime})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Tanggal KBM:</label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Guru Pengampu:</label>
                <div className="p-2 bg-slate-100 rounded-xl font-bold text-slate-700 truncate">
                  {selectedSchedule?.teacherName || '-'}
                </div>
              </div>
            </div>

            {selectedSchedule && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs text-blue-900">
                <span className="font-medium">
                  <strong>Ruang:</strong> {selectedSchedule.roomName} • <strong>Jam ke-:</strong>{' '}
                  {selectedSchedule.periodNumber} ({selectedSchedule.startTime} -{' '}
                  {selectedSchedule.endTime})
                </span>
                <span className="bg-blue-600 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                  T.A. {selectedSchedule.academicYear}
                </span>
              </div>
            )}
          </div>

          {/* Student Attendance Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Presensi Peserta Didik Kelas {selectedSchedule?.className} ({attendanceList.length}{' '}
                  Siswa)
                </h3>
                <p className="text-xs text-slate-500">
                  Ringkasan: Hadir: {metrics.present} | Izin: {metrics.excused} | Sakit:{' '}
                  {metrics.sick} | Alpa: {metrics.absent} | Tingkat Kehadiran:{' '}
                  <strong>{metrics.presencePercentage}%</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowBulkConfirmModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 rounded-xl text-xs font-semibold cursor-pointer self-start sm:self-auto"
              >
                <Check className="w-4 h-4" />
                Tandai Semua Hadir (Konfirmasi)
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">NIS</th>
                    <th className="py-2.5 px-3">Nama Lengkap</th>
                    <th className="py-2.5 px-3">L/P</th>
                    <th className="py-2.5 px-3">Status Kehadiran</th>
                    <th className="py-2.5 px-3">Keterangan Khusus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceList.map((item) => (
                    <tr key={item.studentId} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-slate-700">
                        {item.absentNumber}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-500">{item.nis}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{item.studentName}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            item.gender === 'L'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-pink-100 text-pink-800'
                          }`}
                        >
                          {item.gender}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-wrap gap-1">
                          {(['Hadir', 'Izin', 'Sakit', 'Alpa', 'Dispensasi'] as StudentAttendanceStatus[]).map(
                            (st) => {
                              const isSelected = item.status === st;
                              return (
                                <button
                                  type="button"
                                  key={st}
                                  onClick={() => handleStatusChange(item.studentId, st)}
                                  className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                                    isSelected
                                      ? st === 'Hadir'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : st === 'Izin'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : st === 'Sakit'
                                        ? 'bg-amber-600 text-white shadow-xs'
                                        : st === 'Dispensasi'
                                        ? 'bg-purple-600 text-white shadow-xs'
                                        : 'bg-rose-600 text-white shadow-xs'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {st}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          placeholder="Catatan izin/sakit..."
                          value={item.note || ''}
                          onChange={(e) => handleNoteChange(item.studentId, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lesson Notes Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              Catatan Materi & Jurnal Pembelajaran
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Materi atau Topik Pembelajaran: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Operasi Aljabar - Perkalian Suku Dua dan Pemfaktoran"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Deskripsi Kegiatan Pembelajaran: *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Rangkuman tahapan pembelajaran: pendahuluan, kegiatan inti diskusi/praktikum, dan refleksi penutup..."
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Catatan Tambahan (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="Catatan kedisiplinan, kendala sarana proyektor, atau tindak lanjut..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-teal-600/30 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Simpan Presensi & Jurnal Pembelajaran
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: RIWAYAT KBM */}
      {activeTab === 'riwayat' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">
            Riwayat Jurnal KBM yang Telah Tersimpan
          </h3>

          {recordedSessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Belum ada riwayat jurnal KBM yang tercatat.
            </div>
          ) : (
            <div className="space-y-3">
              {recordedSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black bg-blue-600 text-white px-2 py-0.5 rounded text-[11px]">
                        Kelas {session.className}
                      </span>
                      <span className="font-extrabold text-slate-900">{session.subjectName}</span>
                    </div>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {session.date} • Jam {session.startTime} - {session.endTime}
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700">Topik Materi:</span> {session.topic}
                  </div>
                  <p className="text-slate-600 whitespace-pre-line text-[11px] bg-white p-2.5 rounded-lg border border-slate-100">
                    {session.activityDescription}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>Pengampu: {session.teacherName}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {session.attendance.filter((a) => a.status === 'Hadir').length} Hadir dari{' '}
                      {session.attendance.length} Siswa
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bulk Mark Confirmation Modal */}
      {showBulkConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-scale-up">
            <h4 className="font-bold text-slate-900 text-sm mb-2">Konfirmasi Pengisian Massal</h4>
            <p className="text-xs text-slate-600 mb-4">
              Apakah Anda yakin ingin menandai seluruh {attendanceList.length} siswa di kelas{' '}
              {selectedSchedule?.className} sebagai <strong>Hadir</strong>? Anda tetap dapat mengubah status siswa yang berhalangan secara individual.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBulkConfirmModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
              >
                Ya, Tandai Hadir Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
