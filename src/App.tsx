import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LogoutModal } from './components/common/LogoutModal';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { ScanQrView } from './components/qr/ScanQrView';
import { PicketScheduleView } from './components/picket/PicketScheduleView';
import { OrganizationView } from './components/organization/OrganizationView';
import { SchoolRulesView } from './components/rules/SchoolRulesView';
import { HomeroomView } from './components/homeroom/HomeroomView';
import { LessonScheduleView } from './components/schedule/LessonScheduleView';
import { AttendanceLessonView } from './components/attendance/AttendanceLessonView';
import { TaskReportView } from './components/tasks/TaskReportView';
import { StaffAttendanceView } from './components/staff-attendance/StaffAttendanceView';
import { ProfileView } from './components/profile/ProfileView';
import { DataManagementView } from './components/admin/DataManagementView';
import { SettingsView } from './components/settings/SettingsView';

const MainAppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage onSuccess={() => setActiveView('dashboard')} />;
  }

  const getMenuTitle = (view: string): string => {
    switch (view) {
      case 'dashboard':
        return 'Dashboard Monitoring Sekolah';
      case 'scan-qr':
        return 'Scan QR / Barcode Rombel';
      case 'jadwal-piket':
        return 'Jadwal Piket Guru & Tenaga Kependidikan';
      case 'struktur-organisasi':
        return 'Struktur Organisasi & Pimpinan';
      case 'tata-tertib':
        return 'Tata Tertib & Kedisiplinan Sekolah';
      case 'wali-kelas':
        return 'Data Rombel & Penugasan Wali Kelas';
      case 'jadwal-pelajaran':
        return 'Jadwal Pelajaran Mingguan';
      case 'absensi-pembelajaran':
        return 'Absensi Siswa & Catatan Pembelajaran';
      case 'laporan-tugas':
        return 'Laporan Ketuntasan Tugas Siswa';
      case 'absensi-personel':
        return 'Presensi Kehadiran Guru & Tenaga Kependidikan';
      case 'profil':
        return 'Profil Saya & Pengaturan Akun';
      case 'manajemen-data':
        return 'Manajemen Data Master (CRUD)';
      case 'pengaturan':
        return 'Pengaturan & Identitas Sekolah';
      default:
        return 'SCHOOLHUB';
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView onNavigate={(v) => setActiveView(v)} />;
      case 'scan-qr':
        return <ScanQrView />;
      case 'jadwal-piket':
        return <PicketScheduleView />;
      case 'struktur-organisasi':
        return <OrganizationView />;
      case 'tata-tertib':
        return <SchoolRulesView />;
      case 'wali-kelas':
        return <HomeroomView />;
      case 'jadwal-pelajaran':
        return <LessonScheduleView />;
      case 'absensi-pembelajaran':
        return <AttendanceLessonView />;
      case 'laporan-tugas':
        return <TaskReportView />;
      case 'absensi-personel':
        return <StaffAttendanceView />;
      case 'profil':
        return <ProfileView />;
      case 'manajemen-data':
        return <DataManagementView />;
      case 'pengaturan':
        return <SettingsView />;
      default:
        return <DashboardView onNavigate={(v) => setActiveView(v)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased font-sans">
      {/* Main app layout */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={(view) => setActiveView(view)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Navbar */}
          <Navbar
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            activeMenuTitle={getMenuTitle(activeView)}
            onNavigate={(view) => setActiveView(view)}
          />

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderActiveView()}
          </main>

          {/* Footer */}
          <footer className="py-4 px-6 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
            Smarthub MTsN 1 Kartanegara • Sistem Informasi Manajemen Madrasah Terpadu
          </footer>
        </div>
      </div>

      {/* Global Logout Confirmation Modal */}
      <LogoutModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
