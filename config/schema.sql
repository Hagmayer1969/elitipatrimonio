-- =============================================
--  ELITI PATRIMÔNIO — Schema Supabase
--  Execute este script no SQL Editor do Supabase
-- =============================================

-- Habilitar UUID
create extension if not exists "uuid-ossp";

-- ---- Unidades ----
create table if not exists unidades (
  id text primary key,
  nome text not null,
  end text,
  cidade text,
  cor text default '#F97316',
  ativa boolean default true,
  created_at timestamptz default now()
);

-- ---- Usuários (Alunos) ----
create table if not exists usuarios (
  id text primary key,
  nome text not null,
  email text,
  tel text,
  turma text,
  unidade text references unidades(id),
  ativo boolean default true,
  obs text,
  created_at timestamptz default now()
);

-- ---- Equipamentos ----
create table if not exists equipamentos (
  id text primary key,
  nome text not null,
  tipo text,
  status text default 'disponivel',
  marca text,
  modelo text,
  serie text,
  patrimonio text,
  unidade text references unidades(id),
  usuario text references usuarios(id),
  foto text,
  obs text,
  data text,
  valor numeric,
  epanel_id text,
  sincronizado boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---- Movimentações ----
create table if not exists movimentacoes (
  id text primary key,
  eq_id text references equipamentos(id) on delete cascade,
  uid text references usuarios(id) on delete set null,
  tipo text, -- 'emprestimo' | 'devolucao' | 'manutencao'
  data timestamptz default now(),
  resp text,
  obs text
);

-- ---- Trigger: atualiza updated_at automaticamente ----
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger equipamentos_updated_at
  before update on equipamentos
  for each row execute function update_updated_at();
