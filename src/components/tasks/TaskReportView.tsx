import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { SchoolTask, StudentTaskStatus, TaskStatus } from '../../types';
import { validateCsvTaskRow, summarizeTaskStatuses, isIncompleteTask } from '../../utils/schoolLogic';
import Papa from 'papaparse';
import {
  FileCheck2,
  Plus,
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  Save,
  Trash2,
  FileSpreadsheet,
  Check,
  X,
  FileText,
} from 'lucide-react';

export const TaskReportView: React.FC = () => {
  const { currentUser, activeRole } = useAuth();
  const tasks = storageService.getTasks();
  const classes = storageService.getClasses();
  const subjects = storageService.getSubjects();
  const students = storageService.getStudents();
  const allTaskStatuses = storageService.getStudentTaskStatuses();

  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [studentSearch, setStudentSearch] = useState('');
  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newClassId, setNewClassId] = useState(classes[0]?.id || '');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');
  const [newAssignedDate, setNewAssignedDate] = useState('2026-10-28');
  const [newDueDate, setNewDueDate] = useState('2026-11-04');
  const [newMaxScore, setNewMaxScore] = useState(100);

  // CSV upload state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreviewRows, setCsvPreviewRows] = useState<any[]>([]);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [isCsvValid, setIsCsvValid] = useState(false);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);
  const taskStatuses = allTaskStatuses.filter((ts) => ts.taskId === selectedTaskId);

  const filteredStatuses = taskStatuses.filter((ts) => {
    if (statusFilter !== 'ALL' && ts.status !== statusFilter) return false;
    if (studentSearch && !ts.studentName.toLowerCase().includes(studentSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  const summary = summarizeTaskStatuses(taskStatuses);

  // Handler for direct inline status change
  const handleInlineStatusChange = (statusId: string, status: TaskStatus) => {
    storageService.updateStudentTaskStatus(
      statusId,
      { status },
      currentUser?.fullName || 'Guru'
    );
  };

  const handleInlineGradeChange = (statusId: string, gradeStr: string) => {
    const num = gradeStr === '' ? undefined : Number(gradeStr);
    if (num !== undefined && (isNaN(num) || num < 0 || num > 100)) return;
    storageService.updateStudentTaskStatus(
      statusId,
      { grade: num },
      currentUser?.fullName || 'Guru'
    );
  };

  const handleInlineNotesChange = (statusId: string, notes: string) => {
    storageService.updateStudentTaskStatus(
      statusId,
      { notes },
      currentUser?.fullName || 'Guru'
    );
  };

  // Create new task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const cl = classes.find((c) => c.id === newClassId);
    const sub = subjects.find((s) => s.id === newSubjectId);

    if (!cl || !sub) return;

    const newTask: SchoolTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      classId: cl.id,
      className: cl.name,
      subjectId: sub.id,
      subjectName: sub.name,
      teacherId: currentUser?.id || 'teacher-default',
      teacherName: currentUser?.fullName || 'Guru Mata Pelajaran',
      teacherTitle: currentUser?.academicTitle,
      assignedDate: newAssignedDate,
      dueDate: newDueDate,
      maxScore: newMaxScore,
      academicYear: cl.academicYear,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.saveTask(newTask, currentUser?.fullName || 'Guru');
    setSelectedTaskId(newTask.id);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
    setNotificationMsg({
      type: 'success',
      text: `Penugasan "${newTask.title}" untuk kelas ${newTask.className} berhasil dibuat dan dihubungkan ke daftar siswa!`,
    });
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Download CSV template for current task
  const handleDownloadCsvTemplate = () => {
    if (!selectedTask) return;
    const taskStudents = storageService.getStudentsByClass(selectedTask.classId);

    const csvData = taskStudents.map((s) => ({
      nis: s.nis,
      nama: s.fullName,
      status: 'tuntas', // sample value
      nilai: '90',
      catatan: 'Tepat waktu',
    }));

    const csvContent = Papa.unparse(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Template_Tugas_${selectedTask.className}_${selectedTask.title}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle CSV file selection and parsing
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTask) return;

    setCsvFile(file);
    const classStudents = storageService.getStudentsByClass(selectedTask.classId);
    const validNisList = classStudents.map((s) => s.nis);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedRows = results.data as Record<string, string>[];
        const errors: string[] = [];
        const validatedData: any[] = [];

        parsedRows.forEach((row, idx) => {
          const res = validateCsvTaskRow(row, validNisList);
          if (!res.isValid) {
            errors.push(`Baris ${idx + 2}: ${res.error}`);
          } else {
            validatedData.push(res.parsedData);
          }
        });

        setCsvPreviewRows(parsedRows);
        setCsvErrors(errors);
        setIsCsvValid(errors.length === 0 && validatedData.length > 0);
      },
      error: (err) => {
        setCsvErrors([`Gagal membaca berkas CSV: ${err.message}`]);
        setIsCsvValid(false);
      },
    });
  };

  // Commit CSV import
  const handleConfirmCsvImport = () => {
    if (!selectedTask || !isCsvValid) return;

    const classStudents = storageService.getStudentsByClass(selectedTask.classId);
    const validNisList = classStudents.map((s) => s.nis);

    const validRecords: Array<{
      nis: string;
      status: TaskStatus;
      grade?: number;
      notes?: string;
    }> = [];

    csvPreviewRows.forEach((row) => {
      const res = validateCsvTaskRow(row, validNisList);
      if (res.isValid && res.parsedData) {
        validRecords.push(res.parsedData);
      }
    });

    const result = storageService.batchUpdateTaskStatuses(
      selectedTask.id,
      validRecords,
      currentUser?.fullName || 'Guru'
    );

    setShowUploadModal(false);
    setCsvFile(null);
    setCsvPreviewRows([]);
    setCsvErrors([]);
    setNotificationMsg({
      type: 'success',
      text: `Impor nilai/status tugas berhasil! ${result.updatedCount} siswa telah diperbarui.`,
    });
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-blue-100 text-blue-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
            Manajemen Tugas & Ketuntasan Akademik
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Laporan Tugas Siswa & Monitoring Wali Kelas
          </h2>
          <p className="text-xs text-slate-500">
            Guru mapel melaporkan perkembangan tugas siswa; wali kelas memantau ketuntasan per siswa & mata pelajaran
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Buat Penugasan Baru
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Unggah Nilai (CSV)
          </button>
        </div>
      </div>

      {notificationMsg && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs animate-fade-in ${
            notificationMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {notificationMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-semibold">{notificationMsg.text}</span>
        </div>
      )}

      {/* Task Selector & Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Task Picker */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Pilih Penugasan Terdaftar</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {tasks.map((t) => {
              const isSelected = t.id === selectedTaskId;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTaskId(t.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 font-semibold text-blue-900 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold bg-white px-2 py-0.5 rounded text-[10px] border border-slate-200">
                      Kelas {t.className}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Tenggat: {t.dueDate}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 mt-1">{t.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {t.subjectName} • {t.teacherName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Task Details & Completion Metrics */}
        {selectedTask && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
                      Kelas {selectedTask.className}
                    </span>
                    <span className="font-bold text-slate-700 text-xs">
                      {selectedTask.subjectName}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">{selectedTask.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Guru Pengampu: {selectedTask.teacherName} • Tenggat Waktu:{' '}
                    <strong className="text-rose-600 font-mono">{selectedTask.dueDate}</strong>
                  </p>
                </div>

                <button
                  onClick={handleDownloadCsvTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  Unduh Templat CSV
                </button>
              </div>

              <p className="text-xs text-slate-600 mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                {selectedTask.description}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-500">Total Siswa</span>
                <p className="text-xl font-black text-slate-900">{summary.total}</p>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl">
                <span className="text-[11px] text-emerald-700">Tuntas & Kumpul</span>
                <p className="text-xl font-black text-emerald-800">{summary.completed}</p>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl">
                <span className="text-[11px] text-amber-700">Belum Tuntas</span>
                <p className="text-xl font-black text-amber-800">{summary.incomplete}</p>
              </div>
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <span className="text-[11px] text-blue-700">Ketuntasan</span>
                <p className="text-xl font-black text-blue-800">{summary.completionRate}%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Student Status Roster */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Status Pengerjaan Siswa (Input Interaktif Langsung)
            </h3>
            <p className="text-xs text-slate-500">
              Perubahan status, nilai, dan catatan langsung tersimpan ke basis data
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">Semua Status Pengerjaan</option>
              <option value="belum_mengerjakan">Belum Mengerjakan</option>
              <option value="sedang_mengerjakan">Sedang Mengerjakan</option>
              <option value="sudah_mengumpulkan">Sudah Mengumpulkan</option>
              <option value="perlu_perbaikan">Perlu Perbaikan</option>
              <option value="tuntas">Tuntas</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari siswa..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-44 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">No</th>
                <th className="py-2.5 px-3">NIS</th>
                <th className="py-2.5 px-3">Nama Siswa</th>
                <th className="py-2.5 px-3">Status Pengerjaan</th>
                <th className="py-2.5 px-3">Nilai (0-100)</th>
                <th className="py-2.5 px-3">Catatan Pembimbingan</th>
                <th className="py-2.5 px-3">Terakhir Diperbarui</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStatuses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400">
                    Tidak ada siswa yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredStatuses.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono font-bold text-slate-700">
                      #{st.absentNumber}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-500">{st.nis}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">{st.studentName}</td>
                    <td className="py-2 px-3">
                      <select
                        value={st.status}
                        onChange={(e) => handleInlineStatusChange(st.id, e.target.value as TaskStatus)}
                        className={`rounded-lg px-2 py-1 text-xs font-bold uppercase border cursor-pointer ${
                          st.status === 'tuntas'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : st.status === 'sudah_mengumpulkan'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : st.status === 'perlu_perbaikan'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="belum_mengerjakan">Belum Mengerjakan</option>
                        <option value="sedang_mengerjakan">Sedang Mengerjakan</option>
                        <option value="sudah_mengumpulkan">Sudah Mengumpulkan</option>
                        <option value="perlu_perbaikan">Perlu Perbaikan</option>
                        <option value="tuntas">Tuntas</option>
                      </select>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="-"
                        value={st.grade !== undefined ? st.grade : ''}
                        onChange={(e) => handleInlineGradeChange(st.id, e.target.value)}
                        className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-mono font-bold text-center focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        placeholder="Tambahkan catatan koreksi..."
                        value={st.notes || ''}
                        onChange={(e) => handleInlineNotesChange(st.id, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-3 text-[10px] text-slate-400 font-mono">
                      {st.updatedAt.slice(0, 10)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Buat Penugasan Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Buat Penugasan Siswa Baru</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Tugas: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Latihan Soal Sistem Persamaan Linear"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deskripsi / Petunjuk Pengerjaan: *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Instruksi pengerjaan, buku referensi, nomor halaman..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Kelas:</label>
                  <select
                    value={newClassId}
                    onChange={(e) => setNewClassId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran:</label>
                  <select
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Diberikan:</label>
                  <input
                    type="date"
                    required
                    value={newAssignedDate}
                    onChange={(e) => setNewAssignedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tenggat Waktu: *</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Simpan & Rilis ke Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Unggah CSV Nilai */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Unggah Laporan Nilai / Status (CSV)</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                <p className="font-semibold">Format Berkas CSV:</p>
                <p className="text-[11px] mt-0.5">
                  Kolom wajib: <code className="font-mono">nis, nama, status, nilai, catatan</code>.
                  Pastikan NIS sesuai dengan peserta didik kelas {selectedTask?.className}.
                </p>
              </div>

              <div>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCsvFileChange}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              {/* Errors Display */}
              {csvErrors.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-rose-800">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" /> Ditemukan {csvErrors.length}{' '}
                    Kesalahan Validasi:
                  </div>
                  <ul className="list-disc pl-5 text-[11px] space-y-0.5 max-h-32 overflow-y-auto">
                    {csvErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preview table */}
              {csvPreviewRows.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">
                    Pratinjau Data ({csvPreviewRows.length} Baris):
                  </h4>
                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                          <th className="p-1.5">NIS</th>
                          <th className="p-1.5">Nama</th>
                          <th className="p-1.5">Status</th>
                          <th className="p-1.5">Nilai</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {csvPreviewRows.map((r, i) => (
                          <tr key={i}>
                            <td className="p-1.5 font-mono">{r.nis || r.NIS}</td>
                            <td className="p-1.5">{r.nama || r.Nama}</td>
                            <td className="p-1.5">{r.status || r.Status}</td>
                            <td className="p-1.5 font-mono">{r.nilai || r.Nilai || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!isCsvValid}
                onClick={handleConfirmCsvImport}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold disabled:opacity-40"
              >
                Konfirmasi & Simpan ke Basis Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
