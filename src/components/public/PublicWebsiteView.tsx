import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import {
  School,
  BookOpen,
  Award,
  Users,
  Compass,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  Laptop,
  GraduationCap,
  Globe,
} from 'lucide-react';

interface PublicWebsiteViewProps {
  onOpenPortal: () => void;
}

export const PublicWebsiteView: React.FC<PublicWebsiteViewProps> = ({ onOpenPortal }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const settings = storageService.getSettings();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Banner / Public Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-linear-to-br from-emerald-600 via-teal-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-500/20 shrink-0">
                <School className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                    Kemenag RI
                  </span>
                  <span className="text-[10px] text-slate-400 hidden md:inline">NPSN: {settings.npsn}</span>
                </div>
                <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">
                  MTsN 1 Kartanegara
                </h1>
                <p className="text-[10px] text-slate-500 hidden sm:block">Madrasah Mandiri Berprestasi • Kutai Kartanegara</p>
              </div>
            </div>

            {/* Public Navigation & Portal Button */}
            <div className="flex items-center gap-3 sm:gap-6">
              <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600">
                <a href="#profil" className="hover:text-emerald-700 transition">Profil</a>
                <a href="#visi-misi" className="hover:text-emerald-700 transition">Visi & Misi</a>
                <a href="#program" className="hover:text-emerald-700 transition">Program Unggulan</a>
                <a href="#berita" className="hover:text-emerald-700 transition">Pengumuman</a>
                <a href="#kontak" className="hover:text-emerald-700 transition">Kontak</a>
              </nav>

              <button
                type="button"
                onClick={onOpenPortal}
                className="flex items-center gap-2 bg-linear-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAuthenticated ? 'Buka Dashboard Smarthub' : 'Masuk Portal Smarthub'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-slate-900 via-slate-900 to-emerald-950 text-white py-16 sm:py-24">
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Selamat Datang di Laman Resmi MTsN 1 Kartanegara</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Membangun Generasi Islami, Cerdas, dan Berakhlakul Karimah
          </h2>

          <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Madrasah Tsanawiyah Negeri 1 Kartanegara memadukan kurikulum nasional dan penguatan nilai keagamaan berlandaskan teknologi digital terpadu melalui <strong className="text-emerald-400">Smarthub MTsN 1</strong>.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onOpenPortal}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xl shadow-emerald-500/30 transition cursor-pointer"
            >
              <span>Akses Portal Akademik & SIMS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#profil"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl border border-slate-700 transition"
            >
              <span>Pelajari Profil Madrasah</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">320+</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1">Peserta Didik (Kelas VII, VIII, IX)</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-black text-blue-400">48</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1">Guru & Tenaga Kependidikan</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-black text-teal-400">12 Rombel</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1">Ruang Kelas & Lab Komputer</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">Akreditasi A</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1">Unggul (BAN-S/M)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Profil & Sambutan Kepala Madrasah */}
      <section id="profil" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Card: Headmaster */}
            <div className="lg:col-span-5 bg-linear-to-br from-slate-900 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
              <div className="w-20 h-20 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-black text-3xl mb-5 shadow-inner">
                B
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Sambutan Kepala Madrasah
              </span>
              <h3 className="text-xl font-bold mt-2 text-white">Dr. H. Bambang Suryanto, M.Pd.</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">NIP: 196803151994121001</p>

              <blockquote className="mt-4 text-xs sm:text-sm text-slate-300 italic leading-relaxed border-l-2 border-emerald-500 pl-4 py-1">
                "Puji syukur ke hadirat Allah SWT. Di era transformasi digital madrasah, MTsN 1 Kartanegara berkomitmen memberikan layanan pendidikan terbaik yang menyeimbangkan kecerdasan intelektual, kemandirian karakter, dan keluhuran budi pekerti Islam. Smarthub hadir sebagai wujud nyata keterbukaan informasi dan kedisiplinan madrasah."
              </blockquote>
            </div>

            {/* Right: School Identity & Highlights */}
            <div id="visi-misi" className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Visi & Misi Madrasah
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  Madrasah Mandiri Berprestasi Berlandaskan Iman & Taqwa
                </h3>
              </div>

              <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">Visi Utama:</h4>
                <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                  "Terwujudnya Lulusan Madrasah yang Unggul dalam Prestasi Akademik dan Non-Akademik, Berkarakter Qur'ani, Terampil dalam Teknologi, serta Berwawasan Lingkungan Hidup."
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Misi Unggulan:</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Menyelenggarakan pembelajaran berkualitas yang memadukan Kurikulum Merdeka dan Kurikulum Kemenag.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Menumbuhkembangkan pembiasaan ibadah harian, shalat dhuha berjamaah, dan tahfidz Al-Qur'an.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Mengoptimalkan sistem monitoring akademik terpadu berbasis QR Code melalui Smarthub.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Membina minat bakat siswa di bidang riset sains, keagamaan, olahraga, dan seni madrasah.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Unggulan */}
      <section id="program" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-full">
              Keunggulan Akademik & Kesiswaan
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Program Unggulan MTsN 1 Kartanegara
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Dirancang untuk membentuk lulusan yang berdaya saing tinggi dan berakhlak mulia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Program Tahfidz & Tilawah</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Bimbingan hafalan Juz 30 dan surat-surat pilihan dengan talaqqi langsung bersama asatidz bersertifikat, terintegrasi dalam jam kegiatan pagi madrasah.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Madrasah Riset & Sains</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pembinaan intensif Kompetisi Sains Madrasah (KSM), Olimpiade Sains Nasional (OSN), serta karya ilmiah remaja di laboratorium sains terstandar.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Laptop className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Digital Smart Learning</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Sistem pembelajaran dan absensi berbasis barcode QR per rombel dengan Smarthub terhubung langsung dengan wali kelas dan kepala madrasah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pengumuman & Berita */}
      <section id="berita" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Informasi & Agenda
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Pengumuman Terkini Madrasah
              </h3>
            </div>
            <button
              type="button"
              onClick={onOpenPortal}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              Lihat jadwal selengkapnya di Smarthub <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition">
              <div className="flex items-center gap-2 text-slate-400 text-[11px] mb-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Semester Genap 2025/2026</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-2">
                Asesmen Madrasah & Monitoring Ketuntasan Tugas Siswa
              </h4>
              <p className="text-slate-600 leading-relaxed mb-4">
                Seluruh wali kelas VII, VIII, dan IX diharapkan mengecek rekap ketuntasan tugas mandiri melalui menu Smarthub sebelum tenggat evaluasi bulanan.
              </p>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Akademik
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition">
              <div className="flex items-center gap-2 text-slate-400 text-[11px] mb-2">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Pukul 07:00 - 07:15 WITA</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-2">
                Kedisiplinan Presensi Guru & Tenaga Kependidikan
              </h4>
              <p className="text-slate-600 leading-relaxed mb-4">
                Presensi digital staf dan guru piket wajib tercatat sebelum pukul 07:15 WITA melalui panel Presensi Personel di sistem Smarthub.
              </p>
              <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Kedisiplinan
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition">
              <div className="flex items-center gap-2 text-slate-400 text-[11px] mb-2">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Tingkat Kabupaten</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-2">
                Prestasi Juara 1 Kompetisi Sains Madrasah (KSM)
              </h4>
              <p className="text-slate-600 leading-relaxed mb-4">
                Selamat dan sukses atas keberhasilan delegasi MTsN 1 Kartanegara meraih medali emas dalam cabang IPA dan Matematika Terintegrasi.
              </p>
              <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                Prestasi
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Kontak & Lokasi */}
      <section id="kontak" className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Hubungi Kami
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Madrasah Tsanawiyah Negeri 1 Kartanegara
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Kami siap melayani kebutuhan informasi pendidikan, pendaftaran peserta didik baru, dan administrasi akademik madrasah.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm">
                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{settings.contactPhone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{settings.contactEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Globe className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>https://mtsn1kartanegara.sch.id</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Portal Digital Smarthub
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Akses terpusat untuk Kepala Madrasah, Tim Manajemen, Guru Mata Pelajaran, Wali Kelas, dan Staf Tata Usaha MTsN 1 Kartanegara.
              </p>

              <div className="p-3 bg-slate-950/60 border border-slate-700 rounded-xl space-y-1 text-xs font-mono text-emerald-300">
                <div>• Pemindaian Barcode QR Kelas VII, VIII, IX</div>
                <div>• Monitoring Ketuntasan Tugas Siswa</div>
                <div>• Presensi Guru, Staf & Siswa Terintegrasi</div>
              </div>

              <button
                type="button"
                onClick={onOpenPortal}
                className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-900/30 transition cursor-pointer"
              >
                <span>Masuk ke Portal Akademik Smarthub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 MTsN 1 Kartanegara • Kementerian Agama Republik Indonesia. Semua Hak Dilindungi.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Smarthub Version 2.0</span>
            <span>•</span>
            <button
              onClick={onOpenPortal}
              className="text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
            >
              Login Sistem
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
