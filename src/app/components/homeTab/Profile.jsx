import { 
  RiMapPinRangeLine, 
  RiRuler2Line, 
  RiCalendarEventLine, 
  RiPlantLine, 
  RiTeamLine, 
  RiShieldCheckLine,
  RiLeafLine,
  RiFocus3Line,
  RiInformationLine
} from "react-icons/ri";

export default function ProfileTab() {
  const details = [
    { label: "Lokasi", value: "Desa Glantangan, Kec. Banyuwangi, Jawa Timur", icon: <RiMapPinRangeLine /> },
    { label: "Luas Area", value: "4,482.62 Hektar", icon: <RiRuler2Line /> },
    { label: "Didirikan", value: "1985", icon: <RiCalendarEventLine /> },
    { label: "Komoditas", value: "Karet, Kayu, Kopi Arabika", icon: <RiPlantLine /> },
    { label: "Karyawan", value: "±1,300 Orang", icon: <RiTeamLine /> },
    { label: "Sertifikasi", value: "Organic, Fair Trade, Rainforest Alliance", icon: <RiShieldCheckLine /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero-like Info Section */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <RiLeafLine className="text-[240px] text-emerald-900 rotate-12" />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 mb-6">
            <RiInformationLine className="text-sm" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Informasi Umum
            </span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Profil Kebun Glantangan</h2>
          <p className="text-slate-500 max-w-2xl mb-10 leading-relaxed font-medium">
            Perkebunan modern yang berkomitmen pada praktik berkelanjutan, mengintegrasikan teknologi terkini dengan pelestarian lingkungan untuk masa depan agrikultur yang lebih hijau.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {details.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/50 hover:bg-emerald-50/50 transition-all duration-300 border border-transparent hover:border-emerald-100 group">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl shrink-0 text-slate-400 group-hover:text-emerald-600 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">{item.label}</p>
                  <p className="text-sm font-bold text-slate-700">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visi & Misi Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visi */}
        <div className="bg-emerald-900 rounded-3xl p-10 text-white relative overflow-hidden group">
          <div className="absolute -bottom-16 -right-16 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
            <RiFocus3Line className="text-[300px]" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-base font-black shadow-inner">V</span>
              Visi Kami
            </h3>
            <p className="text-emerald-50/90 leading-relaxed text-xl font-medium italic">
              "Menjadi perkebunan terdepan di Indonesia yang menghasilkan produk berkualitas tinggi dengan menerapkan praktik pertanian berkelanjutan dan ramah lingkungan."
            </p>
          </div>
        </div>

        {/* Misi */}
        <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm relative overflow-hidden">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-base font-black">M</span>
            Misi Kami
          </h3>
          <ul className="space-y-6">
            {[
              "Menghasilkan produk perkebunan berkualitas premium",
              "Menerapkan teknologi modern dalam pengelolaan kebun",
              "Memberdayakan masyarakat sekitar kebun",
              "Menjaga kelestarian lingkungan dan biodiversitas"
            ].map((misi, i) => (
              <li key={i} className="flex items-start gap-4 group">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-150 transition-transform duration-300 shrink-0 shadow-sm shadow-emerald-200"></div>
                <span className="text-slate-600 font-bold leading-tight group-hover:text-emerald-700 transition-colors">{misi}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
