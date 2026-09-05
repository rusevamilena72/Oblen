/*
  # Добавяне на колона за снимки към таблицата listings

  1. Промени
    - Добавя колона `images` от тип `text[]` към таблицата `listings`
    - Колоната е nullable, тъй като снимките са незадължителни
*/

-- Добавяне на колона за снимки
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS images text[];