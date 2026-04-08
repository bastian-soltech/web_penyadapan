-- Project: Kebun Glantangan Management System
-- Database Schema: public (PostgreSQL)
-- Updated: 2024 (Revised Design)

-- 1. Profiles Table
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama_penilai text,
  email text,
  created_at timestamptz DEFAULT now()
);

-- 2. Blocks Table
CREATE TABLE public.tabel_blok (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama_blok text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. Tappers Table
CREATE TABLE public.tabel_penyadap (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama_penyadap text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. Trees Table
CREATE TABLE public.tabel_pohon (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_blok bigint NOT NULL REFERENCES public.tabel_blok(id) ON DELETE CASCADE,
  nama_pohon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 5. Assessment Summary Table (Header)
CREATE TABLE public.tabel_rekap_penilaian (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_blok bigint NOT NULL REFERENCES public.tabel_blok(id) ON DELETE CASCADE,
  id_penilai uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  id_penyadap bigint NOT NULL REFERENCES public.tabel_penyadap(id) ON DELETE CASCADE,
  total_score integer DEFAULT 0,
  tanggal_penilaian date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- 6. Detailed Assessment Table
CREATE TABLE public.tabel_penilaian (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_rekap_penilaian bigint NOT NULL REFERENCES public.tabel_rekap_penilaian(id) ON DELETE CASCADE,
  id_pohon bigint REFERENCES public.tabel_pohon(id) ON DELETE CASCADE,
  luka_kayu integer DEFAULT 0,
  kedalaman_sadap integer DEFAULT 0,
  pemakaian_kulit integer DEFAULT 0,
  teknik_ska integer DEFAULT 0,
  irisan_sadap integer DEFAULT 0,
  sudut_sadap integer DEFAULT 0,
  peralatan_tidak_lengkap integer DEFAULT 0,
  kebersihan_alat integer DEFAULT 0,
  pohon_tidak_disadap integer DEFAULT 0,
  hasil_tidak_dipungut integer DEFAULT 0,
  talang_sadap_mampet integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
