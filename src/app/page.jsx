"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  RiLeafLine, 
  RiPlantLine, 
  RiBarChartGroupedLine, 
  RiMapPin2Line, 
  RiCustomerService2Line, 
  RiLockLine,
  RiArrowRightLine,
  RiDashboardLine
} from "react-icons/ri";
import ProfileTab from "./components/homeTab/Profile";
import KontakTab from "./components/homeTab/Kontak";
import ProduksiTab from "./components/homeTab/Produksi";
import PetaTab from "./components/homeTab/Peta";
import supabase from "./lib/supabaseClient";

/**
 * Aesthetic Direction: Organic / Refined
 * Differentiator: Floating Glassmorphism Tab Bar with Micro-interactions
 * Logic: Session-aware navigation for the Login/Dashboard portal.
 */

export default function Home() {
  const [tab, setTab] = useState("profile");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkSession();
  }, []);

  const tabs = [
    { id: "profile", label: "Profil Kebun", icon: <RiPlantLine /> },
    { id: "produksi", label: "Produksi", icon: <RiBarChartGroupedLine /> },
    { id: "peta", label: "Peta Kebun", icon: <RiMapPin2Line /> },
    { id: "kontak", label: "Kontak", icon: <RiCustomerService2Line /> },
    { 
      id: "login", 
      label: isLoggedIn ? "Buka Dashboard" : "Masuk Sistem", 
      icon: isLoggedIn ? <RiDashboardLine /> : <RiLockLine />, 
      isAction: true 
    },
  ];

  const handleTabClick = (t) => {
    if (t.isAction && t.id === "login") {
      if (isLoggedIn) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } else {
      setTab(t.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Refined Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-50/50 shadow-sm shadow-emerald-900/[0.02]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setTab("profile")}>
            <div className="w-20 h-20  flex items-center justify-center text-white  shadow-emerald-200 transition-transform group-hover:scale-105 duration-300">
              <img src="/images/logo.png" alt="" />
              {/* <RiLeafLine className="text-2xl" /> */}
            </div>
            <div>
              <h1 className="text-xl font-black text-emerald-950 tracking-tight leading-none mb-1">
                Kebun Glantangan
              </h1>
              <div className="flex items-center gap-2">
                <span className="h-[1px] w-4 bg-emerald-200"></span>
                <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-[0.2em] leading-none">
                  Sistem Manajemen Terpadu
                </p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase font-black text-slate-300 tracking-widest mb-1">Monitoring Status</span>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-tighter">Live Database</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* Floating Navigation Area */}
        <section className="mb-12 relative">
          <div className="flex flex-wrap items-center justify-center gap-3 p-2 bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] shadow-xl shadow-emerald-900/5 max-w-fit mx-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTabClick(t)}
                className={`group relative flex items-center gap-2.5 px-6 py-3.5 rounded-full transition-all duration-500 text-sm font-semibold overflow-hidden ${
                  tab === t.id && !t.isAction
                    ? "text-white"
                    : t.isAction 
                      ? "bg-slate-900 text-white hover:bg-emerald-600 shadow-lg shadow-slate-200" 
                      : "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/50"
                }`}
              >
                {/* Active Indicator Layer */}
                {tab === t.id && !t.isAction && (
                  <div className="absolute inset-0 bg-emerald-600 transition-all duration-300 -z-10"></div>
                )}
                
                <span className={`text-xl transition-transform duration-300 group-hover:scale-110 ${tab === t.id ? "rotate-0" : "-rotate-12"}`}>
                  {t.icon}
                </span>
                <span className="relative z-10">{t.label}</span>
                
                {t.isAction && (
                  <RiArrowRightLine className="w-4 h-4 ml-0.5 opacity-50 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Content Portal */}
        <section className="relative">
          {/* Subtle Background Accents */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] opacity-40 pointer-events-none -z-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-30 pointer-events-none -z-10"></div>

          <div className="min-h-[600px] transition-all duration-700 ease-in-out">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
              {tab === "profile" && <ProfileTab />}
              {tab === "produksi" && <ProduksiTab />}
              {tab === "peta" && <PetaTab />}
              {tab === "kontak" && <KontakTab />}
            </div>
          </div>
        </section>
      </main>

      {/* Organic Footer */}
      <footer className="border-t border-emerald-50 bg-white/50 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-xs">
                KG
              </div>
              <p className="text-sm font-medium text-slate-500">
                PT. Kebun Glantangan <span className="mx-2 text-slate-300">|</span> 
                <span className="text-slate-400 font-normal">Est. 1985</span>
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-[10px] uppercase font-black text-slate-400 hover:text-emerald-600 tracking-widest transition-colors">Privacy Policy</a>
              <a href="#" className="text-[10px] uppercase font-black text-slate-400 hover:text-emerald-600 tracking-widest transition-colors">Documentation</a>
              <a href="#" className="text-[10px] uppercase font-black text-emerald-600 tracking-widest transition-colors">v1.2.0</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100/50 text-center">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.3em]">
              © 2024 Arsitektur Digital Perkebunan. Seluruh Hak Cipta Dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
