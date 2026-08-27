// Rent-to-Own and HOA Management Data Model
// Rule: 25% Down payment upfront, Remaining 75% paid over 5 years (60 months) with 0% interest.
// SOH (HOA) billed monthly by area size (sqm) and standard breakdown.
// Daily penalty calculated transparently when overdue (e.g. 0.1% per day).

import realResidents502 from './realResidents502.json';

export const SYSTEM_CONFIG = {
  dailyPenaltyRate: 0.001, // 0.1% per day
  sohRatePerSqm: 1000,    // 1,000 ₮ per m²
  paymentDueDay: 25,       // 25th of each month
  totalMonths: 60          // 5 years
};

export const PENALTY_RATE_DAILY = 0.001; // 0.1% per day
export const SOH_RATE_PER_SQM = 1000;    // 1,000 ₮ per m²
export const TOTAL_MONTHS = 60;          // 5 years = 60 months

// System Staff Accounts (Дорноговь Апартмент ХХК-ийн бодит ажилтнууд)
export const SYSTEM_USERS = [
  {
    id: 'USR-CEO',
    name: 'Энхцэцэг',
    fullName: 'Энхцэцэг',
    role: 'ADMIN',
    roleTitle: 'Гүйцэтгэх Захирал',
    email: 'enkhtsetseg@dornogobi-apartment.mn',
    department: 'Гүйцэтгэх Удирдлага',
    permissions: ['ALL']
  },
  {
    id: 'USR-ACC',
    name: 'Соёл-Ундараа',
    fullName: 'Соёл-Ундараа',
    role: 'ACCOUNTANT',
    roleTitle: 'Ахлах Нягтлан Бодогч',
    email: 'soyol-undaraa@dornogobi-apartment.mn',
    department: 'Санхүүгийн Алба',
    permissions: ['PAYMENT_RECONCILE', 'INVOICE_GENERATE', 'PENALTY_CALC', 'REPORTS']
  },
  {
    id: 'USR-ADM',
    name: 'Билгүүн',
    fullName: 'Билгүүн',
    role: 'ADMIN',
    roleTitle: 'Системийн Админ',
    email: 'bilguun@dornogobi-apartment.mn',
    department: 'Мэдээллийн Технологи',
    permissions: ['SYSTEM_CONFIG', 'AUDIT_LOGS', 'SECURITY']
  },
  {
    id: 'USR-CSH',
    name: 'Орхонсэлэнгэ',
    fullName: 'Орхонсэлэнгэ',
    role: 'ACCOUNTANT',
    roleTitle: 'Кассын Нярав',
    email: 'orkhonselenge@dornogobi-apartment.mn',
    department: 'Санхүү, Кассын Алба',
    permissions: ['CASH_COLLECT', 'CASH_VOUCHER']
  },
  {
    id: 'USR-PROC',
    name: 'Нямсүрэн',
    fullName: 'Нямсүрэн',
    role: 'ADMIN',
    roleTitle: 'Худалдан Авах Мэргэжилтэн',
    email: 'nyamsuren@dornogobi-apartment.mn',
    department: 'Хангамж, Худалдан Авалтын Алба',
    permissions: ['EXPENSES_VIEW', 'PURCHASE_REQ']
  }
];

// Sample apartment configurations
export const APARTMENT_TYPES = [
  { rooms: 1, areaSqm: 38, price: 87400000, description: '1 өрөө (38 м²)' },
  { rooms: 2, areaSqm: 45.04, price: 103592000, description: '2 өрөө (45.04 м²) — 502 байр' },
  { rooms: 2, areaSqm: 48.74, price: 112102000, description: '2 өрөө (48.74 м²) — 502 байр' },
  { rooms: 2, areaSqm: 54.39, price: 125097000, description: '2 өрөө (54.39 м²) — 502 байр' },
  { rooms: 2, areaSqm: 84.76, price: 194948000, description: '2 өрөө (84.76 м²) — 502А байр' },
  { rooms: 3, areaSqm: 78, price: 179400000, description: '3 өрөө (78 м²)' },
  { rooms: 4, areaSqm: 110, price: 253000000, description: '4 өрөө (110 м²)' }
];

