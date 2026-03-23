-- Pasya Stock Market — Database Init
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Seed IDX stocks
INSERT INTO stocks (ticker, name, sector, is_active) VALUES
  ('BBCA', 'Bank Central Asia Tbk',          'Finance',  true),
  ('TLKM', 'Telekomunikasi Indonesia Tbk',   'Telecom',  true),
  ('BBRI', 'Bank Rakyat Indonesia Tbk',      'Finance',  true),
  ('ASII', 'Astra International Tbk',        'Auto',     true),
  ('BMRI', 'Bank Mandiri (Persero) Tbk',     'Finance',  true),
  ('UNVR', 'Unilever Indonesia Tbk',         'Consumer', true),
  ('GOTO', 'GoTo Gojek Tokopedia Tbk',       'Tech',     true),
  ('INDF', 'Indofood Sukses Makmur Tbk',     'Consumer', true),
  ('PGAS', 'PGN Perusahaan Gas Negara Tbk',  'Energy',   true),
  ('ICBP', 'Indofood CBP Sukses Makmur Tbk', 'Consumer', true),
  ('KLBF', 'Kalbe Farma Tbk',               'Health',   true),
  ('SMGR', 'Semen Indonesia (Persero) Tbk',  'Material', true),
  ('ADRO', 'Adaro Energy Indonesia Tbk',     'Energy',   true),
  ('PTBA', 'Bukit Asam Tbk',                'Energy',   true),
  ('ANTM', 'Aneka Tambang Tbk',             'Mining',   true)
ON CONFLICT (ticker) DO NOTHING;
