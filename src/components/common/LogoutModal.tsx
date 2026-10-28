import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, AlertTriangle, X, ShieldCheck } from 'lucide-react';

export const LogoutModal: React.FC = () => {
  const { isLogoutModalOpen, closeLogoutModal, logout, currentUser } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLogoutModalOpen) {
        closeLogoutModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLogoutModalOpen, closeLogoutModal]);

  if (!isLogoutModalOpen || !currentUser) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <h3 id="logout-title" className="text-sm font-bold text-white leading-tight">
                Keluar dari Aplikasi
              </h3>
              <p className="text-[11px] text-slate-400">Smarthub MTsN 1 Kartanegara</p>
            </div>
          </div>
          <button
            onClick={closeLogoutModal}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-slate-700">
          <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Apakah Anda yakin ingin mengakhiri sesi aktif?</p>
              <p className="text-rose-700 text-[11px] leading-relaxed">
                Anda akan dialihkan ke halaman login. Semua data perubahan yang telah Anda simpan tetap aman di sistem.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Akun yang Sedang Digunakan:
            </div>
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>{currentUser.fullName}</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                {currentUser.position}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              NIP / ID: {currentUser.nipOrId}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Anda dapat masuk kembali kapan saja dengan NIP atau Username terdaftar.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={closeLogoutModal}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 bg-white border border-slate-300 rounded-xl transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs shadow-rose-600/30 flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Ya, Keluar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
