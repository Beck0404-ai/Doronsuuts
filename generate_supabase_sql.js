import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const residentsPath = path.join(__dirname, 'src', 'data', 'realResidents502.json');
const residents = JSON.parse(fs.readFileSync(residentsPath, 'utf-8'));

let sql = `-- ============================================================================
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
`;

for (const r of residents) {
  const escapeSql = (val) => val === undefined || val === null ? "''" : `'${String(val).replace(/'/g, "''")}'`;
  
  sql += `INSERT INTO residents (
  id, contract_no, contract_date, name, full_name, last_name, first_name, reg_no, phone, email, 
  workplace, apartment, block, door, floor, room, area_sqm, rooms, total_price, down_payment, 
  remaining_principal, monthly_rent, monthly_soh, paid_months, total_months, current_ownership_percent, 
  total_principal_paid, remaining_balance, remaining_months, current_month_due_day, rent_paid_this_month, 
  rent_unpaid, soh_paid_this_month, soh_unpaid, overdue_days, rent_penalty, soh_penalty, penalty_waived, 
  status, total_rent_due_this_month, total_soh_due_this_month, total_due_this_month
) VALUES (
  ${escapeSql(r.id)}, ${escapeSql(r.contractNo)}, ${escapeSql(r.contractDate)}, ${escapeSql(r.name)}, ${escapeSql(r.fullName)}, 
  ${escapeSql(r.lastName)}, ${escapeSql(r.firstName)}, ${escapeSql(r.regNo)}, ${escapeSql(r.phone)}, ${escapeSql(r.email)}, 
  ${escapeSql(r.workplace)}, ${escapeSql(r.apartment)}, ${escapeSql(r.block)}, ${escapeSql(r.door)}, ${r.floor || 1}, 
  ${escapeSql(r.room)}, ${r.areaSqm || 45.04}, ${r.rooms || 2}, ${r.totalPrice || 0}, ${r.downPayment || 0}, 
  ${r.remainingPrincipal || 0}, ${r.monthlyRent || 0}, ${r.monthlySOH || 0}, ${r.paidMonths || 0}, ${r.totalMonths || 60}, 
  ${r.currentOwnershipPercent || 0}, ${r.totalPrincipalPaid || 0}, ${r.remainingBalance || 0}, ${r.remainingMonths || 60}, 
  ${r.currentMonthDueDay || 25}, ${r.rentPaidThisMonth || 0}, ${r.rentUnpaid || 0}, ${r.sohPaidThisMonth || 0}, 
  ${r.sohUnpaid || 0}, ${r.overdueDays || 0}, ${r.rentPenalty || 0}, ${r.sohPenalty || 0}, ${r.penaltyWaived || 0}, 
  ${escapeSql(r.status)}, ${r.totalRentDueThisMonth || 0}, ${r.totalSohDueThisMonth || 0}, ${r.totalDueThisMonth || 0}
) ON CONFLICT (id) DO NOTHING;\n`;
}

fs.writeFileSync(path.join(__dirname, 'supabase_setup.sql'), sql, 'utf-8');
console.log('Successfully generated supabase_setup.sql with 169 residents!');
