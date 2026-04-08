'use client'

import { useEffect, useState } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiTarget } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import FormModal from '@/app/components/FormModal'

export default function PohonPage() {
  const router = useRouter()
  const [pohonList, setPohonList] = useState([])
  const [blokList, setBlokList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({ nama_pohon: '', id_blok: '' })
  const [editMode, setEditMode] = useState(false)
  const [currentPohonId, setCurrentPohonId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pohonRes, blokRes] = await Promise.all([
          fetch('/api/pohon/all'),
          fetch('/api/get-blok/all')
        ])
        setPohonList((await pohonRes.json()).data || [])
        setBlokList((await blokRes.json()).data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(editMode ? `/api/pohon/update/${currentPohonId}` : '/api/pohon/create', {
        method: editMode ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Gagal menyimpan data')
      window.location.reload()
    } catch (error) {
      alert(error.message || 'Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
      document.getElementById('pohon-modal')?.close()
    }
  }

  const handleEdit = (pohon) => {
    setFormData({ nama_pohon: pohon.nama_pohon, id_blok: pohon.id_blok })
    setEditMode(true)
    setCurrentPohonId(pohon.id)
    document.getElementById('pohon-modal').showModal()
  }

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pohon ini?')) return
    try {
      const res = await fetch(`/api/pohon/delete/${id}`, { method: 'DELETE' })
      const result = await res.json()
      if (res.ok) setPohonList(pohonList.filter(p => p.id !== id))
    } catch (error) {
      alert('Terjadi kesalahan')
    }
  }

  const filteredPohon = pohonList.filter(pohon => 
    pohon.nama_pohon.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pohon.tabel_blok?.nama_blok || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-800 flex items-center gap-3">
            <FiTarget className="text-emerald-600" /> Manajemen Pohon
          </h1>
          <p className="text-stone-500">Inventory pohon karet berdasarkan blok perkebunan.</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              className="pl-12 pr-4 py-3 w-full bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
              placeholder="Cari nama pohon/blok..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="btn bg-emerald-600 hover:bg-emerald-700 border-none px-6 rounded-2xl normal-case h-auto py-3 min-h-0 text-white shadow-lg shadow-emerald-200"
            onClick={() => {
              setEditMode(false)
              setFormData({ nama_pohon: '', id_blok: '' })
              document.getElementById('pohon-modal').showModal()
            }}
          >
            <FiPlus className="text-lg" /> <span>Tambah Pohon</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <span className="loading loading-spinner loading-lg text-emerald-600"></span>
            <p className="mt-4 text-stone-400 font-medium">Memuat inventory pohon...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100">
                  <th className="px-6 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest w-20">No</th>
                  <th className="px-6 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest">Identitas Pohon</th>
                  <th className="px-6 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest text-center">Blok</th>
                  <th className="px-6 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest text-right w-40">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredPohon.length > 0 ? (
                  filteredPohon.map((pohon, index) => (
                    <tr key={pohon.id} className="hover:bg-stone-50/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-stone-400">{index + 1}</td>
                      <td className="px-6 py-4 font-bold text-stone-700">{pohon.nama_pohon}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                          {pohon.tabel_blok?.nama_blok || 'Tanpa Blok'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleEdit(pohon)}
                            className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(pohon.id)}
                            className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors"
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
                          🌳
                        </div>
                        <p className="text-stone-500 font-bold">Pohon tidak ditemukan</p>
                        <p className="text-stone-400 text-sm">Coba kata kunci lain atau pilih blok yang berbeda.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
    <FormModal
  id="pohon-modal"
  title={editMode ? 'Edit Pohon' : 'Tambah Pohon Baru'}
  description="Lengkapi identitas pohon dan lokasi blok produksi."
  isSubmitting={isSubmitting}
  submitLabel={editMode ? 'Simpan Perubahan' : 'Tambah Pohon'}
  onSubmit={handleSubmit}
  onClose={() => document.getElementById('pohon-modal').close()}
>
  {/* Input Nama Pohon */}
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-bold text-stone-600">Nama/Kode Pohon</span>
    </label>
    <input
      type="text"
      name="nama_pohon"
      placeholder="Contoh: P-001"
      className="input w-full bg-stone-50 border-stone-200 text-stone-900 rounded-2xl focus:ring-2 focus:ring-emerald-500 h-14"
      value={formData.nama_pohon}
      onChange={handleInputChange}
      required
    />
  </div>

  {/* Input Lokasi Blok */}
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-bold text-stone-600">Lokasi Blok</span>
    </label>
    <select
      name="id_blok"
      className="select w-full bg-stone-50 border-stone-200 text-stone-900 rounded-2xl focus:ring-2 focus:ring-emerald-500 h-14"
      value={formData.id_blok}
      onChange={handleInputChange}
      required
    >
      <option value="">Pilih Blok</option>
      {blokList.map(blok => (
        <option key={blok.id} value={blok.id}>{blok.nama_blok}</option>
      ))}
    </select>
  </div>
</FormModal>
    </div>
  )
}