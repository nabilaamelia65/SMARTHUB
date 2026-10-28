# MASTER PROMPT — PEMBANGUNAN APLIKASI MANAJEMEN SEKOLAH BERBASIS WEB

## 1. PERAN DAN TUJUAN PENGEMBANGAN

Bertindaklah sebagai senior full-stack developer, UI/UX designer, database architect, dan software engineer yang berpengalaman dalam membangun sistem informasi manajemen sekolah.

Saya ingin membangun sebuah aplikasi berbasis website untuk mengintegrasikan administrasi sekolah, pengelolaan data guru dan tenaga kependidikan, informasi akademik, absensi siswa, absensi personel sekolah, serta monitoring ketuntasan tugas peserta didik.

Aplikasi direncanakan untuk digunakan di lingkungan SMP/MTs yang mempunyai kelas VII, VIII, dan IX.

Nama produk sementara: **SCHOOLHUB — School Management & Academic Monitoring System**.

Nama produk, logo, identitas sekolah, alamat sekolah, tahun ajaran, dan pengaturan dasar harus dapat diubah melalui konfigurasi aplikasi.

Tujuan aplikasi:
1. Memusatkan informasi sekolah dalam satu platform.
2. Mengatur akses pengguna berdasarkan jabatan, peran, dan tanggung jawab.
3. Mempermudah wali kelas memantau data siswa dan tugas yang belum tuntas.
4. Membantu guru mata pelajaran mengisi absensi siswa dan mencatat materi pembelajaran.
5. Mencatat kehadiran guru dan seluruh tenaga kependidikan.
6. Menampilkan jadwal pelajaran, jadwal piket, struktur organisasi, tata tertib, dan data wali kelas.
7. Menyediakan laporan yang akurat, dapat ditelusuri, dan bersumber dari data yang tersimpan dalam sistem.

Bangun aplikasi yang benar-benar fungsional. Jangan hanya membuat desain visual, halaman statis, atau tombol yang tidak memiliki fungsi.

Jangan berhenti setelah memberikan rencana atau contoh kode. Implementasikan aplikasi, buat struktur file yang sesuai, hubungkan antarmodul, jalankan pemeriksaan build, dan perbaiki kesalahan yang ditemukan.

## 2. TEKNOLOGI YANG DIGUNAKAN

Gunakan teknologi yang kompatibel dengan lingkungan Google AI Studio Build.

Prioritas teknologi:
- Frontend: React dengan TypeScript.
- Styling: Tailwind CSS atau sistem styling modern yang kompatibel dengan lingkungan.
- Backend: server-side Node.js untuk proses yang membutuhkan akses tepercaya.
- Autentikasi: Firebase Authentication.
- Database: Cloud Firestore.
- Penyimpanan dokumen dan laporan: Firebase Storage apabila integrasi tersedia.
- Pemindaian QR code: library pemindai QR yang kompatibel dengan browser.
- Grafik dashboard: library grafik yang ringan dan responsif.
- Ikon: library ikon konsisten seperti Lucide.
- Formulir: validasi input di sisi frontend dan backend sesuai kebutuhan.

Gunakan Firebase untuk penyimpanan persisten, bukan hanya localStorage atau array data sementara.

Jika diperlukan integrasi Firebase, minta aktivasi Firebase melalui mekanisme yang tersedia di Google AI Studio. Konfigurasikan Authentication, Firestore, dan Storage sesuai kebutuhan.

Semua kredensial, secret, dan operasi administratif harus ditangani secara aman. Jangan menempatkan API key rahasia, kata sandi, atau kredensial server di kode frontend.

Jangan mengganti teknologi atau membuat backend tiruan hanya agar tampilan terlihat berfungsi.

Jika konfigurasi eksternal belum tersedia, jelaskan konfigurasi yang masih diperlukan dan pertahankan implementasi yang benar-benar dapat dijalankan tanpa mengklaim bahwa layanan tersebut sudah aktif.

## 3. DESAIN ANTARMUKA DAN PENGALAMAN PENGGUNA

Buat tampilan aplikasi yang modern, profesional, bersih, dan sesuai untuk digunakan oleh guru, kepala sekolah, wakil kepala sekolah, serta tenaga kependidikan.

Gunakan bahasa Indonesia pada seluruh antarmuka.

Panduan desain:
- Warna utama biru tua atau navy.
- Warna pendukung biru terang dan teal dengan aksen netral.
- Latar belakang abu-abu sangat muda atau putih.
- Kartu dengan sudut membulat secukupnya.
- Bayangan ringan dan garis pembatas yang halus.
- Tipografi yang profesional dan mudah dibaca.
- Ikon yang konsisten untuk setiap menu.
- Tampilan tabel yang rapi, dengan pencarian, filter, pengurutan, dan pagination apabila diperlukan.
- Sidebar navigasi pada desktop dan navigasi responsif pada perangkat seluler.
- Navbar menampilkan nama halaman, notifikasi yang relevan, identitas pengguna, dan tombol logout.
- Dashboard memiliki kartu statistik, informasi aktivitas terbaru, tabel ringkas, serta grafik jika datanya tersedia.

Hindari tampilan yang terlalu ramai, penggunaan warna mencolok secara berlebihan, dan dekorasi yang mengganggu fungsi.

