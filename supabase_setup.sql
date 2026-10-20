-- ============================================================================
-- ДОРНОГОВЬ АПАРТМЕНТ (502-Р БАЙР) SUPABASE САНХҮҮ, БҮРТГЭЛИЙН ӨГӨГДЛИЙН САН
-- ============================================================================

-- 1. Оршин суугчдын хүснэгт үүсгэх
CREATE TABLE IF NOT EXISTS residents (
  id TEXT PRIMARY KEY,
  contract_no TEXT,
  contract_date TEXT,
  name TEXT,
  full_name TEXT,
  last_name TEXT,
  first_name TEXT,
  reg_no TEXT,
  phone TEXT,
  email TEXT,
  workplace TEXT,
  apartment TEXT,
  block TEXT,
  door TEXT,
  floor INT,
  room TEXT,
  area_sqm NUMERIC,
  rooms INT,
  total_price NUMERIC,
  down_payment NUMERIC,
  remaining_principal NUMERIC,
  monthly_rent NUMERIC,
  monthly_soh NUMERIC,
  paid_months INT,
  total_months INT,
  current_ownership_percent INT,
  total_principal_paid NUMERIC,
  remaining_balance NUMERIC,
  remaining_months INT,
  current_month_due_day INT,
  rent_paid_this_month NUMERIC,
  rent_unpaid NUMERIC,
  soh_paid_this_month NUMERIC,
  soh_unpaid NUMERIC,
  overdue_days INT,
  rent_penalty NUMERIC,
  soh_penalty NUMERIC,
  penalty_waived NUMERIC,
  status TEXT,
  total_rent_due_this_month NUMERIC,
  total_soh_due_this_month NUMERIC,
  total_due_this_month NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) - Анхан шатанд нийтэд унших, засах эрх олгох
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read and write residents" ON residents FOR ALL USING (true) WITH CHECK (true);

-- 2. Байгууллагын ажилтнуудын хүснэгт
CREATE TABLE IF NOT EXISTS staff_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL,
  role_title TEXT,
  email TEXT,
  department TEXT
);

ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read staff" ON staff_users FOR ALL USING (true) WITH CHECK (true);

-- Бодит 5 ажилтныг оруулах
INSERT INTO staff_users (id, name, full_name, role, role_title, email, department) VALUES
('USR-CEO', 'Энхцэцэг', 'Энхцэцэг', 'ADMIN', 'Гүйцэтгэх Захирал', 'enkhtsetseg@dornogobi-apartment.mn', 'Гүйцэтгэх Удирдлага'),
('USR-ACC', 'Соёл-Ундараа', 'Соёл-Ундараа', 'ACCOUNTANT', 'Ахлах Нягтлан Бодогч', 'soyol-undaraa@dornogobi-apartment.mn', 'Санхүүгийн Алба'),
('USR-ADM', 'Билгүүн', 'Билгүүн', 'ADMIN', 'Системийн Админ', 'bilguun@dornogobi-apartment.mn', 'Мэдээллийн Технологи'),
('USR-CSH', 'Орхонсэлэнгэ', 'Орхонсэлэнгэ', 'ACCOUNTANT', 'Кассын Нярав', 'orkhonselenge@dornogobi-apartment.mn', 'Санхүү, Кассын Алба'),
('USR-PROC', 'Нямсүрэн', 'Нямсүрэн', 'ADMIN', 'Худалдан Авах Мэргэжилтэн', 'nyamsuren@dornogobi-apartment.mn', 'Хангамж, Худалдан Авалтын Алба')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  role_title = EXCLUDED.role_title;

