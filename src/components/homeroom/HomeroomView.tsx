import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { SchoolClass } from '../../types';
import { ClassDetailView } from '../class/ClassDetailView';
import {
  GraduationCap,
  Search,
  Filter,
  Users,
  Building,
  QrCode,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const HomeroomView: React.FC = () => {
  const classes = storageService.getClasses();
  const students = storageService.getStudents();
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  if (selectedClass) {
    return <ClassDetailView schoolClass={selectedClass} onBack={() => setSelectedClass(null)} />;
  }

  const filteredClasses = classes.filter((c) => {
    if (gradeFilter !== 'ALL' && c.grade !== gradeFilter) return false;
    if (
      search &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.homeroomTeacherName.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-blue-100 text-blue-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
            Data Resmi Penugasan Rombel
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Data Rombongan Belajar & Wali Kelas
          </h2>
          <p className="text-xs text-slate-500">
            Daftar penugasan resmi wali kelas untuk seluruh kelas VII, VIII, dan IX beserta data rombel aktif
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Semua Tingkat Kelas</option>
            <option value="VII">Kelas VII (Tujuh)</option>
            <option value="VIII">Kelas VIII (Delapan)</option>
            <option value="IX">Kelas IX (Sembilan)</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama kelas atau wali kelas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl w-60 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="text-slate-500">
          Total: <strong>{filteredClasses.length}</strong> rombel terdaftar
        </div>
      </div>

      {/* Rombel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((c) => {
          const classStudents = students.filter((s) => s.classId === c.id);
          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-5 shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm bg-blue-600 text-white px-2.5 py-0.5 rounded-lg">
                    KELAS {c.name}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded font-mono">
                    T.A. {c.academicYear}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] text-slate-400">Wali Kelas:</span>
                  <h3 className="font-extrabold text-sm text-slate-900">{c.homeroomTeacherName}</h3>
                  <p className="text-xs text-slate-500 mt-1">{c.roomName}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <strong>{classStudents.length}</strong> Peserta Didik
                  </span>
                  <span className="font-mono text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                    {c.qrIdentifier}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedClass(c)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>Buka Detail Rombel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