Gunakan desain responsif untuk desktop, laptop, tablet, dan ponsel.

Setiap halaman harus mempunyai kondisi loading, error, empty state, dan success state yang sesuai. Tambahkan dialog konfirmasi untuk tindakan penting seperti penghapusan data dan koreksi absensi.

Jangan tampilkan angka statistik palsu sebagai data nyata. Bila menggunakan data demonstrasi, tandai dengan jelas sebagai DATA DEMO.

## 4. LOGIN DAN SISTEM HAK AKSES

Buat halaman login dengan komponen berikut:
- Logo sekolah.
- Nama aplikasi dan identitas sekolah.
- Kolom username atau NIP.
- Kolom kata sandi.
- Tombol tampil/sembunyikan kata sandi.
- Tombol masuk.
- Indikator proses login.
- Pesan kesalahan yang mudah dipahami.
- Validasi input.
- Fitur logout dan perlindungan halaman internal.

Gunakan autentikasi sungguhan melalui Firebase Authentication.

Jika pengguna masuk menggunakan username atau NIP, implementasikan pemetaan identitas ke akun autentikasi melalui mekanisme server-side yang tepercaya. Jangan mencari atau memvalidasi kata sandi sendiri menggunakan dokumen Firestore di frontend.

Apabila diperlukan konfigurasi autentikasi tambahan, jelaskan kebutuhan tersebut secara terbuka. Jangan membuat login palsu yang menerima sembarang username dan kata sandi.

Setelah login berhasil, sistem membaca profil serta seluruh peran pengguna, kemudian menampilkan dashboard dan menu berdasarkan hak akses.

Satu pengguna dapat mempunyai lebih dari satu peran. Contohnya, seorang guru dapat merangkap sebagai wali kelas. Dalam kondisi tersebut, semua hak akses yang sah harus dapat digunakan tanpa membuat akun ganda.

Peran yang harus didukung:
1. Admin/operator aplikasi.
2. Kepala sekolah.
3. Wakil kepala sekolah bidang kurikulum.
4. Wakil kepala sekolah bidang kesiswaan.
5. Wakil kepala sekolah bidang humas.
6. Wakil kepala sekolah bidang sarana dan prasarana.
7. Wali kelas.
8. Guru mata pelajaran.
9. Staf tata usaha.
10. Staf kebersihan.
11. Staf keamanan.
12. Staf koperasi.

### Aturan hak akses

**Admin/operator**  
Dapat mengelola akun, peran, data siswa, kelas, personel, mata pelajaran, jadwal, penugasan, dan pengaturan sistem sesuai kewenangan administrator.

**Kepala sekolah**  
Dapat melihat dashboard umum, ringkasan absensi, informasi akademik, struktur organisasi, dan laporan yang menjadi kewenangannya.

**Wakil kepala sekolah bidang kurikulum**  
Dapat mengakses jadwal pelajaran, data penugasan guru, informasi akademik, dan kelengkapan laporan pembelajaran sesuai kewenangan.

**Wakil kepala sekolah bidang kesiswaan**  
Dapat melihat data dan laporan peserta didik, ringkasan absensi, serta informasi kedisiplinan sesuai kebijakan sekolah.

**Wakil kepala sekolah bidang humas**  
Dapat mengakses informasi organisasi, agenda, dan informasi sekolah yang berkaitan dengan tugasnya.

**Wakil kepala sekolah bidang sarana dan prasarana**  
Dapat mengakses informasi terkait sarana dan prasarana sesuai penugasan.

**Wali kelas**  
Dapat melihat data peserta didik di kelas yang menjadi tanggung jawabnya, daftar guru pengampu, jadwal kelas, dan laporan tugas siswa. Wali kelas tidak otomatis memperoleh hak mengubah absensi atau status tugas yang menjadi tanggung jawab guru lain.

**Guru mata pelajaran**  
Dapat melihat kelas yang diampu, mengisi absensi siswa pada sesi mengajarnya, mencatat materi pembelajaran, membuat laporan tugas, serta memperbarui status pengerjaan siswa sesuai kewenangan.

**Staf tata usaha**  
Dapat mengakses data administrasi yang menjadi tanggung jawabnya.

**Staf kebersihan, keamanan, dan koperasi**  
Dapat melihat profil pribadi, jadwal tugas atau piket yang relevan, informasi umum, dan mencatat kehadiran pribadi.

Hak akses harus diperiksa di sisi server atau melalui aturan keamanan database. Jangan hanya menyembunyikan menu di frontend.

## 5. STRUKTUR NAVIGASI APLIKASI

Buat menu utama berikut:
1. Dashboard.
2. Scan QR/Barcode.
3. Jadwal Piket.
4. Struktur Organisasi.
5. Tata Tertib Sekolah.
6. Data Wali Kelas.
7. Jadwal Pelajaran.
8. Absensi dan Pembelajaran.
9. Laporan Tugas Siswa.
10. Absensi Guru dan Tenaga Kependidikan.
11. Profil Saya.
12. Manajemen Data — khusus admin/operator atau pengguna yang diberi kewenangan.
13. Pengaturan — khusus admin/operator.

