import { NextResponse } from 'next/server'
import supabaseServer from '@/app/lib/supabaseServer'

export async function GET() {
  const supabase = await supabaseServer()
  const { data, error } = await supabase
    .from('tabel_pengaturan')
    .select('*')
    .eq('kunci', 'spreadsheet_id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req) {
  const { spreadsheet_id } = await req.json()
  const supabase = await supabaseServer()

  // Ekstrak ID dari URL jika yang diberikan adalah link lengkap
  let id = spreadsheet_id;
  if (spreadsheet_id.includes('spreadsheets/d/')) {
    id = spreadsheet_id.split('spreadsheets/d/')[1].split('/')[0];
  }

  const { data, error } = await supabase
    .from('tabel_pengaturan')
    .upsert({ kunci: 'spreadsheet_id', nilai: id, updated_at: new Date().toISOString() })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Spreadsheet ID updated successfully', data })
}
