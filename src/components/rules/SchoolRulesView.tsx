import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { SchoolRule } from '../../types';
import {
  BookOpenCheck,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit,
  X,
  Sparkles,
} from 'lucide-react';

export const SchoolRulesView: React.FC = () => {
  const { currentUser } = useAuth();
  const rules = storageService.getSchoolRules();

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SchoolRule['category']>('Kedisiplinan');
  const [description, setDescription] = useState('');
  const [pointsRule, setPointsRule] = useState<number>(5);
  const [sanction, setSanction] = useState('');

  const isAdminOrLeader = currentUser?.roles.some((r) =>
    ['admin', 'kepala_sekolah', 'wakasek_kesiswaan'].includes(r)
  );

  const categories = [
    'Ketentuan Umum',
    'Kedisiplinan',
    'Kehadiran',
    'Kegiatan Pembelajaran',
    'Penggunaan Fasilitas',
    'Tanggung Jawab dan Perilaku',
  ];

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule: SchoolRule = {
      id: `rule-${Date.now()}`,
      category,
      title: title.trim(),
      description: description.trim(),
      pointsRule,
      sanction: sanction.trim() || undefined,
      effectiveDate: '2025-07-14',
      version: '2025.2-DEMO',
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser?.fullName || 'Wakasek Kesiswaan',
      isDemo: true,
    };

    storageService.saveSchoolRule(newRule, currentUser?.fullName || 'Admin');
    setShowAddModal(false);
    setTitle('');
    setDescription('');
    setSanction('');
  };

  const handleDeleteRule = (id: string) => {
    if (confirm('Hapus butir tata tertib ini?')) {
      storageService.deleteSchoolRule(id, currentUser?.fullName || 'Admin');
    }
  };

  const filteredRules = rules.filter((r) => {
    if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
    if (
      search &&
      !r.title.toLowerCase().includes(search.toLowerCase()) &&
      !r.description.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-blue-100 text-blue-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
            Pedoman Kedisiplinan
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">Tata Tertib & Peraturan Sekolah</h2>
          <p className="text-xs text-slate-500">
            Kaidah perilaku, tata krama, ketentuan seragam, dan poin kedisiplinan peserta didik SMP/MTs
          </p>
        </div>

        {isAdminOrLeader && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Tambah Aturan Tata Tertib
          </button>
        )}
      </div>

      {/* Demo Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between gap-2 text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Contoh Tata Tertib Berlabel DEMO:</strong> Butir tata tertib di bawah ini disiapkan sebagai contoh standar operasional sekolah dan dapat disunting oleh pihak pimpinan kesiswaan sekolah.
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Semua Kategori Aturan</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kata kunci aturan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl w-56 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="text-slate-500">
          Menampilkan <strong>{filteredRules.length}</strong> butir peraturan
        </div>
      </div>

      {/* Rules list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                  {rule.category}
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-mono px-2 py-0.5 rounded font-bold">
                  {rule.version}
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 mt-2">{rule.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rule.description}</p>

              {rule.sanction && (
                <div className="mt-3 p-2.5 bg-rose-50/60 border border-rose-200 rounded-xl text-[11px] text-rose-900">
                  <span className="font-bold block">Tindakan / Sanksi:</span>
                  <span>{rule.sanction}</span>
                  {rule.pointsRule && (
                    <span className="font-mono font-bold text-rose-700 block mt-0.5">
                      Poin Pelanggaran: +{rule.pointsRule}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Diperbarui oleh: {rule.updatedBy}</span>
              {isAdminOrLeader && (
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Rule */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Butir Tata Tertib</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRule} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori Aturan: *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Aturan: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Larangan Membawa Gawai Tanpa Izin Guru"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Isi Peraturan: *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Uraian rinci ketentuan aturan tata tertib..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Poin Pelanggaran:</label>
                  <input
                    type="number"
                    min="0"
                    value={pointsRule}
                    onChange={(e) => setPointsRule(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tindakan / Sanksi:</label>
                  <input
                    type="text"
                    placeholder="Penyitaan sementara..."
                    value={sanction}
                    onChange={(e) => setSanction(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Simpan Aturan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
