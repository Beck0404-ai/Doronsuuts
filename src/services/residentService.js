import { supabase } from '../lib/supabaseClient';

// Helper: Map Supabase DB row (snake_case) to Frontend resident model (camelCase)
export const mapDbToResident = (row) => ({
  id: row.id,
  contractNo: row.contract_no,
  contractDate: row.contract_date,
  name: row.name,
  fullName: row.full_name || row.name,
  lastName: row.last_name || '',
  firstName: row.first_name || '',
  regNo: row.reg_no || '',
  phone: row.phone || '',
  email: row.email || '',
  workplace: row.workplace || '',
  apartment: row.apartment,
  block: row.block,
  door: String(row.door),
  floor: Number(row.floor) || 1,
  room: row.room || '',
  areaSqm: Number(row.area_sqm) || 45.04,
  rooms: Number(row.rooms) || 2,
  totalPrice: Number(row.total_price) || 0,
  downPayment: Number(row.down_payment) || 0,
  remainingPrincipal: Number(row.remaining_principal) || 0,
  monthlyRent: Number(row.monthly_rent) || 0,
  monthlySOH: Number(row.monthly_soh) || 0,
  paidMonths: Number(row.paid_months) || 0,
  totalMonths: Number(row.total_months) || 60,
  currentOwnershipPercent: Number(row.current_ownership_percent) || 0,
  totalPrincipalPaid: Number(row.total_principal_paid) || 0,
  remainingBalance: Number(row.remaining_balance) || 0,
  remainingMonths: Number(row.remaining_months) || 60,
  currentMonthDueDay: Number(row.current_month_due_day) || 25,
  rentPaidThisMonth: Number(row.rent_paid_this_month) || 0,
  rentUnpaid: Number(row.rent_unpaid) || 0,
  sohPaidThisMonth: Number(row.soh_paid_this_month) || 0,
  sohUnpaid: Number(row.soh_unpaid) || 0,
  overdueDays: Number(row.overdue_days) || 0,
  rentPenalty: Number(row.rent_penalty) || 0,
  sohPenalty: Number(row.soh_penalty) || 0,
  penaltyWaived: Number(row.penalty_waived) || 0,
  status: row.status || 'Бүрэн төлсөн',
  totalRentDueThisMonth: Number(row.total_rent_due_this_month) || 0,
  totalSohDueThisMonth: Number(row.total_soh_due_this_month) || 0,
  totalDueThisMonth: Number(row.total_due_this_month) || 0
});

// Helper: Map Frontend resident model (camelCase) to Supabase DB row (snake_case)
export const mapResidentToDb = (res) => ({
  id: res.id,
  contract_no: res.contractNo,
  contract_date: res.contractDate,
  name: res.name,
  full_name: res.fullName || res.name,
  last_name: res.lastName,
  first_name: res.firstName,
  reg_no: res.regNo,
  phone: res.phone,
  email: res.email,
  workplace: res.workplace,
  apartment: res.apartment,
  block: res.block,
  door: res.door,
  floor: res.floor,
  room: res.room,
  area_sqm: res.areaSqm,
  rooms: res.rooms,
  total_price: res.totalPrice,
  down_payment: res.downPayment,
  remaining_principal: res.remainingPrincipal,
  monthly_rent: res.monthlyRent,
  monthly_soh: res.monthlySOH,
  paid_months: res.paidMonths,
  total_months: res.totalMonths,
  current_ownership_percent: res.currentOwnershipPercent,
  total_principal_paid: res.totalPrincipalPaid,
  remaining_balance: res.remainingBalance,
  remaining_months: res.remainingMonths,
  current_month_due_day: res.currentMonthDueDay,
  rent_paid_this_month: res.rentPaidThisMonth,
  rent_unpaid: res.rentUnpaid,
  soh_paid_this_month: res.sohPaidThisMonth,
  soh_unpaid: res.sohUnpaid,
  overdue_days: res.overdueDays,
  rent_penalty: res.rentPenalty,
  soh_penalty: res.sohPenalty,
  penalty_waived: res.penaltyWaived,
  status: res.status,
  total_rent_due_this_month: res.totalRentDueThisMonth,
  total_soh_due_this_month: res.totalSohDueThisMonth,
  total_due_this_month: res.totalDueThisMonth,
  updated_at: new Date().toISOString()
});

// Fetch all residents from Supabase
export const fetchResidentsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('residents')
      .select('*')
      .order('door', { ascending: true });

    if (error) {
      console.warn('Supabase fetch error, fallback to local data:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(mapDbToResident);
    }
    return null;
  } catch (err) {
    console.error('Failed to load from Supabase:', err);
    return null;
  }
};

// Update a resident in Supabase
export const updateResidentInSupabase = async (resident) => {
  try {
    const dbPayload = mapResidentToDb(resident);
    const { data, error } = await supabase
      .from('residents')
      .upsert(dbPayload)
      .select();

    if (error) {
      console.warn('Supabase update warning:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Failed to update in Supabase:', err);
    return null;
  }
};