Tampilkan hanya menu yang sesuai dengan hak akses pengguna.

Semua navigasi harus berfungsi, mempunyai rute halaman yang benar, dan tidak menghasilkan halaman kosong atau tautan yang tidak bekerja.

## 6. DASHBOARD BERDASARKAN PERAN

Buat dashboard yang berbeda sesuai tanggung jawab pengguna.

### Dashboard kepala sekolah
Tampilkan ringkasan:
- Jumlah guru dan tenaga kependidikan.
- Jumlah kelas dan peserta didik.
- Ringkasan kehadiran personel.
- Ringkasan absensi siswa.
- Informasi jadwal dan kegiatan sekolah.
- Laporan yang membutuhkan perhatian.

### Dashboard wakil kepala sekolah
Tampilkan informasi yang relevan dengan bidang masing-masing, misalnya jadwal dan kelengkapan pembelajaran untuk kurikulum atau ringkasan absensi siswa untuk kesiswaan.

### Dashboard wali kelas
Tampilkan:
- Kelas yang menjadi tanggung jawab.
- Jumlah peserta didik.
- Ringkasan kehadiran terbaru.
- Daftar siswa dengan tugas belum tuntas.
- Ringkasan tugas berdasarkan mata pelajaran.
- Jadwal pelajaran kelas.
- Informasi guru pengampu.

### Dashboard guru mata pelajaran
Tampilkan:
- Jadwal mengajar hari ini.
- Daftar kelas yang diampu.
- Sesi pembelajaran yang perlu diabsen.
- Catatan materi yang sudah dibuat.
- Tugas yang sudah dilaporkan.
- Tugas atau laporan yang belum diselesaikan.

### Dashboard tenaga kependidikan
Tampilkan:
- Profil dan jabatan.
- Jadwal tugas atau piket yang relevan.
- Status absensi pribadi.
- Ringkasan kehadiran pribadi jika tersedia.
- Pengumuman atau informasi sekolah.

### Dashboard admin/operator
Tampilkan:
- Jumlah akun aktif.
- Data personel dan siswa.
- Jumlah kelas.
- Status kelengkapan data master.
- Aktivitas administrasi terbaru.
- Akses cepat ke manajemen data.

Pastikan seluruh statistik dihitung dari database, menerapkan filter tahun ajaran atau rentang tanggal yang tepat, serta mengikuti hak akses masing-masing pengguna.

## 7. FITUR SCAN QR CODE UNTUK WALI KELAS

Bangun fitur pemindaian QR code menggunakan kamera perangkat.

Gunakan QR code sebagai pengenal kelas, bukan tempat menyimpan seluruh data pribadi siswa.

Contoh identifier:
- `CLASS-VII-A-2026`
- `CLASS-VII-B-2026`
- `CLASS-VIII-A-2026`

Identifier harus dikelola secara konsisten dan unik sesuai kelas serta tahun ajaran.

Alur fitur:
1. Wali kelas membuka menu Scan QR/Barcode.
2. Aplikasi meminta izin kamera.
3. Pengguna memindai QR code.
4. Sistem memvalidasi identifier dan status kelas.
5. Sistem memeriksa bahwa pengguna login dan mempunyai hak akses ke kelas tersebut.
6. Jika valid, halaman detail kelas ditampilkan.
7. Jika tidak valid, tampilkan pesan kesalahan yang jelas.

Sediakan alternatif pemilihan kelas secara manual jika kamera tidak tersedia.

QR code tidak boleh digunakan untuk melewati login atau hak akses. QR code yang valid tidak otomatis memberikan akses kepada semua pengguna.

### Halaman detail kelas

Buat halaman detail kelas dengan tab berikut:
- Ringkasan.
- Data Peserta Didik.
- Guru Pengampu.
- Tugas Belum Tuntas.
- Jadwal Pelajaran.
- Riwayat Pembelajaran, apabila diizinkan.

### Tab Data Peserta Didik

Kolom tabel:
- Nomor absen.
- Nomor Induk Siswa (NIS).
- Nama lengkap.
- Jenis kelamin.
- Kelas.

Fitur:
- Pencarian nama.
- Pencarian NIS.
- Pengurutan berdasarkan nomor absen.
- Filter jika diperlukan.
- Pagination.
- Tampilan jumlah siswa.
- Empty state jika tidak ada data.

### Tab Guru Pengampu

Tampilkan:
- Nama lengkap guru.
- Gelar sesuai data resmi.
- Mata pelajaran.
- Kelas yang diampu.
- Jadwal mengajar.

Tambahkan kolom pencarian guru berdasarkan nama beserta gelarnya. Pencarian juga harus mempertimbangkan mata pelajaran atau kelas apabila diperlukan untuk membedakan penugasan yang berbeda.

### Tab Tugas Belum Tuntas

Tampilkan laporan tugas berdasarkan siswa di kelas tersebut.

Kolom:
- Nama siswa.
- Nomor absen.
- Mata pelajaran.
- Nama tugas.
- Guru pengampu beserta gelar.
- Tanggal penugasan.
- Tenggat waktu.
- Status pengerjaan.
- Tanggal terakhir diperbarui.
- Sumber laporan.

