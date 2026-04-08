'use client';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FiEdit3, FiDownload } from "react-icons/fi";

export default function RekapTable({ rekap, labelMap, onPenilaian }) {
  
  // Fungsi utilitas
  const hitungTotal = (penilaian) => {
    return penilaian
      ? Object.keys(labelMap).reduce((sum, key) => sum + (parseFloat(penilaian[key]) || 0), 0)
      : 0;
  };

  const tentukanKelas = (nilai) => {
    if (nilai < 15) return 'A';
    if (nilai <= 25) return 'B';
    return 'C';
  };

  const calculateAverage = () => {
    const scores = rekap.tabel_blok.tabel_pohon
      .map(p => hitungTotal(p.tabel_penilaian?.find(pn => pn.id_rekap_penilaian === rekap.id)))
      .filter(score => score > 0);

    return scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : "0";
  };

  // Fungsi ekspor
  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4'
    });

    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const tableWidth = pageWidth - 2 * margin;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('REKAP PENILAIAN POHON', margin, margin);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Blok: ${rekap.tabel_blok?.nama_blok || '-'}`, margin, margin + 20);
    doc.text(`Nama Penilai: ${rekap.profiles?.nama_penilai || '-'}`, margin, margin + 35);
    doc.text(`Nama Penyadap: ${rekap.tabel_penyadap?.nama_penyadap || '-'}`, margin, margin + 50);
    doc.text(`Tanggal: ${rekap.tanggal_penilaian}`, margin, margin + 65);

    const head = [["No", "Nama Pohon", ...Object.values(labelMap), "Total", "Kelas"]];
    const body = rekap.tabel_blok.tabel_pohon.map((pohon, index) => {
      const penilaian = pohon.tabel_penilaian?.find(p => p.id_rekap_penilaian === rekap.id);
      const nilaiList = Object.keys(labelMap).map(key => penilaian?.[key] ?? "-");
      const total = hitungTotal(penilaian);
      const kelas = total === 0 ? "-" : tentukanKelas(total);
      return [(index + 1).toString(), pohon.nama_pohon, ...nilaiList, total.toString(), kelas];
    });

    autoTable(doc, {
      startY: margin + 85,
      head,
      body,
      theme: 'grid',
      headStyles: { fillColor: [5, 150, 105], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 7 },
      margin: { left: margin, right: margin },
    });

    doc.save(`rekap-penilaian-${rekap.tabel_blok?.nama_blok}-${rekap.tanggal_penilaian}.pdf`);
  };

  const exportToExcel = () => {
    const wsData = [
      ['REKAP PENILAIAN POHON'],
      [`Blok: ${rekap.tabel_blok?.nama_blok || '-'}`],
      [`Nama Penilai: ${rekap.profiles?.nama_penilai || '-'}`],
      [`Nama Penyadap: ${rekap.tabel_penyadap?.nama_penyadap || '-'}`],
      [`Tanggal: ${rekap.tanggal_penilaian}`],
      [],
      ["No", "Nama Pohon", ...Object.values(labelMap), "Total", "Kelas"]
    ];

    rekap.tabel_blok.tabel_pohon.forEach((pohon, index) => {
      const penilaian = pohon.tabel_penilaian?.find(p => p.id_rekap_penilaian === rekap.id);
      const nilaiList = Object.keys(labelMap).map(key => penilaian?.[key] ?? "-");
      const total = hitungTotal(penilaian);
      const kelas = total === 0 ? "-" : tentukanKelas(total);
      wsData.push([index + 1, pohon.nama_pohon, ...nilaiList, total, kelas]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Rekap");
    XLSX.writeFile(wb, `rekap-${rekap.tabel_blok?.nama_blok}-${rekap.tanggal_penilaian}.xlsx`);
  };

  const updateScore = async () => {
    const avg = calculateAverage();
    const total_score = Math.round(parseFloat(avg)); 

    const response = await fetch(`/api/get-rekap/update-score/${rekap.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total_score })
    });

    if (response.ok) {
      alert('Total score berhasil disinkronkan!');
      window.location.reload();
    } else {
      const errorData = await response.json();
      alert(`Gagal memperbarui total score: ${errorData.message || 'Error tidak diketahui'}`);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 items-center justify-between bg-stone-50 p-6 rounded-2xl border border-stone-100">
        <div className="flex gap-2">
          <button onClick={exportToPDF} className="btn btn-sm bg-rose-600 hover:bg-rose-700 text-white border-none rounded-xl gap-2 px-4">
            <FiDownload /> PDF
          </button>
          <button onClick={exportToExcel} className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-xl gap-2 px-4">
            <FiDownload /> Excel
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Rata-rata Skor</p>
            <p className="text-2xl font-black text-emerald-700">{calculateAverage()}</p>
          </div>
          <button onClick={updateScore} className="btn bg-white hover:bg-stone-100 text-stone-700 border-stone-200 rounded-xl shadow-sm">
            Sinkronkan Skor ke Rekap
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-stone-100 rounded-2xl">
        <table className="table w-full">
          <thead>
            <tr className="bg-stone-50/50">
              <th className="text-[10px] font-bold uppercase text-stone-400">No</th>
              <th className="text-[10px] font-bold uppercase text-stone-400">Pohon</th>
              {Object.keys(labelMap).map(key => (
                <th key={key} className="text-[10px] font-bold uppercase text-stone-400 text-center">{labelMap[key]}</th>
              ))}
              <th className="text-[10px] font-bold uppercase text-stone-400 text-center">Total</th>
              <th className="text-[10px] font-bold uppercase text-stone-400 text-center">Kelas</th>
              <th className="text-[10px] font-bold uppercase text-stone-400 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {rekap.tabel_blok.tabel_pohon.map((pohon, index) => {
              const penilaian = pohon.tabel_penilaian?.find(p => p.id_rekap_penilaian === rekap.id);
              const total = hitungTotal(penilaian);
              const kelas = total === 0 ? "-" : tentukanKelas(total);

              return (
                <tr key={pohon.id} className="hover:bg-stone-50/30 transition-colors">
                  <td className="font-medium text-stone-400">{index + 1}</td>
                  <td className="font-bold text-stone-700">{pohon.nama_pohon}</td>
                  {Object.keys(labelMap).map(field => (
                    <td key={field} className="text-center text-stone-500">{penilaian?.[field] ?? "-"}</td>
                  ))}
                  <td className="text-center font-black text-stone-800">{total}</td>
                  <td className="text-center">
                    <span className={`badge border-none font-bold text-[10px] ${
                      kelas === 'A' ? 'bg-emerald-100 text-emerald-700' :
                      kelas === 'B' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {kelas}
                    </span>
                  </td>
                  <td className="text-right">
                    <button 
                      onClick={() => onPenilaian(pohon, penilaian)}
                      className="btn btn-ghost btn-sm text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    >
                      <FiEdit3 />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-stone-50/50">
            <tr>
              <td colSpan={Object.keys(labelMap).length + 2} className="text-right font-bold text-stone-500">Rata-rata Skor Keseluruhan:</td>
              <td className="text-center font-black text-emerald-700 text-lg">{calculateAverage()}</td>
              <td className="text-center">
                 <span className={`badge border-none font-bold ${
                  tentukanKelas(Number(calculateAverage())) === 'A' ? 'bg-emerald-100 text-emerald-700' :
                  tentukanKelas(Number(calculateAverage())) === 'B' ? 'bg-amber-100 text-amber-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                  {tentukanKelas(Number(calculateAverage()))}
                </span>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
