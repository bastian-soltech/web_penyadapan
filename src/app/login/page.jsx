"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  RiMailLine, 
  RiLockPasswordLine, 
  RiLeafLine, 
  RiArrowRightLine,
  RiArrowLeftLine,
  RiErrorWarningLine
} from "react-icons/ri";
import supabase from "../lib/supabaseClient";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] flex items-center justify-center p-6 relative overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      {/* Organic Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-50 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-[120px] opacity-30"></div>
        <RiLeafLine className="absolute top-20 right-20 text-[300px] text-emerald-900/[0.02] -rotate-12" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 transition-colors mb-8 group"
        >
          <RiArrowLeftLine className="text-sm group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-[2.5rem] p-10 md:p-12 border border-slate-100 shadow-2xl shadow-emerald-900/5">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 mx-auto mb-6 transition-transform hover:scale-105 duration-300">
              <RiLeafLine className="text-3xl" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2 italic leading-none">
              Akses Sistem
            </h1>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.3em]">
              Kebun Glantangan Management
            </p>
          </div>

          {errorMsg && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <RiErrorWarningLine className="text-red-500 text-lg shrink-0" />
              <p className="text-xs font-bold text-red-700 leading-tight">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
              <div className="relative group">
                <RiMailLine className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="name@company.com" 
                  required 
                  className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border border-transparent focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Secret Password</label>
              <div className="relative group">
                <RiLockPasswordLine className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                  className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border border-transparent focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-emerald-600 hover:shadow-2xl hover:shadow-emerald-200 transition-all duration-500 group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  Masuk Ke Dashboard
                  <RiArrowRightLine className="text-lg group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-50 text-center">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em]">
              Secure Internal Portal v1.2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