// Bank accounts
export const BANK_ACCOUNTS = {
  RENT: {
    name: 'Түрээс / Өмчлөлийн данс',
    bank: 'ХААН Банк',
    number: '5070123456',
    holder: 'Дорноговь Апартмент ХХК',
    purposePrefix: 'DGA-'
  },
  SOH: {
    name: 'СӨХ-ийн ашиглалтын данс',
    bank: 'Голомт Банк',
    number: '1605987654',
    holder: 'Дорноговь Апартмент СӨХ',
    purposePrefix: 'DGA-SOH-'
  }
};

// SOH service breakdown percentages
export const SOH_BREAKDOWN_PERCENT = {
  cleaning: 0.25,    // Нийтийн эзэмшлийн цэвэрлэгээ 25%
  security: 0.35,    // Харуул хамгаалалт, хяналтын камер 35%
  elevator: 0.15,    // Лифтний ашиглалт, засвар 15%
  maintenance: 0.15, // Дундын өмчлөлийн урсгал засвар 15%
  waste: 0.10        // Хог тээвэрлэлт, ариутгал 10%
};

// Return real imported residents from 502-р байр
export function generateResidents() {
  if (realResidents502 && realResidents502.length > 0) {
    return [...realResidents502];
  }
  return [];
}

// Calculate financial details for a resident / contract
export function calculateContractDetails(totalPrice, areaSqm, paidMonths = 0, overdueDays = 0, penaltyRate = PENALTY_RATE_DAILY) {
  const downPayment = Math.round(totalPrice * 0.25); // 25% upfront
  const remainingPrincipal = totalPrice - downPayment; // 75% remaining
  const monthlyRent = Math.round(remainingPrincipal / TOTAL_MONTHS); // 60 months 0% interest
  const monthlySOH = Math.round(areaSqm * SOH_RATE_PER_SQM);
  
  const currentOwnershipPercent = Number((25 + (Math.min(paidMonths, TOTAL_MONTHS) / TOTAL_MONTHS) * 75).toFixed(2));
  const totalPrincipalPaid = downPayment + (Math.min(paidMonths, TOTAL_MONTHS) * monthlyRent);
  const remainingBalance = Math.max(0, totalPrice - totalPrincipalPaid);
  const remainingMonths = Math.max(0, TOTAL_MONTHS - paidMonths);

  const rentPenalty = overdueDays > 0 ? Math.round(monthlyRent * penaltyRate * overdueDays) : 0;
  const sohPenalty = overdueDays > 0 ? Math.round(monthlySOH * penaltyRate * overdueDays) : 0;

  return {
    totalPrice,
    downPayment,
    remainingPrincipal,
    monthlyRent,
    monthlySOH,
    currentOwnershipPercent,
    totalPrincipalPaid,
    remainingBalance,
    remainingMonths,
    rentPenalty,
    sohPenalty
  };
}