Filter berdasarkan nama siswa, mata pelajaran, nama guru, status pengerjaan, dan tenggat waktu.

Sediakan ringkasan jumlah tugas belum tuntas per siswa dan per mata pelajaran.

Wali kelas memiliki akses pemantauan dan dapat melihat asal laporan, tetapi tidak otomatis dapat mengubah status tugas yang dibuat oleh guru mata pelajaran.

## 8. FITUR ABSENSI GURU MATA PELAJARAN

Bangun halaman absensi siswa yang terhubung dengan jadwal mengajar.

Alur:
1. Guru login.
2. Guru membuka jadwal mengajar.
3. Guru memilih sesi pembelajaran yang sesuai.
4. Aplikasi menampilkan informasi kelas, mata pelajaran, hari, jam, dan guru pengampu.
5. Guru membuka daftar siswa dari kelas tersebut.
6. Guru mengisi status kehadiran setiap siswa.
7. Guru mengisi catatan materi pembelajaran.
8. Guru meninjau hasil input.
9. Guru menyimpan atau mengirim laporan.
10. Sistem menyimpan waktu pencatatan dan identitas pengguna.

### Kolom daftar siswa

- Nomor absen.
- NIS.
- Nama.
- Jenis kelamin.
- Kelas.
- Status kehadiran.
- Keterangan, jika diperlukan.

Pilihan kehadiran:
- Hadir.
- Izin.
- Sakit.
- Alpa/tanpa keterangan.
- Dispensasi.
- Status lain yang dapat dikonfigurasi sekolah.

Sediakan aksi untuk menetapkan status secara individual dan, apabila sesuai, pengisian status massal dengan konfirmasi sebelum penyimpanan.

Jangan langsung menandai semua siswa sebagai hadir tanpa tindakan konfirmasi guru. Jangan menganggap siswa yang belum dicatat otomatis alpa sebelum sesi diselesaikan sesuai prosedur sekolah.

Cegah duplikasi data untuk siswa yang sama pada sesi pembelajaran yang sama. Sediakan mekanisme koreksi terbatas yang mencatat riwayat perubahan.

### Catatan materi pembelajaran

Setiap catatan harus berhubungan dengan satu sesi pembelajaran.

Kolom:
- Tanggal.
- Jam pelajaran.
- Kelas.
- Mata pelajaran.
- Guru pengampu.
- Materi atau topik pembelajaran.
- Deskripsi kegiatan.
- Catatan tambahan.
- Status penyimpanan.

Guru dapat melihat riwayat materi yang pernah dicatat untuk kelas yang diampu.

## 9. FITUR PELAPORAN TUGAS SISWA

Bangun modul yang memungkinkan guru melaporkan ketuntasan tugas setiap siswa.

### Pembuatan laporan

Guru memilih:
- Kelas.
- Mata pelajaran.
- Nama tugas.
- Deskripsi tugas.
- Tanggal penugasan.
- Tenggat waktu.
- Daftar peserta didik.

Untuk setiap siswa, simpan status pengerjaan yang dapat mencakup:
- Belum mengerjakan.
- Sedang mengerjakan.
- Sudah mengumpulkan.
- Perlu perbaikan.
- Tuntas.

Status harus dapat disesuaikan dengan kebijakan sekolah. Tentukan dengan jelas status mana yang dianggap belum tuntas untuk kebutuhan pemantauan wali kelas.

### Metode input

Sediakan dua metode:

**A. Input langsung**

Guru mengisi atau memperbarui status tugas siswa melalui tabel interaktif.

**B. Unggah laporan**

Guru dapat mengunggah laporan menggunakan format file yang didukung, misalnya CSV atau Excel, serta lampiran laporan sesuai kebutuhan.

Untuk file CSV/Excel:
- Sediakan format templat yang dapat diunduh.
- Validasi nama kolom, NIS, kelas, identitas tugas, dan status.
- Tampilkan preview sebelum impor.
- Tandai baris yang bermasalah atau duplikat.
- Minta konfirmasi sebelum menyimpan.
- Jangan mengganti data lama sebelum validasi berhasil.
- Laporkan jumlah data berhasil, ditolak, dan perlu diperiksa.

Untuk file PDF atau dokumen yang tidak terstruktur, simpan sebagai lampiran laporan jika penyimpanan file tersedia. Jangan menganggap isi file otomatis sudah terbaca atau benar. Jika diperlukan, sediakan input langsung atau tahap verifikasi manual.

Buat hubungan yang jelas antara laporan tugas, siswa, kelas, mata pelajaran, guru pembuat laporan, dan tahun ajaran.

### Pemantauan wali kelas

Wali kelas dapat melihat:
- Siswa dengan tugas belum tuntas.
- Jumlah tugas belum tuntas per siswa.
- Mata pelajaran yang bersangkutan.
- Guru pengampu.
- Tenggat waktu.
- Status terakhir.
- Waktu pembaruan.
- Catatan atau sumber laporan.

Sediakan filter dan fungsi ekspor laporan apabila sesuai dengan hak akses.

Jangan membuat laporan tugas hanya dengan angka statis atau data yang tidak bersumber dari database.

## 10. FITUR ABSENSI GURU DAN TENAGA KEPENDIDIKAN

