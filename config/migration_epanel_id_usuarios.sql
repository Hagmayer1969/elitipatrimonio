-- =============================================
--  MIGRAÇÃO: adicionar epanel_id na tabela usuarios
--  Execute no SQL Editor do Supabase
-- =============================================

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS epanel_id TEXT DEFAULT NULL;

-- Índice para busca rápida por ID do ePainel
CREATE INDEX IF NOT EXISTS idx_usuarios_epanel_id
  ON usuarios(epanel_id)
  WHERE epanel_id IS NOT NULL;
