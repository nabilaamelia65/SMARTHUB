import React, { useState, useRef, useEffect } from 'react';
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
  Check,
  Calendar,
  Globe,
  Settings as SettingsIcon,
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

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const settings = storageService.getSettings();

  // Handle clicking outside of dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (userDropdownRef.current && !userDropdownRef.current.contains(target)) {
        setShowUserDropdown(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(target)) {
        setShowRoleDropdown(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(target)) {
        setShowNotifications(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserDropdown(false);
        setShowRoleDropdown(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
        return 'Guru Mapel';
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
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date());

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md w-full border-b border-slate-800">
      <div className="w-full max-w-full px-2.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition shrink-0"
            aria-label="Buka navigasi menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="font-semibold text-emerald-400 uppercase tracking-wider truncate">
                {settings.schoolName}
              </span>
              <span>•</span>
              <span className="truncate">
                T.A. {settings.academicYear} ({settings.semester})
              </span>
            </div>
            <h1 className="text-sm sm:text-base lg:text-lg font-bold text-slate-100 truncate leading-tight">
              {activeMenuTitle}
            </h1>
          </div>
        </div>

        {/* Right: Actions, Notifications, Profile & Logout */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Public Website Button (Icon on sm, label on md+) */}
          <button
            onClick={() => onNavigate('website-publik')}
            className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white bg-emerald-950/70 hover:bg-emerald-900/80 px-2 py-1.5 md:px-2.5 rounded-lg border border-emerald-600/40 transition cursor-pointer shrink-0"
            title="Kunjungi Website Resmi MTsN 1 Kartanegara"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden md:inline font-medium">Website Madrasah</span>
          </button>

          {/* Today Date pill (desktop xl) */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>{todayFormatted}</span>
          </div>

          {/* Multi-role Switcher button (Desktop/Tablet) */}
          {currentUser && currentUser.roles.length > 1 && (
            <div className="relative hidden md:block shrink-0" ref={roleDropdownRef}>
              <button
                onClick={() => {
                  setShowRoleDropdown(!showRoleDropdown);
                  setShowUserDropdown(false);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-1.5 bg-blue-950/80 hover:bg-blue-900/90 text-blue-200 border border-blue-700/50 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                title="Ganti peran aktif saat ini"
              >
                <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="max-w-[100px] truncate">{getRoleLabel(activeRole)}</span>
                <ChevronDown className="w-3 h-3 text-blue-400 shrink-0" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-scale-up">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Pilih Peran Tampilan
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
                        <span className="flex items-center gap-2 truncate">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isSelected ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          />
                          <span className="truncate">{getRoleLabel(r)}</span>
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Notifications button */}
          <div className="relative shrink-0" ref={notifDropdownRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowRoleDropdown(false);
                setShowUserDropdown(false);
              }}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 relative transition cursor-pointer"
              aria-label="Notifikasi aktivitas sekolah"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-xs sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-scale-up">
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
                    <p className="font-semibold text-slate-900">Ketuntasan Tugas Siswa</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Pembaruan catatan tugas dari guru mapel siap ditinjau.
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
            <div className="relative shrink-0" ref={userDropdownRef}>
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowRoleDropdown(false);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-2 bg-slate-800 hover:bg-slate-700/80 rounded-lg sm:rounded-xl border border-slate-700/70 transition cursor-pointer"
                aria-label="Menu profil pengguna"
                title={`Masuk sebagai ${currentUser.fullName}`}
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-slate-200 max-w-[120px] truncate leading-tight">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-emerald-300 leading-tight truncate">
                    {getRoleLabel(activeRole)}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-[270px] bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-scale-up">
                  {/* User info */}
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="font-bold text-xs text-slate-900 truncate">{currentUser.fullName}</div>
                    <div className="text-[11px] text-slate-500 font-mono truncate">NIP: {currentUser.nipOrId}</div>
                    <div className="text-[10px] text-emerald-700 mt-1 font-semibold bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md inline-block max-w-full truncate">
                      {currentUser.position}
                    </div>
                  </div>

                  {/* Mobile Role Switcher (Shown inside profile on mobile if multiple roles) */}
                  {currentUser.roles.length > 1 && (
                    <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/70 md:hidden">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-blue-600" />
                        <span>Ganti Peran Aktif</span>
                      </div>
                      <div className="space-y-1">
                        {currentUser.roles.map((r) => {
                          const isSelected = activeRole === r;
                          return (
                            <button
                              key={r}
                              onClick={() => {
                                setActiveRole(r);
                                setShowUserDropdown(false);
                              }}
                              className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition cursor-pointer ${
                                isSelected ? 'font-bold text-blue-600 bg-blue-100/60' : 'text-slate-700 hover:bg-white'
                              }`}
                            >
                              <span className="truncate">{getRoleLabel(r)}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('profil');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Profil Saya & Akun</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('website-publik');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition cursor-pointer sm:hidden"
                    >
                      <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Website Madrasah</span>
                    </button>
                  </div>

                  {/* Logout item inside dropdown */}
                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        openLogoutModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-semibold transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer"
            >
              Masuk
            </button>
          )}

          {/* Dedicated Direct Logout Button on top bar */}
          {currentUser && (
            <button
              onClick={openLogoutModal}
              className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/15 hover:bg-rose-600 border border-rose-500/30 transition cursor-pointer shrink-0"
              title="Keluar dari akun (Logout)"
              aria-label="Keluar dari aplikasi"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400 group-hover:text-white shrink-0" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
