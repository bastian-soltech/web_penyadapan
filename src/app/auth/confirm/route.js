
import supabaseServer from "@/app/lib/supabaseServer";
import { NextResponse } from "next/server";
export async function GET(request) {
    const supabase = await supabaseServer()
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const next = searchParams.get('next') ?? '/complete-profile'
  if (token_hash) {

    const {error } = await supabase.auth.verifyOtp({
      token_hash,
      type:'invite',
    })

    console.log('ERROR',error)
    if (!error) {
      return NextResponse.redirect('http://192.168.100.17:3000/complete-profile')
    }
  }

  return NextResponse.redirect(`http://192.168.100.17:3000/login?message=Link tidak valid`)
}