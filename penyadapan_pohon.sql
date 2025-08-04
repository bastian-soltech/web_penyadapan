-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  nama_penilai character varying,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.tabel_blok (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nama_blok character varying NOT NULL,
  CONSTRAINT tabel_blok_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tabel_penilai (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nama_penilai character varying NOT NULL,
  email character varying NOT NULL,
  password text NOT NULL,
  CONSTRAINT tabel_penilai_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tabel_penilaian (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  luka_kayu integer NOT NULL,
  kedalaman_sadap integer NOT NULL,
  pemakaian_kulit integer NOT NULL,
  teknik_ska integer NOT NULL,
  irisan_sadap integer NOT NULL,
  sudut_sadap integer NOT NULL,
  peralatan_tidak_lengkap integer NOT NULL,
  kebersihan_alat integer NOT NULL,
  pohon_tidak_disadap integer NOT NULL,
  hasil_tidak_dipungut integer NOT NULL,
  talang_sadap_mampet integer NOT NULL,
  id_rekap_penilaian bigint NOT NULL,
  id_pohon bigint,
  CONSTRAINT tabel_penilaian_pkey PRIMARY KEY (id),
  CONSTRAINT tabel_penilaian_id_rekap_penilaian_fkey FOREIGN KEY (id_rekap_penilaian) REFERENCES public.tabel_rekap_penilaian(id),
  CONSTRAINT tabel_penilaian_id_pohon_fkey FOREIGN KEY (id_pohon) REFERENCES public.tabel_pohon(id)
);
CREATE TABLE public.tabel_penyadap (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nama_penyadap character varying NOT NULL,
  CONSTRAINT tabel_penyadap_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tabel_pohon (
  id_blok bigint NOT NULL,
  nama_pohon character varying NOT NULL,
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  CONSTRAINT tabel_pohon_pkey PRIMARY KEY (id),
  CONSTRAINT tabel_pohon_id_blok_fkey FOREIGN KEY (id_blok) REFERENCES public.tabel_blok(id)
);
CREATE TABLE public.tabel_rekap_penilaian (
  id_blok bigint NOT NULL,
  id_penilai uuid NOT NULL,
  id_penyadap bigint NOT NULL,
  total_score integer NOT NULL,
  tanggal_penilaian date NOT NULL,
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  CONSTRAINT tabel_rekap_penilaian_pkey PRIMARY KEY (id),
  CONSTRAINT tabel_rekap_penilaian_id_penyadap_fkey FOREIGN KEY (id_penyadap) REFERENCES public.tabel_penyadap(id),
  CONSTRAINT tabel_rekap_penilaian_id_penilai_fkey1 FOREIGN KEY (id_penilai) REFERENCES public.profiles(id),
  CONSTRAINT tabel_rekap_penilaian_id_blok_fkey FOREIGN KEY (id_blok) REFERENCES public.tabel_blok(id)
);