'use client';

import React from 'react';

/**
 * Komponen Modal Universal
 * @param {String} id - ID untuk dialog element
 * @param {String} title - Judul modal
 * @param {String} description - Deskripsi singkat di bawah judul
 * @param {Boolean} isOpen - State untuk kontrol buka/tutup (opsional jika pakai ID)
 * @param {Boolean} isSubmitting - State loading saat submit
 * @param {String} submitLabel - Teks tombol submit (default: Simpan)
 * @param {Function} onSubmit - Handler saat form disubmit
 * @param {Function} onClose - Handler saat tombol batal/close diklik
 * @param {ReactNode} children - Isi form (input-input)
 */
export default function FormModal({ 
  id, 
  title, 
  description, 
  isSubmitting, 
  submitLabel = 'Simpan', 
  onSubmit, 
  onClose, 
  children 
}) {
  return (
    <dialog id={id} className="modal backdrop-blur-sm">
      <div className="modal-box rounded-3xl p-8 max-w-md shadow-2xl border border-stone-100 bg-white">
        
        {/* Header Section */}
        <div className="mb-8">
          <h3 className="font-black text-2xl text-stone-800 tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-stone-500 mt-1 text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Form Section */}
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-4">
            {children}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              className="btn flex-1 h-14 rounded-2xl bg-stone-100 border-none hover:bg-stone-200 text-stone-600 font-bold normal-case transition-all"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn flex-1 h-14 rounded-2xl bg-emerald-600 border-none hover:bg-emerald-700 text-white font-bold normal-case shadow-lg shadow-emerald-200/50 disabled:bg-stone-300 transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop: Klik luar untuk tutup */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}