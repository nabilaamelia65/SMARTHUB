import React from 'react';
import { storageService } from '../../services/storageService';
import { Network, UserCheck, Shield, ChevronDown, Award } from 'lucide-react';

export const OrganizationView: React.FC = () => {
  const positions = storageService.getOrganizationPositions();
  const settings = storageService.getSettings();

  const level1 = positions.filter((p) => p.level === 1);
  const level2 = positions.filter((p) => p.level === 2);
  const level3 = positions.filter((p) => p.level === 3);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <span className="bg-indigo-100 text-indigo-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Tata Kelola Lembaga
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Struktur Organisasi Sekolah
            </h2>
            <p className="text-xs text-slate-500">
              Bagan hierarki pimpinan dan pembagian tugas pokok fungsi di lingkungan {settings.schoolName}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Hierarchy Tree */}
      <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-6 space-y-8 overflow-x-auto">
        {/* LEVEL 1: KEPALA SEKOLAH */}
        <div className="flex justify-center">
          {level1.map((pos) => (
            <div
              key={pos.id}
              className="bg-white rounded-2xl border-2 border-blue-600 p-5 shadow-lg max-w-md w-full text-center relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-black text-[10px] tracking-wider uppercase px-3 py-0.5 rounded-full shadow-xs">
                Pimpinan Utama
              </div>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-600/30">
                {pos.holderName.charAt(0)}
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mt-2">{pos.holderName}</h3>
              <p className="text-xs text-blue-600 font-bold">{pos.title}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">NIP: {pos.holderNip}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 text-left text-xs text-slate-600 space-y-1">
                <span className="font-semibold text-slate-800 block text-[11px]">
                  Tanggung Jawab Pokok:
                </span>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  {pos.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Connector Line */}
        <div className="w-0.5 h-6 bg-slate-300 mx-auto -my-4" />

        {/* LEVEL 2: WAKIL KEPALA SEKOLAH */}
        <div>
          <div className="text-center mb-4">
            <span className="bg-slate-200 text-slate-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Wakil Kepala Sekolah (Bidang Terkait)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {level2.map((pos) => (
              <div
                key={pos.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-4 shadow-xs text-center transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 mx-auto rounded-xl bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center">
                    {pos.holderName.charAt(0)}
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mt-2">{pos.holderName}</h4>
                  <p className="text-[11px] text-teal-700 font-semibold mt-0.5">{pos.title}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">NIP: {pos.holderNip}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 text-left text-[11px] text-slate-500">
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    {pos.responsibilities.slice(0, 2).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LEVEL 3: KOORDINATOR TATA USAHA & TENAGA KEPENDIDIKAN */}
        <div className="pt-2">
          <div className="text-center mb-4">
            <span className="bg-slate-200 text-slate-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Tata Usaha & Tenaga Kependidikan
            </span>
          </div>

          <div className="flex justify-center">
            {level3.map((pos) => (
              <div
                key={pos.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs max-w-md w-full text-center"
              >
                <h4 className="font-bold text-slate-900 text-xs">{pos.holderName}</h4>
                <p className="text-[11px] text-indigo-700 font-semibold mt-0.5">{pos.title}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">NIP: {pos.holderNip}</p>
                <div className="mt-2 text-left text-[11px] text-slate-500">
                  <ul className="list-disc pl-4 space-y-0.5">
                    {pos.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
