-- Create services table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  default_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Drop old service_prices table as it's no longer needed
DROP TABLE IF EXISTS service_prices;

-- Add RLS policies for services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON services
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON services
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON services
  FOR DELETE USING (auth.role() = 'authenticated');
