export default function PenilaianModal({ labelMap, pointOptions, form, onChange, onClose, onSubmit, selectedPohon }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop dengan efek Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Konten Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        
        {/* Header dengan Background Soft */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            Penilaian: <span className="text-emerald-700">{selectedPohon?.nama_pohon || "Pohon"}</span>
          </h2>
          <p className="text-sm text-slate-500">Silakan lengkapi parameter penilaian di bawah ini.</p>
        </div>

        {/* Body dengan Scrollbar Cantik jika data banyak */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {Object.entries(pointOptions).map(([field, options]) => (
            <div key={field} className="mb-5 last:mb-0">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {labelMap[field]}
              </label>
              <select
                className="select select-bordered w-full bg-slate-50 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-700"
                onChange={(e) => onChange(field, parseInt(e.target.value))}
                value={form[field] || ""}
              >
                <option value="" disabled>— Pilih {labelMap[field]} —</option>
                {options.map((opt) => (
                  <option key={opt.label} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Footer dengan Elevasi */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            className="btn btn-ghost text-slate-500 hover:bg-slate-200" 
            onClick={onClose}
          >
            Batal
          </button>
          <button 
            className="btn bg-emerald-700 px-8 shadow-lg shadow-emerald/30" 
            onClick={onSubmit}
          >
            Simpan Penilaian
          </button>
        </div>
      </div>
    </div>
  );
}