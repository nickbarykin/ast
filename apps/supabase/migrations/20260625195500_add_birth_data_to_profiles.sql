alter table public.profiles
  add column birth_date date,
  add column birth_time time,
  add column birth_place_name text,
  add column birth_latitude double precision,
  add column birth_longitude double precision,
  add column birth_timezone text;