// Generate the 60-month complete schedule for a resident
export function generateFullSchedule(resident) {
  const schedule = [];
  const startParts = (resident.contractDate || '2024-01-01').split('-');
  const startYear = parseInt(startParts[0], 10);
  const startMonth = parseInt(startParts[1], 10);

  // Month 0: Down payment
  schedule.push({
    monthIndex: 0,
    label: 'Урьдчилгаа 25%',
    date: `${startYear} оны ${startMonth}-р сар`,
    type: 'Урьдчилгаа 25% төлбөр',
    amount: resident.downPayment,
    paidAmount: resident.downPayment,
    unpaidAmount: 0,
    penalty: 0,
    ownershipPercent: 25.0,
    status: 'Төлөгдсөн',
    isDownPayment: true
  });

  for (let m = 1; m <= TOTAL_MONTHS; m++) {
    const monthNum = ((startMonth - 1 + m) % 12) + 1;
    const yearOffset = Math.floor((startMonth - 1 + m) / 12);
    const year = startYear + yearOffset;
    const dateLabel = `${year} оны ${monthNum}-р сар`;
    const ownershipAfterMonth = Number((25 + (m / TOTAL_MONTHS) * 75).toFixed(2));

    let status = 'Хүлээгдэж буй';
    let paidAmount = 0;
    let unpaidAmount = resident.monthlyRent;
    let penalty = 0;

    if (m < resident.paidMonths) {
      status = 'Төлөгдсөн';
      paidAmount = resident.monthlyRent;
      unpaidAmount = 0;
      penalty = 0;
    } else if (m === resident.paidMonths) {
      paidAmount = resident.rentPaidThisMonth;
      unpaidAmount = resident.rentUnpaid;
      penalty = resident.rentPenalty;
      if (unpaidAmount === 0) {
        status = 'Төлөгдсөн';
      } else if (resident.overdueDays > 0) {
        status = 'Хугацаа хэтэрсэн';
      } else if (paidAmount > 0) {
        status = 'Дутуу төлсөн';
      } else {
        status = 'Хүлээгдэж буй';
      }
    } else {
      status = 'Хүлээгдэж буй';
      paidAmount = 0;
      unpaidAmount = resident.monthlyRent;
      penalty = 0;
    }

    schedule.push({
      monthIndex: m,
      label: `${m}-р сар`,
      date: dateLabel,
      type: 'Сар бүрийн хуваарь',
      amount: resident.monthlyRent,
      paidAmount,
      unpaidAmount,
      penalty,
      ownershipPercent: ownershipAfterMonth,
      status,
      isDownPayment: false
    });
  }

  return schedule;
}

// Payment history for receipt and drawer views
export function getPaymentHistory(resident) {
  const history = [];
  const startParts = (resident.contractDate || '2024-01-01').split('-');
  const startYear = parseInt(startParts[0], 10);
  const startMonth = parseInt(startParts[1], 10);

  // Add 25% down payment record
  history.push({
    id: `TX-${resident.id}-DP`,
    date: `${startYear} оны ${startMonth}-р сарын 01`,
    type: 'Урьдчилгаа 25% төлбөр',
    amount: resident.downPayment,
    penalty: 0,
    status: 'Амжилттай',
    account: BANK_ACCOUNTS.RENT.name,
    refNo: `DP-${resident.contractNo || resident.id}`
  });

  const recentMonths = Math.min(resident.paidMonths || 1, 12);
  for (let i = recentMonths; i >= 1; i--) {
    const monthNum = ((startMonth - 1 + i) % 12) + 1;
    const yearOffset = Math.floor((startMonth - 1 + i) / 12);
    const year = startYear + yearOffset;
    const dateLabel = `${year} оны ${monthNum}-р сарын 20`;

    const isCurrent = i === resident.paidMonths;
    const rentPaid = isCurrent ? resident.rentPaidThisMonth : resident.monthlyRent;
    const sohPaid = isCurrent ? resident.sohPaidThisMonth : resident.monthlySOH;

    if (rentPaid > 0) {
      history.push({
        id: `TX-${resident.id}-R-${i}`,
        date: dateLabel,
        type: `Түрээс / Өмчлөл (${i}-р сар)`,
        amount: rentPaid,
        penalty: isCurrent ? resident.rentPenalty : 0,
        status: (isCurrent && resident.rentUnpaid > 0) ? 'Дутуу төлсөн' : 'Амжилттай',
        account: BANK_ACCOUNTS.RENT.name,
        refNo: `RTO-${resident.id}-${i}`
      });
    }

    if (sohPaid > 0) {
      history.push({
        id: `TX-${resident.id}-S-${i}`,
        date: dateLabel,
        type: `СӨХ-ийн хураамж (${i}-р сар)`,
        amount: sohPaid,
        penalty: isCurrent ? resident.sohPenalty : 0,
        status: (isCurrent && resident.sohUnpaid > 0) ? 'Дутуу төлсөн' : 'Амжилттай',
        account: BANK_ACCOUNTS.SOH.name,
        refNo: `SOH-${resident.id}-${i}`
      });
    }
  }

  return history;
}

