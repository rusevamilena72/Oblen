/*
  # Създаване на Storage bucket за снимки на обяви

  1. Storage
    - Създава bucket 'listing-images' за съхранение на снимки
    - Настройва публичен достъп за четене на снимките
    - Добавя RLS политики за сигурност

  2. Security
    - Всички могат да четат снимки (публичен достъп)
    - Само удостоверени потребители могат да качват снимки
    - Потребителите могат да изтриват само собствените си снимки
*/

-- Създаване на bucket за снимки
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Политика за четене на снимки (публичен достъп)
CREATE POLICY "Всички могат да четат снимки на обяви"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listing-images');

-- Политика за качване на снимки (само удостоверени потребители)
CREATE POLICY "Удостоверени потребители могат да качват снимки"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing-images');

-- Политика за изтриване на снимки (само собствените си)
CREATE POLICY "Потребители могат да изтриват собствените си снимки"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'listing-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);