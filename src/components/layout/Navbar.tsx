import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { UserRole } from '../../types';
import {
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Shield,
  GraduationCap,
  Briefcase,
  Check,
  Calendar,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  activeMenuTitle: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, activeMenuTitle, onNavigate }) => {
  const { currentUser, activeRole, setActiveRole, openLogoutModal } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const settings = storageService.getSettings();

  const getRoleLabel = (role: UserRole | null): string => {
    switch (role) {
      case 'admin':
        return 'Admin / Operator';
      case 'kepala_sekolah':
        return 'Kepala Sekolah';
      case 'wakasek_kurikulum':
        return 'Wakasek Kurikulum';
      case 'wakasek_kesiswaan':
        return 'Wakasek Kesiswaan';
      case 'wakasek_humas':
        return 'Wakasek Humas';
      case 'wakasek_sarpras':
        return 'Wakasek Sarpras';
      case 'wali_kelas':
        return 'Wali Kelas';
      case 'guru_mapel':
        return 'Guru Mata Pelajaran';
      case 'staf_tu':
        return 'Staf Tata Usaha';
      case 'staf_keamanan':
        return 'Staf Keamanan';
      case 'staf_kebersihan':
        return 'Staf Kebersihan';
      case 'staf_koperasi':
        return 'Staf Koperasi';
      default:
        return 'Pengguna';
    }
  };

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            aria-label="Buka navigasi menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider hidden sm:inline">
                {settings.schoolName}
              </span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                T.A. {settings.academicYear} ({settings.semester})
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-1.5">
              {activeMenuTitle}
            </h1>
          </div>
        </div>

        {/* Right: Date, Role Switcher, Notifications, User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Today Date pill (desktop) */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{todayFormatted}</span>
          </div>

          {/* Multi-role Switcher (if user has > 1 role) */}
          {currentUser && currentUser.roles.length > 1 && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowRoleDropdown(!showRoleDropdown);
                  setShowUserDropdown(false);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-1.5 bg-blue-950/80 hover:bg-blue-900/90 text-blue-200 border border-blue-700/50 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                title="Ganti peran aktif Anda saat ini"
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="max-w-[110px] sm:max-w-none truncate">{getRoleLabel(activeRole)}</span>
                <ChevronDown className="w-3 h-3 text-blue-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-scale-up">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Pilih Peran Tampilan Aktif
                  </div>
                  {currentUser.roles.map((r) => {
                    const isSelected = activeRole === r;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          setActiveRole(r);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition cursor-pointer ${
                          isSelected ? 'font-bold text-blue-600 bg-blue-50/60' : 'text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSelected ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          />
                          {getRoleLabel(r)}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowRoleDropdown(false);
                setShowUserDropdown(false);
              }}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 relative transition cursor-pointer"
              aria-label="Notifikasi aktivitas sekolah"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-scale-up">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">Pemberitahuan Sistem</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">
                    3 Baru
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
                  <div className="p-3 hover:bg-slate-50 transition">
                    <p className="font-semibold text-slate-900">Jadwal Piket Hari Ini</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Budi Santoso & Rini Astuti bertugas di Pos Utama & Koridor.
                    </p>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition">
                    <p className="font-semibold text-slate-900">Ketuntasan Tugas Kelas VII-A</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      2 siswa memiliki tugas Matematika yang belum tuntas melewati tenggat waktu.
                    </p>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition">
                    <p className="font-semibold text-slate-900">Sinkronisasi Presensi Masuk</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Batas waktu presensi tepat waktu berlaku hingga 07:15 WIB.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowRoleDropdown(false);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 pl-2 bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700/70 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-slate-200 max-w-[130px] truncate leading-tight">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-blue-300 leading-tight">
                    {getRoleLabel(activeRole)}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-scale-up">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="font-bold text-xs text-slate-900">{currentUser.fullName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">NIP: {currentUser.nipOrId}</div>
                    <div className="text-[11px] text-blue-700 mt-1 font-medium bg-blue-50 px-2 py-0.5 rounded inline-block">
                      {currentUser.position}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('profil');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      Profil Saya & Akun
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        openLogoutModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Keluar (Logout)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition"
            >
              Masuk
            </button>
          )}

          {/* Dedicated Quick Logout button on top bar */}
          {currentUser && (
            <button
              onClick={openLogoutModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-100 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition cursor-pointer"
              title="Keluar dari akun (Logout)"
              aria-label="Keluar dari aplikasi"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
