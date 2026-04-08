export default function PohonCard({ pohon, rekapId, onPenilaian }) {
  const assessment = pohon.tabel_penilaian?.find((p) => p.id_rekap_penilaian === rekapId);
  const sudahDinilai = !!assessment;

  return (
    <div className={`rounded-3xl border transition-all duration-300 ${
      sudahDinilai 
      ? 'bg-emerald-50 border-emerald-100 shadow-sm shadow-emerald-100/50' 
      : 'bg-white border-stone-100 shadow-sm hover:shadow-md'
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-xl">
            🌳
          </div>
          {sudahDinilai && (
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
              Terverifikasi
            </span>
          )}
        </div>
        
        <h2 className="text-xl font-black text-stone-800 mb-1">{pohon.nama_pohon}</h2>
        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-6">ID Pohon: #{pohon.id}</p>
        
        {sudahDinilai ? (
          <button
            className="w-full py-3 px-4 rounded-2xl bg-white border border-emerald-200 text-emerald-700 font-bold text-sm hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm"
            onClick={() => onPenilaian(pohon, assessment)}
          >
            Edit Penilaian
          </button>
        ) : (
          <button
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            onClick={() => onPenilaian(pohon)}
          >
            + Beri Penilaian
          </button>
        )}
      </div>
    </div>
  );
}
