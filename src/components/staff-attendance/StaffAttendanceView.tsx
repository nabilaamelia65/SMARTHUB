import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { StaffAttendance, StaffAttendanceStatus } from '../../types';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  History,
  ShieldCheck,
  UserCheck,
  Edit3,
  X,
  Search,
} from 'lucide-react';

export const StaffAttendanceView: React.FC = () => {
  const { currentUser } = useAuth();
  const attendances = storageService.getStaffAttendances();
  const settings = storageService.getSettings();

  const todayStr = '2026-10-28';
  const currentTimeStr = new Date().toLocaleTimeString('id-ID', { hour12: false });

  const [activeTab, setActiveTab] = useState<'pribadi' | 'rekap'>('pribadi');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Correction modal state (for Admin / Kepsek)
  const [selectedRecordForCorrection, setSelectedRecordForCorrection] = useState<StaffAttendance | null>(null);
  const [correctedStatus, setCorrectedStatus] = useState<StaffAttendanceStatus>('Hadir');
  const [correctionReason, setCorrectionReason] = useState('');

  // Recap filters
  const [recapSearch, setRecapSearch] = useState('');
  const [recapDateFilter, setRecapDateFilter] = useState(todayStr);

  const isAdminOrLeader = currentUser?.roles.some((r) =>
    ['admin', 'kepala_sekolah', 'staf_tu'].includes(r)
  );

  const myAttendanceToday = currentUser
    ? storageService.getStaffAttendanceToday(currentUser.id, todayStr)
    : undefined;

  const myHistory = currentUser
    ? attendances.filter((a) => a.userId === currentUser.id)
    : [];

  const handleCheckIn = () => {
    if (!currentUser) return;
    const res = storageService.recordStaffCheckIn(currentUser, todayStr, currentTimeStr);
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: res.message });
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleCheckOut = () => {
    if (!currentUser) return;
    const res = storageService.recordStaffCheckOut(currentUser, todayStr, currentTimeStr);
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: res.message });
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleSaveCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordForCorrection || !correctionReason.trim()) return;

    storageService.correctStaffAttendance(
      selectedRecordForCorrection.id,
      { status: correctedStatus },
      correctionReason.trim(),
      currentUser?.fullName || 'Administrator'
    );

    setSelectedRecordForCorrection(null);
    setCorrectionReason('');
    setFeedbackMsg({
      type: 'success',
      text: `Koreksi presensi atas nama ${selectedRecordForCorrection.userName} berhasil disimpan dan dicatat dalam audit log.`,
    });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const filteredRecap = attendances.filter((a) => {
    if (recapDateFilter && a.date !== recapDateFilter) return false;
    if (
      recapSearch &&
      !a.userName.toLowerCase().includes(recapSearch.toLowerCase()) &&
      !a.nipOrId.includes(recapSearch) &&
      !a.position.toLowerCase().includes(recapSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
            Disiplin Personel Sekolah
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Presensi Kehadiran Guru & Tenaga Kependidikan
          </h2>
          <p className="text-xs text-slate-500">
            Jam Masuk: {settings.workStartHour} WIB • Batas Keterlambatan: {settings.lateThresholdHour} WIB • Jam Pulang: {settings.workEndHour} WIB
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('pribadi')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pribadi'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Presensi Pribadi Saya
          </button>

          {isAdminOrLeader && (
            <button
              onClick={() => setActiveTab('rekap')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'rekap'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <History className="w-4 h-4" />
              Rekap Kehadiran Seluruh PTK ({attendances.length})
            </button>
          )}
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs animate-fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-semibold">{feedbackMsg.text}</span>
        </div>
      )}

      {/* TAB 1: PRESENSI PRIBADI */}
      {activeTab === 'pribadi' && (
        <div className="space-y-6">
          {/* Check In / Out Action Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-500">Akun Anda Saat Ini:</span>
                <h3 className="text-lg font-bold text-slate-900">{currentUser?.fullName}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  NIP: {currentUser?.nipOrId} • Jabatan: {currentUser?.position}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Tanggal Sistem:</span>
                <div className="font-mono font-bold text-slate-800 text-sm">{todayStr}</div>
              </div>
            </div>

            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Status Box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Status Presensi Masuk:</span>
                  {myAttendanceToday?.checkInTime ? (
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                      Tercatat ({myAttendanceToday.checkInTime})
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">
                      Belum Masuk
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Status Presensi Pulang:</span>
                  {myAttendanceToday?.checkOutTime ? (
                    <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
                      Tercatat ({myAttendanceToday.checkOutTime})
                    </span>
                  ) : (
                    <span className="text-slate-400 font-bold px-2.5 py-0.5 rounded-full">
                      Belum Pulang
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-semibold">Kategori Kehadiran:</span>
                  <span className="font-bold text-slate-800">
                    {myAttendanceToday?.status || 'Belum Terdata'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={!!myAttendanceToday?.checkInTime}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-40 cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  Presensi Masuk Sekarang
                </button>

                <button
                  type="button"
                  onClick={handleCheckOut}
                  disabled={!myAttendanceToday?.checkInTime || !!myAttendanceToday?.checkOutTime}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-40 cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  Presensi Pulang
                </button>
              </div>
            </div>
          </div>

          {/* Personal History Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Riwayat Presensi Pribadi Anda</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Jam Masuk</th>
                    <th className="py-2.5 px-3">Jam Pulang</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Keterangan / Koreksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                        {item.date}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-800">
                        {item.checkInTime || '-'}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-800">
                        {item.checkOutTime || '-'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.status === 'Hadir'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Terlambat'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {item.isCorrected ? (
                          <span className="text-purple-700 font-semibold text-[11px]">
                            [Koreksi oleh {item.correctedBy}]: {item.correctionReason}
                          </span>
                        ) : (
                          item.notes || '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REKAP KEHADIRAN SELURUH PTK (ADMIN/LEADER ONLY) */}
      {activeTab === 'rekap' && isAdminOrLeader && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Rekap Kehadiran Seluruh Personel Sekolah
              </h3>
              <p className="text-xs text-slate-500">
                Pimpinan dan petugas administrasi dapat memeriksa dan mengoreksi data presensi bila diperlukan
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={recapDateFilter}
                onChange={(e) => setRecapDateFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono"
              />
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama/NIP..."
                  value={recapSearch}
                  onChange={(e) => setRecapSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-44"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Nama Pegawai & Gelar</th>
                  <th className="py-2.5 px-3">NIP / ID</th>
                  <th className="py-2.5 px-3">Jabatan & Unit</th>
                  <th className="py-2.5 px-3">Jam Masuk</th>
                  <th className="py-2.5 px-3">Jam Pulang</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecap.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-slate-400">
                      Tidak ada data presensi pada tanggal {recapDateFilter}.
                    </td>
                  </tr>
                ) : (
                  filteredRecap.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-slate-600">{rec.date}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{rec.userName}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{rec.nipOrId}</td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {rec.position} ({rec.workUnit})
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                        {rec.checkInTime || '-'}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {rec.checkOutTime || '-'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            rec.status === 'Hadir'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.status === 'Terlambat'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedRecordForCorrection(rec);
                            setCorrectedStatus(rec.status);
                            setCorrectionReason('');
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium flex items-center gap-1 mx-auto"
                        >
                          <Edit3 className="w-3 h-3 text-blue-600" />
                          Koreksi
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Koreksi Presensi Modal */}
      {selectedRecordForCorrection && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Koreksi Presensi Personel</h3>
              <button
                onClick={() => setSelectedRecordForCorrection(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCorrection} className="py-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-500">Nama Pegawai:</span>
                <div className="font-bold text-slate-900 text-sm">
                  {selectedRecordForCorrection.userName}
                </div>
                <div className="text-[11px] text-slate-500">
                  Tanggal: {selectedRecordForCorrection.date}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ubah Status Kehadiran:
                </label>
                <select
                  value={correctedStatus}
                  onChange={(e) => setCorrectedStatus(e.target.value as StaffAttendanceStatus)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800"
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Terlambat">Terlambat</option>
                  <option value="Izin">Izin</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Dinas Luar">Dinas Luar</option>
                  <option value="Tidak Hadir">Tidak Hadir</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alasan Koreksi (Wajib Dicatat dalam Log): *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Pegawai sedang mendampingi lomba OSN di dinas kota, surat tugas terlampir..."
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedRecordForCorrection(null)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Simpan Koreksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