Bangun modul absensi untuk seluruh personel sekolah, meliputi:
- Kepala sekolah.
- Wakil kepala sekolah bidang kurikulum.
- Wakil kepala sekolah bidang kesiswaan.
- Wakil kepala sekolah bidang humas.
- Wakil kepala sekolah bidang sarana dan prasarana.
- Guru.
- Staf tata usaha.
- Staf kebersihan.
- Staf keamanan.
- Staf koperasi.

Identitas personel:
- ID pegawai atau NIP.
- Nama lengkap.
- Jabatan.
- Unit atau bidang kerja.
- Status akun.

Informasi kehadiran:
- Tanggal.
- Waktu masuk.
- Waktu pulang.
- Status kehadiran.
- Keterangan.
- Pencatat atau sumber koreksi jika ada.

Status kehadiran dapat meliputi hadir, terlambat, izin, sakit, cuti, dinas luar, dan tidak hadir, sesuai konfigurasi sekolah.

Terapkan aturan jam kerja melalui pengaturan yang dapat dikelola oleh admin/operator.

Fitur:
- Pencatatan masuk dan pulang.
- Pencegahan check-in ganda.
- Validasi waktu.
- Riwayat kehadiran pribadi.
- Rekap berdasarkan tanggal, bulan, jabatan, dan unit kerja.
- Filter dan ekspor laporan.
- Koreksi oleh pengguna berwenang.
- Riwayat perubahan absensi.

Pengguna biasa hanya dapat mencatat dan melihat kehadirannya sendiri. Admin atau petugas yang berwenang dapat melakukan koreksi dengan alasan yang tercatat.

Jangan menambahkan GPS, biometrik, atau pengenalan wajah sebagai persyaratan wajib pada versi awal.

## 11. JADWAL PIKET

Buat halaman Jadwal Piket Guru dan Tenaga Kependidikan.

Kolom:
- Tanggal dan hari.
- Nama petugas.
- Jabatan.
- Jenis tugas.
- Jam atau periode piket.
- Lokasi atau tanggung jawab.
- Keterangan.

Fitur:
- Tampilan tabel dan kalender.
- Filter tanggal.
- Filter jabatan atau jenis tugas.
- Pencarian nama.
- Penambahan, pengubahan, dan penghapusan sesuai hak akses.
- Penanda jadwal piket hari ini.
- Riwayat perubahan jadwal.

Semua data piket harus bersumber dari database.

## 12. STRUKTUR ORGANISASI SEKOLAH

Buat tampilan struktur organisasi berbentuk hierarki yang mudah dibaca.

Struktur dapat memuat:
- Kepala sekolah.
- Wakil kepala sekolah dan bidangnya.
- Guru.
- Wali kelas.
- Tata usaha.
- Tenaga kebersihan.
- Tenaga keamanan.
- Tenaga koperasi.
- Jabatan lain yang dikonfigurasi sekolah.

Setiap entri dapat berisi:
- Nama lengkap.
- Jabatan.
- Bidang kerja.
- Foto opsional.
- Deskripsi tugas singkat jika tersedia.

Data organisasi harus terhubung dengan profil personel agar perubahan jabatan tidak menciptakan data yang bertentangan.

Tampilkan struktur dengan baik pada perangkat desktop dan ponsel.

## 13. TATA TERTIB SEKOLAH

Buat halaman tata tertib yang dapat memuat kategori:
- Ketentuan umum.
- Kedisiplinan.
- Kehadiran.
- Kegiatan pembelajaran.
- Penggunaan fasilitas.
- Tanggung jawab dan perilaku.
- Ketentuan lain yang berlaku di sekolah.

Konten dapat dikelola oleh admin/operator atau petugas yang diberi kewenangan.

Simpan informasi:
- Judul.
- Kategori.
- Isi peraturan.
- Tanggal berlaku.
- Versi.
- Waktu pembaruan.
- Pengguna yang memperbarui.

Pengguna umum hanya dapat membaca. Jangan membuat aturan sekolah fiktif seolah-olah merupakan peraturan resmi. Gunakan contoh berlabel DEMO sampai isi resmi diberikan oleh sekolah.

## 14. DATA WALI KELAS

Buat halaman Data Wali Kelas yang menampilkan seluruh rombongan belajar kelas VII, VIII, dan IX.

Kolom:
- Tingkat.
- Nama kelas.
- Nama wali kelas.
- Tahun ajaran.
- Jumlah peserta didik.
- Status penugasan.

Fitur:
- Pencarian berdasarkan nama.
- Filter berdasarkan tingkat.
- Filter tahun ajaran.
- Tampilan detail kelas.
- Pembaruan penugasan sesuai hak akses.

Data harus berasal dari penugasan resmi yang tersimpan pada database dan menjadi sumber untuk validasi akses QR wali kelas.

## 15. JADWAL PELAJARAN KELAS VII–IX

Buat modul jadwal untuk seluruh kelas VII, VIII, dan IX.

Setiap jadwal mencakup:
- Hari.
- Jam mulai.
- Jam selesai.
- Jam atau urutan pelajaran.
- Kelas.
- Mata pelajaran.
- Guru pengampu.
- Ruang kelas jika tersedia.
- Tahun ajaran.

