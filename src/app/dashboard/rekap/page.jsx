'use client'

import FormModal from '@/app/components/FormModal'
import { useEffect, useState } from 'react'
import { FiPlus, FiCalendar, FiUser, FiMap, FiAward, FiEdit3, FiTrash2, FiExternalLink } from 'react-icons/fi'

export default function RekapPage() {
  const [blokList, setBlokList] = useState([])
  const [penyadapList, setPenyadapList] = useState([])
  const [user, setUser] = useState([])
  const [rekap, setRekap] = useState([])

  const [selectedBlok, setSelectedBlok] = useState('')
  const [selectedPenyadap, setSelectedPenyadap] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [totalScore, setTotalScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initFetch = async () => {
      setIsLoading(true)
      try {
        const [bloks, usr, penyadaps] = await Promise.all([
          fetch('/api/get-blok/all').then(res => res.json()),
          fetch('/api/auth/get-user').then(res => res.json()),
          fetch('/api/get-penyadap/all').then(res => res.json())
        ])
        setBlokList(bloks.data || [])
        setUser(usr.user || [])
        setPenyadapList(penyadaps.data || [])
        await fetchData()
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    initFetch()
  }, [])

  const fetchData = async () => {
    const res = await fetch('/api/get-rekap/all')
    const data = await res.json()
    setRekap(data.data || [])
  }

  const resetForm = () => {
    setSelectedBlok('')
    setSelectedPenyadap('')
    setTanggal('')
    setTotalScore(0)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      id_blok: selectedBlok,
      id_penyadap: selectedPenyadap,
      tanggal_penilaian: tanggal,
      total_score: parseInt(totalScore),
      id_penilai: user.id
    }
    const endpoint = editingId ? `/api/get-rekap/update/${editingId}` : '/api/get-rekap/create'
    const res = await fetch(endpoint, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const result = await res.json()
    document.getElementById('rekap_modal').close()
    fetchData()
    resetForm()
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus rekap ini?')) return
    const res = await fetch(`/api/get-rekap/delete/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const handleEdit = (rek) => {
    setEditingId(rek.id)
    setSelectedBlok(rek.id_blok)
    setSelectedPenyadap(rek.id_penyadap)
    setTanggal(rek.tanggal_penilaian)
    setTotalScore(rek.total_score)
    document.getElementById('rekap_modal').showModal()
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-800 flex items-center gap-3">
            <FiAward className="text-emerald-600" /> Rekap Penilaian
          </h1>
          <p className="text-stone-500">Daftar laporan hasil penilaian penyadapan harian.</p>
        </div>

        <button
          className="btn bg-emerald-600 hover:bg-emerald-700 border-none px-6 rounded-2xl normal-case h-auto py-3 min-h-0 text-white shadow-lg shadow-emerald-200"
          onClick={() => {
            resetForm()
            document.getElementById('rekap_modal').showModal()
          }}
        >
          <FiPlus className="text-lg" /> <span>Buat Rekap Baru</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <span className="loading loading-spinner loading-lg text-emerald-600"></span>
            <p className="mt-4 text-stone-400 font-medium">Memuat data rekap...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100">
                  <th className="px-6 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest w-16 text-center">No</th>
                  <th className="px-6 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest">Informasi Dasar</th>
                  <th className="px-6 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest text-center">Skor Total</th>
                  <th className="px-6 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {rekap.length > 0 ? (
                  rekap.map((rek, index) => (
                    <tr key={rek.id} className="hover:bg-stone-50/30 transition-colors">
                      <td className="px-6 py-4 text-center font-medium text-stone-400">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <span className="font-black text-stone-700">{rek.tabel_penyadap?.nama_penyadap || '-'}</span>
                             <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-bold uppercase tracking-wider">{rek.tabel_blok?.nama_blok || '-'}</span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-400 font-medium">
                            <span className="flex items-center gap-1"><FiCalendar className="opacity-70" /> {rek.tanggal_penilaian}</span>
                            <span className="flex items-center gap-1"><FiUser className="opacity-70" /> Penilai: {rek.profiles?.nama_penilai || '-'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl font-black shadow-sm ${
                           (rek.total_score ?? 0) > 80 ? 'bg-emerald-50 text-emerald-600' :
                           (rek.total_score ?? 0) > 60 ? 'bg-amber-50 text-amber-600' :
                           'bg-rose-50 text-rose-600'
                         }`}>
                           {rek.total_score ?? '-'}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <a
                            href={`/dashboard/penilaian/rekap/${rek.id}`}
                            className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                            title="Detail"
                          >
                            <FiExternalLink />
                          </a>
                          <button
                            onClick={() => handleEdit(rek)}
                            className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors"
                            title="Edit"
                          >
                            <FiEdit3 />
                          </button>
                          <button
                            onClick={() => handleDelete(rek.id)}
                            className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors"
                            title="Hapus"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-20">
                      <div className="max-w-xs mx-auto">
                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                          📋
                        </div>
                        <p className="text-stone-500 font-bold">Belum ada rekap penilaian</p>
                        <p className="text-stone-400 text-sm">Klik tombol "Buat Rekap Baru" untuk memulai penilaian.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
     <FormModal
  id="rekap_modal"
  title={editingId ? 'Edit Rekap' : 'Buat Rekap Baru'}
  description="Masukkan detail penilaian untuk sesi ini agar laporan dapat diarsip."
  submitLabel="Simpan Laporan"
  onSubmit={handleSubmit}
  onClose={() => {
    resetForm();
    document.getElementById('rekap_modal').close();
  }}
>
  {/* Baris 1: Blok dan Penyadap */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="form-control">
      <label className="label">
        <span className="label-text font-bold text-stone-600">Pilih Blok</span>
      </label>
      <select
        className="select w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-2xl focus:ring-2 focus:ring-emerald-500 h-14"
        value={selectedBlok}
        onChange={(e) => setSelectedBlok(e.target.value)}
        required
      >
        <option value="">Pilih Blok</option>
        {blokList.map((blok) => (
          <option key={blok.id} value={blok.id}>{blok.nama_blok}</option>
        ))}
      </select>
    </div>

    <div className="form-control">
      <label className="label">
        <span className="label-text font-bold text-stone-600">Penyadap</span>
      </label>
      <select
        className="select w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-2xl focus:ring-2 focus:ring-emerald-500 h-14"
        value={selectedPenyadap}
        onChange={(e) => setSelectedPenyadap(e.target.value)}
        required
      >
        <option value="">Pilih Penyadap</option>
        {penyadapList.map((p) => (
          <option key={p.id} value={p.id}>{p.nama_penyadap}</option>
        ))}
      </select>
    </div>
  </div>

  {/* Baris 2: Tanggal dan Skor */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="form-control">
      <label className="label">
        <span className="label-text font-bold text-stone-600">Tanggal</span>
      </label>
      <input
        type="date"
        className="input w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-2xl focus:ring-2 focus:ring-emerald-500 h-14 px-4"
        value={tanggal}
        onChange={(e) => setTanggal(e.target.value)}
        required
      />
    </div>

    <div className="form-control">
      <label className="label">
        <span className="label-text font-bold text-stone-600">Skor Awal</span>
      </label>
      <input
        type="number"
        placeholder="0"
        className="input w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-2xl focus:ring-2 focus:ring-emerald-500 h-14 px-4 font-bold"
        value={totalScore}
        onChange={(e) => setTotalScore(e.target.value)}
        required
      />
    </div>
  </div>
</FormModal>
    </div>
  )
}