// SOH Expenses Database (Feature 4)
export const INITIAL_SOH_EXPENSES = [
  {
    id: 'EXP-502-01',
    date: '2026-08-22',
    category: 'Лифт үйлчилгээ',
    title: '502В, 502Д Лифтний сар бүрийн үзлэг, үйлчилгээний хөлс',
    amount: 450000,
    recipient: 'Лифт Сервис ХХК',
    receiptNo: 'INV-88912',
    payer: 'О. Баярмаа (Нягтлан)',
    account: 'Голомт Банк (СӨХ данс)',
    status: 'Төлөгдсөн'
  },
  {
    id: 'EXP-502-02',
    date: '2026-08-20',
    category: 'Цэвэрлэгээний материал',
    title: 'Орц, давхруудын угаалгын бодис, шүүр, ариутгалын бодис',
    amount: 185000,
    recipient: 'Наран Их Дэлгүүр',
    receiptNo: 'E-BARIMT-7721',
    payer: 'О. Баярмаа (Нягтлан)',
    account: 'Голомт Банк (СӨХ данс)',
    status: 'Төлөгдсөн'
  },
  {
    id: 'EXP-502-03',
    date: '2026-08-15',
    category: 'Харуул хамгаалалт',
    title: '24/7 Харуул хамгаалалтын албаны сарын хөлс',
    amount: 1200000,
    recipient: 'Бамбай Секьюрити ХХК',
    receiptNo: 'CON-2026-08',
    payer: 'Соёл-Ундараа (Нягтлан)',
    account: 'Голомт Банк (СӨХ данс)',
    status: 'Төлөгдсөн'
  },
  {
    id: 'EXP-502-04',
    date: '2026-08-12',
    category: 'Хог тээвэрлэлт',
    title: '502-р байрны ахуйн хог хаягдал тээвэрлэлт, ариутгал',
    amount: 220000,
    recipient: 'Сайншанд ТҮК ОНӨААТҮГ',
    receiptNo: 'TUK-2026-88',
    payer: 'Орхонсэлэнгэ (Нярав)',
    account: 'Голомт Банк (СӨХ данс)',
    status: 'Төлөгдсөн'
  },
  {
    id: 'EXP-502-05',
    date: '2026-08-10',
    category: 'Дундын урсгал засвар',
    title: '502В 3-р давхрын мэдрэгчтэй LED гэрэл, унтраалга солих',
    amount: 95000,
    recipient: 'Дорноговь Цахилгаан Хангамж',
    receiptNo: 'REC-5512',
    payer: 'Нямсүрэн (Худалдан авалт)',
    account: 'Голомт Банк (СӨХ данс)',
    status: 'Төлөгдсөн'
  }
];

// Penalty Waive Audit Trail History (Feature 7)
export const INITIAL_PENALTY_WAIVE_LOGS = [
  {
    id: 'WAIVE-101',
    date: '2026-08-25 14:15',
    residentId: 'RES-502-004',
    residentName: 'Дүгэр Энхтогтох (502Д-2)',
    amount: 19500,
    reason: 'Захирал Энхцэцэгийн 2026/08/24-ний 12-р тушаалаар чөлөөлөв',
    officer: 'Соёл-Ундараа (Ахлах Нягтлан)'
  },
  {
    id: 'WAIVE-102',
    date: '2026-08-22 11:30',
    residentId: 'RES-502-011',
    residentName: 'Даваадорж Чоён (502В-31)',
    amount: 14200,
    reason: 'Эмнэлэгт хэвтсэн эмнэлгийн магадлагааг үндэслэн хөнгөлөв',
    officer: 'Соёл-Ундараа (Ахлах Нягтлан)'
  },
  {
    id: 'WAIVE-103',
    date: '2026-08-18 16:45',
    residentId: 'RES-502-014',
    residentName: 'Сүрэн Одгэрэл (502Д-7)',
    amount: 8500,
    reason: 'Банкны гүйлгээ саатсан лавлагааны дагуу алдангийг тэглэв',
    officer: 'Орхонсэлэнгэ (Нярав)'
  }
];

