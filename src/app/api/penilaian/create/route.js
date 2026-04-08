import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      id_rekap_penilaian,
      id_pohon,
      ...scores
    } = body;

    // 1. Upsert detailed assessment (tabel_penilaian)
    // Check if it already exists
    const { data: existingPenilaian } = await supabase
      .from('tabel_penilaian')
      .select('id')
      .eq('id_rekap_penilaian', id_rekap_penilaian)
      .eq('id_pohon', id_pohon)
      .single();

    let penilaianError;
    if (existingPenilaian) {
      const { error } = await supabase
        .from('tabel_penilaian')
        .update(scores)
        .eq('id', existingPenilaian.id);
      penilaianError = error;
    } else {
      const { error } = await supabase
        .from('tabel_penilaian')
        .insert([{ id_rekap_penilaian, id_pohon, ...scores }]);
      penilaianError = error;
    }

    if (penilaianError) {
      console.error('Error upserting assessment:', penilaianError);
      return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 });
    }

    // 2. Recalculate total_score (average) for tabel_rekap_penilaian
    const { data: allAssessments, error: fetchError } = await supabase
      .from('tabel_penilaian')
      .select('luka_kayu, kedalaman_sadap, pemakaian_kulit, teknik_ska, irisan_sadap, sudut_sadap, peralatan_tidak_lengkap, kebersihan_alat, pohon_tidak_disadap, hasil_tidak_dipungut, talang_sadap_mampet')
      .eq('id_rekap_penilaian', id_rekap_penilaian);

    if (fetchError) {
      console.error('Error fetching assessments for recalculation:', fetchError);
    } else if (allAssessments && allAssessments.length > 0) {
      // Calculate sum for each assessment, then average of all assessments
      const totalSums = allAssessments.map(p => 
        Object.values(p).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
      );
      
      const averageScore = totalSums.reduce((a, b) => a + b, 0) / totalSums.length;

      // Update tabel_rekap_penilaian
      await supabase
        .from('tabel_rekap_penilaian')
        .update({ total_score: Math.round(averageScore) })
        .eq('id', id_rekap_penilaian);
    }

    return NextResponse.json({ message: 'Penilaian berhasil disimpan', status: 200 });
  } catch (error) {
    console.error('Error in POST /api/penilaian/create:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}