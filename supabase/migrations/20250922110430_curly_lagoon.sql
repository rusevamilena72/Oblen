/*
  # Създаване на таблица за обяви

  1. Нови таблици
    - `listings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key към auth.users)
      - `category` (text, категория на обявата)
      - `title` (text, име на артикула)
      - `description` (text, детайли)
      - `dimensions` (text, размери - незадължително)
      - `price` (numeric, цена)
      - `currency` (text, валута - лв. или eur)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Сигурност
    - Включване на RLS за таблицата `listings`
    - Политика за четене на всички обяви
    - Политика за създаване на обяви само от удостоверени потребители
    - Политика за редактиране/изтриване само на собствени обяви
*/

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  dimensions text,
  price numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'лв.',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Включване на Row Level Security
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Политика за четене на всички обяви (публични)
CREATE POLICY "Всички могат да четат обяви"
  ON listings
  FOR SELECT
  TO public
  USING (true);

-- Политика за създаване на обяви само от удостоверени потребители
CREATE POLICY "Удостоверени потребители могат да създават обяви"
  ON listings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Политика за редактиране на собствени обяви
CREATE POLICY "Потребители могат да редактират собствените си обяви"
  ON listings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Политика за изтриване на собствени обяви
CREATE POLICY "Потребители могат да изтриват собствените си обяви"
  ON listings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Индекс за по-бързо търсене по категория
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);

-- Индекс за по-бързо търсене по потребител
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);

-- Индекс за сортиране по дата на създаване
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);