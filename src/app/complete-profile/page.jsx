'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Page(){
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal memperbarui profil');
      }

      console.log('Success:', data);
      // Redirect ke dashboard setelah sukses
      router.push('/dashboard');

    } catch (error) {
      console.error('Error saat submit:', error.message);
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-stone-50 p-4">
      <div className="card w-full max-w-md bg-white shadow-xl border border-stone-100 rounded-3xl">
        <div className="card-body p-8 sm:p-10">
          <div className="text-center space-y-2 mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🌿
            </div>
            <h2 className="text-3xl font-black text-emerald-900 leading-tight">Lengkapi Profil</h2>
            <p className="text-stone-500 text-sm">Silakan atur identitas penilai Anda di Kebun Glantangan.</p>
          </div>

          {errorMsg && (
            <div className="alert alert-error rounded-2xl mb-6 text-sm py-3 px-4">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-stone-600">Nama Penilai</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  required
                  className="input bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 w-full pl-12 h-14 transition-all"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="Masukkan Nama Lengkap"
                  minLength="3"
                  maxLength="50"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-stone-600">Password Baru (Opsional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 w-full pl-12 h-14 transition-all"
                  placeholder="Kosongkan jika tetap"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-emerald-600 bg-emerald-600 hover:bg-emerald-700 border-none text-white btn-block h-14 rounded-2xl shadow-lg shadow-emerald-200 mt-4 transition-all normal-case font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Simpan Profil"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}