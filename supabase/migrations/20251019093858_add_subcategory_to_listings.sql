/*
  # Add subcategory field to listings table

  1. Changes
    - Add `subcategory` column to `listings` table
      - Type: text
      - Nullable: true (for backwards compatibility with existing listings)
      - Will store subcategories like 'practical', 'decorations', 'holidays' for 'for-home' category
  
  2. Notes
    - Existing listings will have NULL subcategory
    - Only 'for-home' category will use subcategories initially
    - Other categories can ignore this field
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'subcategory'
  ) THEN
    ALTER TABLE listings ADD COLUMN subcategory text;
  END IF;
END $$;