-- 3. 502-р байрны 169 өрхийн өгөгдлийг оруулах
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-001', 'DGA-502-091', '2024-01-01', 'Б. Содномпунцаг', 'Балжинням Содномпунцаг', 
  'Балжинням', 'Содномпунцаг', 'ЕГ46040519', '88963373, 86992662', 'nadmidregzidmaa.0113@gmail.com', 
  'Дэлгэрэх сум', '502В байр, 1 тоот', '502В байр', '1', 1, 
  '1', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 8, 60, 
  35, 36257200, 67334800, 52, 
  25, 776940, 517960, 45040, 
  0, 4, 2072, 0, 0, 
  'Дутуу төлсөн', 520032, 0, 520032
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-002', 'DGA-502-118', '2024-01-01', 'Т. Норжинсүрэн', 'Түмэнбаяр Норжинсүрэн', 
  'Түмэнбаяр', 'Норжинсүрэн', 'ЕЮ81090201', '80566767, 88134353', 'цаасаар хүргэх /настай хүн байдаг/', 
  '', '502Д байр, 1 тоот', '502Д байр', '1', 1, 
  '1', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 15, 60, 
  43.75, 45321500, 58270500, 45, 
  25, 1294900, 0, 0, 
  45040, 7, 0, 315, 0, 
  'СӨХ төлөөгүй', 0, 45355, 45355
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-003', 'DGA-502-012', '2024-01-01', 'Ц. Хөхцэцэг', 'Цэрэнсодном Хөхцэцэг', 
  'Цэрэнсодном', 'Хөхцэцэг', 'ЕЭ65072566', '90895089, 96560596', 'Oonchig_kh@yahoo.com', 
  '1-р баг тэтгэвэрт', '502В байр, 2 тоот', '502В байр', '2', 1, 
  '2', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 22, 60, 
  52.5, 58853550, 53248450, 38, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-004', 'DGA-502-038', '2024-01-01', 'Д. Энхтогтох', 'Дүгэр Энхтогтох', 
  'Дүгэр', 'Энхтогтох', 'ЕД76120770', '96366366, 98242133-нөхөр, 90097787-эхнэр, 88901800-охин', 'Gereleemuugii18@gmail.com', 
  'Их хэт сум', '502Д байр, 2 тоот', '502Д байр', '2', 1, 
  '2', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 29, 60, 
  61.25, 68662475, 43439525, 31, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-005', 'DGA-502-059', '2024-01-01', 'О. Ариунтуяа', 'Одонбаатар Ариунтуяа', 
  'Одонбаатар', 'Ариунтуяа', 'НБ96013109,411392611604', '89098216, 88019218', 'odonbaatar18@gmail.com', 
  '4-р баг 887-7-2тоот', '502В байр, 3 тоот', '502В байр', '3', 1, 
  '3', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 36, 60, 
  70, 87567918, 37529082, 24, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-006', 'DGA-502-082', '2024-01-01', 'Е. Өнөболд', 'Ерөөлт Өнөболд', 
  'Ерөөлт', 'Өнөболд', 'УП92052551, СЩ71091306', '95232598, 94215771', 'e.unubold2020@gmail.com', 
  'АШУИС Дорноговь дахь салбар', '502Д байр, 3 тоот', '502Д байр', '3', 1, 
  '3', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 7, 60, 
  33.75, 42220241, 82876759, 53, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-007', 'DGA-502-048', '2024-01-01', 'Ц. Мөнхтогоо', 'Цэсэнжав Мөнхтогоо', 
  'Цэсэнжав', 'Мөнхтогоо', 'ЕЕ49031319', '80207708, 88544903', 'puntsagnaran41@gmail.com', 
  'мандах сум', '502В байр, 4 тоот', '502В байр', '4', 1, 
  '4', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 14, 60, 
  42.5, 53166232, 71930768, 46, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-008', 'DGA-502-087', '2024-01-01', 'Л. Сүхбаатар', 'Лхамсүрэн Сүхбаатар', 
  'Лхамсүрэн', 'Сүхбаатар', 'ЕК59061671', '95757502, 95172727', 'цаасаар хүргэх /настай хүн байдаг/', 
  'Улаанбадрах', '502Д байр, 4 тоот', '502Д байр', '4', 1, 
  '4', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 21, 60, 
  51.25, 64112223, 60984777, 39, 
  25, 0, 1563713, 0, 
  54390, 13, 20328, 707, 0, 
  'Хугацаа хэтэрсэн', 1584041, 55097, 1639138
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-009', 'DGA-502-050', '2024-01-01', 'Х. Өнөрбат', 'Ханддорж Өнөрбат', 
  'Ханддорж', 'Өнөрбат', 'ЕЗ77040318', '96042594,  99588993', 'narantuyaenkhzul968@gmail.com', 
  '', '502В байр, 5 тоот', '502В байр', '5', 2, 
  '5', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 28, 60, 
  60, 67261200, 44840800, 32, 
  25, 840765, 560510, 48740, 
  0, 4, 2242, 0, 0, 
  'Дутуу төлсөн', 562752, 0, 562752
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-010', 'DGA-502-100', '2024-01-01', 'Л. Пэрэнлэймаа', 'Лувсан Пэрэнлэймаа', 
  'Лувсан', 'Пэрэнлэймаа', 'ЕЭ48121565', '90261221', 'chigen920@gmail.com', 
  'Тэтгэвэрт', '502Д байр, 5 тоот', '502Д байр', '5', 2, 
  '5', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 35, 60, 
  68.75, 77070125, 35031875, 25, 
  25, 1401275, 0, 0, 
  48740, 7, 0, 341, 0, 
  'СӨХ төлөөгүй', 0, 49081, 49081
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-011', 'DGA-502-031', '2024-01-01', 'Д. Үүрцайх', 'Дашзэвэг Үүрцайх', 
  'Дашзэвэг', 'Үүрцайх', 'ЕЭ84030564', '91452324, 99012437', 'uuree.9145@gmail.com', 
  'нэгдсэн эмнэлэг', '502В байр, 6 тоот', '502В байр', '6', 2, 
  '6', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 6, 60, 
  32.5, 33667400, 69924600, 54, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-012', 'DGA-502-065', '2024-01-01', 'Я. Отгон', 'Ядам Отгон', 
  'Ядам', 'Отгон', 'ЕЛ54030903', '86448612, 94444412сувдаа', 'Daahai0908@gmail.com', 
  'Тэтгэвэрт', '502Д байр, 6 тоот', '502Д байр', '6', 2, 
  '6', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 13, 60, 
  41.25, 42731700, 60860300, 47, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-013', 'DGA-502-114', '2024-01-01', 'Ч. Чимэдцэрэн', 'Чойдог Чимэдцэрэн', 
  'Чойдог', 'Чимэдцэрэн', 'ЕГ30030206', '80660640, 94197735', 'Uuk0329@gmail.com', 
  'Дэлгэрэх сум', '502В байр, 7 тоот', '502В байр', '7', 2, 
  '7', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 20, 60, 
  50, 51796000, 51796000, 40, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-014', 'DGA-502-106', '2024-01-01', 'Т. Одгэрэл', 'Тогоонтөмөр Одгэрэл', 
  'Тогоонтөмөр', 'Одгэрэл', 'СВ91032605', '96699927, 89152803', 'gerleeodgerel530@gmail.com', 
  'Талст зам өрхийн эрүүл мэндийн төв', '502Д байр, 7 тоот', '502Д байр', '7', 2, 
  '7', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 27, 60, 
  58.75, 60860300, 42731700, 33, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-015', 'DGA-502-117', '2024-01-01', 'Д. Одсүрэн', 'Дамбийням Одсүрэн', 
  'Дамбийням', 'Одсүрэн', 'ЕЦ55041969', '95820434, 94223716', 'odsurendambiinyam@gmail.com', 
  'Тэтгэвэрт', '502В байр, 8 тоот', '502В байр', '8', 2, 
  '8', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 34, 60, 
  67.5, 75668850, 36433150, 26, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-016', 'DGA-502-045', '2024-01-01', 'Ч. Уранчимэг', 'Чулуу Уранчимэг', 
  'Чулуу', 'Уранчимэг', 'ЕЛ68062304', '99792311, 85322380', 'unaraa0179@gmail.com', 
  'Хатанбулаг Тэтгэвэрт', '502Д байр, 8 тоот', '502Д байр', '8', 2, 
  '8', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 5, 60, 
  31.25, 35031875, 77070125, 55, 
  25, 0, 1401275, 0, 
  48740, 7, 9809, 341, 0, 
  'Хугацаа хэтэрсэн', 1411084, 49081, 1460165
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-017', 'DGA-502-061', '2024-01-01', 'Б. Норжинсүрэн', 'Буд Норжинсүрэн', 
  'Буд', 'Норжинсүрэн', 'ЕЦ59011063', '80595504, 96638753, 98610456,89985211', 'uuganaa7904@gmail.com', 
  'Өргөн сум', '502В байр, 9 тоот', '502В байр', '9', 3, 
  '9', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 12, 60, 
  40, 50038806, 75058194, 48, 
  25, 938228, 625485, 54390, 
  0, 4, 2502, 0, 0, 
  'Дутуу төлсөн', 627987, 0, 627987
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-018', 'DGA-502-032', '2024-01-01', 'Ж. Санхүү', 'Жамбал Санхүү', 
  'Жамбал', 'Санхүү', 'ЕО55102673', '99478582, 88828856', 'sanhvvdelgerhvv@gmail.com', 
  '3-р баг тэтгэвэрт', '502Д байр, 9 тоот', '502Д байр', '9', 3, 
  '9', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 19, 60, 
  48.75, 60984797, 64112203, 41, 
  25, 1563713, 0, 0, 
  54390, 7, 0, 381, 0, 
  'СӨХ төлөөгүй', 0, 54771, 54771
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-019', 'DGA-502-101', '2024-01-01', 'С. Буянжаргал', 'Сүхбаатар Буянжаргал', 
  'Сүхбаатар', 'Буянжаргал', 'ЕС80020403', '99144860, 99802072', 'buynolziibatireedvi@gmail.com', 
  'Мөнхдүүрэн зах', '502В байр, 10 тоот', '502В байр', '10', 3, 
  '10', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 26, 60, 
  57.5, 71930788, 53166212, 34, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-020', 'DGA-502-036', '2024-01-01', 'И. Сарантуяа', 'Ишмаа Сарантуяа', 
  'Ишмаа', 'Сарантуяа', 'ЕМ56020160', '99136045', 'ariukabiz00@gmail.com', 
  '', '502Д байр, 10 тоот', '502Д байр', '10', 3, 
  '10', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 33, 60, 
  66.25, 82876779, 42220221, 27, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-021', 'DGA-502-124', '2024-01-01', 'С. Нарантуяа', 'Сосорбурам Нарантуяа', 
  'Сосорбурам', 'Нарантуяа', 'ЕБ64031248', '99048962, 99047830', 'nnaran.ttuya@gmail.com', 
  'Тэтгэвэрт', '502В байр, 11 тоот', '502В байр', '11', 3, 
  '11', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 4, 60, 
  30, 33630600, 78471400, 56, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-022', 'DGA-502-044', '2024-01-01', 'С. Төмөрмөнх', 'Сугир Төмөрмөнх', 
  'Сугир', 'Төмөрмөнх', 'ЕП61032811', '99031328, 94874812', 'davaadelger2712@gmail.com', 
  'Зүүн баян ЦТС салбар', '502Д байр, 11 тоот', '502Д байр', '11', 3, 
  '11', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 11, 60, 
  38.75, 43439525, 68662475, 49, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-023', 'DGA-502-071', '2024-01-01', 'Р. Энхбаяр', 'Ренчинжүгдэр Энхбаяр', 
  'Ренчинжүгдэр', 'Энхбаяр', 'ЕЭ75041862', '90110490, 88899089', 'rentsenjugder0418@gmail.com', 
  '1-р цэцэрлэг', '502В байр, 12 тоот', '502В байр', '12', 3, 
  '12', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 18, 60, 
  47.5, 49206200, 54385800, 42, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-024', 'DGA-502-098', '2024-01-01', 'Д. Даваадорж', 'Дамбадаржаа Даваадорж', 
  'Дамбадаржаа', 'Даваадорж', 'ЕС75031310', '88188805, 94081228', 'dolgorsaihnaa14@gmail.com', 
  'хувиараа', '502Д байр, 12 тоот', '502Д байр', '12', 3, 
  '12', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 25, 60, 
  56.25, 58270500, 45321500, 35, 
  25, 0, 1294900, 0, 
  45040, 15, 19424, 676, 0, 
  'Хугацаа хэтэрсэн', 1314324, 45716, 1360040
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-025', 'DGA-502-052', '2024-01-01', 'Б. Баярчимэг', 'Батжаргал Баярчимэг', 
  'Батжаргал', 'Баярчимэг', 'ЕЮ90013002', '91299797, 95562997', 'bayarchimegjoyce@gmail.com', 
  '', '502В байр, 13 тоот', '502В байр', '13', 4, 
  '13', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 32, 60, 
  65, 67334800, 36257200, 28, 
  25, 776940, 517960, 45040, 
  0, 4, 2072, 0, 0, 
  'Дутуу төлсөн', 520032, 0, 520032
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-026', 'DGA-502-028', '2024-01-01', 'Э. Энхсаруул', 'Энхболд Энхсаруул', 
  'Энхболд', 'Энхсаруул', 'ЕЭ91120110', '90901121, 90119111', 'odontuya941201@gmail.com', 
  'Дорноговь Цагдаагийн газар', '502Д байр, 13 тоот', '502Д байр', '13', 4, 
  '13', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 3, 60, 
  28.75, 29782700, 73809300, 57, 
  25, 1294900, 0, 0, 
  45040, 7, 0, 315, 0, 
  'СӨХ төлөөгүй', 0, 45355, 45355
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-027', 'DGA-502-051', '2024-01-01', 'Ж. Дэлгэржаргал', 'Жаалай Дэлгэржаргал', 
  'Жаалай', 'Дэлгэржаргал', 'ЕЕ79052902', '96190016, 91660016', 'jaalaideegii@gmail.com', 
  '12-р цэцэрлэг', '502В байр, 14 тоот', '502В байр', '14', 4, 
  '14', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 10, 60, 
  37.5, 42038250, 70063750, 50, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-028', 'DGA-502-067', '2024-01-01', 'Д. Нарантуяа', 'Дамбийням Нарантуяа', 
  'Дамбийням', 'Нарантуяа', 'ЕЭ83040361', '96466161, 80821949', 'naraa96466161@gmail.com', 
  '3-р сургууль', '502Д байр, 14 тоот', '502Д байр', '14', 4, 
  '14', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 17, 60, 
  46.25, 51847175, 60254825, 43, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-029', 'DGA-502-120', '2024-01-01', 'Т. Мөнхцолмон', 'Тунгалаг Мөнхцолмон', 
  'Тунгалаг', 'Мөнхцолмон', 'ЕЮ96050107', '88842782, 89072782', 'tsoomoot703@gmail.com', 
  '9-р цэцэрлэг', '502В байр, 15 тоот', '502В байр', '15', 4, 
  '15', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 24, 60, 
  55, 68803362, 56293638, 36, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-030', 'DGA-502-026', '2024-01-01', 'Б. Анхбаяр', 'Баянбаатар Анхбаяр', 
  'Баянбаатар', 'Анхбаяр', 'УК90092241', '88893391, 88763391, 01039473861', 'badambatbaatar19@gmail.com', 
  '13-р цэцэрлэг', '502Д байр, 15 тоот', '502Д байр', '15', 4, 
  '15', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 31, 60, 
  63.75, 79749353, 45347647, 29, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-031', 'DGA-502-054', '2024-01-01', 'Г. Отгонцэцэг', 'Гэрэлдорж Отгонцэцэг', 
  'Гэрэлдорж', 'Отгонцэцэг', 'ЕД83101262', '99985466, 99987607', 'bathuyag1211@gmail.com', 
  'нэгдсэн эмнэлэг', '502В байр, 16 тоот', '502В байр', '16', 4, 
  '16', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 2, 60, 
  27.5, 34401676, 90695324, 58, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-032', 'DGA-502-049', '2024-01-01', 'С. Отгонтуяа', 'Сандуй Отгонтуяа', 
  'Сандуй', 'Отгонтуяа', 'ЕТ84010703', '90669964, 80599504', 'gerelmaamngnhlg@gmail.com', 
  'Хувиараа', '502Д байр, 16 тоот', '502Д байр', '16', 4, 
  '16', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 9, 60, 
  36.25, 45347667, 79749333, 51, 
  25, 0, 1563713, 0, 
  54390, 9, 14073, 490, 0, 
  'Хугацаа хэтэрсэн', 1577786, 54880, 1632666
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-033', 'DGA-502-017', '2024-01-01', 'Ц. Мөнгөнтунгалаг', 'Цэгмид Мөнгөнтунгалаг', 
  'Цэгмид', 'Мөнгөнтунгалаг', 'ЕЛ90080507', '89648182, 88891606', 'tsegmid.tungaa.90@gmail.com', 
  'Практикал даатгал', '502В байр, 17 тоот', '502В байр', '17', 5, 
  '17', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 16, 60, 
  45, 50445900, 61656100, 44, 
  25, 840765, 560510, 48740, 
  0, 4, 2242, 0, 0, 
  'Дутуу төлсөн', 562752, 0, 562752
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-034', 'DGA-502-113', '2024-01-01', 'Б. Сарангэрэл', 'Батаа Сарангэрэл', 
  'Батаа', 'Сарангэрэл', 'ЕЮ86022204', '86040222, 96555084', 'sarangerel0222@gmail.com', 
  'Нийтлэг үйлчилгээний газар', '502Д байр, 17 тоот', '502Д байр', '17', 5, 
  '17', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 23, 60, 
  53.75, 60254825, 51847175, 37, 
  25, 1401275, 0, 0, 
  48740, 7, 0, 341, 0, 
  'СӨХ төлөөгүй', 0, 49081, 49081
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-035', 'DGA-502-079', '2024-01-01', 'Ч. Солонго', 'Чинболд Солонго', 
  'Чинболд', 'Солонго', 'ЕЭ95092603', '90906003,', 'chinboldsolongo@gmail.com', 
  '5-р сургууль', '502В байр, 18 тоот', '502В байр', '18', 5, 
  '18', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 30, 60, 
  62.5, 64745000, 38847000, 30, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-036', 'DGA-502-009', '2024-01-01', 'Б. Баярцэцэг', 'Буянхүү Баярцэцэг', 
  'Буянхүү', 'Баярцэцэг', 'КЕ89091500', '96960292, 88408876', 'bbayartsetseg99@gmail.com', 
  '6-р сургууль', '502Д байр, 18 тоот', '502Д байр', '18', 5, 
  '18', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 1, 60, 
  26.25, 27192900, 76399100, 59, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-037', 'DGA-502-115', '2024-01-01', 'А. Түмэнбаяр', 'Алтандөл Түмэнбаяр', 
  'Алтандөл', 'Түмэнбаяр', 'ЕЭ91101809', '96891018, 96891009', 'tumee96891018@gmail.com', 
  '6-р сургууль', '502В байр, 19 тоот', '502В байр', '19', 5, 
  '19', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 8, 60, 
  35, 36257200, 67334800, 52, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-038', 'DGA-502-043', '2024-01-01', 'Б. Төмөртулга', 'Банзаржав Төмөртулга', 
  'Банзаржав', 'Төмөртулга', 'ЕЮ67031307', '90525293, 90520289', 'Enkhgerelt1989@gmail.com', 
  'нэгдсэн эмнэлэг', '502Д байр, 19 тоот', '502Д байр', '19', 5, 
  '19', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 15, 60, 
  43.75, 45321500, 58270500, 45, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-039', 'DGA-502-013', '2024-01-01', 'Ө. Батчимэг', 'Өлзийхутаг Батчимэг', 
  'Өлзийхутаг', 'Батчимэг', 'ЕС88050301', '80877936', 'ubatchimeg21@gmail.com', 
  '', '502В байр, 20 тоот', '502В байр', '20', 5, 
  '20', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 22, 60, 
  52.5, 58853550, 53248450, 38, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-040', 'DGA-502-002', '2024-01-01', 'М. Мөнхбаатар', 'Мөнхцэцэг Мөнхбаатар', 
  'Мөнхцэцэг', 'Мөнхбаатар', 'ЕЭ65102373', '91887299, 99897299', 'otgonmaam1210@gmail.com', 
  '1-р сургууль', '502Д байр, 20 тоот', '502Д байр', '20', 5, 
  '20', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 29, 60, 
  61.25, 68662475, 43439525, 31, 
  25, 0, 1401275, 0, 
  48740, 17, 23822, 829, 0, 
  'Хугацаа хэтэрсэн', 1425097, 49569, 1474666
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-041', 'DGA-502-074', '2024-01-01', 'А. Амармэнд', 'Амгалан Амармэнд', 
  'Амгалан', 'Амармэнд', 'ЕА89091614', '89110633, 85808994', 'mareo0916@gmail.com', 
  'Ди медиа агентлаг', '502В байр, 21 тоот', '502В байр', '21', 6, 
  '21', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 36, 60, 
  70, 87567918, 37529082, 24, 
  25, 938228, 625485, 54390, 
  0, 4, 2502, 0, 0, 
  'Дутуу төлсөн', 627987, 0, 627987
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-042', 'DGA-502-083', '2024-01-01', 'Б. Марал-Эрдэнэ', 'Баярсайхан Марал-Эрдэнэ', 
  'Баярсайхан', 'Марал-Эрдэнэ', 'ЕС97021005', '99656537, 88818145', 'maral-erdene@done.do.gov.mn', 
  'нэгдсэн эмнэлэг', '502Д байр, 21 тоот', '502Д байр', '21', 6, 
  '21', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 7, 60, 
  33.75, 42220241, 82876759, 53, 
  25, 1563713, 0, 0, 
  54390, 7, 0, 381, 0, 
  'СӨХ төлөөгүй', 0, 54771, 54771
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-043', 'DGA-502-055', '2024-01-01', 'Г. Цэцэгдэлгэр', 'Ганбаатар Цэцэгдэлгэр', 
  'Ганбаатар', 'Цэцэгдэлгэр', 'ЕВ86121604', '95818182, 80440044', 'emujin0424@gmail.com', 
  'хувиараа', '502В байр, 22 тоот', '502В байр', '22', 6, 
  '22', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 14, 60, 
  42.5, 53166232, 71930768, 46, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-044', 'DGA-502-037', '2024-01-01', 'Б. Эрдэнэцэцэг', 'Борхүү Эрдэнэцэцэг', 
  'Борхүү', 'Эрдэнэцэцэг', 'ЛМ86081209', '99588054, 99470676', 'erdenetsetseg733@gmail.com', 
  '11-р цэцэрлэг', '502Д байр, 22 тоот', '502Д байр', '22', 6, 
  '22', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 21, 60, 
  51.25, 64112223, 60984777, 39, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-045', 'DGA-502-076', '2024-01-01', 'Э. Энхмаа', 'Энхболд Энхмаа', 
  'Энхболд', 'Энхмаа', 'ЕЛ96021601', '89795995, 88420686', 'enhmaa742@gmail.com', 
  'нэгдсэн эмнэлэг', '502В байр, 23 тоот', '502В байр', '23', 6, 
  '23', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 28, 60, 
  60, 67261200, 44840800, 32, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-046', 'DGA-502-105', '2024-01-01', 'Ш. Ганчимэг', 'Шагдар Ганчимэг', 
  'Шагдар', 'Ганчимэг', 'ЕГ73032606', '89758844, 90904919', 'sh.ganchimeg0326@gmail.com', 
  '5-р сургууль', '502Д байр, 23 тоот', '502Д байр', '23', 6, 
  '23', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 35, 60, 
  68.75, 77070125, 35031875, 25, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-047', 'DGA-502-122', '2024-01-01', 'Г. Бэрцэцэг', 'Гансүх Бэрцэцэг', 
  'Гансүх', 'Бэрцэцэг', 'ЕГ95072702', '96112623, 85910185', 'Bereeganaa@gmail.com', 
  '10-р цэцэрлэг', '502В байр, 24 тоот', '502В байр', '24', 6, 
  '24', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 6, 60, 
  32.5, 33667400, 69924600, 54, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-048', 'DGA-502-025', '2024-01-01', 'Т. Эрдэнэжаргал', 'Төмөрбат Эрдэнэжаргал', 
  'Төмөрбат', 'Эрдэнэжаргал', 'ЧЕ83101261', '90126042, 94585879', 't.erdenejargal2019@gmail.com', 
  '', '502Д байр, 24 тоот', '502Д байр', '24', 6, 
  '24', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 13, 60, 
  41.25, 42731700, 60860300, 47, 
  25, 0, 1294900, 0, 
  45040, 11, 14244, 495, 0, 
  'Хугацаа хэтэрсэн', 1309144, 45535, 1354679
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-049', 'DGA-502-035', '2024-01-01', 'О. Наранбат', 'Отгонцэрэн Наранбат', 
  'Отгонцэрэн', 'Наранбат', 'ЕС89013017', '88706610, 88440082', 'naranbatnaran070@gmail.com', 
  'Төмөрзам татах хэсэг', '502В байр, 25 тоот', '502В байр', '25', 7, 
  '25', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 20, 60, 
  50, 51796000, 51796000, 40, 
  25, 776940, 517960, 45040, 
  0, 4, 2072, 0, 0, 
  'Дутуу төлсөн', 520032, 0, 520032
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-050', 'DGA-502-001', '2024-01-01', 'Ш. Энхтуяа', 'Шархүү Энхтуяа', 
  'Шархүү', 'Энхтуяа', 'ЙЮ58092465', '88157225, 88008412', 'enkhgerel6215@gmail.com', 
  'Зүүн баян ЕБС', '502Д байр, 25 тоот', '502Д байр', '25', 7, 
  '25', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 27, 60, 
  58.75, 60860300, 42731700, 33, 
  25, 1294900, 0, 0, 
  45040, 7, 0, 315, 0, 
  'СӨХ төлөөгүй', 0, 45355, 45355
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-051', 'DGA-502-108', '2024-01-01', 'Б. Мөнхчимэг', 'Баасандорж Мөнхчимэг', 
  'Баасандорж', 'Мөнхчимэг', 'ЕЭ85021366', '96999622, 99295912', 'baasandorjchimeg@gmail.com', 
  '2-р сургууль', '502В байр, 26 тоот', '502В байр', '26', 7, 
  '26', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 34, 60, 
  67.5, 75668850, 36433150, 26, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-052', 'DGA-502-023', '2024-01-01', 'Ч. Номин-Эрдэнэ', 'Чинбат Номин-Эрдэнэ', 
  'Чинбат', 'Номин-Эрдэнэ', 'ЕЛ89110906', '91116227,', 'Cnomio@gmail.com', 
  '6-р сургууль', '502Д байр, 26 тоот', '502Д байр', '26', 7, 
  '26', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 5, 60, 
  31.25, 35031875, 77070125, 55, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-053', 'DGA-502-102', '2024-01-01', 'Ю. Саранцэцэг', 'Юра Саранцэцэг', 
  'Юра', 'Саранцэцэг', 'ЕЙ74091907', '96949141, 96929141', 'ojugjinnorov@gmail.com', 
  '2-р сургууль', '502В байр, 27 тоот', '502В байр', '27', 7, 
  '27', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 12, 60, 
  40, 50038806, 75058194, 48, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-054', 'DGA-502-075', '2024-01-01', 'Ш. Удвалсүрэн', 'Шуураа Удвалсүрэн', 
  'Шуураа', 'Удвалсүрэн', 'ЕЮ79062108', '91207712, 91141528', 'shuuraaudvalsuren@gmail.com', 
  '5-р цэцэрлэг', '502Д байр, 27 тоот', '502Д байр', '27', 7, 
  '27', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 19, 60, 
  48.75, 60984797, 64112203, 41, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-055', 'DGA-502-004', '2024-01-01', 'Т. Ёндон', 'Төмөрсүх Ёндон', 
  'Төмөрсүх', 'Ёндон', 'ЕС81012933', '89098122', 'shagdarsurenbattsooj@gmail.com', 
  'Хараацай цэцэрлэг', '502В байр, 28 тоот', '502В байр', '28', 7, 
  '28', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 26, 60, 
  57.5, 71930788, 53166212, 34, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-056', 'DGA-502-042', '2024-01-01', 'Ц. Нарантогтох', 'Цагааннохой Нарантогтох', 
  'Цагааннохой', 'Нарантогтох', 'ЕЭ71031960', '89298933.8581851', 'bsaku89@gmail.com', 
  'нэгдсэн эмнэлэг', '502Д байр, 28 тоот', '502Д байр', '28', 7, 
  '28', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 33, 60, 
  66.25, 82876779, 42220221, 27, 
  25, 0, 1563713, 0, 
  54390, 5, 7819, 272, 0, 
  'Хугацаа хэтэрсэн', 1571532, 54662, 1626194
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-057', 'DGA-502-093', '2024-01-01', 'Б. Есөнгээ', 'Бумдарь Есөнгээ', 
  'Бумдарь', 'Есөнгээ', 'ЕП96021418', '89045501, 99384383', 'esungemongolzam@gmail.com', 
  'MTL ХХК', '502В байр, 29 тоот', '502В байр', '29', 8, 
  '29', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 4, 60, 
  30, 33630600, 78471400, 56, 
  25, 840765, 560510, 48740, 
  0, 4, 2242, 0, 0, 
  'Дутуу төлсөн', 562752, 0, 562752
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-058', 'DGA-502-090', '2024-01-01', 'Л. Хатанбаатар', 'Лхагвасуурь Хатанбаатар', 
  'Лхагвасуурь', 'Хатанбаатар', 'ЧО88021117', '99014099', 'thehaagii@gmail.com', 
  'Аймгийн ЗДТГ', '502Д байр, 29 тоот', '502Д байр', '29', 8, 
  '29', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 11, 60, 
  38.75, 43439525, 68662475, 49, 
  25, 1401275, 0, 0, 
  48740, 7, 0, 341, 0, 
  'СӨХ төлөөгүй', 0, 49081, 49081
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-059', 'DGA-502-088', '2024-01-01', 'М. Эрдэнэцогт', 'Манцуйт Эрдэнэцогт', 
  'Манцуйт', 'Эрдэнэцогт', 'ЕВ40032211', '88922060-wife, 95112243.91999963', 'oyunhanderdenetsogt@gmail.com', 
  'Тэтгэвэрт', '502В байр, 30 тоот', '502В байр', '30', 8, 
  '30', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 18, 60, 
  47.5, 49206200, 54385800, 42, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-060', 'DGA-502-070', '2024-01-01', 'Б. Тунгалаг', 'Базарсүрэн Тунгалаг', 
  'Базарсүрэн', 'Тунгалаг', 'ЕП65082307', '88898165, 95911186', 'bbodi2623@gmail.com', 
  'Зүүнбаян 7-р цэцэрлэг', '502Д байр, 30 тоот', '502Д байр', '30', 8, 
  '30', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 25, 60, 
  56.25, 58270500, 45321500, 35, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-061', 'DGA-502-061', '2024-01-01', 'Д. Чоён', 'Даваажаргал Чоён', 
  'Даваажаргал', 'Чоён', 'ЕГ93120614', '88666522', 'Choyon1206@gmail.com', 
  'Нэгдсэн эмнэлэг', '502В байр, 31 тоот', '502В байр', '31', 8, 
  '31', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 32, 60, 
  65, 67334800, 36257200, 28, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-062', 'DGA-502-033', '2024-01-01', 'М. Мөнхцэцэг', 'Мягмар Мөнхцэцэг', 
  'Мягмар', 'Мөнхцэцэг', 'ЛБ92092502', '95512424, 96559612', 'mmonkhtsetseg449@gmail.com', 
  '4-р цэцэрлэг', '502Д байр, 31 тоот', '502Д байр', '31', 8, 
  '31', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 3, 60, 
  28.75, 29782700, 73809300, 57, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-063', 'DGA-502-053', '2024-01-01', 'Э. Чинцэцэг', 'Эрдэнэчулуун Чинцэцэг', 
  'Эрдэнэчулуун', 'Чинцэцэг', 'ЕО90112967', '90224310, 96585796,88585691', 'chintsetseg@gmail.com', 
  'Содмонгол', '502В байр, 32 тоот', '502В байр', '32', 8, 
  '32', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 10, 60, 
  37.5, 42038250, 70063750, 50, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-064', 'DGA-502-139', '2024-01-01', 'Р. Баасандорж', 'Рэнцэндорж Баасандорж', 
  'Рэнцэндорж', 'Баасандорж', 'УХ93062515', '90212406', 'r.baaska0625@gmail.com', 
  '103 яаралтай эмч', '502Д байр, 32 тоот', '502Д байр', '32', 8, 
  '32', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 17, 60, 
  46.25, 51847175, 60254825, 43, 
  25, 0, 1401275, 0, 
  48740, 13, 18217, 634, 0, 
  'Хугацаа хэтэрсэн', 1419492, 49374, 1468866
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-065', 'DGA-502-134', '2024-01-01', 'М. Энхболд', 'Мягмарсүрэн Энхболд', 
  'Мягмарсүрэн', 'Энхболд', 'ЕЮ86121134, ЕЭ83071868', '96999660', 'zac.enkhbold@gmail.com', 
  'Боловсрол соёлын газрын дарга', '502В байр, 33 тоот', '502В байр', '33', 9, 
  '33', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 24, 60, 
  55, 68803362, 56293638, 36, 
  25, 938228, 625485, 54390, 
  0, 4, 2502, 0, 0, 
  'Дутуу төлсөн', 627987, 0, 627987
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-066', 'DGA-502-116', '2024-01-01', 'Б. Сайханбилэг', 'Батсайхан Сайханбилэг', 
  'Батсайхан', 'Сайханбилэг', 'ЕП96040654', '90949996, 91289388', 'dddeegii142@gmail.com', 
  'Хувиараа 6-р баг', '502Д байр, 33 тоот', '502Д байр', '33', 9, 
  '33', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 31, 60, 
  63.75, 79749353, 45347647, 29, 
  25, 1563713, 0, 0, 
  54390, 7, 0, 381, 0, 
  'СӨХ төлөөгүй', 0, 54771, 54771
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-067', 'DGA-502-107', '2024-01-01', 'Д. Цэрэндагва', 'Дорждэрэм Цэрэндагва', 
  'Дорждэрэм', 'Цэрэндагва', 'ЕГ97070918', '96848841, 95112243', 'tserendagwad@gmail.com', 
  'ЦТС', '502В байр, 34 тоот', '502В байр', '34', 9, 
  '34', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 2, 60, 
  27.5, 34401676, 90695324, 58, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-068', 'DGA-502-096', '2024-01-01', 'Е. Ганшүр', 'Ерөөлтхуяг Ганшүр', 
  'Ерөөлтхуяг', 'Ганшүр', 'ЕЮ01221205', '80826644, 95730925', 'ganshur021212@gmail.com', 
  'Оюутолгой', '502Д байр, 34 тоот', '502Д байр', '34', 9, 
  '34', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 9, 60, 
  36.25, 45347667, 79749333, 51, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-069', 'DGA-502-125', '2024-01-01', 'М. Жаргалмаа', 'Мөнхбат Жаргалмаа', 
  'Мөнхбат', 'Жаргалмаа', 'ЖЖ93040501', '99276840, 99569520', 'jagi8802@gmail.com', 
  '1-р сургууль', '502В байр, 35 тоот', '502В байр', '35', 9, 
  '35', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 16, 60, 
  45, 50445900, 61656100, 44, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-070', 'DGA-502-070', '2024-01-01', 'эзэнгүй', 'эзэнгүй', 
  '', 'эзэнгүй', '', '', 'эзэнгүй', 
  '', '502Д байр, 35 тоот', '502Д байр', '35', 9, 
  '35', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 23, 60, 
  53.75, 60254825, 51847175, 37, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-071', 'DGA-502-071', '2024-01-01', 'Б. Хүрэлтулга', 'Баттулга Хүрэлтулга', 
  'Баттулга', 'Хүрэлтулга', 'УЮ95031813', '89118252', 'hurlee95@gmail.com', 
  'Нэгдсэн эмнэлэг', '502В байр, 36 тоот', '502В байр', '36', 9, 
  '36', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 30, 60, 
  62.5, 64745000, 38847000, 30, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-072', 'DGA-502-136', '2024-01-01', 'Э. Чулуунцэцэг', 'Эрдэнэчулуун Чулуунцэцэг', 
  'Эрдэнэчулуун', 'Чулуунцэцэг', 'КК86060606', '99923699', 'chuluunaa_1986@yahoo.com', 
  'Мандах сумын эрүүл мэндийн эмчлэгч эмч', '502Д байр, 36 тоот', '502Д байр', '36', 9, 
  '36', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 1, 60, 
  26.25, 27192900, 76399100, 59, 
  25, 0, 1294900, 0, 
  45040, 7, 9064, 315, 0, 
  'Хугацаа хэтэрсэн', 1303964, 45355, 1349319
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-073', 'DGA-502-020', '2024-01-01', 'О. Маам', 'Очирбат Маам', 
  'Очирбат', 'Маам', 'ЕВ37070501', '89119182, 80188864', 'bilgeee843@gmail.com', 
  'Тэтгэвэрт', '502В байр, 37 тоот', '502В байр', '37', 10, 
  '37', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 8, 60, 
  35, 36257200, 67334800, 52, 
  25, 776940, 517960, 45040, 
  0, 4, 2072, 0, 0, 
  'Дутуу төлсөн', 520032, 0, 520032
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-074', 'DGA-502-068', '2024-01-01', 'Н. Ангараг', 'Найдансүрэн Ангараг', 
  'Найдансүрэн', 'Ангараг', 'ЕЭ55020860', '91822200', 'oyunkhishigdashdorj@gmail.com', 
  'Тэтгэвэрт', '502Д байр, 37 тоот', '502Д байр', '37', 10, 
  '37', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 15, 60, 
  43.75, 45321500, 58270500, 45, 
  25, 1294900, 0, 0, 
  45040, 7, 0, 315, 0, 
  'СӨХ төлөөгүй', 0, 45355, 45355
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-075', 'DGA-502-021', '2024-01-01', 'Л. Батбаяр', 'Лхагва Батбаяр', 
  'Лхагва', 'Батбаяр', 'ЕБ78012219', '96848505, 88634355, 91282803', 'anujintvwshinbayr@gmail.com', 
  'малчин', '502В байр, 38 тоот', '502В байр', '38', 10, 
  '38', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 22, 60, 
  52.5, 58853550, 53248450, 38, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-076', 'DGA-502-097', '2024-01-01', 'Ц. Батбаатар', 'Цэдэв Батбаатар', 
  'Цэдэв', 'Батбаатар', 'ЕЮ61042618', '88150951, 88065988, 88052688-сувдаа', 'Royalque_s@yahoo.com', 
  '', '502Д байр, 38 тоот', '502Д байр', '38', 10, 
  '38', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 29, 60, 
  61.25, 68662475, 43439525, 31, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-077', 'DGA-502-103', '2024-01-01', 'Ж. Маам', 'Жигмэд Маам', 
  'Жигмэд', 'Маам', 'ЕЭ34010761', '96527070, 88076724', 'Marshall_master57@yahoo.com', 
  '6-р баг тэтгэвэрт', '502В байр, 39 тоот', '502В байр', '39', 10, 
  '39', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 36, 60, 
  70, 87567918, 37529082, 24, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-078', 'DGA-502-040', '2024-01-01', 'Ц. Хандсожил', 'Цэвэлмаа Хандсожил', 
  'Цэвэлмаа', 'Хандсожил', 'ЕБ46050622', '94388333 96890404', 'erdenetsetsegodontungalag4@gmail.com', 
  'Алтанширээ', '502Д байр, 39 тоот', '502Д байр', '39', 10, 
  '39', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 7, 60, 
  33.75, 42220241, 82876759, 53, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-079', 'DGA-502-063', '2024-01-01', 'С. Амаржаргал', 'Санзайжамц Амаржаргал', 
  'Санзайжамц', 'Амаржаргал', 'ХЕ64070105', '91666528, 88961119', 'amarj3779@gmail.com', 
  '6-р баг тэтгэвэрт', '502В байр, 40 тоот', '502В байр', '40', 10, 
  '40', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 14, 60, 
  42.5, 53166232, 71930768, 46, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-080', 'DGA-502-007', '2024-01-01', 'Т. Алтантуяа', 'Төмөрсүх Алтантуяа', 
  'Төмөрсүх', 'Алтантуяа', 'ЕЭ88071369', '88012146, 86012146', 'naranbaatar.naidanjav@gmail.com', 
  'нэгдсэн эмнэлэг', '502Д байр, 40 тоот', '502Д байр', '40', 10, 
  '40', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 21, 60, 
  51.25, 64112223, 60984777, 39, 
  25, 0, 1563713, 0, 
  54390, 15, 23456, 816, 0, 
  'Хугацаа хэтэрсэн', 1587169, 55206, 1642375
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-081', 'DGA-502-024', '2024-01-01', 'Ш. Чулуун', 'Шийнэн Чулуун', 
  'Шийнэн', 'Чулуун', 'ЕЕ53042709', '80170427,', 'dteacher0308@gmail.com', 
  'мандах сум', '502В байр, 41 тоот', '502В байр', '41', 11, 
  '41', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 28, 60, 
  60, 67261200, 44840800, 32, 
  25, 840765, 560510, 48740, 
  0, 4, 2242, 0, 0, 
  'Дутуу төлсөн', 562752, 0, 562752
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-082', 'DGA-502-073', '2024-01-01', 'Б. Эрдэнэ', 'Бадмааваанжил Эрдэнэ', 
  'Бадмааваанжил', 'Эрдэнэ', 'ЕЗ61020202', '99907013, 99026105', 'erdeneb0202@gmail.com', 
  'Тэтгэвэрт', '502Д байр, 41 тоот', '502Д байр', '41', 11, 
  '41', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 35, 60, 
  68.75, 77070125, 35031875, 25, 
  25, 1401275, 0, 0, 
  48740, 7, 0, 341, 0, 
  'СӨХ төлөөгүй', 0, 49081, 49081
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-083', 'DGA-502-027', '2024-01-01', 'Ц. Жаргалсайхан', 'Цэрэнцоо Жаргалсайхан', 
  'Цэрэнцоо', 'Жаргалсайхан', 'ЕЦ60081874', '98622718, 80509496', 'uransaikhan1986@gmail.com', 
  'Тэтгэвэрт', '502В байр, 42 тоот', '502В байр', '42', 11, 
  '42', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 6, 60, 
  32.5, 33667400, 69924600, 54, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-084', 'DGA-502-084', '2024-01-01', 'О. Оффис', 'Оффис Оффис', 
  'Оффис', 'Оффис', 'ЕЛ83101807', 'Оффис', 'оффис', 
  'ОНӨААТҮГ', '502Д байр, 42 тоот', '502Д байр', '42', 11, 
  '42', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 13, 60, 
  41.25, 42731700, 60860300, 47, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-085', 'DGA-502-077', '2024-01-01', 'Т. Нэмэх', 'Төмөрзүрх Нэмэх', 
  'Төмөрзүрх', 'Нэмэх', 'ЕА56062017', '99613304, 80206141', 'narantsatsral9961@gmail.com', 
  'Айраг ЭМТ хамтран түрээслэгч', '502В байр, 43 тоот', '502В байр', '43', 11, 
  '43', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 20, 60, 
  50, 51796000, 51796000, 40, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-086', 'DGA-502-084', '2024-01-01', 'Д. Шинэбаяр', 'Даваасүрэн Шинэбаяр', 
  'Даваасүрэн', 'Шинэбаяр', 'ЕЦ72122163', '94114663', 'shineeshinebayar42@gmail.com', 
  'Соёлын төв', '502Д байр, 43 тоот', '502Д байр', '43', 11, 
  '43', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 27, 60, 
  58.75, 60860300, 42731700, 33, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-087', 'DGA-502-057', '2024-01-01', 'П. Оюунбилэг', 'Пэлжээ Оюунбилэг', 
  'Пэлжээ', 'Оюунбилэг', 'ЕС55082037', '91395550, 91195550.95850508тунгалаг', 'цаасаар хүргэх /настай хүн байдаг/', 
  'Тэтгэвэрт', '502В байр, 44 тоот', '502В байр', '44', 11, 
  '44', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 34, 60, 
  67.5, 75668850, 36433150, 26, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-088', 'DGA-502-095', '2024-01-01', 'Х. Мөнхбат', 'Хаддорж Мөнхбат', 
  'Хаддорж', 'Мөнхбат', 'ЕЭ87012579', '96693145', 'haddorjbat@gmail.com', 
  'нэгдсэн эмнэлэг', '502Д байр, 44 тоот', '502Д байр', '44', 11, 
  '44', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 5, 60, 
  31.25, 35031875, 77070125, 55, 
  25, 0, 1401275, 0, 
  48740, 9, 12611, 439, 0, 
  'Хугацаа хэтэрсэн', 1413886, 49179, 1463065
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-089', 'DGA-502-047', '2024-01-01', 'Ө. Навчаа', 'Өлгийт Навчаа', 
  'Өлгийт', 'Навчаа', 'ЕЕ75022100', '96013052, 96023052', 'unavchaa0221@gmail.com', 
  'Гуа тээг бөс барааны дэлгүүр', '502В байр, 45 тоот', '502В байр', '45', 12, 
  '45', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 12, 60, 
  40, 50038806, 75058194, 48, 
  25, 938228, 625485, 54390, 
  0, 4, 2502, 0, 0, 
  'Дутуу төлсөн', 627987, 0, 627987
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-090', 'DGA-502-046', '2024-01-01', 'С. Чулуун', 'Соном Чулуун', 
  'Соном', 'Чулуун', 'ЕЛ47092611', '80477144....88159800ариунаа', 'ariunaakh2001@gmail.com', 
  'Хатанбулаг Тэтгэвэрт', '502Д байр, 45 тоот', '502Д байр', '45', 12, 
  '45', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 19, 60, 
  48.75, 60984797, 64112203, 41, 
  25, 1563713, 0, 0, 
  54390, 7, 0, 381, 0, 
  'СӨХ төлөөгүй', 0, 54771, 54771
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-091', 'DGA-502-078', '2024-01-01', 'Д. Оюунчимэг', 'Дуламсүрэн Оюунчимэг', 
  'Дуламсүрэн', 'Оюунчимэг', 'ЕД58082588', '88261308, 91397739', 'oyunchimeg5888@gmail.com', 
  '4-р баг тэтгэвэрт', '502В байр, 46 тоот', '502В байр', '46', 12, 
  '46', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 26, 60, 
  57.5, 71930788, 53166212, 34, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-092', 'DGA-502-133', '2024-01-01', 'С. Энх-Эрдэнэ', 'Сумъяа Энх-Эрдэнэ', 
  'Сумъяа', 'Энх-Эрдэнэ', 'ЕБ91021316', '', 'S.Enkh3888@gmail.com', 
  '', '502Д байр, 46 тоот', '502Д байр', '46', 12, 
  '46', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 33, 60, 
  66.25, 82876779, 42220221, 27, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-093', 'DGA-502-060', '2024-01-01', 'Б. Ганболд', 'Бадарчин Ганболд', 
  'Бадарчин', 'Ганболд', 'ЕБ55083115', '99262363', 'munkhtvwshin.05@gmail.com', 
  '', '502В байр, 47 тоот', '502В байр', '47', 12, 
  '47', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 4, 60, 
  30, 33630600, 78471400, 56, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-094', 'DGA-502-119', '2024-01-01', 'Ц. Бямбажав', 'Цэндсүрэн Бямбажав', 
  'Цэндсүрэн', 'Бямбажав', 'СМ64060606', '99170140,', 'byambajav435@gmail.com', 
  'Сайншанд гаалийн газар', '502Д байр, 47 тоот', '502Д байр', '47', 12, 
  '47', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 11, 60, 
  38.75, 43439525, 68662475, 49, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-095', 'DGA-502-056', '2024-01-01', 'Х. Мөнхбаатар', 'Хамбадай Мөнхбаатар', 
  'Хамбадай', 'Мөнхбаатар', 'ЕН62061813', '89792777, 86792777', 'm.tselmeg6na@gmail.com', 
  'Эрдэнэ сум', '502В байр, 48 тоот', '502В байр', '48', 12, 
  '48', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 18, 60, 
  47.5, 49206200, 54385800, 42, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-096', 'DGA-502-086', '2024-01-01', 'Г. Мөнхжаргал', 'Гомбожав Мөнхжаргал', 
  'Гомбожав', 'Мөнхжаргал', 'ЕЭ55020763', '99528118 96502688', 'monhzargalgombozav@gmail.com', 
  '3-р баг тэтгэвэрт', '502Д байр, 48 тоот', '502Д байр', '48', 12, 
  '48', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 25, 60, 
  56.25, 58270500, 45321500, 35, 
  25, 0, 1294900, 0, 
  45040, 17, 22013, 766, 0, 
  'Хугацаа хэтэрсэн', 1316913, 45806, 1362719
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-097', 'DGA-502-006', '2024-01-01', 'Э. Энхнаран', 'Энхмэнд Энхнаран', 
  'Энхмэнд', 'Энхнаран', 'ЕЭ93071601', '96974647', 'e.enkhnaran0204@gmail.com', 
  'нэгдсэн эмнэлэг', '502В байр, 49 тоот', '502В байр', '49', 13, 
  '49', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 32, 60, 
  65, 67334800, 36257200, 28, 
  25, 776940, 517960, 45040, 
  0, 4, 2072, 0, 0, 
  'Дутуу төлсөн', 520032, 0, 520032
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-098', 'DGA-502-034', '2024-01-01', 'Г. Ганжаргал', 'Ганчулуун Ганжаргал', 
  'Ганчулуун', 'Ганжаргал', 'ЕЮ84073026', '91166116, 96653536', 'ganjargal6069@gmail.com', 
  '2-р цэцэрлэг', '502Д байр, 49 тоот', '502Д байр', '49', 13, 
  '49', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 3, 60, 
  28.75, 29782700, 73809300, 57, 
  25, 1294900, 0, 0, 
  45040, 7, 0, 315, 0, 
  'СӨХ төлөөгүй', 0, 45355, 45355
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-099', 'DGA-502-109', '2024-01-01', 'Ө. Өлзийсайхан', 'Өлзийхутаг Өлзийсайхан', 
  'Өлзийхутаг', 'Өлзийсайхан', 'ЕЮ89060807', '90906100,', 'pvsa.8990@gmail.com', 
  '6-р сургууль', '502В байр, 50 тоот', '502В байр', '50', 13, 
  '50', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 10, 60, 
  37.5, 42038250, 70063750, 50, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-100', 'DGA-502-014', '2024-01-01', 'Г. Хулан', 'Ганболд Хулан', 
  'Ганболд', 'Хулан', 'ЕБ97111808', '96061663', 'khulanganbold29@gmail.com', 
  'нэгдсэн эмнэлэг', '502Д байр, 50 тоот', '502Д байр', '50', 13, 
  '50', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 17, 60, 
  46.25, 51847175, 60254825, 43, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-101', 'DGA-502-123', '2024-01-01', 'Ц. Дэлгэрмаа', 'Цэдэнсодном Дэлгэрмаа', 
  'Цэдэнсодном', 'Дэлгэрмаа', 'АЯ91110922', '99877173, 88939634', 'Tsdeegii1109@gmail.com', 
  '3-р сургууль', '502В байр, 51 тоот', '502В байр', '51', 13, 
  '51', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 24, 60, 
  55, 68803362, 56293638, 36, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-102', 'DGA-502-135', '2024-01-01', 'Т. Тэгш-Эрдэнэ', 'Тэгшбаяр Тэгш-Эрдэнэ', 
  'Тэгшбаяр', 'Тэгш-Эрдэнэ', 'КЮ79021861', '99066544', 'tegsherdene.2021@gmail.com', 
  'Нэгдсэн эмнэлэг', '502Д байр, 51 тоот', '502Д байр', '51', 13, 
  '51', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 31, 60, 
  63.75, 79749353, 45347647, 29, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-103', 'DGA-502-092', '2024-01-01', 'И. Адъяаням', 'Ишгээ Адъяаням', 
  'Ишгээ', 'Адъяаням', 'ЕК59082569', '99220134, 96969100', 'nyamishigee@gmail.com', 
  'Улаанбадрах', '502В байр, 52 тоот', '502В байр', '52', 13, 
  '52', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 2, 60, 
  27.5, 34401676, 90695324, 58, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-104', 'DGA-502-129', '2024-01-01', 'Т. Лхагвасүрэн', 'Төмөрпүрэв Лхагвасүрэн', 
  'Төмөрпүрэв', 'Лхагвасүрэн', 'ЖЯ91040319', '90868601', 'Lglhagvaa4@gmail.com', 
  'Нэгдсэн эмнэлэг-дүрс оношлогооны эмч', '502Д байр, 52 тоот', '502Д байр', '52', 13, 
  '52', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 9, 60, 
  36.25, 45347667, 79749333, 51, 
  25, 0, 1563713, 0, 
  54390, 11, 17201, 598, 0, 
  'Хугацаа хэтэрсэн', 1580914, 54988, 1635902
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-105', 'DGA-502-011', '2024-01-01', 'С. Сониу', 'Сономдаржаа Сониу', 
  'Сономдаржаа', 'Сониу', 'ЧТ48112065', '96665566-хамтран, 96220003-бэр', 'narantuya1107@gmail.com', 
  '5-р баг тэтгэвэрт', '502В байр, 53 тоот', '502В байр', '53', 14, 
  '53', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 16, 60, 
  45, 50445900, 61656100, 44, 
  25, 840765, 560510, 48740, 
  0, 4, 2242, 0, 0, 
  'Дутуу төлсөн', 562752, 0, 562752
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-106', 'DGA-502-080', '2024-01-01', 'Л. Ханд', 'Лувсаншарав Ханд', 
  'Лувсаншарав', 'Ханд', 'ЕМ47021666', '88552928, 89379292', 'Enkhmanlai0427@gmail.com', 
  '1-р баг Жавхлант', '502Д байр, 53 тоот', '502Д байр', '53', 14, 
  '53', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 23, 60, 
  53.75, 60254825, 51847175, 37, 
  25, 1401275, 0, 0, 
  48740, 7, 0, 341, 0, 
  'СӨХ төлөөгүй', 0, 49081, 49081
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-107', 'DGA-502-015', '2024-01-01', 'Л. Бүнчин', 'Лхам Бүнчин', 
  'Лхам', 'Бүнчин', 'ЛИ91060715', '86757777, 88980211', 'bvnchinlham@gmail.com', 
  '', '502В байр, 54 тоот', '502В байр', '54', 14, 
  '54', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 30, 60, 
  62.5, 64745000, 38847000, 30, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-108', 'DGA-502-005', '2024-01-01', 'М. Наранчимэг', 'Мягмаржав Наранчимэг', 
  'Мягмаржав', 'Наранчимэг', 'ЕБ91052903', '80013136', 'nn5609797@gmail.com', 
  '1-р сургууль', '502Д байр, 54 тоот', '502Д байр', '54', 14, 
  '54', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 1, 60, 
  26.25, 27192900, 76399100, 59, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-109', 'DGA-502-104', '2024-01-01', 'У. Амгаланбаатар', 'Ухна Амгаланбаатар', 
  'Ухна', 'Амгаланбаатар', 'ЕЗ73071316', '95117588, 90479696', 'erdenesuvd1031@gmail.com', 
  'Сайхандулаан сум 2-р баг', '502В байр, 55 тоот', '502В байр', '55', 14, 
  '55', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 8, 60, 
  35, 36257200, 67334800, 52, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-110', 'DGA-502-003', '2024-01-01', 'А. Тунгалагтуяа', 'Ангарагсүрэн Тунгалагтуяа', 
  'Ангарагсүрэн', 'Тунгалагтуяа', 'ЕЦ87022169', '80804149, 99075379,', 'Tungalagtuyatungaa2@gmail.com', 
  'Төрийн банк', '502Д байр, 55 тоот', '502Д байр', '55', 14, 
  '55', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 15, 60, 
  43.75, 45321500, 58270500, 45, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-111', 'DGA-502-085', '2024-01-01', 'С. Мөнхбат', 'Соёмбо Мөнхбат', 
  'Соёмбо', 'Мөнхбат', 'РГ92093017', '80031113, 95161600', 'moogii1929@gmail.com', 
  'Төмөрзам татах хэсэг', '502В байр, 56 тоот', '502В байр', '56', 14, 
  '56', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 22, 60, 
  52.5, 58853550, 53248450, 38, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-112', 'DGA-502-039', '2024-01-01', 'Ж. Наранбат', 'Жанлав Наранбат', 
  'Жанлав', 'Наранбат', 'ХО64101571', '99295675', 'цаасаар хүргэх /мэйл хаяг байхгүй/', 
  '', '502Д байр, 56 тоот', '502Д байр', '56', 14, 
  '56', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 29, 60, 
  61.25, 68662475, 43439525, 31, 
  25, 0, 1401275, 0, 
  48740, 5, 7006, 244, 0, 
  'Хугацаа хэтэрсэн', 1408281, 48984, 1457265
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-113', 'DGA-502-094', '2024-01-01', 'Э. Дэлгэрбаяр', 'Энхбаатар Дэлгэрбаяр', 
  'Энхбаатар', 'Дэлгэрбаяр', 'СЖ96102903', '90201029, 90201026', 'Enhbaatardelgerbayar@gmail.com', 
  'нэгдсэн эмнэлэг', '502В байр, 57 тоот', '502В байр', '57', 15, 
  '57', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 36, 60, 
  70, 87567918, 37529082, 24, 
  25, 938228, 625485, 54390, 
  0, 4, 2502, 0, 0, 
  'Дутуу төлсөн', 627987, 0, 627987
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-114', 'DGA-502-089', '2024-01-01', 'Ч. Энх-Амгалан', 'Чимэд Энх-Амгалан', 
  'Чимэд', 'Энх-Амгалан', 'ЕЮ57120206', '99121566, 93435555-хүү нь', 'Damdinbatsaikhan@mail.com', 
  'Тэтгэвэрт', '502Д байр, 57 тоот', '502Д байр', '57', 15, 
  '57', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 7, 60, 
  33.75, 42220241, 82876759, 53, 
  25, 1563713, 0, 0, 
  54390, 7, 0, 381, 0, 
  'СӨХ төлөөгүй', 0, 54771, 54771
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-115', 'DGA-502-081', '2024-01-01', 'Б. Анхбаяр', 'Батсайхан Анхбаяр', 
  'Батсайхан', 'Анхбаяр', 'ЕБ93081418', '90093646, 88844060', 'b.anhaa0814@yahoo.com', 
  'Дорноговь Прокурорын газар', '502В байр, 58 тоот', '502В байр', '58', 15, 
  '58', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 14, 60, 
  42.5, 53166232, 71930768, 46, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-116', 'DGA-502-130', '2024-01-01', 'Б. Баттайван', 'Батболд Баттайван', 
  'Батболд', 'Баттайван', 'ЕЗ88121512', '90097052', 'battaivan89@gmail.com', 
  '', '502Д байр, 58 тоот', '502Д байр', '58', 15, 
  '58', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 21, 60, 
  51.25, 64112223, 60984777, 39, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-117', 'DGA-502-019', '2024-01-01', 'У. Өлзийсайхан', 'Ухна Өлзийсайхан', 
  'Ухна', 'Өлзийсайхан', 'ЕЭ71061768', '86660153, 99324086', 'olzii8490@gmail.com', 
  '3-р цэцэрлэг', '502В байр, 59 тоот', '502В байр', '59', 15, 
  '59', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 28, 60, 
  60, 67261200, 44840800, 32, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-118', 'DGA-502-112', '2024-01-01', 'С. Эрдэнэжаргал', 'Сэдээ Эрдэнэжаргал', 
  'Сэдээ', 'Эрдэнэжаргал', 'ЕЭ73121578', '96527777', 'мэссэжээр явуулна гэсэн', 
  'Нүүрс ХХК', '502Д байр, 59 тоот', '502Д байр', '59', 15, 
  '59', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 35, 60, 
  68.75, 77070125, 35031875, 25, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-119', 'DGA-502-064', '2024-01-01', 'Н. Баярсайн', 'Нямсүрэн Баярсайн', 
  'Нямсүрэн', 'Баярсайн', 'ЕЭ72110372', '99724222, 90082224', 'altaibaysaa@gmail.com', 
  '6-р цэцэрлэг', '502В байр, 60 тоот', '502В байр', '60', 15, 
  '60', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 6, 60, 
  32.5, 33667400, 69924600, 54, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-120', 'DGA-502-099', '2024-01-01', 'Х. Оюунханд', 'Халзан Оюунханд', 
  'Халзан', 'Оюунханд', 'ЕЗ75092109', '88928088', 'oyukhai44@gmail.com', 
  '', '502Д байр, 60 тоот', '502Д байр', '60', 15, 
  '60', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 13, 60, 
  41.25, 42731700, 60860300, 47, 
  25, 0, 1294900, 0, 
  45040, 13, 16834, 586, 0, 
  'Хугацаа хэтэрсэн', 1311734, 45626, 1357360
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-121', 'DGA-502-072', '2024-01-01', 'М. Алтантуяа', 'Мөнхцэцэг Алтантуяа', 
  'Мөнхцэцэг', 'Алтантуяа', 'ЖЯ92040502', '91070400, 80310400, 88216166', 'altantuya061419@gmail.com', 
  '', '502В байр, 61 тоот', '502В байр', '61', 16, 
  '61', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 20, 60, 
  50, 51796000, 51796000, 40, 
  25, 776940, 517960, 45040, 
  0, 4, 2072, 0, 0, 
  'Дутуу төлсөн', 520032, 0, 520032
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-122', 'DGA-502-018', '2024-01-01', 'Б. Орхонсэлэнгэ', 'Баярлах Орхонсэлэнгэ', 
  'Баярлах', 'Орхонсэлэнгэ', 'ЕЛ82062602', '88489036', 'Selengeeb72@gmail.com', 
  'Дорноговь орон сууц', '502Д байр, 61 тоот', '502Д байр', '61', 16, 
  '61', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 27, 60, 
  58.75, 60860300, 42731700, 33, 
  25, 1294900, 0, 0, 
  45040, 7, 0, 315, 0, 
  'СӨХ төлөөгүй', 0, 45355, 45355
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-123', 'DGA-502-066', '2024-01-01', 'Ц. Чойсүрэн', 'Цэсэнхүү Чойсүрэн', 
  'Цэсэнхүү', 'Чойсүрэн', 'ТИ67040917', '88877910, 88221355', 'enkh88877910@gmail.com', 
  'Содмонгол', '502В байр, 62 тоот', '502В байр', '62', 16, 
  '62', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 34, 60, 
  67.5, 75668850, 36433150, 26, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-124', 'DGA-502-111', '2024-01-01', 'О. Даваасүрэн', 'Ооёо Даваасүрэн', 
  'Ооёо', 'Даваасүрэн', 'ЛИ82060768', '98020030', 'enkuk0906@gmail.com', 
  'Дэлгэрэх сум ЕБС', '502Д байр, 62 тоот', '502Д байр', '62', 16, 
  '62', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 5, 60, 
  31.25, 35031875, 77070125, 55, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-125', 'DGA-502-058', '2024-01-01', 'А. Амарбаяр', 'Амаржаргал Амарбаяр', 
  'Амаржаргал', 'Амарбаяр', 'ЕЭ99052310', '80929218, 99640810', 'amaraa9218@gmail.com', 
  'Сайншанд инфинити спэйс ХХК', '502В байр, 63 тоот', '502В байр', '63', 16, 
  '63', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 12, 60, 
  40, 50038806, 75058194, 48, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-126', 'DGA-502-041', '2024-01-01', 'Ц. Баярцэнгэл', 'Цэвээнсамбуу Баярцэнгэл', 
  'Цэвээнсамбуу', 'Баярцэнгэл', 'ЕЕ91120319', '99153240, 90153240', 'Ts99153240@gmail.com', 
  '', '502Д байр, 63 тоот', '502Д байр', '63', 16, 
  '63', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 19, 60, 
  48.75, 60984797, 64112203, 41, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-127', 'DGA-502-029', '2024-01-01', 'М. Мөнхзул', 'Мэндсайхан Мөнхзул', 
  'Мэндсайхан', 'Мөнхзул', 'УК94032684', '96119931, 99019746', 'bombvvsh.iw@gmail.com', 
  'нэгдсэн эмнэлэг', '502В байр, 64 тоот', '502В байр', '64', 16, 
  '64', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 26, 60, 
  57.5, 71930788, 53166212, 34, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-128', 'DGA-502-131', '2024-01-01', 'Б. Аюурзана', 'Бат-Очир Аюурзана', 
  'Бат-Очир', 'Аюурзана', 'ЛЙ88031072', '99233361', 'ayur3332@gmail.com', 
  '', '502Д байр, 64 тоот', '502Д байр', '64', 16, 
  '64', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 33, 60, 
  66.25, 82876779, 42220221, 27, 
  25, 0, 1563713, 0, 
  54390, 7, 10946, 381, 0, 
  'Хугацаа хэтэрсэн', 1574659, 54771, 1629430
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-129', 'DGA-502-008', '2024-01-01', 'Н. Энхбаяр', 'Найдан Энхбаяр', 
  'Найдан', 'Энхбаяр', 'ЕЭ85100769', '88928808,', 'enhbayrenhbayr747@gmail.com', 
  '3-р сургууль', '502В байр, 65 тоот', '502В байр', '65', 17, 
  '65', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 4, 60, 
  30, 33630600, 78471400, 56, 
  25, 840765, 560510, 48740, 
  0, 4, 2242, 0, 0, 
  'Дутуу төлсөн', 562752, 0, 562752
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-130', 'DGA-502-137', '2024-01-01', 'Т. Эрдничимиг', 'Тодан Эрдничимиг', 
  'Тодан', 'Эрдничимиг', 'ЮД87082809, ЕЮ88022718', '88907949', 'Skydance999@mail.ru', 
  '2-р сургууль', '502Д байр, 65 тоот', '502Д байр', '65', 17, 
  '65', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 11, 60, 
  38.75, 43439525, 68662475, 49, 
  25, 1401275, 0, 0, 
  48740, 7, 0, 341, 0, 
  'СӨХ төлөөгүй', 0, 49081, 49081
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-131', 'DGA-502-016', '2024-01-01', 'А. Эрдэнэбаатар', 'Амгаланбаатар Эрдэнэбаатар', 
  'Амгаланбаатар', 'Эрдэнэбаатар', 'ЕЮ90121233', '90906465', 'etuya385@gmail.com', 
  'Аймгийн ЗДТГ', '502В байр, 66 тоот', '502В байр', '66', 17, 
  '66', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 18, 60, 
  47.5, 59421084, 65675916, 42, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-132', 'DGA-502-022', '2024-01-01', 'Д. Батцэцэг', 'Дэлгэрсайхан Батцэцэг', 
  'Дэлгэрсайхан', 'Батцэцэг', 'жь80070452', '89987307', 'battsetseg.de@gmail.com', 
  'НЭ-их эмч', '502Д байр, 66 тоот', '502Д байр', '66', 17, 
  '66', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 25, 60, 
  56.25, 58270500, 45321500, 35, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-133', 'DGA-502-127', '2024-01-01', 'Б. Ургацаа', 'Баттогтох Ургацаа', 
  'Баттогтох', 'Ургацаа', 'ЖЭ62041503', '85059076', 'urgatsaa6@gmail.com', 
  'ЕБС', '502Д байр, 67 тоот', '502Д байр', '67', 17, 
  '67', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 32, 60, 
  65, 67334800, 36257200, 28, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-134', 'DGA-502-110', '2024-01-01', 'Г. Гэрэлмаа', 'Ганбаатар Гэрэлмаа', 
  'Ганбаатар', 'Гэрэлмаа', 'ЕЮ89091300', '96099668, 99525250', 'ganbaatargerelmaa7@gmail.com', 
  'Амгийн онцгой байдлын газар', '502В байр, 67 тоот', '502В байр', '67', 17, 
  '67', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 3, 60, 
  28.75, 29782700, 73809300, 57, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-135', 'DGA-502-069', '2024-01-01', 'Г. Баярсайхан', 'Гүнчин Баярсайхан', 
  'Гүнчин', 'Баярсайхан', 'ЕД75101762', '99348689,', 'bayarsaikhangunchin@gmail.com', 
  '1-р сургууль багш', '502В байр, 68 тоот', '502В байр', '68', 17, 
  '68', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 10, 60, 
  37.5, 42038250, 70063750, 50, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-136', 'DGA-502-121', '2024-01-01', 'А. Мөнх-Эрдэнэ', 'Аюуш Мөнх-Эрдэнэ', 
  'Аюуш', 'Мөнх-Эрдэнэ', 'ЕБ96122113', '89806969, 89890077,', 'Munkherdene.ayu@gmail.com', 
  'Дорноговь Цагдаагийн газар', '502Д байр, 68 тоот', '502Д байр', '68', 17, 
  '68', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 17, 60, 
  46.25, 51847175, 60254825, 43, 
  25, 0, 1401275, 0, 
  48740, 15, 21019, 731, 0, 
  'Хугацаа хэтэрсэн', 1422294, 49471, 1471765
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-137', 'DGA-502-030', '2024-01-01', 'Т. Эрдэнэмандах', 'Төмөр Эрдэнэмандах', 
  'Төмөр', 'Эрдэнэмандах', 'ФБ91120408', '95771488, 95786744', 'mandakhtudi976@gmail.com', 
  'нэгдсэн эмнэлэг', '502В байр, 69 тоот', '502В байр', '69', 18, 
  '69', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 24, 60, 
  55, 68803362, 56293638, 36, 
  25, 938228, 625485, 54390, 
  0, 4, 2502, 0, 0, 
  'Дутуу төлсөн', 627987, 0, 627987
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-138', 'DGA-502-010', '2024-01-01', 'Э. Түвшинтунгалаг', 'Энхжаргал Түвшинтунгалаг', 
  'Энхжаргал', 'Түвшинтунгалаг', 'ЕЭ86061069', '88331315', 'Tungaadg1@gmail.com', 
  '', '502Д байр, 69 тоот', '502Д байр', '69', 18, 
  '69', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 31, 60, 
  63.75, 79749353, 45347647, 29, 
  25, 1563713, 0, 0, 
  54390, 7, 0, 381, 0, 
  'СӨХ төлөөгүй', 0, 54771, 54771
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-139', 'DGA-502-126', '2024-01-01', 'А. Бямбасүрэн', 'Адьяа Бямбасүрэн', 
  'Адьяа', 'Бямбасүрэн', 'ЕС89032526', '99977276, 89762211', 'bmbka250@gmail.com', 
  '8-р цэцэрлэг', '502В байр, 70 тоот', '502В байр', '70', 18, 
  '70', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 2, 60, 
  27.5, 34401676, 90695324, 58, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-140', 'DGA-502-128', '2024-01-01', 'эзэнгүй', 'эзэнгүй', 
  '', 'эзэнгүй', '', '88354343', 'эзэнгүй@gmail.com', 
  'Нэгдсэн эмнэлэг-сүлжээний инженер', '502Д байр, 70 тоот', '502Д байр', '70', 18, 
  '70', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 9, 60, 
  36.25, 45347667, 79749333, 51, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-141', 'DGA-502-138', '2024-01-01', 'О. Агар-Эрдэнэ', 'Отгондаваа Агар-Эрдэнэ', 
  'Отгондаваа', 'Агар-Эрдэнэ', 'ЕС96032518', '99695157', 'agar340@gmail.com', 
  'Сайншанд Цагдаагын газар', '502В байр, 71 тоот', '502В байр', '71', 18, 
  '71', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 16, 60, 
  45, 50445900, 61656100, 44, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-142', 'DGA-502-142', '2024-01-01', 'И. Идэргарав', 'Ихбаяр Идэргарав', 
  'Ихбаяр', 'Идэргарав', '', '', 'Цаасаар хэвлэсэн', 
  'Онцгой газрын дарга', '502Д байр, 71 тоот', '502Д байр', '71', 18, 
  '71', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 23, 60, 
  53.75, 60254825, 51847175, 37, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-143', 'DGA-502-062', '2024-01-01', 'М. Энхмэнд', 'Мөнхтогоо Энхмэнд', 
  'Мөнхтогоо', 'Энхмэнд', 'ЕЕ84033105', '89257900, 88487900', 'munhtogooenhmend@mail.com', 
  'Мандах сум ЗДТГ', '502В байр, 72 тоот', '502В байр', '72', 18, 
  '72', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 30, 60, 
  62.5, 64745000, 38847000, 30, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-144', 'DGA-502-144', '2024-01-01', 'эзэнгүй', 'эзэнгүй', 
  '', 'эзэнгүй', '', '', 'эзэнгүй', 
  '', '502Д байр, 72 тоот', '502Д байр', '72', 18, 
  '72', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 1, 60, 
  26.25, 27192900, 76399100, 59, 
  25, 0, 1294900, 0, 
  45040, 9, 11654, 405, 0, 
  'Хугацаа хэтэрсэн', 1306554, 45445, 1351999
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-145', 'DGA-502-145', '2024-01-01', 'нийт', 'нийт', 
  '', 'нийт', '', '', 'нийт@gmail.com', 
  '', '502-р байр байр,  тоот', '502-р байр байр', '', 1, 
  '', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 8, 60, 
  35, 36257200, 67334800, 52, 
  25, 776940, 517960, 45040, 
  0, 4, 2072, 0, 0, 
  'Дутуу төлсөн', 520032, 0, 520032
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-146', 'DGA-502-146', '2024-01-01', 'Н. Алдарбаяр', 'Найдан Алдарбаяр', 
  'Найдан', 'Алдарбаяр', 'ЕК75052473', '99023484, 99063484-эхнэр', 'Aldarbayar144@gmail.com', 
  'АИТХ', '502А байр, 32 тоот', '502А байр', '32', 8, 
  '32', 84.76, 2, 194948000, 48737000, 
  146211000, 2436850, 84760, 15, 60, 
  43.75, 85289750, 109658250, 45, 
  25, 2436850, 0, 0, 
  84760, 7, 0, 593, 0, 
  'СӨХ төлөөгүй', 0, 85353, 85353
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-147', 'DGA-502-019', '2024-01-01', 'У. Энхмаа', 'Ухнаа Энхмаа', 
  'Ухнаа', 'Энхмаа', 'ЕН77060800', '91999584, 91999588-нөхөр', 'enhmaa.ith@gmail.com', 
  'Нэгдсэн эмнэлэг', '502А байр, 44 тоот', '502А байр', '44', 11, 
  '44', 84.76, 2, 194948000, 48737000, 
  146211000, 2436850, 84760, 22, 60, 
  52.5, 102347700, 92600300, 38, 
  25, 2436850, 0, 84760, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-148', 'DGA-502-148', '2024-01-01', 'Д. Чоён', 'Даваадорж Чоён', 
  'Даваадорж', 'Чоён', '', '88666522, 88700187', 'choyon1206@gmail.com', 
  'Нэгдсэн эмнэлэг Рентген технекч', '502В байр, 31 тоот', '502В байр', '31', 8, 
  '31', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 29, 60, 
  61.25, 63450100, 40141900, 31, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-149', 'DGA-502-014', '2024-01-01', 'Р. Баасандорж', 'Рэнцэндорж Баасандорж', 
  'Рэнцэндорж', 'Баасандорж', 'УХ93062515', '90212406', 'r.baaska0625@gmail.com', 
  'Нэгдсэн эмнэлэг', '502Д байр, 32 тоот', '502Д байр', '32', 8, 
  '32', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 36, 60, 
  70, 78471400, 33630600, 24, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-150', 'DGA-502-009', '2024-01-01', 'М. Энхболд', 'Мягмарсүрэн Энхболд', 
  'Мягмарсүрэн', 'Энхболд', 'ЕЮ86121134', '96999660', 'zac.enkhbold@gmail.com', 
  'боловсрол', '502В байр, 33 тоот', '502В байр', '33', 9, 
  '33', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 7, 60, 
  33.75, 42220241, 82876759, 53, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-151', 'DGA-502-151', '2024-01-01', 'Б. Хүрэлтулга', 'Баттулга Хүрэлтулга', 
  'Баттулга', 'Хүрэлтулга', '', '89118252', 'hurlee95@gmail.com', 
  'Нэгдсэн эмнэлэг Дотрын эмч', '502В байр, 36 тоот', '502В байр', '36', 9, 
  '36', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 14, 60, 
  42.5, 44026600, 59565400, 46, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-152', 'DGA-502-016', '2024-01-01', 'Х. Мөнхбат', 'Хаддорж Мөнхбат', 
  'Хаддорж', 'Мөнхбат', 'ЕЭ87012579', '96693145', 'haddorjbat@gmail.com', 
  'эмнэлэг', '502Д байр, 44 тоот', '502Д байр', '44', 11, 
  '44', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 21, 60, 
  51.25, 57452275, 54649725, 39, 
  25, 0, 1401275, 0, 
  48740, 17, 23822, 829, 0, 
  'Хугацаа хэтэрсэн', 1425097, 49569, 1474666
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-153', 'DGA-502-011', '2024-01-01', 'Т. Тэгш-Эрдэнэ', 'Тэгшбаяр Тэгш-Эрдэнэ', 
  'Тэгшбаяр', 'Тэгш-Эрдэнэ', 'КЮ79021861', '99066544', 'tegsherdene.2021@gmail.com', 
  'эмнэлэг', '502Д байр, 51 тоот', '502Д байр', '51', 13, 
  '51', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 28, 60, 
  60, 75058214, 50038786, 32, 
  25, 938228, 625485, 54390, 
  0, 4, 2502, 0, 0, 
  'Дутуу төлсөн', 627987, 0, 627987
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-154', 'DGA-502-004', '2024-01-01', 'Т. Лхагвасүрэн', 'Төмөрпүрэв Лхагвасүрэн', 
  'Төмөрпүрэв', 'Лхагвасүрэн', 'ЖЯ91040319', '90868601', 'Lglhagvaa4@gmail.com', 
  'эмнэлэг', '502Д байр, 52 тоот', '502Д байр', '52', 13, 
  '52', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 35, 60, 
  68.75, 86004205, 39092795, 25, 
  25, 1563713, 0, 0, 
  54390, 7, 0, 381, 0, 
  'СӨХ төлөөгүй', 0, 54771, 54771
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-155', 'DGA-502-013', '2024-01-01', 'Ц. Баярцэнгэл', 'Цэвээнсамбуу Баярцэнгэл', 
  'Цэвээнсамбуу', 'Баярцэнгэл', 'ЕЕ91120319', '99153240, 90153240', 'Ts99153240@gmail.com', 
  'эмнэлэг', '502Д байр, 63 тоот', '502Д байр', '63', 16, 
  '63', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 6, 60, 
  32.5, 40656528, 84440472, 54, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-156', 'DGA-502-012', '2024-01-01', 'Т. Эрдничимиг', 'Тодан Эрдничимиг', 
  'Тодан', 'Эрдничимиг', 'ЮД87082809, ЕЮ88022718', '', 'Skydance999@mail.ru', 
  'боловсрол', '502Д байр, 65 тоот', '502Д байр', '65', 17, 
  '65', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 13, 60, 
  41.25, 46242075, 65859925, 47, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-157', 'DGA-502-001', '2024-01-01', 'Б. Ургацаа', 'Баттогтох Ургацаа', 
  'Баттогтох', 'Ургацаа', 'ЖЭ62041503', '85059076', 'urgatsaa6@gmail.com', 
  'боловсрол', '502Д байр, 67 тоот', '502Д байр', '67', 17, 
  '67', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 20, 60, 
  50, 51796000, 51796000, 40, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-158', 'DGA-502-010', '2024-01-01', 'О. Агар-Эрдэнэ', 'Отгондаваа Агар-Эрдэнэ', 
  'Отгондаваа', 'Агар-Эрдэнэ', 'ЕС96032518', '99695157', 'agar340@gmail.com', 
  'Цагдаа', '502В байр, 71 тоот', '502В байр', '71', 18, 
  '71', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 27, 60, 
  58.75, 65859925, 46242075, 33, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-159', 'DGA-502-159', '2024-01-01', 'г. гадаад иргэн', 'гадаад иргэн гадаад иргэн', 
  'гадаад иргэн', 'гадаад иргэн', '', '', 'гадаад иргэн@gmail.com', 
  '', '502Д байр, 35 тоот', '502Д байр', '35', 9, 
  '35', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 34, 60, 
  67.5, 75668850, 36433150, 26, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-160', 'DGA-502-015', '2024-01-01', 'Э. Чулуунцэцэг', 'Эрдэнэчулуун Чулуунцэцэг', 
  'Эрдэнэчулуун', 'Чулуунцэцэг', 'КК86060606', '99923699', 'chuluunaa_1986@yahoo.com', 
  'эмнэлэг', '502Д байр, 36 тоот', '502Д байр', '36', 9, 
  '36', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 5, 60, 
  31.25, 32372500, 71219500, 55, 
  25, 0, 1294900, 0, 
  45040, 11, 14244, 495, 0, 
  'Хугацаа хэтэрсэн', 1309144, 45535, 1354679
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-161', 'DGA-502-161', '2024-01-01', 'о. оффис', 'оффис оффис', 
  'оффис', 'оффис', 'ЕЛ83101807', '70520059', 'оффис@gmail.com', 
  '', '502Д байр, 42 тоот', '502Д байр', '42', 11, 
  '42', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 12, 60, 
  40, 41436800, 62155200, 48, 
  25, 776940, 517960, 45040, 
  0, 4, 2072, 0, 0, 
  'Дутуу төлсөн', 520032, 0, 520032
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-162', 'DGA-502-005', '2024-01-01', 'Б. Баттайван', 'Батболд Баттайван', 
  'Батболд', 'Баттайван', 'НФ85060307', '90097052', 'battaivan89@gmail.com', 
  '', '502Д байр, 58 тоот', '502Д байр', '58', 15, 
  '58', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 19, 60, 
  48.75, 60984797, 64112203, 41, 
  25, 1563713, 0, 0, 
  54390, 7, 0, 381, 0, 
  'СӨХ төлөөгүй', 0, 54771, 54771
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-163', 'DGA-502-003', '2024-01-01', 'М. Алтантуяа', 'Мөнхцэцэг Алтантуяа', 
  'Мөнхцэцэг', 'Алтантуяа', 'ЖЯ92040502', '91070400, 80310400, 88216166', 'altantuya061419@gmail.com', 
  'боловсрол', '502В байр, 61 тоот', '502В байр', '61', 16, 
  '61', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 26, 60, 
  57.5, 59565400, 44026600, 34, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-164', 'DGA-502-002', '2024-01-01', 'Батцэцэг', 'Батцэцэг', 
  '', 'Батцэцэг', 'КЮ97012101', '94459635, 98102710', 'battsetseg.de@gmail.com', 
  '', '502Д байр, 66 тоот', '502Д байр', '66', 17, 
  '66', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 33, 60, 
  66.25, 68629700, 34962300, 27, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-165', 'DGA-502-007', '2024-01-01', 'э. эзэнгүй', 'эзэнгүй эзэнгүй', 
  'эзэнгүй', 'эзэнгүй', 'ЕЭ95021906', '', 'эзэнгүй@gmail.com', 
  '', '502Д байр, 70 тоот', '502Д байр', '70', 18, 
  '70', 54.39, 2, 125097000, 31274250, 
  93822750, 1563713, 54390, 4, 60, 
  30, 37529102, 87567898, 56, 
  25, 1563713, 0, 54390, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-166', 'DGA-502-166', '2024-01-01', 'И. Идэргарав', 'Ихбаяр Идэргарав', 
  'Ихбаяр', 'Идэргарав', '', '', 'Цаасаар хэвлэх', 
  'Онцгой', '502Д байр, 71 тоот', '502Д байр', '71', 18, 
  '71', 48.74, 2, 112102000, 28025500, 
  84076500, 1401275, 48740, 11, 60, 
  38.75, 43439525, 68662475, 49, 
  25, 1401275, 0, 48740, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-167', 'DGA-502-167', '2024-01-01', 'э. эзэнгүй', 'эзэнгүй эзэнгүй', 
  'эзэнгүй', 'эзэнгүй', '', '', 'эзэнгүй@gmail.com', 
  '', '502Д байр, 72 тоот', '502Д байр', '72', 18, 
  '72', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 18, 60, 
  47.5, 49206200, 54385800, 42, 
  25, 1294900, 0, 45040, 
  0, 0, 0, 0, 0, 
  'Бүрэн төлсөн', 0, 0, 0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-168', 'DGA-502-168', '2024-01-01', 'д72 эзэнгүй', 'д72 эзэнгүй', 
  '', 'д72 эзэнгүй', '', '', 'д72 эзэнгүй@gmail.com', 
  '', '502-р байр байр,  тоот', '502-р байр байр', '', 1, 
  '', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 25, 60, 
  56.25, 58270500, 45321500, 35, 
  25, 0, 1294900, 0, 
  45040, 5, 6475, 225, 0, 
  'Хугацаа хэтэрсэн', 1301375, 45265, 1346640
) ON CONFLICT (id) DO NOTHING;
INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  'RES-502-169', 'DGA-502-169', '2024-01-01', 'д70 эзэнгүй', 'д70 эзэнгүй', 
  '', 'д70 эзэнгүй', '', '', 'д70 эзэнгүй@gmail.com', 
  '', '502-р байр байр,  тоот', '502-р байр байр', '', 1, 
  '', 45.04, 2, 103592000, 25898000, 
  77694000, 1294900, 45040, 32, 60, 
  65, 67334800, 36257200, 28, 
  25, 776940, 517960, 45040, 
  0, 4, 2072, 0, 0, 
  'Дутуу төлсөн', 520032, 0, 520032
) ON CONFLICT (id) DO NOTHING;
