import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Student, UserProfile, SchoolClass, Subject } from '../../types';
import {
  Database,
  Plus,
  Trash2,
  Edit2,
  Search,
  Users,
  GraduationCap,
  BookOpen,
  Building,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
} from 'lucide-react';

export const DataManagementView: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'siswa' | 'ptk' | 'kelas' | 'mapel'>('siswa');

  // Load data
  const students = storageService.getStudents();
  const users = storageService.getUsers();
  const classes = storageService.getClasses();
  const subjects = storageService.getSubjects();

  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Student Form State
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [stuNis, setStuNis] = useState('');
  const [stuNisn, setStuNisn] = useState('');
  const [stuName, setStuName] = useState('');
  const [stuGender, setStuGender] = useState<'L' | 'P'>('L');
  const [stuClassId, setStuClassId] = useState(classes[0]?.id || '');
  const [stuAbsentNum, setStuAbsentNum] = useState<number>(1);

  // Class Form State
  const [showClassModal, setShowClassModal] = useState(false);
  const [className, setClassName] = useState('');
  const [classGrade, setClassGrade] = useState<'VII' | 'VIII' | 'IX'>('VII');
  const [classRoom, setClassRoom] = useState('');
  const [classTeacherId, setClassTeacherId] = useState(users[0]?.id || '');

  // Subject Form State
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subCode, setSubCode] = useState('');
  const [subName, setSubName] = useState('');
  const [subCategory, setSubCategory] = useState<'Wajib' | 'Pilihan' | 'Muatan Lokal'>('Wajib');
  const [subHours, setSubHours] = useState(4);

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      nis: stuNis.trim(),
      nisn: stuNisn.trim() || undefined as any,
      fullName: stuName.trim(),
      gender: stuGender,
      classId: stuClassId,
      absentNumber: stuAbsentNum,
      isActive: true,
    };
    storageService.saveStudent(newStudent, currentUser?.fullName || 'Admin');
    setShowStudentModal(false);
    setStuNis('');
    setStuName('');
    setFeedback(`Peserta didik "${newStudent.fullName}" berhasil ditambahkan.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Hapus data siswa ini? Tindakan ini akan tercatat dalam audit log.')) {
      storageService.deleteStudent(id, currentUser?.fullName || 'Admin');
      setFeedback('Data siswa berhasil dihapus.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = users.find((u) => u.id === classTeacherId);
    const newClass: SchoolClass = {
      id: `class-${className.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      grade: classGrade,
      name: className.trim(),
      academicYear: '2025/2026',
      homeroomTeacherId: teacher?.id || '',
      homeroomTeacherName: teacher?.fullName || 'Wali Kelas',
      qrIdentifier: `CLASS-${className.toUpperCase().replace(/\s+/g, '-')}-2026`,
      capacity: 32,
      roomName: classRoom.trim(),
    };
    storageService.saveClass(newClass, currentUser?.fullName || 'Admin');
    setShowClassModal(false);
    setClassName('');
    setClassRoom('');
    setFeedback(`Rombongan belajar "${newClass.name}" berhasil ditambahkan.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const newSubject: Subject = {
      id: `sub-${subCode.toLowerCase()}`,
      code: subCode.toUpperCase().trim(),
      name: subName.trim(),
      category: subCategory,
      weeklyHours: subHours,
    };
    storageService.saveSubject(newSubject, currentUser?.fullName || 'Admin');
    setShowSubjectModal(false);
    setSubCode('');
    setSubName('');
    setFeedback(`Mata pelajaran "${newSubject.name}" berhasil ditambahkan.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-purple-100 text-purple-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
            Administrasi Master Data
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Manajemen Data Sekolah (CRUD Master)
          </h2>
          <p className="text-xs text-slate-500">
            Kelola data peserta didik, pendidik & tenaga kependidikan, rombel kelas, dan mata pelajaran kurikulum
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {activeTab === 'siswa' && (
            <button
              onClick={() => setShowStudentModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Tambah Siswa
            </button>
          )}
          {activeTab === 'kelas' && (
            <button
              onClick={() => setShowClassModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Tambah Rombel
            </button>
          )}
          {activeTab === 'mapel' && (
            <button
              onClick={() => setShowSubjectModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Tambah Mapel
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{feedback}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 text-xs font-bold">
        <button
          onClick={() => {
            setActiveTab('siswa');
            setSearch('');
          }}
          className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'siswa'
              ? 'border-blue-600 text-blue-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Data Siswa ({students.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('ptk');
            setSearch('');
          }}
          className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'ptk'
              ? 'border-blue-600 text-blue-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> Pendidik & Tenaga Kependidikan ({users.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('kelas');
            setSearch('');
          }}
          className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'kelas'
              ? 'border-blue-600 text-blue-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" /> Rombel Kelas ({classes.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('mapel');
            setSearch('');
          }}
          className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'mapel'
              ? 'border-blue-600 text-blue-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Mata Pelajaran ({subjects.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari entri data..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* TAB 1: DATA SISWA */}
      {activeTab === 'siswa' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">No. Absen</th>
                <th className="py-2.5 px-3">NIS</th>
                <th className="py-2.5 px-3">NISN</th>
                <th className="py-2.5 px-3">Nama Siswa</th>
                <th className="py-2.5 px-3">Kelas</th>
                <th className="py-2.5 px-3">L/P</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students
                .filter(
                  (s) =>
                    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
                    s.nis.includes(search)
                )
                .map((s) => {
                  const cl = classes.find((c) => c.id === s.classId);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                        #{s.absentNumber}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{s.nis}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{s.nisn || '-'}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{s.fullName}</td>
                      <td className="py-2.5 px-3 font-bold text-blue-900">{cl?.name || s.classId}</td>
                      <td className="py-2.5 px-3">{s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteStudent(s.id)}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: DATA PTK */}
      {activeTab === 'ptk' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Nama & Gelar</th>
                <th className="py-2.5 px-3">NIP / ID</th>
                <th className="py-2.5 px-3">Jabatan</th>
                <th className="py-2.5 px-3">Unit Kerja</th>
                <th className="py-2.5 px-3">Peran Akses</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users
                .filter(
                  (u) =>
                    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
                    u.nipOrId.includes(search)
                )
                .map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{u.fullName}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{u.nipOrId}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{u.position}</td>
                    <td className="py-2.5 px-3 text-slate-600">{u.workUnit}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <span
                            key={r}
                            className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-mono"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: DATA KELAS */}
      {activeTab === 'kelas' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Nama Rombel</th>
                <th className="py-2.5 px-3">Tingkat</th>
                <th className="py-2.5 px-3">Wali Kelas</th>
                <th className="py-2.5 px-3">Identifier QR</th>
                <th className="py-2.5 px-3">Ruang Kelas</th>
                <th className="py-2.5 px-3">Kapasitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-black text-blue-900">Kelas {c.name}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-700">Tingkat {c.grade}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {c.homeroomTeacherName}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                    {c.qrIdentifier}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{c.roomName}</td>
                  <td className="py-2.5 px-3 font-mono">{c.capacity} Siswa</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: MATA PELAJARAN */}
      {activeTab === 'mapel' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Kode Mapel</th>
                <th className="py-2.5 px-3">Nama Mata Pelajaran</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3">Beban Jam / Minggu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-800">{sub.code}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{sub.name}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                      {sub.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono">{sub.weeklyHours} Jam Pelajaran (JP)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Peserta Didik Baru</h3>
              <button onClick={() => setShowStudentModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Absen: *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={stuAbsentNum}
                    onChange={(e) => setStuAbsentNum(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIS: *</label>
                  <input
                    type="text"
                    required
                    placeholder="252607xxx"
                    value={stuNis}
                    onChange={(e) => setStuNis(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Siswa: *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap sesuai akta lahir..."
                  value={stuName}
                  onChange={(e) => setStuName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin: *</label>
                  <select
                    value={stuGender}
                    onChange={(e) => setStuGender(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rombel Kelas: *</label>
                  <select
                    value={stuClassId}
                    onChange={(e) => setStuClassId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Rombel Kelas Baru</h3>
              <button onClick={() => setShowClassModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Rombel: *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: VII-C"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tingkat: *</label>
                  <select
                    value={classGrade}
                    onChange={(e) => setClassGrade(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  >
                    <option value="VII">VII (Tujuh)</option>
                    <option value="VIII">VIII (Delapan)</option>
                    <option value="IX">IX (Sembilan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Wali Kelas: *</label>
                <select
                  value={classTeacherId}
                  onChange={(e) => setClassTeacherId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.position})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lokasi Ruangan:</label>
                <input
                  type="text"
                  placeholder="Ruang 7.3 (Lantai 2 Gedung A)"
                  value={classRoom}
                  onChange={(e) => setClassRoom(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Simpan Rombel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Mata Pelajaran</h3>
              <button onClick={() => setShowSubjectModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Mapel: *</label>
                  <input
                    type="text"
                    required
                    placeholder="MTK, IPA, PJOK..."
                    value={subCode}
                    onChange={(e) => setSubCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Beban JP/Minggu:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={subHours}
                    onChange={(e) => setSubHours(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Mata Pelajaran: *</label>
                <input
                  type="text"
                  required
                  placeholder="Bahasa Daerah, Bimbingan Konseling..."
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori: *</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="Wajib">Wajib (Kurikulum Nasional)</option>
                  <option value="Pilihan">Pilihan / Peminatan</option>
                  <option value="Muatan Lokal">Muatan Lokal</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
