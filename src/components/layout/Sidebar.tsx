import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  QrCode,
  CalendarDays,
  Network,
  BookOpenCheck,
  GraduationCap,
  CalendarClock,
  ClipboardCheck,
  FileCheck2,
  Clock,
  User,
  Database,
  Settings,
  X,
  School,
  LogOut,
  Globe,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  allowedRoles?: string[]; // If undefined, available to all logged-in roles
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const { currentUser, activeRole, openLogoutModal } = useAuth();

  const userRoles = currentUser?.roles || [];
  const currentActiveRole = activeRole || userRoles[0] || '';

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'scan-qr',
      label: 'Scan QR / Barcode',
      icon: QrCode,
      badge: 'Wali Kelas',
      allowedRoles: [
        'admin',
        'kepala_sekolah',
        'wakasek_kurikulum',
        'wakasek_kesiswaan',
        'wali_kelas',
        'guru_mapel',
      ],
    },
    {
      id: 'jadwal-piket',
      label: 'Jadwal Piket',
      icon: CalendarDays,
    },
    {
      id: 'struktur-organisasi',
      label: 'Struktur Organisasi',
      icon: Network,
    },
    {
      id: 'tata-tertib',
      label: 'Tata Tertib Sekolah',
      icon: BookOpenCheck,
    },
    {
      id: 'wali-kelas',
      label: 'Data Wali Kelas',
      icon: GraduationCap,
      allowedRoles: [
        'admin',
        'kepala_sekolah',
        'wakasek_kurikulum',
        'wakasek_kesiswaan',
        'wakasek_humas',
        'wakasek_sarpras',
        'wali_kelas',
        'guru_mapel',
        'staf_tu',
      ],
    },
    {
      id: 'jadwal-pelajaran',
      label: 'Jadwal Pelajaran',
      icon: CalendarClock,
      allowedRoles: [
        'admin',
        'kepala_sekolah',
        'wakasek_kurikulum',
        'wakasek_kesiswaan',
        'wali_kelas',
        'guru_mapel',
        'staf_tu',
      ],
    },
    {
      id: 'absensi-pembelajaran',
      label: 'Absensi & Pembelajaran',
      icon: ClipboardCheck,
      allowedRoles: [
        'admin',
        'kepala_sekolah',
        'wakasek_kurikulum',
        'guru_mapel',
        'wali_kelas',
      ],
    },
    {
      id: 'laporan-tugas',
      label: 'Laporan Tugas Siswa',
      icon: FileCheck2,
      allowedRoles: [
        'admin',
        'kepala_sekolah',
        'wakasek_kurikulum',
        'wakasek_kesiswaan',
        'guru_mapel',
        'wali_kelas',
      ],
    },
    {
      id: 'absensi-personel',
      label: 'Absensi Guru & PTK',
      icon: Clock,
    },
    {
      id: 'profil',
      label: 'Profil Saya',
      icon: User,
    },
    {
      id: 'manajemen-data',
      label: 'Manajemen Data',
      icon: Database,
      badge: 'Admin',
      allowedRoles: ['admin'],
    },
    {
      id: 'website-publik',
      label: 'Website Publik Madrasah',
      icon: Globe,
      badge: 'Publik',
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan Sekolah',
      icon: Settings,
      allowedRoles: ['admin'],
    },
  ];

  // Filter items based on user roles
  const filteredNavItems = navItems.filter((item) => {
    if (!item.allowedRoles) return true;
    // Allow if user possesses ANY role in allowedRoles (or activeRole is in allowedRoles)
    return item.allowedRoles.some(
      (role) => userRoles.includes(role as any) || currentActiveRole === role
    );
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-emerald-600 via-teal-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-sm tracking-wide text-white flex items-center gap-1.5">
                <span>Smarthub</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-mono">
                  MTsN 1
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">MTsN 1 Kartanegara</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
            aria-label="Tutup navigasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Menu Utama
          </div>

          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      isActive
                        ? 'bg-blue-700 text-blue-100'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User status & Logout button */}
        <div className="shrink-0 p-3 border-t border-slate-800 bg-slate-950/70 space-y-2">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
              {currentUser?.fullName.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {currentUser?.fullName || 'Belum Masuk'}
              </div>
              <div className="text-[10px] text-emerald-400 truncate">
                {currentUser?.position || 'Pengguna'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              openLogoutModal();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition cursor-pointer"
            title="Keluar dari akun dan kembali ke halaman login"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