// Sample Bank Statement for Auto-Reconciliation (Feature 1)
export const SAMPLE_BANK_STATEMENTS = [
  {
    id: 'STMT-001',
    date: '2026-08-25',
    time: '14:22',
    sender: 'Балжинням Содномпунцаг',
    bank: 'ХААН Банк',
    amount: 1294900,
    description: 'DGA-502-091 502В-1 Содномпунцаг түрээс',
    matchedResidentId: 'RES-502-001',
    matchedResidentName: 'Балжинням Содномпунцаг',
    matchedApartment: '502В байр, 1 тоот',
    type: 'RENT',
    status: 'MATCHED' // MATCHED, UNMATCHED, PARTIAL
  },
  {
    id: 'STMT-002',
    date: '2026-08-25',
    time: '11:05',
    sender: 'Түмэнбаяр Норжинсүрэн',
    bank: 'Голомт Банк',
    amount: 45040,
    description: '502Д-1 Норжинсүрэн СӨХ төлбөр',
    matchedResidentId: 'RES-502-002',
    matchedResidentName: 'Түмэнбаяр Норжинсүрэн',
    matchedApartment: '502Д байр, 1 тоот',
    type: 'SOH',
    status: 'MATCHED'
  },
  {
    id: 'STMT-003',
    date: '2026-08-24',
    time: '16:40',
    sender: 'Цэрэнсодном Хөхцэцэг',
    bank: 'ХААН Банк',
    amount: 1343640,
    description: '502В-2 Хөхцэцэг түрээс + СӨХ',
    matchedResidentId: 'RES-502-003',
    matchedResidentName: 'Цэрэнсодном Хөхцэцэг',
    matchedApartment: '502В байр, 2 тоот',
    type: 'ALL',
    status: 'MATCHED'
  },
  {
    id: 'STMT-004',
    date: '2026-08-24',
    time: '09:18',
    sender: 'Найдан Алдарбаяр',
    bank: 'ХААН Банк',
    amount: 2436850,
    description: '502А-32 Алдарбаяр түрээс',
    matchedResidentId: 'RES-502-146',
    matchedResidentName: 'Найдан Алдарбаяр',
    matchedApartment: '502А байр, 32 тоот',
    type: 'ALL',
    status: 'MATCHED'
  },
  {
    id: 'STMT-005',
    date: '2026-08-23',
    time: '18:50',
    sender: 'Батбаяр Т.',
    bank: 'Голомт Банк',
    amount: 100000,
    description: 'Байрны мөнгө',
    matchedResidentId: null,
    matchedResidentName: 'Тодорхойгүй',
    matchedApartment: 'Тодорхойгүй',
    type: 'UNKNOWN',
    status: 'UNMATCHED'
  }
];

// Sample Contract Documents attached to residents (Feature 6)
export const SAMPLE_ATTACHED_DOCUMENTS = [
  {
    id: 'DOC-01',
    name: '25% Урьдчилгаа Төлбөрийн Баримт.pdf',
    size: '1.4 MB',
    date: '2024-01-01',
    type: 'RECEIPT',
    uploadedBy: 'Соёл-Ундараа (Нягтлан)'
  },
  {
    id: 'DOC-02',
    name: 'Түрээслээд Өмчлөх Үндсэн Гэрээ_Нотариатаар баталгаажсан.pdf',
    size: '4.8 MB',
    date: '2024-01-02',
    type: 'CONTRACT',
    uploadedBy: 'Билгүүн (Админ)'
  },
  {
    id: 'DOC-03',
    name: 'Орон Сууц Хүлээлцсэн Акт.pdf',
    size: '850 KB',
    date: '2024-01-03',
    type: 'HANDOVER_ACT',
    uploadedBy: 'Орхонсэлэнгэ (Нярав)'
  },
  {
    id: 'DOC-04',
    name: 'Иргэний Үнэмлэхний Хуулбар.jpg',
    size: '2.1 MB',
    date: '2024-01-01',
    type: 'ID_CARD',
    uploadedBy: 'Оршин суугч'
  }
];