Fitur:
- Filter kelas.
- Filter tingkat.
- Filter hari.
- Filter mata pelajaran.
- Filter nama guru.
- Tampilan tabel mingguan.
- Tampilan jadwal harian.
- Pencetakan atau ekspor sesuai kewenangan.

Hubungkan jadwal dengan data penugasan guru, sesi pembelajaran, dan fitur absensi.

Buat validasi benturan jadwal agar guru tidak ditempatkan mengajar di dua kelas pada waktu yang sama, dan kelas tidak mempunyai dua sesi pelajaran pada waktu yang bertabrakan, kecuali sekolah mengizinkannya secara eksplisit.

## 16. PROFIL SAYA

Buat halaman profil setiap pengguna dengan informasi:
- Foto profil opsional.
- Nama lengkap.
- Username atau NIP/ID pegawai.
- Jabatan.
- Bidang kerja.
- Daftar peran yang dimiliki.
- Mata pelajaran atau kelas yang diampu apabila relevan.
- Informasi kontak yang diperlukan.
- Status akun.

Sediakan kemampuan:
- Melihat profil.
- Mengubah bidang profil yang diizinkan.
- Mengubah kata sandi melalui mekanisme autentikasi yang aman.
- Logout.
- Melihat informasi penugasan yang relevan.

Perubahan jabatan, hak akses, dan penugasan resmi harus dibatasi kepada pengguna yang berwenang.

## 17. MANAJEMEN DATA OLEH ADMIN

Buat halaman administrasi yang menyediakan CRUD (Create, Read, Update, Delete) untuk data yang relevan.

Kelompokkan ke dalam:
1. Akun dan peran pengguna.
2. Data guru dan tenaga kependidikan.
3. Data siswa.
4. Data kelas.
5. Mata pelajaran.
6. Penugasan wali kelas.
7. Penugasan guru mata pelajaran.
8. Jadwal pelajaran.
9. Jadwal piket.
10. Tahun ajaran.
11. Tata tertib.
12. Pengaturan sekolah.

Sediakan import data terstruktur untuk membantu memasukkan data awal, beserta template file dan validasi.

Terapkan konfirmasi sebelum penghapusan, validasi relasi antar-data, dan pencegahan penghapusan data yang masih digunakan oleh jadwal atau laporan.

Gunakan soft delete atau mekanisme pengarsipan untuk data historis jika sesuai.

Setiap perubahan data penting harus masuk ke riwayat aktivitas.

## 18. STRUKTUR DATABASE

Rancang Cloud Firestore dengan struktur yang jelas, konsisten, dan mendukung relasi logis antardokumen.

Pertimbangkan koleksi berikut:
- `users`: identitas profil dan status akun.
- `roles`: definisi peran.
- `students`: data peserta didik.
- `classes`: kelas dan tahun ajaran.
- `subjects`: data mata pelajaran.
- `teachingAssignments`: guru pengampu kelas dan mata pelajaran.
- `homeroomAssignments`: penugasan wali kelas.
- `lessonSchedules`: jadwal pelajaran.
- `lessonSessions`: sesi pembelajaran aktual.
- `studentAttendance`: catatan kehadiran siswa.
- `lessonNotes`: catatan materi pembelajaran.
- `tasks`: data tugas.
- `taskReports`: laporan yang dibuat atau diunggah guru.
- `studentTaskStatuses`: status pengerjaan tugas per siswa.
- `staffAttendance`: catatan kehadiran personel.
- `picketSchedules`: jadwal piket.
- `organizationPositions`: struktur jabatan.
- `schoolRules`: tata tertib.
- `schoolSettings`: identitas dan konfigurasi sekolah.
- `auditLogs`: riwayat perubahan penting.

Sesuaikan struktur koleksi dan subkoleksi bila diperlukan untuk efisiensi query serta aturan keamanan.

Gunakan ID dokumen yang konsisten, referensi yang valid, timestamp server untuk pencatatan waktu penting, dan tahun ajaran sebagai bagian dari pengorganisasian data akademik.

Buat indeks Firestore yang diperlukan untuk filter dan pengurutan yang digunakan aplikasi.

Jangan menggunakan nama siswa sebagai satu-satunya identifier. Gunakan ID internal unik dan validasi NIS sesuai sistem sekolah.

## 19. KEAMANAN DAN PRIVASI

Terapkan perlindungan berikut:
- Autentikasi untuk semua halaman internal.
- Pemeriksaan hak akses pada setiap operasi sensitif.
- Firebase Security Rules yang membatasi akses dokumen sesuai identitas dan peran.
- Validasi input di frontend dan backend.
- Proteksi terhadap akses langsung ke data kelas yang bukan menjadi kewenangan pengguna.
- Pencegahan pembacaan atau modifikasi data melalui manipulasi URL.
- Penyimpanan kata sandi melalui penyedia autentikasi, bukan dalam dokumen pengguna.
- Pembatasan akses file berdasarkan peran dan konteks data.
- Validasi tipe file serta ukuran unggahan.
- Audit log untuk perubahan penting.
- Penanganan kegagalan yang tidak membocorkan informasi sensitif.
- Penggunaan soft delete atau mekanisme arsip bila diperlukan untuk mempertahankan riwayat.
- Pengelolaan sesi dan logout yang benar.

