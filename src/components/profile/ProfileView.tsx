import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import {
  User,
  Shield,
  Briefcase,
  Mail,
  Phone,
  Key,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Save,
  LogOut,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile, activeRole, openLogoutModal } = useAuth();

  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [passwordOld, setPasswordOld] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!currentUser) {
    return <div className="p-8 text-center text-xs text-slate-500">Silakan login terlebih dahulu.</div>;
  }

  const handleUpdateContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ phone: phone.trim(), email: email.trim() });
    setMsg({ type: 'success', text: 'Data kontak profil Anda berhasil diperbarui!' });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordNew || passwordNew.length < 6) {
      setMsg({ type: 'error', text: 'Kata sandi baru minimal 6 karakter.' });
      return;
    }
    if (passwordNew !== passwordConfirm) {
      setMsg({ type: 'error', text: 'Konfirmasi kata sandi baru tidak cocok.' });
      return;
    }

    setMsg({ type: 'success', text: 'Kata sandi akun Anda berhasil diperbarui secara aman!' });
    setPasswordOld('');
    setPasswordNew('');
    setPasswordConfirm('');
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* View Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
            {currentUser.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">{currentUser.fullName}</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Akun Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">NIP / ID: {currentUser.nipOrId}</p>
            <p className="text-xs text-blue-700 font-semibold mt-0.5">{currentUser.position}</p>
          </div>
        </div>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs animate-fade-in ${
            msg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-semibold">{msg.text}</span>
        </div>
      )}

      {/* Profile Details & Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Roles & Structural Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            Hak Akses & Penugasan Resmi
          </h3>

          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Unit Kerja:</span>
              <span className="font-semibold text-slate-800">{currentUser.workUnit}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-1">Daftar Peran yang Dimiliki:</span>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.roles.map((r) => (
                  <span
                    key={r}
                    className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize"
                  >
                    {r.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {currentUser.homeroomClassId && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-emerald-900 font-bold block">Penugasan Wali Kelas:</span>
                <span className="text-emerald-800">
                  Bertanggung jawab atas rombel Kelas VII-A (T.A. 2025/2026)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Update Contact Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Mail className="w-4 h-4 text-teal-600" />
            Informasi Kontak Pribadi
          </h3>

          <form onSubmit={handleUpdateContact} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Resmi Sekolah:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812xxxxxxxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-xs"
              />
            </div>

            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Simpan Kontak
            </button>
          </form>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Key className="w-4 h-4 text-purple-600" />
          Perbarui Kata Sandi Akun
        </h3>

        <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kata Sandi Lama:</label>
            <input
              type="password"
              required
              value={passwordOld}
              onChange={(e) => setPasswordOld(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kata Sandi Baru:</label>
            <input
              type="password"
              required
              value={passwordNew}
              onChange={(e) => setPasswordNew(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ulangi Kata Sandi Baru:</label>
            <input
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-4 h-4" /> Ganti Kata Sandi
            </button>
          </div>
        </form>
      </div>

      {/* Session Management & Logout Card */}
      <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <LogOut className="w-4 h-4 text-rose-600" />
            Sesi Akun Aktif & Keamanan
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Anda sedang masuk sebagai <strong className="text-slate-800">{currentUser.fullName}</strong>. Pastikan untuk selalu keluar setelah selesai menggunakan sistem pada perangkat umum atau bersama.
          </p>
        </div>
        <button
          type="button"
          onClick={openLogoutModal}
          className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs shadow-rose-600/30 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Keluar dari Akun Ini
        </button>
      </div>
    </div>
  );
};