// Sample SOH service requests
export const SAMPLE_SERVICE_REQUESTS = [
  {
    id: 'REQ-101',
    residentId: 'RES-502-001',
    residentName: 'Балжинням Содномпунцаг',
    apartment: '502В байр, 1 тоот',
    category: 'Сантехник',
    title: 'Халаалтын шугамнаас ус алдаж байна',
    description: 'Зочны өрөөний паарны хаалт бага зэрэг дусалж байна, шалгаж өгнө үү.',
    date: '2026-08-22',
    status: 'Хийгдэж буй',
    priority: 'Яаралтай'
  },
  {
    id: 'REQ-102',
    residentId: 'RES-502-003',
    residentName: 'Цэрэнсодном Хөхцэцэг',
    apartment: '502В байр, 2 тоот',
    category: 'Цахилгаан',
    title: 'Орцны гэрэл асахгүй байна',
    description: '3-р давхрын коридорын мэдрэгчтэй гэрэл шатсан бололтой солих шаардлагатай.',
    date: '2026-08-23',
    status: 'Шийдвэрлэсэн',
    priority: 'Энгийн'
  },
  {
    id: 'REQ-103',
    residentId: 'RES-502-008',
    residentName: 'Лхамсүрэн Сүхбаатар',
    apartment: '502Д байр, 4 тоот',
    category: 'Лифт',
    title: 'Лифтний хаалга гацаж байна',
    description: '502Д орцны лифтний хаалга 4-р давхарт удаан хаагдаж байна.',
    date: '2026-08-24',
    status: 'Хүлээгдэж буй',
    priority: 'Яаралтай'
  }
];

// Calculate aggregated stats for Accountant & Admin
export function getStatistics(residents) {
  let totalPortfolioValue = 0;
  let totalDownPaymentCollected = 0;
  let totalRentCollected = 0;
  let totalRentDue = 0;
  let totalRentPenalty = 0;
  let totalPenaltyWaived = 0;

  let totalSohCollected = 0;
  let totalSohDue = 0;
  let totalSohPenalty = 0;

  let countPaid = 0;
  let countUnderpaid = 0;
  let countOverdue = 0;
  let countSohUnpaid = 0;

  residents.forEach(res => {
    totalPortfolioValue += (res.totalPrice || 0);
    totalDownPaymentCollected += (res.downPayment || 0);
    
    totalRentCollected += (res.rentPaidThisMonth || 0);
    totalRentDue += (res.rentUnpaid || 0);
    totalRentPenalty += (res.rentPenalty || 0);
    totalPenaltyWaived += (res.penaltyWaived || 0);

    totalSohCollected += (res.sohPaidThisMonth || 0);
    totalSohDue += (res.sohUnpaid || 0);
    totalSohPenalty += (res.sohPenalty || 0);

    if (res.status === 'Бүрэн төлсөн') countPaid++;
    else if (res.status === 'Дутуу төлсөн') countUnderpaid++;
    else if (res.status === 'Хугацаа хэтэрсэн') countOverdue++;
    else if (res.status === 'СӨХ төлөөгүй') countSohUnpaid++;
  });

  return {
    portfolio: {
      totalValue: totalPortfolioValue,
      downPaymentCollected: totalDownPaymentCollected,
      totalResidents: residents.length
    },
    rent: {
      expected: totalRentCollected + totalRentDue,
      collected: totalRentCollected,
      outstanding: totalRentDue,
      penalty: totalRentPenalty,
      penaltyWaived: totalPenaltyWaived
    },
    soh: {
      expected: totalSohCollected + totalSohDue,
      collected: totalSohCollected,
      outstanding: totalSohDue,
      penalty: totalSohPenalty
    },
    counts: {
      total: residents.length,
      paid: countPaid,
      underpaid: countUnderpaid,
      overdue: countOverdue,
      sohUnpaid: countSohUnpaid
    }
  };
}
