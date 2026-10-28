import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { PicketSchedule } from '../../types';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Edit,
  Clock,
  MapPin,
  Calendar,
  X,
} from 'lucide-react';

export const PicketScheduleView: React.FC = () => {
  const { currentUser } = useAuth();
  const pickets = storageService.getPicketSchedules();
  const users = storageService.getUsers();

  const [search, setSearch] = useState('');
  const [taskTypeFilter, setTaskTypeFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [date, setDate] = useState('2026-10-28');
  const [dayOfWeek, setDayOfWeek] = useState<PicketSchedule['dayOfWeek']>('Rabu');
  const [staffId, setStaffId] = useState(users[0]?.id || '');
  const [taskType, setTaskType] = useState<PicketSchedule['taskType']>('Piket Gerbang & Kehadiran');
  const [timeSlot, setTimeSlot] = useState('06:30 - 15:00');
  const [location, setLocation] = useState('Pos Gerbang Depan & Lobi Utama');
  const [notes, setNotes] = useState('');

  const isAdminOrLeader = currentUser?.roles.some((r) =>
    ['admin', 'kepala_sekolah', 'wakasek_kesiswaan', 'wakasek_sarpras', 'staf_tu'].includes(r)
  );

  const todayStr = '2026-10-28';

  const handleAddPicket = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = users.find((u) => u.id === staffId);
    if (!staff) return;

    const newPicket: PicketSchedule = {
      id: `picket-${Date.now()}`,
      date,
      dayOfWeek,
      staffId: staff.id,
      staffName: staff.fullName,
      staffPosition: staff.position,
      taskType,
      timeSlot,
      location,
      notes: notes.trim() || undefined,
    };

    storageService.savePicketSchedule(newPicket, currentUser?.fullName || 'Admin');
    setShowAddModal(false);
    setNotes('');
  };

  const handleDeletePicket = (id: string) => {
    if (confirm('Hapus jadwal piket ini?')) {
      storageService.deletePicketSchedule(id, currentUser?.fullName || 'Admin');
    }
  };

  const filteredPickets = pickets.filter((p) => {
    if (taskTypeFilter !== 'ALL' && p.taskType !== taskTypeFilter) return false;
    if (
      search &&
      !p.staffName.toLowerCase().includes(search.toLowerCase()) &&
      !p.location.toLowerCase().includes(search.toLowerCase())
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
          <span className="bg-teal-100 text-teal-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
            Ketertiban & K3 Sekolah
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Jadwal Piket Guru & Tenaga Kependidikan
          </h2>
          <p className="text-xs text-slate-500">
            Pengaturan tugas penyambutan siswa, ketertiban KBM, pengawasan gerbang, dan layanan kesehatan sekolah
          </p>
        </div>

        {isAdminOrLeader && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Tambah Jadwal Piket
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={taskTypeFilter}
            onChange={(e) => setTaskTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Semua Jenis Tugas Piket</option>
            <option value="Piket Gerbang & Kehadiran">Piket Gerbang & Kehadiran</option>
            <option value="Piket KBM & Ketertiban">Piket KBM & Ketertiban</option>
            <option value="Piket UKS & Kebersihan">Piket UKS & Kebersihan</option>
            <option value="Piket Umum">Piket Umum</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama petugas atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl w-56 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="text-slate-500">
          Total: <strong>{filteredPickets.length}</strong> jadwal piket
        </div>
      </div>

      {/* Pickets Grid & Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPickets.map((p) => {
          const isToday = p.date === todayStr;
          return (
            <div
              key={p.id}
              className={`p-5 rounded-2xl border transition shadow-xs flex flex-col justify-between ${
                isToday
                  ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    {p.dayOfWeek}, {p.date}
                  </span>
                  {isToday && (
                    <span className="bg-teal-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                      HARI INI
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-2.5">{p.staffName}</h3>
                <p className="text-[11px] text-slate-500">{p.staffPosition}</p>

                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <CalendarDays className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{p.taskType}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{p.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{p.location}</span>
                  </div>
                </div>

                {p.notes && (
                  <p className="mt-2.5 p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600 italic border border-slate-100">
                    "{p.notes}"
                  </p>
                )}
              </div>

              {isAdminOrLeader && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleDeletePicket(p.id)}
                    className="text-rose-600 hover:text-rose-700 p-1 text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Picket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Jadwal Piket Petugas</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPicket} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Petugas: *</label>
                <select
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                >
                  {users.map((u) => (
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
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal: *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Tugas Piket: *</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                >
                  <option value="Piket Gerbang & Kehadiran">Piket Gerbang & Kehadiran</option>
                  <option value="Piket KBM & Ketertiban">Piket KBM & Ketertiban</option>
                  <option value="Piket UKS & Kebersihan">Piket UKS & Kebersihan</option>
                  <option value="Piket Umum">Piket Umum</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Periode Waktu:</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    placeholder="06:30 - 15:00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lokasi Tanggung Jawab:</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Pos Gerbang / Lobi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan:</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instruksi khusus jika ada guru izin..."
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
                  Simpan Jadwal Piket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
