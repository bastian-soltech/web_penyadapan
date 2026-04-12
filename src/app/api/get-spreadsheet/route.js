// /app/api/sheet/route.js

import { NextResponse } from 'next/server'
import supabaseServer from '@/app/lib/supabaseServer'

export async function GET() {
  const supabase = await supabaseServer()

  // Ambil Spreadsheet ID dari database
  const { data: settingData, error: settingError } = await supabase
    .from('tabel_pengaturan')
    .select('nilai')
    .eq('kunci', 'spreadsheet_id')
    .single()

  if (settingError || !settingData?.nilai) {
    console.error('Database Fetch Error:', settingError);
    return NextResponse.json({ status: 'error', message: 'Spreadsheet ID not found in settings' }, { status: 404 });
  }

  const spreadsheetId = settingData.nilai;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Rank!A:Z/?key=AIzaSyDMAggxPK5ju16Ni_WVsRUk1uQpSMsNo2Y`

  try {    const res = await fetch(url)
    const data = await res.json()

    const rows = data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'No data found in this spreadsheet.' });
    }

    // --- LOGIKA SMART CLEANING ---
    const findRowIndex = (keyword) => rows.findIndex(row => row.some(cell => cell?.toString().includes(keyword)));
    
    const idxHariIni = findRowIndex("1. HARI INI");
    const idxBulanIni = findRowIndex("2. BULAN INI");
    const idxSdHariIni = findRowIndex("3. SD HARI INI");

    const parseTable = (startIndex) => {
      if (startIndex === -1) return [];
      return rows.slice(startIndex + 2, startIndex + 10) 
        .map(row => {
          const no = row[0]?.trim();
          if (!no || isNaN(parseInt(no))) return null;
          return {
            no,
            afdeling: row[1]?.trim(),
            luas: row[2]?.trim(),
            target: row[4]?.trim(),
            realisasi: row[5]?.trim(),
            persen: row[6]?.trim(),
            selisih: row[7]?.trim(),
            rangking: row[8]?.trim()
          };
        }).filter(Boolean);
    };

    const findTotal = (startIndex) => {
      if (startIndex === -1) return null;
      const tableRows = rows.slice(startIndex, startIndex + 15);
      const totalRow = tableRows.find(row => row.some(cell => cell?.toString().includes("JUMLAH")));
      if (!totalRow) return null;
      return {
        afdeling: "TOTAL",
        target: totalRow[4]?.trim(),
        realisasi: totalRow[5]?.trim(),
        persen: totalRow[6]?.trim()
      };
    };

    const cleanedData = {
      tanggal: rows[2]?.[4] || 'Update Terbaru',
      hari_ini: parseTable(idxHariIni),
      bulan_ini: parseTable(idxBulanIni),
      sd_hari_ini: parseTable(idxSdHariIni),
      total: {
        hari_ini: findTotal(idxHariIni),
        bulan_ini: findTotal(idxBulanIni),
        sd_hari_ini: findTotal(idxSdHariIni),
      }
    };

    return NextResponse.json(cleanedData);
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
