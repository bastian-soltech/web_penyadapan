'use client'

import { useEffect, useState } from 'react'
import ImportExcelModal from '@/app/components/ImportExcelModal'
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiUsers, FiFilePlus } from 'react-icons/fi'
import FormModal from '@/app/components/FormModal'

export default function PenyadapPage() {
  const [penyadapList, setPenyadapList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({ nama_penyadap: '' })
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/get-penyadap/all')
        if (!res.ok) throw new Error('Gagal mengambil data')
        const data = await res.json()
        setPenyadapList(data?.data || [])
      } catch (err) {
        console.error(err)
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
        ? `/api/get-penyadap/update/${currentId}`
        : '/api/get-penyadap/create'

      const method = editMode ? 'PATCH' : 'POST'

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message)

      // Refresh data
      const refresh = await fetch('/api/get-penyadap/all')
      const refreshData = await refresh.json()
      setPenyadapList(refreshData?.data || [])

      setFormData({ nama_penyadap: '' })
      setEditMode(false)
      setCurrentId(null)
      document.getElementById('penyadap-modal')?.close()
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (penyadap) => {
    setFormData({ nama_penyadap: penyadap.nama_penyadap || '' })
    setEditMode(true)
    setCurrentId(penyadap.id)
    document.getElementById('penyadap-modal')?.showModal()
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus penyadap ini?')) return
    try {
      const res = await fetch(`/api/get-penyadap/delete/${id}`, { method: 'DELETE' })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message)
      setPenyadapList(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan saat menghapus')
    }
  }

  const filteredList = penyadapList.filter(p =>
    (p.nama_penyadap?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-800 flex items-center gap-3">
            <FiUsers className="text-emerald-600" /> Manajemen Penyadap
          </h1>
          <p className="text-stone-500">Kelola data tenaga kerja penyadap pohon.</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              className="pl-12 pr-4 py-3 w-full bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
              placeholder="Cari penyadap..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
             <ImportExcelModal />
             <button
                className="btn bg-emerald-600 hover:bg-emerald-700 border-none px-6 rounded-2xl normal-case h-auto py-3 min-h-0 text-white shadow-lg shadow-emerald-200"
                onClick={() => {
                  setEditMode(false)
                  setFormData({ nama_penyadap: '' })
                  document.getElementById('penyadap-modal')?.showModal()
                }}
                disabled={isLoading}
              >
                <FiPlus className="text-lg" /> <span>Tambah</span>
              </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <span className="loading loading-spinner loading-lg text-emerald-600"></span>
            <p className="mt-4 text-stone-400 font-medium">Memuat data penyadap...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100">
                  <th className="px-6 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest w-20">No</th>
                  <th className="px-6 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest">Nama Penyadap</th>
                  <th className="px-6 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest text-right w-40">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredList.length > 0 ? (
                  filteredList.map((p, index) => (
                    <tr key={p.id} className="hover:bg-stone-50/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-stone-400">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs uppercase">
                              {p.nama_penyadap?.charAt(0)}
                           </div>
                           <div className="font-bold text-stone-700">{p.nama_penyadap}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(p)}
                            className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
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
                          👤
                        </div>
                        <p className="text-stone-500 font-bold">Tidak ada data ditemukan</p>
                        <p className="text-stone-400 text-sm">Belum ada data penyadap atau kata kunci tidak cocok.</p>
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
  id="penyadap-modal"
  title={editMode ? 'Edit Penyadap' : 'Penyadap Baru'}
  description="Masukkan nama lengkap tenaga penyadap untuk pendataan."
  isSubmitting={isSubmitting}
  submitLabel={editMode ? 'Simpan Perubahan' : 'Tambah Penyadap'}
  onSubmit={handleSubmit}
  onClose={() => document.getElementById('penyadap-modal').close()}
>
  {/* Input Khusus Penyadap */}
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-bold text-stone-600">Nama Lengkap</span>
    </label>
    <div className="relative">
      <input
        type="text"
        name="nama_penyadap"
        placeholder="Contoh: Budi Santoso"
        className="input w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all h-14 px-4"
        value={formData.nama_penyadap}
        onChange={handleInputChange}
        required
        disabled={isSubmitting}
      />
    </div>
  </div>
</FormModal>
    </div>
  )
}
