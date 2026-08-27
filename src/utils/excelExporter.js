import * as XLSX from 'xlsx';

// 1. Export Full Monthly Financial Report for all 169 residents
export function exportMonthlyFinancialReport(residents) {
  const data = residents.map((r, idx) => ({
    '№': idx + 1,
    'Блок / Байр': r.block || '502-р байр',
    'Хаалганы Тоот': r.door,
    'Оршин Суугчийн Овог Нэр': r.fullName || r.name,
    'Утасны Дугаар': r.phone,
    'И-мэйл': r.email,
    'Регистрийн №': r.regNo,
    'Гэрээний №': r.contractNo,
    'Талбай (м²)': r.areaSqm,
    'Өрөө': r.rooms,
    'Байрны Нийт Үнэ (₮)': r.totalPrice,
    '25% Урьдчилгаа (₮)': r.downPayment,
    '75% Үндсэн Төлбөр (₮)': r.remainingPrincipal,
    'Сар Төлөх Түрээс (₮)': r.monthlyRent,
    'Сар Төлөх СӨХ (₮)': r.monthlySOH,
    'Төлсөн Сар': `${r.paidMonths} / 60 сар`,
    'Өмчлөлийн Хувь': `${r.currentOwnershipPercent}%`,
    'Нийт Төлсөн Хөрөнгө (₮)': r.totalPrincipalPaid,
    'Үлдэгдэл Төлбөр (₮)': r.remainingBalance,
    'Энэ Сар Төлсөн Түрээс (₮)': r.rentPaidThisMonth,
    'Энэ Сар Төлсөн СӨХ (₮)': r.sohPaidThisMonth,
    'Хэтэрсэн Хоног': r.overdueDays || 0,
    'Тооцогдсон Алданги (₮)': (r.rentPenalty || 0) + (r.sohPenalty || 0),
    'Төлөв': r.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '502 Сарын Санхүүгийн Тайлан');
  XLSX.writeFile(workbook, `Дорноговь_Апартмент_502_Сарын_Нэгдсэн_Тайлан_2026-08.xlsx`);
}

// 2. Export Detailed Penalty & Overdue Report
export function exportPenaltyReport(residents, waiveLogs = []) {
  const overdueResidents = residents.filter(r => (r.overdueDays > 0 || r.rentPenalty > 0 || r.sohPenalty > 0));

  const data = overdueResidents.map((r, idx) => ({
    '№': idx + 1,
    'Байр / Тоот': r.apartment,
    'Оршин Суугчийн Нэр': r.fullName || r.name,
    'Утас': r.phone,
    'Гэрээний №': r.contractNo,
    'Хугацаа Хэтэрсэн Хоног': r.overdueDays,
    'Үндсэн Түрээсийн Үлдэгдэл (₮)': r.rentUnpaid,
    'Түрээсийн Алданги (0.1%) (₮)': r.rentPenalty,
    'СӨХ-ийн Үлдэгдэл (₮)': r.sohUnpaid,
    'СӨХ-ийн Алданги (₮)': r.sohPenalty,
    'Нийт Төлөх Өр (₮)': r.totalDueThisMonth,
    'Төлөв': r.status
  }));

  const waiveData = waiveLogs.map((w, idx) => ({
    '№': idx + 1,
    'Огноо': w.date,
    'Оршин Суугч': w.residentName,
    'Чөлөөлсөн Алданги (₮)': w.amount,
    'Шалтгаан / Захирлын Тушаал': w.reason,
    'Шийдвэрлэсэн Нягтлан': w.officer
  }));

  const workbook = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, ws1, 'Хугацаа Хэтэрсэн Өрхүүд');

  if (waiveData.length > 0) {
    const ws2 = XLSX.utils.json_to_sheet(waiveData);
    XLSX.utils.book_append_sheet(workbook, ws2, 'Алданги Чөлөөлсөн Түүх');
  }

  XLSX.writeFile(workbook, `Дорноговь_Апартмент_Алдангийн_Тайлан_2026-08.xlsx`);
}

// 3. Export SOH Expenses & Income Balance Report
export function exportSohReport(residents, sohExpenses = []) {
  const totalSohCollected = residents.reduce((acc, curr) => acc + (curr.sohPaidThisMonth || 0), 0);
  const totalSohExpenses = sohExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const expenseData = sohExpenses.map((exp, idx) => ({
    '№': idx + 1,
    'Огноо': exp.date,
    'Ангилал': exp.category,
    'Зардлын Утга': exp.title,
    'Хүлээн Авагч': exp.recipient,
    'Баримт №': exp.receiptNo,
    'Зардлын Дүн (₮)': exp.amount,
    'Данс': exp.account,
    'Нягтлан': exp.payer
  }));

  const summaryData = [
    { 'Үзүүлэлт': 'СӨХ-ийн Нийт Цугласан Орлого (₮)', 'Дүн': totalSohCollected },
    { 'Үзүүлэлт': 'СӨХ-ийн Нийт Гарсан Зардал (₮)', 'Дүн': totalSohExpenses },
    { 'Үзүүлэлт': 'СӨХ-ийн Дансны Цэвэр Үлдэгдэл (₮)', 'Дүн': totalSohCollected - totalSohExpenses },
    { 'Үзүүлэлт': 'Тайлант Хугацаа', 'Дүн': '2026 оны 08-р сар' },
    { 'Үзүүлэлт': 'СӨХ-ийн Албан Данс', 'Дүн': 'Голомт Банк: 1605987654' }
  ];

  const workbook = XLSX.utils.book_new();
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, wsSummary, 'СӨХ Баланс');

  const wsExpenses = XLSX.utils.json_to_sheet(expenseData);
  XLSX.utils.book_append_sheet(workbook, wsExpenses, 'СӨХ-ийн Зардлын Журнал');

  XLSX.writeFile(workbook, `Дорноговь_Апартмент_СӨХ_Санхүүгийн_Тайлан_2026-08.xlsx`);
}
