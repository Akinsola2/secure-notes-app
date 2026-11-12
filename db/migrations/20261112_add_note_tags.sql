alter table public.notes
add column if not exists tag text not null default '';
