import supabaseServer from '@/app/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  const { id } = await params;
  
  try {
    const supabase = await supabaseServer();
    const body = await request.json();
    const { total_score } = body;

    // Pastikan total_score adalah angka bulat (integer)
    const scoreInt = Math.round(parseFloat(total_score));

    const { data, error } = await supabase
      .from('tabel_rekap_penilaian')
      .update({
        total_score: scoreInt 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database Error:', error);
      return NextResponse.json({ message: 'Gagal memperbarui total score', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Data score berhasil diperbarui', data });
  } catch (err) {
    console.error('Request Error:', err);
    return NextResponse.json({ message: 'Request tidak valid', error: err.message }, { status: 400 });
  }
}
