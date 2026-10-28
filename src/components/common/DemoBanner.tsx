import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import {
  Sparkles,
  RefreshCw,
  UserCheck,
  Database,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { currentUser, quickSwitchUser, activeRole, setActiveRole } = useAuth();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const users = storageService.getUsers();

  const handleReset = () => {
    if (confirm('Kembalikan semua data ke kondisi demonstrasi awal?')) {
      storageService.resetToDemo();
      setResetMessage('Data demonstrasi berhasil direset ke kondisi awal.');
      setTimeout(() => setResetMessage(null), 3000);
    }
  };

  const getRoleLabel = (role: string) => {
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
        return role;
    }
  };

  return (
    <>
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded text-[11px] tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-800" />
            DATA DEMO AKTIF
          </span>
          <span className="hidden sm:inline text-amber-800">
            Sistem terisi dengan data simulasi SMP/MTs (Kelas VII, VIII, IX). Semua aksi tersimpan persisten secara lokal.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRoleModal(true)}
            className="inline-flex items-center gap-1 bg-white hover:bg-amber-100 text-amber-950 px-2.5 py-1 rounded border border-amber-300 font-medium transition cursor-pointer"
            title="Ganti peran pengguna demonstrasi"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-700" />
            Ganti Akun Demo
          </button>

          <button
            onClick={() => setShowFirebaseModal(true)}
            className="inline-flex items-center gap-1 bg-white hover:bg-blue-50 text-blue-900 px-2.5 py-1 rounded border border-blue-200 font-medium transition cursor-pointer"
            title="Lihat status integrasi database Firebase"
          >
            <Database className="w-3.5 h-3.5 text-blue-600" />
            Kesiapan Firebase
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 bg-white hover:bg-rose-50 text-rose-900 px-2.5 py-1 rounded border border-rose-200 font-medium transition cursor-pointer"
            title="Reset data demonstrasi"
          >
            <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
            Reset Data
          </button>
        </div>
      </div>

      {resetMessage && (
        <div className="bg-emerald-600 text-white text-xs px-4 py-1.5 flex items-center justify-between animate-fade-in">
          <span>{resetMessage}</span>
          <button onClick={() => setResetMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Switch Demo User Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Pilih Akun Demonstrasi Pengguna</h3>
                <p className="text-xs text-slate-500">
                  Uji antarmuka dan hak akses untuk berbagai jabatan struktural di sekolah
                </p>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {users.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => {
                        quickSwitchUser(u.id);
                        setShowRoleModal(false);
                      }}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-sm text-slate-900">{u.fullName}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">NIP: {u.nipOrId}</div>
                        </div>
                        {isCurrent && (
                          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-xs font-medium text-slate-700 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {u.position}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <span
                            key={r}
                            className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded border border-slate-200"
                          >
                            {getRoleLabel(r)}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Firebase Readiness Modal */}
      {showFirebaseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Database className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Arsitektur Cloud Firestore & Auth</h3>
                  <p className="text-xs text-slate-500">SCHOOLHUB Enterprise School Management</p>
                </div>
              </div>
              <button onClick={() => setShowFirebaseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600">
              <p>
                Aplikasi ini dirancang menggunakan <strong>Clean Architecture</strong> dengan pemisahan yang rapi antara antarmuka pengguna, aturan validasi bisnis, dan lapisan penyimpanan data persisten.
              </p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Skema Blueprint Siap:</span> Koleksi <code className="bg-slate-200 px-1 rounded">users</code>, <code className="bg-slate-200 px-1 rounded">classes</code>, <code className="bg-slate-200 px-1 rounded">students</code>, <code className="bg-slate-200 px-1 rounded">lessonSchedules</code>, <code className="bg-slate-200 px-1 rounded">lessonSessions</code>, <code className="bg-slate-200 px-1 rounded">tasks</code>, <code className="bg-slate-200 px-1 rounded">staffAttendance</code> telah didefinisikan secara baku di <code className="text-blue-700">firebase-blueprint.json</code>.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Aturan Keamanan ABAC / Zero-Trust:</span> Berkas <code className="text-blue-700">firestore.rules</code> telah dikonfigurasi dengan perlindungan 8 pilar keamanan (validasi ID, pencegahan update bayangan, isolasi data siswa, dan pembatasan wewenang guru).
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Penyimpanan Lokal Aktif:</span> Setiap penambahan siswa, absensi, koreksi kehadiran, dan pembagian tugas disimpan langsung ke penyimpanan persisten browser Anda dan dapat diekspor.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                <span className="font-semibold">Catatan Produksi:</span> Saat sekolah Anda menghubungkan kredensial resmi Firebase Project, sistem secara otomatis dapat beralih ke sinkronisasi Cloud Firestore secara realtime tanpa mengubah antarmuka KBM.
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowFirebaseModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-blue-900 text-white rounded-lg hover:bg-blue-800"
              >
                Mengerti & Lanjutkan Pengujian
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