Jangan pernah mengandalkan menu tersembunyi sebagai sistem keamanan.

Data siswa, absensi, dan laporan akademik hanya boleh diakses oleh pengguna yang benar-benar berwenang. Data demonstrasi harus menggunakan identitas fiktif dan tidak boleh tercampur dengan data nyata.

Sertakan dokumentasi tentang konfigurasi Firebase, aturan keamanan, akun administrator, dan langkah pengujian keamanan sebelum digunakan di sekolah.

## 20. KETENTUAN IMPLEMENTASI

Semua modul harus terhubung dan konsisten.

Contoh:
- Penugasan wali kelas harus menentukan kelas yang dapat diakses melalui QR.
- Penugasan guru harus terhubung dengan jadwal mengajar.
- Jadwal mengajar harus menjadi sumber sesi yang dapat diabsen.
- Absensi siswa harus terkait dengan sesi pembelajaran yang benar.
- Catatan materi harus tersimpan pada sesi yang sesuai.
- Laporan tugas harus terhubung dengan siswa, kelas, mata pelajaran, dan guru.
- Wali kelas hanya melihat laporan untuk siswa di kelas yang menjadi tanggung jawabnya.
- Absensi personel harus terhubung dengan akun dan identitas personel.
- Struktur organisasi harus menggunakan data personel yang konsisten.
- Dashboard harus menghitung angka dari database.

Jangan membuat setiap halaman menggunakan data yang berbeda atau duplikasi sumber data yang seharusnya terhubung.

Tidak boleh ada tombol dekoratif. Setiap tombol, formulir, tab, filter, pencarian, menu, unggahan, dan aksi harus menjalankan fungsi yang sesuai atau menampilkan penjelasan apabila memerlukan konfigurasi tambahan.

Berikan feedback yang jelas setelah berhasil menyimpan, memperbarui, menghapus, memindai QR, atau gagal memuat data.

Jangan diam-diam menyimpan perubahan hanya ke state lokal.

## 21. DATA DEMONSTRASI

Sediakan data awal fiktif untuk membantu pengujian tampilan dan alur kerja.

Data demo dapat berisi:
- Satu kepala sekolah.
- Beberapa wakil kepala sekolah.
- Beberapa guru.
- Beberapa wali kelas.
- Beberapa staf.
- Kelas VII, VIII, dan IX.
- Sejumlah siswa fiktif per kelas.
- Mata pelajaran.
- Jadwal pelajaran.
- Jadwal piket.
- Sesi pembelajaran.
- Contoh absensi.
- Contoh tugas dengan status yang berbeda.

Semua data demonstrasi harus ditandai dengan jelas sebagai DEMO.

Jangan membuat akun administrator tersembunyi, kata sandi tetap yang tidak aman, atau mekanisme bypass login.

Siapkan prosedur inisialisasi data yang hanya dapat dijalankan oleh administrator atau lingkungan pengembangan yang berwenang.

Jika data contoh digunakan sebelum Firebase aktif, jelaskan bahwa data tersebut hanya untuk pratinjau dan tidak mewakili sistem produksi.

## 22. PENGUJIAN DAN KRITERIA PENERIMAAN

Sebelum menyatakan implementasi selesai, periksa hal-hal berikut.

### A. Autentikasi dan akses
- Login berhasil untuk akun yang valid.
- Login gagal untuk kredensial yang salah.
- Logout bekerja.
- Pengguna tidak dapat membuka halaman internal tanpa autentikasi.
- Guru yang merangkap wali kelas mendapatkan semua peran yang sah.
- Pengguna yang tidak berwenang tidak dapat membaca atau mengubah data terbatas.

### B. Data sekolah
- Data siswa dapat ditambah, dicari, diperbarui, dan ditampilkan.
- Data kelas VII, VIII, dan IX dapat dikelola.
- Data wali kelas dan guru pengampu saling terhubung.
- Jadwal dapat difilter berdasarkan kelas, hari, dan guru.
- Benturan jadwal dapat dideteksi.

### C. QR code
- QR yang valid membuka detail kelas yang sesuai.
- QR yang tidak valid menampilkan pesan kesalahan.
- Wali kelas tidak dapat mengakses kelas lain tanpa kewenangan.
- Pemindaian tetap memiliki alternatif pemilihan manual.
- QR tidak dapat melewati autentikasi.

### D. Absensi pembelajaran
- Guru melihat sesi pembelajaran yang sesuai dengan penugasannya.
- Daftar siswa sesuai dengan kelas.
- Status absensi dapat disimpan dan dibaca kembali.
- Catatan materi dapat dibuat dan dibaca kembali.
- Duplikasi absensi pada sesi yang sama dapat dicegah.
- Perubahan yang diizinkan memiliki riwayat.

### E. Pelaporan tugas
- Guru dapat membuat laporan tugas.
- Status siswa dapat diperbarui sesuai kewenangan.
- Unggahan CSV/Excel dapat divalidasi sebelum disimpan.
- Laporan yang tidak valid dapat ditolak dengan pesan yang jelas.
- Wali kelas dapat melihat tugas belum tuntas berdasarkan data sesungguhnya.
- Tugas dari kelas lain tidak muncul tanpa hak akses.

