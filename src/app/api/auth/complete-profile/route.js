import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request) {
  const body = await request.json();
  const { username, password } = body;

  if (!username) {
    return NextResponse.json({ status: 400, message: 'Username wajib diisi' }, { status: 400 });
  }
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json({ status: 401, message: 'Sesi tidak valid' }, { status: 401 });
  }


  const updateData = { data: { full_name: username } };
  if (password) updateData.password = password;

  const { error: authError } = await supabase.auth.updateUser(updateData);

  if (authError) {
    return NextResponse.json({ status: 500, message: authError.message }, { status: 500 });
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ nama_penilai: username })
    .eq('id', user.id);

  if (profileError) {
    return NextResponse.json({ status: 500, message: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ status: 200, message: 'Profil berhasil diperbarui' });
}
