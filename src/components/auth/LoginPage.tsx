import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import {
  School,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  Globe,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
  onBackToWebsite?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onBackToWebsite }) => {
  const { login, quickSwitchUser, loggedOutNotice } = useAuth();
  const [nipOrUsername, setNipOrUsername] = useState('197505121999032001'); // Dra. Hj. Siti Rahmawati
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const settings = storageService.getSettings();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await login(nipOrUsername, password);
      if (res.success) {
        onSuccess();
      } else {
        setErrorMessage(res.message || 'Login gagal.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAccount = (nip: string) => {
    setNipOrUsername(nip);
    setPassword('password123');
  };

  const handleDirectLogin = async (nip: string) => {
    setNipOrUsername(nip);
    setPassword('password123');
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await login(nip, 'password123');
      if (res.success) {
        onSuccess();
      } else {
        setErrorMessage(res.message || 'Login gagal.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950/40 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* School Logo / Emblem */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-600 via-teal-600 to-blue-700 flex items-center justify-center text-white shadow-xl shadow-emerald-900/30 ring-4 ring-emerald-500/20">
            <School className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="mt-4">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Kementerian Agama RI
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
            Smarthub MTsN 1 Kartanegara
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            Sistem Informasi Manajemen Madrasah & Monitoring Akademik Terpadu
          </p>
        </div>

        {onBackToWebsite && (
          <div className="mt-4">
            <button
              type="button"
              onClick={onBackToWebsite}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lihat Laman / Website Utama Madrasah</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/90 py-8 px-6 shadow-2xl rounded-2xl sm:px-8 space-y-4">
          {loggedOutNotice && (
            <div className="p-3.5 bg-emerald-950/70 border border-emerald-500/50 rounded-xl flex items-start gap-2.5 text-xs text-emerald-200 animate-fade-in shadow-md">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <div className="flex-1">
                <span className="font-semibold block">{loggedOutNotice}</span>
                <span className="text-[11px] text-emerald-300/80">
                  Sesi akun Anda telah ditutup dengan aman. Silakan masuk kembali dengan NIP atau pilih akun simulasi.
                </span>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            {errorMessage && (
              <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl flex items-start gap-2.5 text-xs text-rose-300 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nomor Induk Pegawai (NIP) / Username
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={nipOrUsername}
                  onChange={(e) => setNipOrUsername(e.target.value)}
                  placeholder="Masukkan NIP atau nama pengguna..."
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 select-none">Ingat sesi perangkat</span>
              </label>
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
              >
                Bantuan Masuk
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-linear-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 shadow-lg shadow-emerald-700/25 transition cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Memverifikasi Kredensial...</span>
              ) : (
                <>
                  <span>Masuk ke Portal Madrasah</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Discreet Quick Switch Accordion */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-400 hover:text-slate-200 py-1 transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Pilihan Akun Pejabat & Guru (Simulasi)
              </span>
              {showDemoAccounts ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showDemoAccounts && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] animate-fade-in">
                <button
                  type="button"
                  onClick={() => handleDirectLogin('197505121999032001')}
                  className="p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-left border border-slate-800 hover:border-emerald-500/50 text-slate-200 transition cursor-pointer group"
                  title="Klik untuk langsung masuk sebagai Wali Kelas VII-A"
                >
                  <div className="font-semibold text-emerald-300 group-hover:text-emerald-200 flex items-center justify-between">
                    <span>Wali Kelas VII-A</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-normal">Masuk →</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Dra. Hj. Siti Rahmawati</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectLogin('198506142010011012')}
                  className="p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-left border border-slate-800 hover:border-blue-500/50 text-slate-200 transition cursor-pointer group"
                  title="Klik untuk langsung masuk sebagai Admin SIMS"
                >
                  <div className="font-semibold text-blue-300 group-hover:text-blue-200 flex items-center justify-between">
                    <span>Admin / Operator</span>
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-normal">Masuk →</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Fajar Nugraha, S.Kom.</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectLogin('196803151994121001')}
                  className="p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-left border border-slate-800 hover:border-amber-500/50 text-slate-200 transition cursor-pointer group"
                  title="Klik untuk langsung masuk sebagai Kepala Madrasah"
                >
                  <div className="font-semibold text-amber-300 group-hover:text-amber-200 flex items-center justify-between">
                    <span>Kepala Madrasah</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-normal">Masuk →</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Dr. H. Bambang Suryanto</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectLogin('197204181998021003')}
                  className="p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-left border border-slate-800 hover:border-teal-500/50 text-slate-200 transition cursor-pointer group"
                  title="Klik untuk langsung masuk sebagai Wakasek Kurikulum"
                >
                  <div className="font-semibold text-teal-300 group-hover:text-teal-200 flex items-center justify-between">
                    <span>Wakasek Kurikulum</span>
                    <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded font-normal">Masuk →</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Hendra Gunawan, M.Pd.</div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>© 2026 MTsN 1 Kartanegara • Kementerian Agama Republik Indonesia</p>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Sistem Informasi Manajemen Madrasah Terpadu
          </p>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" /> Bantuan Masuk Akun
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Silakan masukkan NIP resmi atau username terdaftar Anda. Untuk pendidik dan tenaga kependidikan baru, silakan hubungi bagian Tata Usaha / Operator IT madrasah untuk aktivasi akun dinas.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 mb-4">
              Pusat Layanan IT: (0541) 661234
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
