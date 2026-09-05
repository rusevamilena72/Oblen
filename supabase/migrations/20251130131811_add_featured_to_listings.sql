/*
  # Add featured field to listings table

  1. Changes
    - Add `featured` column to `listings` table
      - Type: boolean
      - Default: false
      - Nullable: false
      - Will mark listings that should appear in "Most Searched Items" section on homepage
  
  2. Notes
    - Existing listings will have featured = false by default
    - Only featured listings will appear in the "Most Searched Items" section
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'featured'
  ) THEN
    ALTER TABLE listings ADD COLUMN featured boolean DEFAULT false NOT NULL;
  END IF;
END $$;
