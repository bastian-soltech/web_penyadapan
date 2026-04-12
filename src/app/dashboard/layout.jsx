import Link from 'next/link';
import { 
  HiOutlineChartBar, 
  HiOutlineUserGroup, 
  HiOutlineMap, 
  HiOutlineClipboardList,
  HiOutlineDatabase
} from "react-icons/hi";
import { RiTreeFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import supabaseServer from "@/app/lib/supabaseServer";

export default async function DashboardLayout({ children }) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('nama_penilai')
    .eq('id', user?.id)
    .single();

  const userName = profile?.nama_penilai || user?.email?.split('@')[0] || 'User';

  const menuItems = [
    { path: "/dashboard", icon: <HiOutlineChartBar />, name: "Ringkasan" },
    { path: "/dashboard/blok", icon: <HiOutlineMap />, name: "Data Blok" },
    { path: "/dashboard/penyadap", icon: <HiOutlineUserGroup />, name: "Data Penyadap" },
    { path: "/dashboard/pohon", icon: <RiTreeFill />, name: "Data Pohon" },
    { path: "/dashboard/rekap", icon: <HiOutlineClipboardList />, name: "Rekap Penilaian" },
    { path: "/dashboard/pengaturan", icon: <HiOutlineDatabase />, name: "Integrasi Data" },
    { path: "/dashboard/profile", icon: <CgProfile />, name: "Profile" },
  ];

  return (
    <div className="drawer lg:drawer-open bg-stone-50">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Content Area */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200">
          <div className="flex items-center justify-between p-4">
            <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <h1 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
              <span>🌿</span>
              <span>Panel Penilai</span>
            </h1>
            <div className="w-10"></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-6 text-center text-sm text-stone-400 border-t border-stone-100">
          © {new Date().getFullYear()} Kebun Glantangan - Sistem Manajemen Penyadapan
        </footer>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="w-72 min-h-full bg-white border-r border-stone-200 flex flex-col shadow-sm">
          {/* Sidebar Header */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">
                <img src="/images/logo.png" alt="" />
              </div>
              <div>
                <h2 className="text-xl font-black text-emerald-900 leading-tight">
                  GLANTANGAN
                </h2>
                <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-600/60">
                  Management System
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4">
            <ul className="menu w-full p-0 space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all hover:bg-emerald-50 text-stone-600 hover:text-emerald-700 font-medium active:bg-emerald-100"
                  >
                    <span className="text-xl opacity-80">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer - User Profile */}
          <div className="p-6 border-t border-stone-100">
            <Link href="/dashboard/profile" className="bg-stone-50 rounded-2xl p-4 flex items-center gap-3 hover:bg-emerald-50 transition-colors group">
              <div className="avatar placeholder">
                <div className="bg-emerald-200 text-emerald-700 rounded-full w-10 group-hover:bg-emerald-300 transition-colors">
                  <span>{userName[0].toUpperCase()}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-stone-800 truncate">{userName}</p>
                <p className="text-xs text-stone-500 truncate">{user?.email}</p>
              </div>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