### F. Absensi personel
- Pengguna dapat mencatat kehadiran sesuai ketentuan.
- Sistem mencegah pencatatan masuk ganda.
- Data kehadiran dapat direkap.
- Koreksi terbatas pada pihak berwenang dan tercatat.

### G. Kualitas aplikasi
- Tidak ada error kompilasi atau import yang belum terselesaikan.
- Semua rute halaman berfungsi.
- Semua formulir mempunyai validasi.
- Semua fitur mempunyai kondisi loading, kosong, sukses, dan gagal.
- Tidak ada tombol utama yang tidak bekerja.
- Tidak ada data demo yang ditampilkan sebagai data nyata.
- Tampilan responsif pada desktop dan ponsel.
- Aturan keamanan database diuji terhadap akses yang diizinkan dan ditolak.

## 23. URUTAN PENGERJAAN

Bangun aplikasi secara bertahap tetapi pertahankan satu proyek dan satu struktur data yang terintegrasi.

**Tahap 1:**
- Fondasi proyek.
- Desain UI.
- Firebase Authentication.
- Database dan konfigurasi awal.
- Role-based access control.
- Dashboard.
- CRUD data personel, siswa, kelas, dan mata pelajaran.
- Profil Saya.

**Tahap 2:**
- Struktur organisasi.
- Data wali kelas.
- Jadwal pelajaran.
- Jadwal piket.
- Tata tertib sekolah.

**Tahap 3:**
- QR code.
- Detail kelas dan data siswa.
- Data guru pengampu.
- Absensi siswa per sesi pembelajaran.
- Catatan materi.

**Tahap 4:**
- Laporan tugas.
- Unggah dan validasi file laporan.
- Monitoring tugas belum tuntas oleh wali kelas.

**Tahap 5:**
- Absensi guru dan seluruh tenaga kependidikan.
- Laporan dan rekap.
- Audit log.
- Pengujian hak akses, validasi, serta perbaikan akhir.

Apabila keseluruhan fitur tidak dapat diselesaikan dengan baik dalam satu proses, selesaikan dahulu fondasi dan modul tahap pertama, kemudian lanjutkan ke tahapan berikutnya dengan mempertahankan struktur proyek dan implementasi sebelumnya. Jangan menghapus fitur yang sudah berfungsi ketika menambahkan modul baru.

## 24. INSTRUKSI AKHIR

Mulai dengan membuat aplikasi web full-stack yang bisa dijalankan dan dilihat melalui live preview Google AI Studio.

Prioritaskan autentikasi, integrasi database, struktur data, hak akses, dashboard, dan fungsi CRUD sebelum memperluas fitur lainnya.

Buat kode secara terstruktur, mudah dipelihara, dan menggunakan komponen yang dapat digunakan kembali.

Periksa kode yang dihasilkan, jalankan pemeriksaan build, perbaiki error yang ditemukan, dan pastikan modul saling terhubung.

Jangan berhenti hanya dengan memberikan penjelasan, mockup, desain Figma, atau daftar rencana. Implementasikan kode aplikasi yang sebenarnya.

Jika ada konfigurasi Firebase atau layanan eksternal yang membutuhkan tindakan manual, tampilkan petunjuk konfigurasi yang spesifik. Jangan mengklaim integrasi telah aktif jika belum benar-benar dikonfigurasi.

Mulai implementasi sekarang dengan urutan pengerjaan yang telah ditetapkan, dan pastikan fondasi aplikasi siap dikembangkan hingga seluruh fitur di atas berjalan secara terintegrasi.

---

# PROMPT LANJUTAN — AUDIT DAN PENGUJIAN APLIKASI

Audit seluruh kode aplikasi SCHOOLHUB yang sudah dibuat. Periksa setiap menu, rute halaman, formulir, tombol, autentikasi, integrasi Firebase, hak akses pengguna, dan hubungan antardata.

Jangan mengubah desain yang sudah baik tanpa alasan. Fokuskan audit pada fungsi yang belum bekerja, data yang masih statis, penyimpanan yang belum persisten, validasi yang belum lengkap, dan masalah keamanan.

Uji alur nyata berikut menggunakan akun serta data DEMO:
1. Admin menambahkan siswa, kelas, guru, dan penugasan wali kelas.
2. Wali kelas login dan mengakses kelas yang menjadi tanggung jawabnya melalui QR code.
3. Guru membuka jadwal mengajar, mengisi absensi siswa, lalu menyimpan catatan materi.
4. Guru membuat laporan tugas dan memperbarui status pengerjaan siswa.
5. Wali kelas melihat laporan tugas belum tuntas dari database.
6. Personel mencatat kehadiran dan admin merekap data sesuai kewenangan.

Uji juga bahwa pengguna tidak dapat mengakses kelas, laporan, atau data pribadi yang bukan menjadi haknya.

Perbaiki kode secara langsung. Jangan hanya memberikan daftar temuan. Setelah perbaikan, jalankan pemeriksaan build dan laporkan bagian yang berhasil, bagian yang masih membutuhkan konfigurasi manual, serta pengujian yang belum dapat dilakukan.
