export default function PetaTab() {
  return (
    <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[500px] text-center relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-md">
        <div className="w-24 h-24 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-5xl mb-8 mx-auto shadow-sm animate-bounce duration-3000">
          📍
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Peta Interaktif Kebun</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Fitur visualisasi spasial afdeling dan blok sedang dalam tahap sinkronisasi data GIS. Segera hadir untuk memudahkan pemantauan area secara real-time.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3">
          {["Afdeling A-F", "Blok Penyadapan", "Titik Kumpul"].map((tag) => (
            <span key={tag} className="px-4 py-1.5 rounded-full bg-slate-50 text-slate-400 text-xs font-bold border border-slate-100">
              {tag}
            </span>
          ))}
        </div>

        <button className="mt-10 btn btn-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-xl px-8 shadow-lg shadow-emerald-100">
          Minta Akses Peta Beta
        </button>
      </div>

      {/* Mini Legend Preview */}
      <div className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 text-left shadow-sm hidden md:block">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Legenda Rencana</p>
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-semibold text-slate-600">Area Produktif</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs font-semibold text-slate-600">Area Tanam Ulang</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs font-semibold text-slate-600">Fasilitas Umum</span>
            </div>
        </div>
      </div>
    </div>
  );
}
