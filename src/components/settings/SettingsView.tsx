import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { SchoolSettings } from '../../types';
import {
  Settings,
  School,
  Save,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  Phone,
  UserCheck,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser } = useAuth();
  const currentSettings = storageService.getSettings();

  const [form, setForm] = useState<SchoolSettings>(currentSettings);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings(form, currentUser?.fullName || 'Admin');
    setSuccessMsg('Konfigurasi identitas sekolah dan jam operasional berhasil diperbarui!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <span className="bg-slate-100 text-slate-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Konfigurasi Sistem
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">Pengaturan Lembaga Sekolah</h2>
            <p className="text-xs text-slate-500">
              Ubah nama sekolah, NPSN, tahun ajaran aktif, kepala sekolah, serta aturan jam presensi kerja
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identitas Sekolah */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <School className="w-4 h-4 text-blue-600" /> Identitas Resmi Satuan Pendidikan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Resmi Sekolah: *</label>
              <input
                type="text"
                required
                value={form.schoolName}
                onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NPSN (Nomor Pokok Sekolah Nasional): *</label>
              <input
                type="text"
                required
                value={form.npsn}
                onChange={(e) => setForm({ ...form, npsn: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran Aktif:</label>
              <input
                type="text"
                value={form.academicYear}
                onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                placeholder="2025/2026"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Semester Aktif:</label>
              <select
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Sekolah:</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Kepala Sekolah & Kontak */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-600" /> Penandatangan Resmi & Kontak Layanan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah & Gelar: *</label>
              <input
                type="text"
                required
                value={form.headmasterName}
                onChange={(e) => setForm({ ...form, headmasterName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah: *</label>
              <input
                type="text"
                required
                value={form.headmasterNip}
                onChange={(e) => setForm({ ...form, headmasterNip: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Satuan Pendidikan:</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon Kantor:</label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Aturan Jam Kerja Presensi */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" /> Aturan Jam Kerja Presensi Personel
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jam Masuk (Buka Presensi):</label>
              <input
                type="time"
                value={form.workStartHour}
                onChange={(e) => setForm({ ...form, workStartHour: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Batas Waktu Tepat Waktu (Toleransi):</label>
              <input
                type="time"
                value={form.lateThresholdHour}
                onChange={(e) => setForm({ ...form, lateThresholdHour: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-amber-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jam Pulang Resmi:</label>
              <input
                type="time"
                value={form.workEndHour}
                onChange={(e) => setForm({ ...form, workEndHour: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-blue-700"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Simpan Pengaturan Sekolah
          </button>
        </div>
      </form>
    </div>
  );
};
