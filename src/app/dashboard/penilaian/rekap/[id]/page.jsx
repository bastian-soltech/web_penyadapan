'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PohonCard from "@/app/components/PohonCard";
import PenilaianModal from "@/app/components/PenilaianModal";
import RekapTable from "@/app/components/RekapTable";
import { FiArrowLeft, FiList, FiGrid, FiFileText } from "react-icons/fi";
import Link from "next/link";

export default function Page() {
  const { id: rekapId } = useParams();
  const [rekap, setRekap] = useState(null);
  const [form, setForm] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedPohon, setSelectedPohon] = useState(null);
  const [showRekap, setShowRekap] = useState(false);

  const labelMap = {
    luka_kayu: "Luka Kayu",
    kedalaman_sadap: "Kedalaman Sadap",
    pemakaian_kulit: "Pemakaian Kulit",
    teknik_ska: "Teknik SKA",
    irisan_sadap: "Irisan Sadap",
    sudut_sadap: "Sudut Sadap",
    pengambilan_scrap: "Pengambilan Scrap",
    peralatan_tidak_lengkap: "Peralatan Tidak Lengkap",
    kebersihan_alat: "Kebersihan Alat",
    pohon_tidak_disadap: "Pohon Tidak Disadap",
    hasil_tidak_dipungut: "Hasil Tidak Dipungut",
    talang_sadap_mampet: "Talang Sadap Mampet",
  };

  const pointOptions = {
    luka_kayu: [
      { label: "Tidak Ada (0 Poin)", value: 0 },
      { label: "Luka Kecil (3 Poin)", value: 3 },
      { label: "Luka Sedang (5 Poin)", value: 5 },
      { label: "Luka Besar (7 Poin)", value: 7 },
    ],
    kedalaman_sadap: [
      { label: "Dangkal (2 Poin)", value: 2 },
      { label: "Normatif (0 Poin)", value: 0 },
      { label: "Rapat (4 Poin)", value: 4 },
    ],
    pemakaian_kulit: [
      { label: "Boros (6 Poin)", value: 6 },
      { label: "Sangat Boros (10 Poin)", value: 10 },
    ],
    teknik_ska: [
      { label: "Tidak Pakai Tangga (3 Poin)", value: 3 },
      { label: "Tidak Pakai Pacekung (5 Poin)", value: 5 },
      { label: "Sotokan (7 Poin)", value: 7 },
    ],
    irisan_sadap: [
      { label: "IMDB (2 Poin)", value: 2 },
      { label: "IMBB (2 Poin)", value: 2 },
      { label: "ITSBD (2 Poin)", value: 2 },
      { label: "ITSBB (2 Poin)", value: 2 },
      { label: "TAS (5 Poin)", value: 5 },
      { label: "TAP (5 Poin)", value: 5 },
      { label: "TEBAL TATAL (10 Poin)", value: 10 },
    ],
    sudut_sadap: [
      { label: ">45 Derajat (3 Poin)", value: 3 },
      { label: "<35 Derajat (3 Poin)", value:  3},
      { label: "Bergelombang (2 Poin)", value: 2 },
    ],
    pengambilan_scrap: [
      { label: "Diambil (0 Poin)", value: 0 },
      { label: "Tidak diambil (2 Poin)", value: 2 },
    ],
    peralatan_tidak_lengkap: [
      { label: "Talang (2 Poin)", value: 2 },
      { label: "Mangkok (3 Poin)", value: 3},
      { label: "Talang Pancing (1 Poin)", value: 1 },
    ],
    kebersihan_alat: [
      { label: "Talang (1 Poin)", value: 1 },
      { label: "Mangkok (1 Poin)", value: 1 },
      { label: "Ember kolotan (2 Poin)", value: 2 },
    ],
    pohon_tidak_disadap: [
      { label: "Ya (10 Poin)", value: 10 },
      { label: "Tidak (0 Poin)", value: 0 },
    ],
    hasil_tidak_dipungut: [
      { label: "Ya (10 Poin)", value: 10 },
      { label: "Tidak (0 Poin)", value: 0 },
    ],
    talang_sadap_mampet: [
      { label: "Ya (1 Poin)", value: 1 },
      { label: "Tidak (0 Poin)", value: 0 },
    ],
  };

  useEffect(() => {
    async function fetchRekap() {
      try {
        const response = await fetch(`/api/get-rekap/${rekapId}`);
        const data = await response.json();
        setRekap(data);
      } catch (err) {
        console.error("Gagal fetch rekap:", err);
      }
    }
    if (rekapId) fetchRekap();
  }, [rekapId]);

  const handleOpenModal = (pohon, existingAssessment = null) => {
    setSelectedPohon(pohon);
    if (existingAssessment) {
      // Filter out metadata fields (id, created_at, etc) and only keep scores
      const initialForm = {};
      Object.keys(labelMap).forEach(key => {
        if (existingAssessment[key] !== undefined) {
          initialForm[key] = existingAssessment[key];
        }
      });
      setForm(initialForm);
    } else {
      setForm({});
    }
    setShowModal(true);
  };

  const handleSelectChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const dataToSend = {
      ...form,
      id_rekap_penilaian: rekap.id,
      id_pohon: selectedPohon.id,
    };

    const response = await fetch("/api/penilaian/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
      setShowModal(false);
      window.location.reload();
    } else {
      alert("Gagal menyimpan penilaian.");
    }
  };

  if (!rekap) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      <p className="mt-4 text-stone-500 font-medium">Memuat data penilaian...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/rekap" className="btn btn-circle btn-ghost bg-white shadow-sm border border-stone-100 text-stone-600">
            <FiArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-stone-800">Detail Penilaian</h1>
            <p className="text-stone-500 text-sm">Blok {rekap.tabel_blok.nama_blok} • {rekap.tanggal_penilaian}</p>
          </div>
        </div>

        <div className="flex gap-2">
           <button 
             className={`btn rounded-2xl normal-case h-auto py-3 min-h-0 shadow-sm border-stone-200 ${!showRekap ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-600'}`}
             onClick={() => setShowRekap(false)}
           >
             <FiGrid className="mr-2" /> Grid Pohon
           </button>
           <button 
             className={`btn rounded-2xl normal-case h-auto py-3 min-h-0 shadow-sm border-stone-200 ${showRekap ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-600'}`}
             onClick={() => setShowRekap(true)}
           >
             <FiList className="mr-2" /> Tabel Rekap
           </button>
        </div>
      </div>

      {/* Info Card Summary */}
      <div className="bg-emerald-900 rounded-3xl p-6 text-white grid grid-cols-1 sm:grid-cols-3 gap-6 shadow-xl shadow-emerald-200/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-1">Penyadap</p>
            <p className="text-xl font-bold">{rekap.tabel_penyadap?.nama_penyadap || '-'}</p>
          </div>
          <div className="relative z-10">
            <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-1">Penilai</p>
            <p className="text-xl font-bold">{rekap.profiles?.nama_penilai || '-'}</p>
          </div>
          <div className="relative z-10">
            <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-1">Total Skor</p>
            <p className="text-3xl font-black">{rekap.total_score ?? '-'}</p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Content */}
      <div className="transition-all duration-300">
        {!showRekap ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rekap.tabel_blok.tabel_pohon.map((pohon) => (
              <PohonCard
                key={pohon.id}
                pohon={pohon}
                rekapId={rekap.id}
                onPenilaian={handleOpenModal}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden p-2">
            <RekapTable rekap={rekap} labelMap={labelMap} onPenilaian={handleOpenModal} />
          </div>
        )}
      </div>

      {showModal && (
        <PenilaianModal
          labelMap={labelMap}
          pointOptions={pointOptions}
          form={form}
          selectedPohon={selectedPohon}
          onChange={handleSelectChange}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
