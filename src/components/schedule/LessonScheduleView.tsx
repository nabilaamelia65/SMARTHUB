import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { LessonSchedule } from '../../types';
import { checkScheduleConflict } from '../../utils/schoolLogic';
import {
  CalendarClock,
  Plus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Clock,
  Building,
  User,
  X,
  ShieldAlert,
} from 'lucide-react';

export const LessonScheduleView: React.FC = () => {
  const { currentUser } = useAuth();
  const schedules = storageService.getLessonSchedules();
  const classes = storageService.getClasses();
  const subjects = storageService.getSubjects();
  const users = storageService.getUsers();

  const [classFilter, setClassFilter] = useState('ALL');
  const [dayFilter, setDayFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [teacherId, setTeacherId] = useState(users[0]?.id || '');
  const [dayOfWeek, setDayOfWeek] = useState<LessonSchedule['dayOfWeek']>('Senin');
  const [periodNumber, setPeriodNumber] = useState<number>(1);
  const [startTime, setStartTime] = useState('07:30');
  const [endTime, setEndTime] = useState('09:00');
  const [roomName, setRoomName] = useState('Ruang 7.1');

  const isAdminOrKurikulum = currentUser?.roles.some((r) =>
    ['admin', 'kepala_sekolah', 'wakasek_kurikulum'].includes(r)
  );

  const days: LessonSchedule['dayOfWeek'][] = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictWarning(null);

    const cl = classes.find((c) => c.id === classId);
    const sub = subjects.find((s) => s.id === subjectId);
    const tch = users.find((u) => u.id === teacherId);

    if (!cl || !sub || !tch) return;

    // Validate collision / conflict
    const conflict = checkScheduleConflict(
      {
        dayOfWeek,
        periodNumber,
        startTime,
        endTime,
        classId: cl.id,
        teacherId: tch.id,
      },
      schedules
    );

    if (conflict.hasConflict) {
      setConflictWarning(conflict.conflictMessage || 'Terjadi benturan jadwal mengajar!');
      return;
    }

    const newSchedule: LessonSchedule = {
      id: `sch-${Date.now()}`,
      classId: cl.id,
      className: cl.name,
      subjectId: sub.id,
      subjectName: sub.name,
      teacherId: tch.id,
      teacherName: tch.fullName,
      dayOfWeek,
      periodNumber,
      startTime,
      endTime,
      roomName,
      academicYear: cl.academicYear,
    };

    storageService.saveLessonSchedule(newSchedule, currentUser?.fullName || 'Admin');
    setShowAddModal(false);
    setSuccessMsg(`Jadwal pelajaran ${sub.name} kelas ${cl.name} hari ${dayOfWeek} berhasil ditambahkan!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDeleteSchedule = (id: string) => {
    if (confirm('Hapus jadwal pelajaran ini?')) {
      storageService.deleteLessonSchedule(id, currentUser?.fullName || 'Admin');
    }
  };

  const filteredSchedules = schedules.filter((s) => {
    if (classFilter !== 'ALL' && s.classId !== classFilter) return false;
    if (dayFilter !== 'ALL' && s.dayOfWeek !== dayFilter) return false;
    if (
      search &&
      !s.subjectName.toLowerCase().includes(search.toLowerCase()) &&
      !s.teacherName.toLowerCase().includes(search.toLowerCase()) &&
      !s.className.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-blue-100 text-blue-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
            Struktur KBM Mingguan
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Jadwal Pelajaran Kelas VII, VIII & IX
          </h2>
          <p className="text-xs text-slate-500">
            Terhubung langsung dengan sesi absensi guru dan dilengkapi deteksi otomatis benturan jadwal
          </p>
        </div>

        {isAdminOrKurikulum && (
          <button
            onClick={() => {
              setShowAddModal(true);
              setConflictWarning(null);
            }}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Tambah Jadwal Pelajaran
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Semua Kelas (VII, VIII, IX)</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Kelas {c.name}
              </option>
            ))}
          </select>

          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Semua Hari</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari mapel, guru, atau kelas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl w-56 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="text-slate-500">
          Total: <strong>{filteredSchedules.length}</strong> jadwal aktif
        </div>
      </div>

      {/* Timetable Cards Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchedules.map((s) => (
          <div
            key={s.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-black text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                  Kelas {s.className}
                </span>
                <span className="bg-slate-100 font-mono text-[11px] font-bold text-slate-700 px-2 py-0.5 rounded">
                  {s.dayOfWeek} (Jam ke-{s.periodNumber})
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 mt-2">{s.subjectName}</h3>
              <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mt-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> {s.teacherName}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {s.startTime} - {s.endTime}
                </span>
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {s.roomName}
                </span>
              </div>
            </div>

            {isAdminOrKurikulum && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleDeleteSchedule(s.id)}
                  className="text-rose-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Schedule Modal with Conflict Detection */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Tambah Sesi Jadwal Pelajaran Baru
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {conflictWarning && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Peringatan Benturan Jadwal:</div>
                  <div className="mt-0.5">{conflictWarning}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleAddSchedule} className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilih Kelas: *</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran: *</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guru Pengampu: *</label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                >
                  {users
                    .filter((u) => u.roles.includes('guru_mapel') || u.roles.includes('wali_kelas'))
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.position})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hari: *</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Ke-: *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={periodNumber}
                    onChange={(e) => setPeriodNumber(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Mulai:</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Selesai:</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ruangan / Lab:</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Ruang 7.1 / Lab Komputer"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Validasi & Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
