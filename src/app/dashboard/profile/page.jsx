'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineLogout,
  HiOutlineSave,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineUserAdd
} from "react-icons/hi";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [inviteEmail, setInviteEmail] = useState('');
  
  const [profile, setProfile] = useState({
    nama_penilai: '',
    email: ''
  });
  
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/get-user');
      const data = await res.json();
      
      if (data.user) {
        setProfile({
          nama_penilai: data.profile?.nama_penilai || '',
          email: data.user.email || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: '', text: '' });

    if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok' });
      setUpdating(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profile.nama_penilai,
          password: passwords.newPassword || undefined
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profil berhasil diperbarui' });
        setPasswords({ newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal memperbarui profil' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan sistem' });
    } finally {
      setUpdating(false);
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    setInviting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/auth/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: `Undangan terkirim ke ${inviteEmail}` });
        setInviteEmail('');
        document.getElementById('invite_modal').close();
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal mengirim undangan' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan sistem' });
    } finally {
      setInviting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-emerald-900 tracking-tight">Pengaturan Profil</h1>
          <p className="text-stone-500 mt-1 font-medium">Kelola informasi akun dan keamanan Anda</p>
        </div>
        <button 
          onClick={handleLogout}
          className="btn btn-ghost text-red-600 hover:bg-red-50 gap-2 font-bold"
        >
          <HiOutlineLogout className="text-xl" />
          Keluar Sesi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm flex flex-col items-center text-center">
            <div className="avatar placeholder mb-6">
              <div className="bg-emerald-100 text-emerald-700 rounded-full w-24 h-24 text-4xl font-black ring-8 ring-emerald-50">
                <span>{profile.nama_penilai?.[0]?.toUpperCase() || 'A'}</span>
              </div>
            </div>
            <h2 className="text-xl font-black text-stone-800 truncate w-full">
              {profile.nama_penilai || 'Administrator'}
            </h2>
            <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mt-1">
              Petugas Penilai
            </p>
            
            <div className="divider my-6 opacity-50"></div>
            
            <div className="w-full space-y-4 text-left">
              <div className="flex items-center gap-3 text-stone-600 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                <HiOutlineMail className="text-xl text-emerald-600" />
                <span className="text-sm font-medium truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-stone-600 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                <HiOutlineUser className="text-xl text-emerald-600" />
                <span className="text-sm font-medium truncate">{profile.nama_penilai || '-'}</span>
              </div>
            </div>
          </div>

         
          {/* Invite User Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-stone-800 flex items-center gap-2">
              <HiOutlineUserAdd className="text-emerald-600 text-xl" />
              Undang Penilai
            </h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Tambahkan anggota tim baru untuk membantu proses penilaian di lapangan.
            </p>
            <button 
              onClick={() => document.getElementById('invite_modal').showModal()}
              className="btn btn-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white btn-block rounded-2xl border-none shadow-md shadow-emerald-100 font-bold"
            >
              Kirim Undangan Email
            </button>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpdateProfile} className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-stone-100 bg-stone-50/50">
              <h3 className="font-bold text-lg text-stone-800 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 text-lg">
                  <HiOutlineUser />
                </div>
                Informasi Dasar
              </h3>
            </div>
            
            <div className="p-8 space-y-6">
              {message.text && (
                <div className={`alert ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'} rounded-2xl flex items-center gap-3`}>
                  {message.type === 'success' ? <HiOutlineCheckCircle className="text-2xl" /> : <HiOutlineXCircle className="text-2xl" />}
                  <span className="font-bold text-sm">{message.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-stone-600">Nama Lengkap</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiOutlineUser className="text-stone-400 text-lg" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Masukkan nama lengkap" 
                      className="input text-stone-900 input-bordered w-full pl-11 rounded-2xl bg-stone-50 border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                      value={profile.nama_penilai}
                      onChange={(e) => setProfile({...profile, nama_penilai: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-stone-600">Email (Read-only)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiOutlineMail className="text-stone-400 text-lg" />
                    </div>
                    <input 
                      type="email" 
                      value={profile.email}
                      className="input input-bordered w-full pl-11 rounded-2xl bg-stone-100 border-stone-200 cursor-not-allowed font-medium text-stone-500"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="divider my-4"></div>

              <h3 className="font-bold text-lg text-stone-800 flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 text-lg">
                  <HiOutlineLockClosed />
                </div>
                Keamanan Akun
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-stone-600">Password Baru</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiOutlineLockClosed className="text-stone-400 text-lg" />
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="input text-stone-900 input-bordered w-full pl-11 rounded-2xl bg-stone-50 border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    />
                  </div>
                  <label className="label">
                    <span className="label-text-alt text-stone-400 italic">Kosongkan jika tidak ingin mengubah password</span>
                  </label>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-stone-600">Konfirmasi Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiOutlineLockClosed className="text-stone-400 text-lg" />
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="input text-stone-900 input-bordered w-full pl-11 rounded-2xl bg-stone-50 border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-stone-50 border-t border-stone-100 flex justify-end">
              <button 
                type="submit" 
                className={`btn bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-10 border-none shadow-lg shadow-emerald-600/20 font-black tracking-wide ${updating ? 'loading' : ''}`}
                disabled={updating}
              >
                {!updating && <HiOutlineSave className="text-xl mr-2" />}
                {updating ? 'Menyimpan...' : 'SIMPAN PERUBAHAN'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Invite Modal */}
      <dialog id="invite_modal" className="modal backdrop-blur-sm">
        <div className="modal-box bg-white rounded-3xl p-8 max-w-md shadow-2xl border border-stone-100">
          <h3 className="font-black text-2xl text-stone-800 mb-2">Undang Tim</h3>
          <p className="text-stone-500 mb-8 text-sm">
            Masukkan email rekan yang ingin Anda undang sebagai penilai.
          </p>

          <form onSubmit={handleInviteUser} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-stone-600">Alamat Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineMail className="text-stone-400 text-lg" />
                </div>
                <input 
                  type="email" 
                  placeholder="email@perusahaan.com" 
                  className="input text-stone-900 input-bordered w-full pl-11 rounded-2xl bg-stone-50 border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                className="btn flex-1 h-14 rounded-2xl bg-stone-100 border-none hover:bg-stone-200 text-stone-600 normal-case"
                onClick={() => document.getElementById('invite_modal').close()}
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="btn flex-1 h-14 rounded-2xl bg-emerald-600 border-none hover:bg-emerald-700 text-white normal-case shadow-lg shadow-emerald-100"
                disabled={inviting}
              >
                {inviting ? <span className="loading loading-spinner"></span> : 'Kirim Link'}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
