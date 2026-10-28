import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { SchoolClass } from '../../types';
import { validateClassQrCode, canUserAccessClass } from '../../utils/schoolLogic';
import { ClassDetailView } from '../class/ClassDetailView';
import {
  QrCode,
  Camera,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  RefreshCw,
  Printer,
  ChevronRight,
  ShieldCheck,
  VideoOff,
} from 'lucide-react';

export const ScanQrView: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [scannedInput, setScannedInput] = useState('');
  const [scanError, setScanError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const classes = storageService.getClasses();
  const assignments = storageService.getTeachingAssignments();

  // Try opening real camera if requested
  const handleStartCamera = async () => {
    setCameraPermissionError(null);
    setScanError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera perangkat tidak didukung di lingkungan browser ini.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      setCameraPermissionError(
        'Izin kamera tidak dapat diakses atau perangkat tidak memiliki kamera aktif. Silakan gunakan pemindai simulasi atau pilih kelas secara manual di bawah.'
      );
      setIsCameraActive(false);
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      handleStopCamera();
    };
  }, []);

  const handleProcessCode = (code: string) => {
    setScanError(null);
    const validation = validateClassQrCode(code, classes);
    if (!validation.isValid || !validation.schoolClass) {
      setScanError(validation.errorMessage || 'Kode QR tidak dikenali.');
      return;
    }

    // Check RBAC permissions
    if (currentUser) {
      const accessCheck = canUserAccessClass(currentUser, validation.schoolClass.id, assignments);
      if (!accessCheck.hasAccess) {
        setScanError(
          `Akses Ditolak: ${accessCheck.reason} Anda sedang login sebagai ${currentUser.fullName} (${currentUser.position}).`
        );
        return;
      }
    }

    handleStopCamera();
    setSelectedClass(validation.schoolClass);
  };

  if (selectedClass) {
    return <ClassDetailView schoolClass={selectedClass} onBack={() => setSelectedClass(null)} />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Pemindai QR Code Rombongan Belajar
              </h2>
              <p className="text-xs text-slate-500">
                Pindai identifier QR kelas resmi untuk membuka lembar data siswa, guru pengampu, dan tugas belum tuntas
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPrintModal(true)}
            className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition self-start sm:self-auto"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Cetak Label QR Kelas
          </button>
        </div>
      </div>

      {/* Error Message */}
      {scanError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-800 animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm text-rose-900">Validasi Gagal</div>
            <div className="mt-0.5">{scanError}</div>
          </div>
        </div>
      )}

      {/* Main Scanner Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Live Camera Viewfinder */}
        <div className="bg-slate-950 rounded-2xl p-6 text-white flex flex-col justify-between relative overflow-hidden min-h-[320px] border border-slate-800 shadow-lg">
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Camera className="w-4 h-4" />
              Kamera Perangkat
            </span>
            {isCameraActive && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Feed
              </span>
            )}
          </div>

          <div className="relative my-4 flex-1 flex items-center justify-center">
            {isCameraActive ? (
              <div className="relative w-full h-48 bg-black rounded-xl overflow-hidden border border-slate-700">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline />
                <div className="absolute inset-0 border-2 border-blue-500/50 m-6 rounded-lg pointer-events-none animate-pulse flex items-center justify-center">
                  <div className="w-12 h-0.5 bg-blue-400 shadow-md shadow-blue-400"></div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-slate-800 rounded-xl w-full">
                <VideoOff className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Kamera sedang non-aktif</p>
                {cameraPermissionError && (
                  <p className="text-[11px] text-amber-400 mt-2 max-w-xs mx-auto">
                    {cameraPermissionError}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="relative z-10 flex gap-2">
            {!isCameraActive ? (
              <button
                onClick={handleStartCamera}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Nyalakan Kamera Perangkat
              </button>
            ) : (
              <button
                onClick={handleStopCamera}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
              >
                Matikan Kamera
              </button>
            )}
          </div>
        </div>

        {/* Input Manual & Simulation Buttons */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Simulasi Pindai Seketika (Demo Scanner)
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Klik salah satu identifier kelas di bawah ini untuk mensimulasikan hasil pemindaian barcode fisik:
            </p>

            <div className="space-y-2">
              {classes.slice(0, 4).map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleProcessCode(c.qrIdentifier)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between text-left text-xs transition cursor-pointer group"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-blue-700">
                      Pindai {c.name}
                    </span>
                    <span className="block text-[11px] font-mono text-slate-400">
                      {c.qrIdentifier}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </button>
              ))}

              <button
                onClick={() => handleProcessCode('CLASS-INVALID-9999')}
                className="w-full p-2.5 rounded-xl border border-rose-200 hover:bg-rose-50/60 flex items-center justify-between text-left text-xs text-rose-800 transition cursor-pointer"
              >
                <span className="font-bold">Uji Coba Kode QR Tidak Terdaftar</span>
                <span className="text-[10px] bg-rose-100 px-2 py-0.5 rounded font-mono">Error Test</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Input Manual Identifier</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: CLASS-VII-A-2026"
                value={scannedInput}
                onChange={(e) => setScannedInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <button
                onClick={() => handleProcessCode(scannedInput)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Periksa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Class Selector (Alternative without camera) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Alternatif Pemilihan Kelas Manual (Semua Rombel VII - IX)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Pilih langsung rombongan belajar tanpa pemindaian optik:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {classes.map((c) => (
            <div
              key={c.id}
              onClick={() => handleProcessCode(c.qrIdentifier)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-xs transition cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  Kelas {c.name}
                </span>
                <span className="font-mono text-[10px] text-blue-600 font-bold">
                  {c.qrIdentifier}
                </span>
              </div>
              <p className="text-slate-600 font-medium truncate">Wali: {c.homeroomTeacherName}</p>
              <p className="text-[11px] text-slate-400">{c.roomName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Print QR Labels Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-black text-slate-900 text-base">Label Cetak QR Identifier Kelas</h3>
                <p className="text-xs text-slate-500">
                  Cetak dan tempel pada pintu ruang kelas untuk akses cepat pemantauan wali kelas
                </p>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-6">
              {classes.map((c) => (
                <div
                  key={c.id}
                  className="border-2 border-slate-800 rounded-xl p-4 text-center bg-white shadow-xs flex flex-col items-center justify-between"
                >
                  <div className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                    MTsN 1 KARTANEGARA
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">KELAS {c.name}</div>
                  <div className="my-3 p-3 bg-slate-50 border border-slate-300 rounded-lg flex flex-col items-center">
                    {/* Visual QR representation */}
                    <div className="w-24 h-24 bg-slate-900 rounded-md p-1.5 flex flex-wrap gap-1 items-center justify-center">
                      <div className="w-7 h-7 bg-white rounded-xs flex items-center justify-center">
                        <div className="w-3.5 h-3.5 bg-slate-900 rounded-xs"></div>
                      </div>
                      <div className="w-7 h-7 bg-white rounded-xs flex items-center justify-center">
                        <div className="w-3.5 h-3.5 bg-slate-900 rounded-xs"></div>
                      </div>
                      <div className="w-7 h-7 bg-white rounded-xs flex items-center justify-center">
                        <div className="w-3.5 h-3.5 bg-slate-900 rounded-xs"></div>
                      </div>
                      <div className="w-7 h-7 bg-blue-500 rounded-xs"></div>
                    </div>
                  </div>
                  <div className="font-mono text-xs font-black text-blue-900">{c.qrIdentifier}</div>
                  <div className="text-[10px] text-slate-500 mt-1 truncate max-w-full">
                    {c.homeroomTeacherName}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-500 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Cetak Lembar Label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
