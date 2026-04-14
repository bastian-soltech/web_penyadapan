import supabaseServer from '../lib/supabaseServer';
import { redirect } from 'next/navigation';
import { FiMapPin, FiUsers, FiLayers, FiCheckSquare, FiTrendingUp } from 'react-icons/fi';
import ProduksiTab from '../components/homeTab/Produksi';

export default async function DashboardPage() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  // Fetch Stats from Supabase
  const today = new Date().toISOString().split('T')[0];

  const [
    { count: totalBlok },
    { count: totalPenyadap },
    { count: totalPohon },
    { count: penilaianHariIni },
    { data: profile }
  ] = await Promise.all([
    supabase.from('tabel_blok').select('*', { count: 'exact', head: true }),
    supabase.from('tabel_penyadap').select('*', { count: 'exact', head: true }),
    supabase.from('tabel_pohon').select('*', { count: 'exact', head: true }),
    supabase.from('tabel_rekap_penilaian').select('*', { count: 'exact', head: true }).eq('tanggal_penilaian', today),
    supabase.from('profiles').select('nama_penilai').eq('id', user.id).single()
  ]);

  const stats = [
    { label: 'Total Blok', value: (totalBlok || 0).toLocaleString('id-ID'), icon: <FiLayers />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Penyadap', value: (totalPenyadap || 0).toLocaleString('id-ID'), icon: <FiUsers />, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pohon Terdata', value: (totalPohon || 0).toLocaleString('id-ID'), icon: <FiTrendingUp />, color: 'bg-amber-50 text-amber-600' },
    { label: 'Penilaian Hari Ini', value: (penilaianHariIni || 0).toLocaleString('id-ID'), icon: <FiCheckSquare />, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-800">
            Halo, <span className="text-emerald-600">{profile?.nama_penilai || 'Penilai'}</span> 👋
          </h1>
          <p className="text-stone-500 mt-1">Selamat datang kembali di sistem manajemen Kebun Glantangan.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-stone-100">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-bold text-stone-600">Sistem Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-stone-400">{stat.label}</p>
              <p className="text-2xl font-black text-stone-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grafik Produksi */}
      <div className="bg-white rounded-[2rem] p-1 border border-stone-100 shadow-sm overflow-hidden">
        <div className="bg-stone-50/50 p-6 border-b border-stone-50">
           <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
              <FiTrendingUp className="text-emerald-600" /> Ringkasan Produksi Kebun
           </h2>
        </div>
        <div className="p-6">
          <ProduksiTab />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="p-8 border-b border-stone-50 bg-stone-50/50">
              <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                <FiMapPin className="text-emerald-600" /> Profil Kebun Glantangan
              </h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[
                  { label: 'Lokasi', value: 'Jalan Padang Golf No. 14, Dusun Glantangan, Desa Pondokrejo, Kecamatan Tempurejo, Kabupaten Jember, Jawa Timur' },
                  { label: 'Luas Area', value: '4,482.62 Hektar' },
                  { label: 'Didirikan', value: 'Tahun 1985' },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-xs uppercase tracking-wider font-bold text-stone-400">{item.label}</p>
                    <p className="text-stone-700 font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Komoditas Utama', value: 'Karet, Kayu, Kopi' },
                  { label: 'Jumlah Karyawan', value: '±1,300 Orang' },
                  { label: 'Sertifikasi', value: 'Organic, Fair Trade' },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-xs uppercase tracking-wider font-bold text-stone-400">{item.label}</p>
                    <p className="text-stone-700 font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-200/20">
             <div className="relative z-10">
                <h3 className="text-2xl font-black mb-2">Visi & Misi</h3>
                <p className="text-emerald-100/80 mb-6 leading-relaxed">
                  Menjadi perkebunan terdepan di Indonesia yang menghasilkan produk berkualitas tinggi dengan menerapkan praktik pertanian berkelanjutan.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-1">Misi #1</p>
                    <p className="text-sm">Produk premium & berkelanjutan</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-1">Misi #2</p>
                    <p className="text-sm">Pemberdayaan masyarakat sekitar</p>
                  </div>
                </div>
             </div>
             {/* Abstract Design Element */}
             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
          </div>
        </div>

        {/* Quick Actions / Recent Activity Placeholder */}
        <div className="space-y-6">
          {/* <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
            <h3 className="text-lg font-bold text-stone-800 mb-6">Aksi Cepat</h3>
            <div className="space-y-3">
              <button className="btn btn-block justify-start gap-4 h-16 rounded-2xl bg-stone-50 border-none hover:bg-emerald-50 text-stone-700 normal-case">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                  📋
                </div>
                <span>Buat Rekap Baru</span>
              </button>
              <button className="btn btn-block justify-start gap-4 h-16 rounded-2xl bg-stone-50 border-none hover:bg-emerald-50 text-stone-700 normal-case">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-600">
                  🌳
                </div>
                <span>Update Data Pohon</span>
              </button>
            </div>
          </div> */}

          <div className="card bg-amber-50 border border-amber-100 rounded-3xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center text-amber-700">
                  💡
                </div>
                <h4 className="font-bold text-amber-900">Tips Hari Ini</h4>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed italic">
                "Pastikan kedalaman sadap tidak mengenai kayu untuk menjaga kesehatan kulit pohon jangka panjang."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
