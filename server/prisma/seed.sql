-- Insert sample digital products data
-- Run this in Supabase SQL Editor

INSERT INTO digital_products (order_number, product_name, witel, branch, revenue, amount, status, sub_type, created_at, updated_at)
VALUES
  -- WITEL JABAR
  ('ORD-2024-001', 'Internet Fiber 30 Mbps', 'WITEL_JABAR', 'Bandung', 300000, 10, 'complete', 'Internet Retail', NOW(), NOW()),
  ('ORD-2024-002', 'Internet Fiber 50 Mbps', 'WITEL_JABAR', 'Bogor', 500000, 5, 'in-progress', 'Internet Retail', NOW(), NOW()),
  ('ORD-2024-003', 'Internet Dedicated 100 Mbps', 'WITEL_JABAR', 'Jakarta', 1500000, 8, 'complete', 'Internet Korporat', NOW(), NOW()),
  ('ORD-2024-004', 'VPN Service', 'WITEL_JABAR', 'Bandung', 250000, 15, 'cancelled', 'Layanan Tambahan', NOW(), NOW()),
  
  -- WITEL JATIM
  ('ORD-2024-005', 'Internet Fiber 30 Mbps', 'WITEL_JATIM', 'Surabaya', 450000, 12, 'complete', 'Internet Retail', NOW(), NOW()),
  ('ORD-2024-006', 'Internet Fiber 50 Mbps', 'WITEL_JATIM', 'Malang', 600000, 6, 'in-progress', 'Internet Retail', NOW(), NOW()),
  ('ORD-2024-007', 'Cloud Storage 1TB', 'WITEL_JATIM', 'Surabaya', 200000, 20, 'complete', 'Layanan Tambahan', NOW(), NOW()),
  
  -- WITEL JATENG
  ('ORD-2024-008', 'Internet Fiber 30 Mbps', 'WITEL_JATENG', 'Semarang', 350000, 14, 'complete', 'Internet Retail', NOW(), NOW()),
  ('ORD-2024-009', 'Internet Dedicated 200 Mbps', 'WITEL_JATENG', 'Solo', 2000000, 3, 'in-progress', 'Internet Korporat', NOW(), NOW()),
  ('ORD-2024-010', 'Cloud Backup Service', 'WITEL_JATENG', 'Yogyakarta', 180000, 9, 'complete', 'Layanan Tambahan', NOW(), NOW())
ON CONFLICT (order_number) DO NOTHING;
