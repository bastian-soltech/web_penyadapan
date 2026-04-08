'use client'

import { useEffect, useState } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiLayers } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import FormModal from '@/app/components/FormModal'

export default function BlokPage() {
  const router = useRouter()
  const [blokList, setBlokList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({ nama_blok: '' })
  const [editMode, setEditMode] = useState(false)
  const [currentBlokId, setCurrentBlokId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/get-blok/all')
        if (!res.ok) throw new Error('Failed to fetch data')
        const data = await res.json()
        setBlokList(data?.data || [])
      } catch (error) {
        console.error('Fetch error:', error)
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
      const endpoint = editMode
        ? `/api/get-blok/update/${currentBlokId}`
        : '/api/get-blok/create'

      const method = editMode ? 'PATCH' : 'POST'

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.message || 'Gagal menyimpan data')

      // Refresh data
      const refreshRes = await fetch('/api/get-blok/all')
      const refreshData = await refreshRes.json()
      setBlokList(refreshData?.data || [])

      setFormData({ nama_blok: '' })
      setEditMode(false)
      setCurrentBlokId(null)
      document.getElementById('blok-modal')?.close()
    } catch (error) {
      alert(error.message || 'Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (blok) => {
    if (!blok) return
    setFormData({ nama_blok: blok.nama_blok || '' })
    setEditMode(true)
    setCurrentBlokId(blok.id)
    document.getElementById('blok-modal')?.showModal()
  }

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus blok ini?')) return
    try {
      const res = await fetch(`/api/get-blok/delete/${id}`, { method: 'DELETE' })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Gagal menghapus data')
      setBlokList(prev => prev.filter(b => b.id !== id))
    } catch (error) {
      alert(error.message || 'Terjadi kesalahan')
    }
  }

  const filteredBlokList = blokList.filter(blok => 
    (blok.nama_blok?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-800 flex items-center gap-3">
            <FiLayers className="text-emerald-600" /> Manajemen Blok
          </h1>
          <p className="text-stone-500">Kelola pembagian area atau blok perkebunan.</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              className="pl-12 pr-4 py-3 w-full bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
              placeholder="Cari blok..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 border-none px-6 rounded-2xl normal-case h-auto py-3 min-h-0 text-white shadow-lg shadow-emerald-200"
            onClick={() => {
              setEditMode(false)
              setFormData({ nama_blok: '' })
              document.getElementById('blok-modal')?.showModal()
            }}
          >
            <FiPlus className="text-lg" /> <span>Tambah Blok</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <span className="loading loading-spinner loading-lg text-emerald-600"></span>
            <p className="mt-4 text-stone-400 font-medium">Memuat data blok...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100">
                  <th className="px-6 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest w-20">No</th>
                  <th className="px-6 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest">Nama Blok</th>
                  <th className="px-6 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest text-right w-40">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredBlokList.length > 0 ? (
                  filteredBlokList.map((blok, index) => (
                    <tr key={blok.id} className="hover:bg-stone-50/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-stone-400">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-stone-700">{blok.nama_blok}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(blok)}
                            className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(blok.id)}
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
                    <td colSpan="3" className="text-center py-20">
                      <div className="max-w-xs mx-auto">
                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                          🔍
                        </div>
                        <p className="text-stone-500 font-bold">Tidak ada data ditemukan</p>
                        <p className="text-stone-400 text-sm">Coba cari dengan kata kunci lain atau tambah data baru.</p>
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
  id="blok-modal"
  title={editMode ? 'Edit Blok' : 'Blok Baru'}
  description="Masukkan detail informasi blok produksi di bawah ini."
  isSubmitting={isSubmitting}
  submitLabel={editMode ? 'Simpan Perubahan' : 'Tambah Blok'}
  onSubmit={handleSubmit}
  onClose={() => document.getElementById('blok-modal').close()}
>
  {/* Input Khusus Nama Blok */}
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-bold text-stone-600">Nama Blok</span>
    </label>
    <input
      type="text"
      name="nama_blok"
      placeholder="Contoh: Blok A1"
      className="input w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all h-14 px-4"
      value={formData.nama_blok}
      onChange={handleInputChange}
      required
      disabled={isSubmitting}
    />
  </div>
</FormModal>
    </div>
  )
}