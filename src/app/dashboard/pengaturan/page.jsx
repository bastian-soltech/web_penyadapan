'use client';

import { useState, useEffect } from 'react';
import { 
  HiOutlineExternalLink, 
  HiOutlineSave, 
  HiOutlineCheckCircle, 
  HiOutlineInformationCircle,
  HiOutlineLink,
  HiOutlineRefresh
} from "react-icons/hi";
import { RiGoogleFill } from "react-icons/ri";

export default function PengaturanPage() {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.nilai) {
        setSpreadsheetId(data.nilai);
        setLastUpdated(data.updated_at);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheet_id: spreadsheetId })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Konfigurasi spreadsheet berhasil diperbarui' });
        setSpreadsheetId(data.data[0].nilai);
        setLastUpdated(data.data[0].updated_at);
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal memperbarui konfigurasi' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan sistem' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
              System Configuration
            </span>
          </div>
          <h1 className="text-4xl font-black text-stone-800 tracking-tight">Integrasi Data</h1>
          <p className="text-stone-500 mt-2 font-medium">Hubungkan dashboard dengan sumber data Google Sheets Anda secara real-time.</p>
        </div>
        
        {lastUpdated && (
          <div className="text-right">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Pembaruan Terakhir</p>
            <p className="text-xs font-bold text-stone-600">{new Date(lastUpdated).toLocaleString('id-ID')}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Connection Status Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm relative overflow-hidden group">
            <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-3xl text-emerald-600 shadow-inner">
                        <RiGoogleFill />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-stone-800">Status Koneksi</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Terhubung ke Google API</span>
                        </div>
                    </div>
                </div>
                <button 
                  onClick={fetchSettings}
                  className="w-10 h-10 rounded-xl bg-stone-50 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-all border border-stone-100"
                >
                  <HiOutlineRefresh className={`text-xl ${updating ? 'animate-spin' : ''}`} />
                </button>
            </div>
            
            <div className="absolute -right-8 -bottom-8 text-stone-50 text-9xl font-black opacity-50 select-none pointer-events-none">
                LIVE
            </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
            <h3 className="font-bold text-lg text-stone-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 text-lg">
                <HiOutlineLink />
              </div>
              Sumber Data Spreadsheet
            </h3>
            <a 
              href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`} 
              target="_blank" 
              className="text-emerald-600 hover:text-emerald-700 text-xs font-bold flex items-center gap-1 transition-colors"
            >
              Buka Spreadsheet <HiOutlineExternalLink />
            </a>
          </div>
          
          <form onSubmit={handleUpdate} className="p-8 space-y-8">
            {message.text && (
              <div className={`alert ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'} rounded-2xl flex items-center gap-3 border`}>
                {message.type === 'success' ? <HiOutlineCheckCircle className="text-2xl" /> : <HiOutlineRefresh className="text-2xl animate-spin" />}
                <span className="font-bold text-sm">{message.text}</span>
              </div>
            )}

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-black text-stone-600 uppercase tracking-widest ml-1">Spreadsheet Link / ID</span>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <HiOutlineLink className="text-stone-400 text-xl" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Tempel link spreadsheet di sini..." 
                    className="w-full bg-stone-50 border-2 border-stone-100 text-stone-900 rounded-3xl py-5 pl-14 pr-6 focus:border-emerald-500 focus:ring-0 transition-all font-bold text-lg shadow-inner"
                    value={spreadsheetId}
                    onChange={(e) => setSpreadsheetId(e.target.value)}
                    required
                  />
                </div>
              </label>

              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex gap-4">
                <HiOutlineInformationCircle className="text-2xl text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-amber-900">Petunjuk Penting:</p>
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    Sistem akan secara otomatis mengekstrak ID dari link yang Anda tempel. Pastikan spreadsheet memiliki sheet bernama <span className="font-black italic text-amber-900">"Rank"</span> dan telah dibagikan (Share) dengan akses <span className="font-black italic text-amber-900">"Anyone with the link can view"</span> agar API dapat membacanya.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                className={`group btn bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-12 h-16 border-none shadow-xl shadow-emerald-600/20 font-black tracking-widest transition-all ${updating ? 'loading' : ''}`}
                disabled={updating}
              >
                {!updating && <HiOutlineSave className="text-2xl mr-3 group-hover:scale-110 transition-transform" />}
                {updating ? 'MEMPROSES...' : 'PERBARUI KONEKSI'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
