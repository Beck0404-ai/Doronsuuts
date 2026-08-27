import React, { useState, useMemo } from 'react';
import { 
  Search, CheckCircle2, 
  DollarSign, TrendingUp, 
  PlusCircle, Building2,
  FileText, Wrench, Send,
  UserCheck, AlertCircle, Upload, Printer,
  Paperclip, Mail, Check, Download, ShieldAlert,
  CalendarCheck, Clock, CheckSquare, Square, Phone
} from 'lucide-react';
import { 
  getStatistics, SYSTEM_USERS,
  INITIAL_SOH_EXPENSES, INITIAL_PENALTY_WAIVE_LOGS, SAMPLE_BANK_STATEMENTS,
  SAMPLE_ATTACHED_DOCUMENTS
} from '../data/mockData';
import { 
  exportMonthlyFinancialReport, exportPenaltyReport, exportSohReport 
} from '../utils/excelExporter';
import InvoiceModal from './InvoiceModal';
import CashVoucherModal from './CashVoucherModal';
import BuildingFloorMap from './BuildingFloorMap';
import LegalNoticeModal from './LegalNoticeModal';

export default function AccountantPortal({ residents, onUpdateResident }) {
  // Current active logged in accountant
  const [currentUser] = useState(SYSTEM_USERS[1]); // Соёл-Ундараа (Ахлах Нягтлан)

  // Sub-tabs for the Accountant portal
  // OVERDUE_PENALTY | FLOOR_MAP | BANK_RECON | BULK_NOTIFICATIONS | SOH_EXPENSES | DAILY_CASH | RESIDENTS_DOCS | OVERVIEW
  const [activeTab, setActiveTab] = useState('OVERDUE_PENALTY');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PAID, OVERDUE, UNDERPAID, SOH_UNPAID
  const [blockFilter, setBlockFilter] = useState('ALL');   // ALL, 502В, 502Д, 502А
  const [expandedResId, setExpandedResId] = useState(null);

  // Modals state
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(null);
  const [showCashVoucherModal, setShowCashVoucherModal] = useState(false);
  const [selectedLegalResident, setSelectedLegalResident] = useState(null);
  const [showMonthCloseModal, setShowMonthCloseModal] = useState(false);
  const [monthCloseSuccess, setMonthCloseSuccess] = useState(false);
  
  // Daily Action Checklist state (Feature 5)
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'ХААН Банкны дансанд орсон танигдаагүй 1 шилжүүлгийг оршин суугчид оноох', done: false, targetTab: 'BANK_RECON' },
    { id: 2, text: '25-наас хойш хугацаа хэтэрсэн 23 өрх рүү алдангийн SMS сануулга илгээх', done: false, targetTab: 'BULK_NOTIFICATIONS' },
    { id: 3, text: 'СӨХ-ийн лифтний засварын 450,000₮ зардлын баримтыг хянаж батлах', done: false, targetTab: 'SOH_EXPENSES' }
  ]);

  // Payment settlement modal state
  const [settlingResident, setSettlingResident] = useState(null);
  const [settleAmount, setSettleAmount] = useState('');
  const [settleType, setSettleType] = useState('ALL'); // ALL, RENT, SOH
  const [settleChannel, setSettleChannel] = useState('ХААН Банк (Түрээс)');
  const [waivePenalty, setWaivePenalty] = useState(false);
  const [waiveReason, setWaiveReason] = useState('Захирлын тушаалаар алдангийг чөлөөлөв');

  // SOH Expenses State
  const [sohExpenses, setSohExpenses] = useState(INITIAL_SOH_EXPENSES);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'Лифт үйлчилгээ',
    title: '',
    amount: '',
    recipient: '',
    receiptNo: ''
  });

  // Penalty Waive Audit Trail State
  const [penaltyWaiveLogs, setPenaltyWaiveLogs] = useState(INITIAL_PENALTY_WAIVE_LOGS);

  // Bank Statements State
  const [bankStatements, setBankStatements] = useState(SAMPLE_BANK_STATEMENTS);
  const [reconcileSuccessMsg, setReconcileSuccessMsg] = useState(null);

  // Bulk Notifications State
  const [notificationType, setNotificationType] = useState('INVOICE');
  const [sentBroadcastSuccess, setSentBroadcastSuccess] = useState(false);
  const [broadcastTargetCount, setBroadcastTargetCount] = useState(0);

  // Document Attachments State
  const [attachedDocs, setAttachedDocs] = useState(SAMPLE_ATTACHED_DOCUMENTS);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');

  // Daily Cash Flow Today's stats
  const [dailyCashTransactions, setDailyCashTransactions] = useState([
    {
      id: 'TX-DLY-01',
      time: '14:22',
      residentName: 'Балжинням Содномпунцаг',
      apartment: '502В байр, 1 тоот',
      type: 'Түрээс / Өмчлөл',
      channel: 'ХААН Банк (Шилжүүлэг)',
      amount: 1294900
    },
    {
      id: 'TX-DLY-02',
      time: '11:05',
      residentName: 'Түмэнбаяр Норжинсүрэн',
      apartment: '502Д байр, 1 тоот',
      type: 'СӨХ-ийн хураамж',
      channel: 'Голомт Банк (СӨХ данс)',
      amount: 45040
    },
    {
      id: 'TX-DLY-03',
      time: '10:15',
      residentName: 'Цэрэнсодном Хөхцэцэг',
      apartment: '502В байр, 2 тоот',
      type: 'Түрээс + СӨХ (Бэлнээр)',
      channel: 'Бэлэн касс',
      amount: 1343640
    }
  ]);

  // Statistics calculation
  const stats = useMemo(() => getStatistics(residents), [residents]);

  // Total SOH expenses
  const totalSohExpenseAmount = useMemo(() => {
    return sohExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [sohExpenses]);

  // SOH Net Fund Balance
  const sohNetBalance = useMemo(() => {
    return stats.soh.collected - totalSohExpenseAmount;
  }, [stats.soh.collected, totalSohExpenseAmount]);

  // Filtered residents list
  const filteredResidents = useMemo(() => {
    return residents.filter(r => {
      const matchSearch = 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.contractNo && r.contractNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.regNo && r.regNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.phone && r.phone.includes(searchTerm));

      const matchStatus = 
        statusFilter === 'ALL' ? true :
        statusFilter === 'PAID' ? r.status === 'Бүрэн төлсөн' :
        statusFilter === 'OVERDUE' ? (r.status === 'Хугацаа хэтэрсэн' || r.overdueDays > 0) :
        statusFilter === 'UNDERPAID' ? (r.status === 'Дутуу төлсөн' || r.status === 'СӨХ төлөөгүй') :
        statusFilter === 'SOH_UNPAID' ? r.status === 'СӨХ төлөөгүй' : true;

      const matchBlock =
        blockFilter === 'ALL' ? true :
        r.apartment.includes(blockFilter);

      return matchSearch && matchStatus && matchBlock;
    });
  }, [residents, searchTerm, statusFilter, blockFilter]);

  // Overdue residents list
  const overdueResidents = useMemo(() => {
    return residents.filter(r => r.overdueDays > 0 || r.status === 'Хугацаа хэтэрсэн' || r.rentPenalty > 0 || r.sohPenalty > 0);
  }, [residents]);

  // Toggle checklist item
  const toggleChecklist = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  // Handle Month End Close Wizard (Feature 3)
  const handleExecuteMonthClose = () => {
    // Advance paid months for active residents and clear current month
    residents.forEach(res => {
      if (res.status === 'Бүрэн төлсөн') {
        onUpdateResident({
          ...res,
          paidMonths: Math.min(60, res.paidMonths + 1),
          currentOwnershipPercent: Number((25 + (Math.min(res.paidMonths + 1, 60) / 60) * 75).toFixed(2)),
          totalPrincipalPaid: res.totalPrincipalPaid + res.monthlyRent,
          remainingBalance: Math.max(0, res.remainingBalance - res.monthlyRent),
          rentPaidThisMonth: 0,
          rentUnpaid: res.monthlyRent,
          sohPaidThisMonth: 0,
          sohUnpaid: res.monthlySOH,
          status: 'Хүлээгдэж буй'
        });
      }
    });

    setMonthCloseSuccess(true);
    setTimeout(() => {
      setMonthCloseSuccess(false);
      setShowMonthCloseModal(false);
    }, 2000);
  };

  // Handle manual payment settlement
  const handleOpenSettle = (resident) => {
    setSettlingResident(resident);
    setSettleAmount(String(resident.totalDueThisMonth || resident.monthlyRent));
    setSettleType('ALL');
    setWaivePenalty(false);
    setWaiveReason('Захирлын шийдвэрээр алдангийг чөлөөлөв');
  };

  const handleConfirmSettle = (e) => {
    e.preventDefault();
    if (!settlingResident) return;

    const amountNum = Number(settleAmount) || 0;
    const waivedAmount = waivePenalty ? (settlingResident.rentPenalty + settlingResident.sohPenalty) : 0;

    // Log waive if penalty was waived
    if (waivedAmount > 0) {
      const newWaiveLog = {
        id: `WAIVE-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        residentId: settlingResident.id,
        residentName: `${settlingResident.fullName || settlingResident.name} (${settlingResident.apartment})`,
        amount: waivedAmount,
        reason: waiveReason,
        officer: currentUser.name
      };
      setPenaltyWaiveLogs(prev => [newWaiveLog, ...prev]);
    }

    // Add to daily cash transactions
    const newTx = {
      id: `TX-DLY-${Date.now().toString().slice(-4)}`,
      time: new Date().toTimeString().slice(0, 5),
      residentName: settlingResident.fullName || settlingResident.name,
      apartment: settlingResident.apartment,
      type: settleType === 'ALL' ? 'Түрээс + СӨХ' : settleType === 'RENT' ? 'Түрээс / Өмчлөл' : 'СӨХ-ийн хураамж',
      channel: settleChannel,
      amount: amountNum
    };
    setDailyCashTransactions(prev => [newTx, ...prev]);

    // Update resident state
    const updated = {
      ...settlingResident,
      rentPaidThisMonth: settleType === 'SOH' ? settlingResident.rentPaidThisMonth : settlingResident.monthlyRent,
      rentUnpaid: settleType === 'SOH' ? settlingResident.rentUnpaid : 0,
      sohPaidThisMonth: settleType === 'RENT' ? settlingResident.sohPaidThisMonth : settlingResident.monthlySOH,
      sohUnpaid: settleType === 'RENT' ? settlingResident.sohUnpaid : 0,
      overdueDays: 0,
      rentPenalty: 0,
      sohPenalty: 0,
      penaltyWaived: (settlingResident.penaltyWaived || 0) + waivedAmount,
      status: 'Бүрэн төлсөн',
      totalDueThisMonth: 0
    };

    onUpdateResident(updated);
    setSettlingResident(null);
  };

  // Handle Bank Statement Auto-Reconciliation
  const handleReconcileStatement = (stmt) => {
    if (!stmt.matchedResidentId) {
      alert('Энэ гүйлгээнд тохирох оршин суугч тодорхойгүй байна.');
      return;
    }
    const targetRes = residents.find(r => r.id === stmt.matchedResidentId);
    if (!targetRes) return;

    const updated = {
      ...targetRes,
      rentPaidThisMonth: targetRes.monthlyRent,
      rentUnpaid: 0,
      sohPaidThisMonth: targetRes.monthlySOH,
      sohUnpaid: 0,
      overdueDays: 0,
      rentPenalty: 0,
      sohPenalty: 0,
      status: 'Бүрэн төлсөн',
      totalDueThisMonth: 0
    };

    onUpdateResident(updated);
    setBankStatements(prev => prev.map(s => s.id === stmt.id ? { ...s, status: 'APPROVED' } : s));
    setReconcileSuccessMsg(`✓ ${stmt.matchedResidentName} (${stmt.matchedApartment})-ийн ${stmt.amount.toLocaleString()}₮ гүйлгээг амжилттай баталгаажуулав!`);
    setTimeout(() => setReconcileSuccessMsg(null), 4000);
  };

  const handleBulkReconcileAll = () => {
    let approvedCount = 0;
    bankStatements.forEach(stmt => {
      if (stmt.status === 'MATCHED' && stmt.matchedResidentId) {
        const targetRes = residents.find(r => r.id === stmt.matchedResidentId);
        if (targetRes) {
          onUpdateResident({
            ...targetRes,
            rentPaidThisMonth: targetRes.monthlyRent,
            rentUnpaid: 0,
            sohPaidThisMonth: targetRes.monthlySOH,
            sohUnpaid: 0,
            overdueDays: 0,
            rentPenalty: 0,
            sohPenalty: 0,
            status: 'Бүрэн төлсөн',
            totalDueThisMonth: 0
          });
          approvedCount++;
        }
      }
    });

    setBankStatements(prev => prev.map(s => ({ ...s, status: 'APPROVED' })));
    setReconcileSuccessMsg(`✓ Нийт ${approvedCount} оршин суугчийн банкны төлөлтийг 1 товшилтоор амжилттай баталгаажууллаа!`);
    setTimeout(() => setReconcileSuccessMsg(null), 5000);
  };

  // Handle Add SOH Expense
  const handleAddSohExpense = (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;

    const expenseItem = {
      id: `EXP-502-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      category: newExpense.category,
      title: newExpense.title,
      amount: Number(newExpense.amount),
      recipient: newExpense.recipient || 'Гүйцэтгэгч',
      receiptNo: newExpense.receiptNo || `REC-${Date.now().toString().slice(-4)}`,
      payer: currentUser.name,
      account: 'Голомт Банк (СӨХ данс)',
      status: 'Төлөгдсөн'
    };

    setSohExpenses(prev => [expenseItem, ...prev]);
    setShowAddExpenseModal(false);
    setNewExpense({ category: 'Лифт үйлчилгээ', title: '', amount: '', recipient: '', receiptNo: '' });
  };

  // Handle Bulk Broadcast Notifications
  const handleSendBroadcast = () => {
    const targetCount = notificationType === 'INVOICE' ? residents.length : overdueResidents.length;
    setBroadcastTargetCount(targetCount);
    setSentBroadcastSuccess(true);
    setTimeout(() => setSentBroadcastSuccess(false), 5000);
  };

  // Handle Document Upload
  const handleUploadDocument = (e) => {
    e.preventDefault();
    if (!newDocName) return;

    const newDoc = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      name: newDocName.endsWith('.pdf') ? newDocName : `${newDocName}.pdf`,
      size: '2.3 MB',
      date: new Date().toISOString().split('T')[0],
      type: 'CONTRACT',
      uploadedBy: currentUser.name
    };

    setAttachedDocs(prev => [newDoc, ...prev]);
    setShowUploadDocModal(false);
    setNewDocName('');
  };

  return (
    <div className="accountant-portal-layout">
      {/* Accountant Header */}
      <div className="accountant-header card-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="profile-avatar bg-blue-glow" style={{ width: '48px', height: '48px' }}>
            <UserCheck size={28} className="text-primary" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 700 }}>
                {currentUser.name}
              </h2>
              <span className="badge-pill bg-blue-glow">{currentUser.roleTitle}</span>
              <span className="badge-pill bg-purple-glow">502-р Байр</span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
              {currentUser.department} | {currentUser.email} | Түрээслээд өмчлөх ба СӨХ-ийн нэгдсэн санхүүгийн удирдлага
            </p>
          </div>
        </div>

        {/* Header Actions: Month Close & Cash Voucher */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary" 
            style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
            onClick={() => setShowMonthCloseModal(true)}
          >
            <CalendarCheck size={15} /> 🏁 8-р Сарын Тооцоо Хаах
          </button>
          <button className="btn-secondary" onClick={() => setShowCashVoucherModal(true)}>
            <Printer size={15} /> Өдрийн Кассын Тайлан
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FEATURE 5: SMART DAILY ACTION CHECKLIST (Нягтлангийн Өглөөний 3 Гол Ажил) */}
      {/* ========================================================================= */}
      <div className="card-box" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} className="text-primary" />
            <strong style={{ fontSize: '14px', color: '#0f172a' }}>Нягтлангийн Өнөөдрийн Гол Даалгаврууд (Smart Checklist):</strong>
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            Дууссан: {checklist.filter(c => c.done).length} / {checklist.length}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {checklist.map(item => (
            <div 
              key={item.id} 
              style={{
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '8px', 
                padding: '10px 12px', 
                background: item.done ? '#f0fdf4' : '#ffffff', 
                border: item.done ? '1px solid #86efac' : '1px solid #e2e8f0', 
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => toggleChecklist(item.id)}
            >
              {item.done ? (
                <CheckSquare size={16} className="text-emerald" style={{ flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <Square size={16} className="text-muted" style={{ flexShrink: 0, marginTop: '2px' }} />
              )}
              <div>
                <div style={{ fontSize: '12px', color: item.done ? '#166534' : '#1e293b', textDecoration: item.done ? 'line-through' : 'none', lineHeight: 1.4 }}>
                  {item.text}
                </div>
                <span 
                  style={{ fontSize: '10px', color: '#2563eb', fontWeight: 600, display: 'inline-block', marginTop: '4px' }}
                  onClick={(e) => { e.stopPropagation(); setActiveTab(item.targetTab); }}
                >
                  Гүйцэтгэх рүү шилжих →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="portal-tabs-nav">
        <button 
          className={`tab-item ${activeTab === 'OVERDUE_PENALTY' ? 'active' : ''}`}
          onClick={() => setActiveTab('OVERDUE_PENALTY')}
        >
          <AlertCircle size={16} /> Алдангийн Хяналт & Төлөлт ({overdueResidents.length})
        </button>
        <button 
          className={`tab-item ${activeTab === 'FLOOR_MAP' ? 'active' : ''}`}
          onClick={() => setActiveTab('FLOOR_MAP')}
        >
          <Building2 size={16} /> 🏢 502 Давхрын План
        </button>
        <button 
          className={`tab-item ${activeTab === 'BANK_RECON' ? 'active' : ''}`}
          onClick={() => setActiveTab('BANK_RECON')}
        >
          <Upload size={16} /> 🏦 Банкны Хуулга Тулгалт
        </button>
        <button 
          className={`tab-item ${activeTab === 'BULK_NOTIFICATIONS' ? 'active' : ''}`}
          onClick={() => setActiveTab('BULK_NOTIFICATIONS')}
        >
          <Mail size={16} /> 📲 Бөөнөөр Мэйл & SMS Илгээх
        </button>
        <button 
          className={`tab-item ${activeTab === 'SOH_EXPENSES' ? 'active' : ''}`}
          onClick={() => setActiveTab('SOH_EXPENSES')}
        >
          <Wrench size={16} /> 🏢 СӨХ-ийн Зардал & Сан ({sohExpenses.length})
        </button>
        <button 
          className={`tab-item ${activeTab === 'DAILY_CASH' ? 'active' : ''}`}
          onClick={() => setActiveTab('DAILY_CASH')}
        >
          <DollarSign size={16} /> 🧾 Өдрийн Кассын Журнал
        </button>
        <button 
          className={`tab-item ${activeTab === 'RESIDENTS_DOCS' ? 'active' : ''}`}
          onClick={() => setActiveTab('RESIDENTS_DOCS')}
        >
          <Paperclip size={16} /> 📁 169 Оршин Суугч & Архив
        </button>
        <button 
          className={`tab-item ${activeTab === 'OVERVIEW' ? 'active' : ''}`}
          onClick={() => setActiveTab('OVERVIEW')}
        >
          <TrendingUp size={16} /> Санхүүгийн KPI & Тайлан
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERDUE PENALTY HUB & SETTLEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'OVERDUE_PENALTY' && (
        <div className="accountant-penalty-hub">
          {/* Top Penalty KPI Cards */}
          <div className="kpi-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div className="kpi-card card-box bg-rose-subtle" style={{ border: '1px solid #fecdd3' }}>
              <span className="kpi-label" style={{ color: '#9f1239' }}>Нийт Тооцогдсон Алданги</span>
              <div className="kpi-value text-rose">
                {(stats.rent.penalty + stats.soh.penalty).toLocaleString()} <span className="kpi-unit">₮</span>
              </div>
              <span className="kpi-sub">Хоног тутамд 0.1%-иар бодогдсон</span>
            </div>

            <div className="kpi-card card-box">
              <span className="kpi-label">Хугацаа Хэтэрсэн Нийт Айлууд</span>
              <div className="kpi-value text-amber">
                {overdueResidents.length} <span className="kpi-unit">өрх</span>
              </div>
              <span className="kpi-sub">Сар бүрийн 25-наас хойш хугацаа хэтэрсэн</span>
            </div>

            <div className="kpi-card card-box">
              <span className="kpi-label">Хүлээгдэж Буй Түрээсийн Үлдэгдэл</span>
              <div className="kpi-value text-primary">
                {(stats.rent.outstanding / 1000000).toFixed(2)} <span className="kpi-unit">сая ₮</span>
              </div>
              <span className="kpi-sub">Үндсэн 75%-ийн сарын төлөлт</span>
            </div>

            <div className="kpi-card card-box bg-emerald-subtle" style={{ border: '1px solid #bbf7d0' }}>
              <span className="kpi-label" style={{ color: '#166534' }}>Чөлөөлөгдсөн Алданги</span>
              <div className="kpi-value text-emerald">
                {stats.rent.penaltyWaived?.toLocaleString()} <span className="kpi-unit">₮</span>
              </div>
              <span className="kpi-sub">{penaltyWaiveLogs.length} шийдвэрээр хөнгөлөлт үзүүлсэн</span>
            </div>
          </div>

          {/* Overdue Table */}
          <div className="card-box" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                  Хугацаа Хэтэрсэн ба Алданги Тооцогдож Буй Өрхүүд ({overdueResidents.length})
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                  Өдөр бүр тооцогдож буй 0.1% алдангийн хэмжээг бодит цагаар хянах, төлбөр баталгаажуулах, албан шаардах хуудас үүсгэх
                </p>
              </div>

              {/* 1-Click Excel Report Export Buttons (Feature 1) */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button 
                  className="btn-secondary" 
                  onClick={() => exportPenaltyReport(residents, penaltyWaiveLogs)}
                  title="Алдангийн нарийвчилсан тайлан татах"
                >
                  <Download size={14} /> Алдангийн Тайлан (.xlsx)
                </button>
                <button className="btn-secondary" onClick={() => setActiveTab('BULK_NOTIFICATIONS')}>
                  <Send size={14} /> Бүгдэд SMS Сануулга Илгээх
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th>Байршил / Тоот</th>
                    <th>Оршин суугч / Бүх Утасны Дугаарууд</th>
                    <th>Гэрээний №</th>
                    <th>Хэтэрсэн</th>
                    <th style={{ textAlign: 'right' }}>Түрээс / Алданги</th>
                    <th style={{ textAlign: 'right' }}>СӨХ / Алданги</th>
                    <th style={{ textAlign: 'right' }}>Нийт Төлөх Дүн</th>
                    <th style={{ textAlign: 'center' }}>Үйлдэл</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueResidents.map((res) => (
                    <tr key={res.id}>
                      <td>
                        <strong>{res.apartment}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{res.areaSqm} м² ({res.rooms} өрөө)</div>
                      </td>
                      <td>
                        <strong>{res.fullName || res.name}</strong>
                        {/* Multi-phone numbers display (Feature 6) */}
                        <div style={{ fontSize: '11px', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Phone size={11} /> {res.phone}
                        </div>
                      </td>
                      <td>
                        <span className="badge-contract">{res.contractNo}</span>
                      </td>
                      <td>
                        <span className="badge-pill bg-rose-glow">
                          -{res.overdueDays} хоног
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div><strong>{res.rentUnpaid?.toLocaleString()} ₮</strong></div>
                        <div style={{ fontSize: '11px', color: '#e11d48' }}>+{res.rentPenalty?.toLocaleString()} ₮ (0.1%)</div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div><strong>{res.sohUnpaid?.toLocaleString()} ₮</strong></div>
                        <div style={{ fontSize: '11px', color: '#e11d48' }}>+{res.sohPenalty?.toLocaleString()} ₮</div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                          {res.totalDueThisMonth?.toLocaleString()} ₮
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button 
                            className="btn-primary-sm"
                            onClick={() => handleOpenSettle(res)}
                            title="Төлбөр кассад бүртгэх / Алданги чөлөөлөх"
                          >
                            <Check size={13} /> Төлөлт
                          </button>
                          {/* Legal Demand Notice Button (Feature 2) */}
                          <button 
                            className="btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11px', color: '#e11d48', borderColor: '#fecdd3' }}
                            onClick={() => setSelectedLegalResident(res)}
                            title="Албан шаардах хуудас үүсгэх"
                          >
                            <ShieldAlert size={12} /> Шаардах
                          </button>
                          <button 
                            className="btn-icon-sm"
                            onClick={() => setSelectedInvoiceData({ resident: res, type: 'INVOICE' })}
                            title="Нэхэмжлэх хэвлэх"
                          >
                            <Printer size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Penalty Waive History Section */}
          <div className="card-box" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                  ⚖️ Алданги Чөлөөлсөн & Хөнгөлсөн Шийдвэрийн Түүх (Penalty Audit Trail)
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                  Нягтлангийн алданги чөлөөлсөн бүх тушаал, шийдвэр, шалтгааны бүртгэл
                </p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th>Огноо / Цаг</th>
                    <th>Оршин Суугч</th>
                    <th>Чөлөөлсөн Дүн</th>
                    <th>Шалтгаан / Захирлын Тушаал</th>
                    <th>Шийдвэрлэсэн Нягтлан</th>
                  </tr>
                </thead>
                <tbody>
                  {penaltyWaiveLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.date}</td>
                      <td><strong>{log.residentName}</strong></td>
                      <td>
                        <span className="badge-pill bg-emerald-glow">
                          {log.amount?.toLocaleString()} ₮
                        </span>
                      </td>
                      <td>{log.reason}</td>
                      <td>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{log.officer}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: 502 BUILDING FLOOR MAP */}
      {/* ========================================================================= */}
      {activeTab === 'FLOOR_MAP' && (
        <BuildingFloorMap 
          residents={residents} 
          onOpenSettle={handleOpenSettle}
          onSelectResident={(res) => {
            setSearchTerm(res.door);
            setActiveTab('RESIDENTS_DOCS');
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BANK STATEMENT AUTO-RECONCILIATION */}
      {/* ========================================================================= */}
      {activeTab === 'BANK_RECON' && (
        <div className="accountant-bank-recon card-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                🏦 Банкны Хуулга Автоматаар Тулгах (Smart Bank Reconciliation)
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                ХААН Банк, Голомт банкны Excel/CSV хуулгыг системд уншуулахад 502-р байрны оршин суугчдын төлөлтийг 1 товшилтоор баталгаажуулна.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-primary" onClick={handleBulkReconcileAll}>
                <CheckCircle2 size={16} /> Бүх Таарсан Гүйлгээг Бөөнөөр Баталгаажуулах ({bankStatements.filter(s => s.status === 'MATCHED').length})
              </button>
            </div>
          </div>

          {reconcileSuccessMsg && (
            <div className="success-banner" style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> {reconcileSuccessMsg}
            </div>
          )}

          <div style={{ border: '2px dashed #93c5fd', borderRadius: '12px', padding: '24px', textAlign: 'center', background: '#eff6ff', marginBottom: '20px' }}>
            <Upload size={32} className="text-primary" style={{ margin: '0 auto 8px' }} />
            <h4 style={{ margin: 0, fontSize: '15px', color: '#1e3a8a' }}>
              Банкны Хуулга Файлаа Энд Чирж Оруулна Уу (.xlsx, .csv, .xls)
            </h4>
            <p style={{ margin: '4px 0 12px', fontSize: '12px', color: '#64748b' }}>
              ХААН Банкны Түрээсийн данс (5070123456) болон Голомт Банкны СӨХ-ийн данс (1605987654)-ны хуулга автоматаар танигдана.
            </p>
            <button className="btn-secondary" onClick={() => alert('ХААН Банкны 2026-08-р сарын шинэчилсэн хуулга амжилттай уншигдлаа!')}>
              Файл Сонгох
            </button>
          </div>

          <div className="table-responsive">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Огноо / Цаг</th>
                  <th>Банк / Данс</th>
                  <th>Шилжүүлэгч / Гүйлгээний Утга</th>
                  <th style={{ textAlign: 'right' }}>Дүн</th>
                  <th>Системд Таарсан Оршин Суугч</th>
                  <th style={{ textAlign: 'center' }}>Төлөв</th>
                  <th style={{ textAlign: 'center' }}>Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {bankStatements.map((stmt) => (
                  <tr key={stmt.id} style={{ background: stmt.status === 'APPROVED' ? '#f0fdf4' : 'inherit' }}>
                    <td>
                      <div><strong>{stmt.date}</strong></div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{stmt.time}</div>
                    </td>
                    <td>
                      <span className={`badge-pill ${stmt.bank.includes('ХААН') ? 'bg-blue-glow' : 'bg-emerald-glow'}`}>
                        {stmt.bank}
                      </span>
                    </td>
                    <td>
                      <div><strong>{stmt.sender}</strong></div>
                      <div style={{ fontSize: '12px', color: '#334155', fontStyle: 'italic' }}>"{stmt.description}"</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{stmt.amount?.toLocaleString()} ₮</strong>
                    </td>
                    <td>
                      {stmt.matchedResidentId ? (
                        <div>
                          <strong className="text-primary">{stmt.matchedResidentName}</strong>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{stmt.matchedApartment}</div>
                        </div>
                      ) : (
                        <span style={{ color: '#e11d48', fontSize: '12px' }}>Утга буруу, таараагүй</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {stmt.status === 'APPROVED' ? (
                        <span className="status-pill status-paid">Баталгаажсан</span>
                      ) : stmt.status === 'MATCHED' ? (
                        <span className="status-pill status-pending">100% Таарсан</span>
                      ) : (
                        <span className="badge-pill bg-rose-glow">Гараар оноох</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {stmt.status !== 'APPROVED' && stmt.matchedResidentId && (
                        <button 
                          className="btn-primary-sm"
                          onClick={() => handleReconcileStatement(stmt)}
                        >
                          <Check size={13} /> Батлах
                        </button>
                      )}
                      {stmt.status === 'APPROVED' && (
                        <span style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>✓ Орлого орсон</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BULK NOTIFICATIONS & MULTI-PHONE BROADCAST (Feature 6) */}
      {/* ========================================================================= */}
      {activeTab === 'BULK_NOTIFICATIONS' && (
        <div className="accountant-bulk-notifications card-box">
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
              📲 502-р Байрны 169 Өрх рүү Бөөнөөр Мэйл & SMS Илгээх Систем
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
              Сар бүрийн нэхэмжлэх, QPay төлбөрийн линк болон алдангийн анхааруулга сануулгыг 1 товшилтоор илгээнэ.
            </p>
          </div>

          {sentBroadcastSuccess && (
            <div className="success-banner" style={{ padding: '14px 18px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={20} />
              <div>
                <strong>Амжилттай илгээгдлээ!</strong>
                <div style={{ fontSize: '12px' }}>
                  Нийт {broadcastTargetCount} өрхийн имэйл ({residents.filter(r => r.email).length} мэйл) болон холбогдох бүх утасны дугаарууд (Нөхөр, Эхнэр, Хамтран түрээслэгч) руу мэдэгдэл шууд очлоо.
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div className="card-box" style={{ background: '#f8fafc', border: notificationType === 'INVOICE' ? '2px solid #2563eb' : '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => setNotificationType('INVOICE')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <input 
                  type="radio" 
                  checked={notificationType === 'INVOICE'} 
                  onChange={() => setNotificationType('INVOICE')} 
                />
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                  1. Сар Бүрийн Төлбөрийн Нэхэмжлэх + QPay QR (Бүх 169 Өрхөд)
                </h4>
              </div>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                Сар бүрийн 20-нд нийт 169 өрх рүү тухайн сарын Түрээс + СӨХ-ийн албан ёсны нэхэмжлэх, QPay линк болон банкны дансыг и-мэйл ба SMS-ээр илгээнэ.
              </p>
            </div>

            <div className="card-box" style={{ background: '#fff1f2', border: notificationType === 'OVERDUE_WARNING' ? '2px solid #e11d48' : '1px solid #fecdd3', cursor: 'pointer' }} onClick={() => setNotificationType('OVERDUE_WARNING')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <input 
                  type="radio" 
                  checked={notificationType === 'OVERDUE_WARNING'} 
                  onChange={() => setNotificationType('OVERDUE_WARNING')} 
                />
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#9f1239' }}>
                  2. Хугацаа Хэтэрсэн Алдангийн Сануулга ({overdueResidents.length} Өрхөд)
                </h4>
              </div>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                25-ны өдрөөс хойш төлбөрөө төлөөгүй өрхүүдийн бүх бүртгэлтэй дугаарууд (Нөхөр, Эхнэр, Хамтран өмчлөгч) руу өдөр тутмын 0.1% алдангийн анхааруулга илгээнэ.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }} onClick={handleSendBroadcast}>
              <Send size={17} /> 
              {notificationType === 'INVOICE' 
                ? `Нийт 169 Өрх рүү Нэхэмжлэх Илгээх` 
                : `Хугацаа Хэтэрсэн ${overdueResidents.length} Өрх рүү Алдангийн Сануулга Илгээх`}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SOH EXPENSES & FUND MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'SOH_EXPENSES' && (
        <div className="accountant-soh-expenses">
          <div className="kpi-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div className="kpi-card card-box">
              <span className="kpi-label">СӨХ-ийн Нийт Сарын Орлого</span>
              <div className="kpi-value text-emerald">
                {stats.soh.collected?.toLocaleString()} <span className="kpi-unit">₮</span>
              </div>
              <span className="kpi-sub">502-р байрны цугласан сан</span>
            </div>

            <div className="kpi-card card-box bg-rose-subtle" style={{ border: '1px solid #fecdd3' }}>
              <span className="kpi-label" style={{ color: '#9f1239' }}>Нийт Гарсан Зардал</span>
              <div className="kpi-value text-rose">
                {totalSohExpenseAmount.toLocaleString()} <span className="kpi-unit">₮</span>
              </div>
              <span className="kpi-sub">{sohExpenses.length} удаагийн зарлага</span>
            </div>

            <div className="kpi-card card-box bg-blue-subtle" style={{ border: '1px solid #bfdbfe' }}>
              <span className="kpi-label" style={{ color: '#1e40af' }}>СӨХ-ийн Дансны Цэвэр Үлдэгдэл</span>
              <div className="kpi-value text-primary">
                {sohNetBalance.toLocaleString()} <span className="kpi-unit">₮</span>
              </div>
              <span className="kpi-sub">Голомт банк: 1605987654</span>
            </div>

            <div className="kpi-card card-box">
              <span className="kpi-label">СӨХ-ийн Тариф (Суурь)</span>
              <div className="kpi-value text-slate">
                1,000 <span className="kpi-unit">₮/м²</span>
              </div>
              <span className="kpi-sub">Сар бүр талбайгаар тооцдог</span>
            </div>
          </div>

          <div className="card-box" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                  🏢 502-р Байрны СӨХ-ийн Зардлын Бүртгэл & Журнал
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                  Лифт, цэвэрлэгээ, харуул хамгаалалт, урсгал засвар, хог тээврийн зардлууд
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {/* 1-Click Excel SOH Export Button (Feature 1) */}
                <button className="btn-secondary" onClick={() => exportSohReport(residents, sohExpenses)}>
                  <Download size={14} /> СӨХ Тайлан (.xlsx)
                </button>
                <button className="btn-primary" onClick={() => setShowAddExpenseModal(true)}>
                  <PlusCircle size={15} /> + Шинэ Зардал Бүртгэх
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th>Огноо</th>
                    <th>Ангилал</th>
                    <th>Зардлын Утга / Гүйлгээ</th>
                    <th>Хүлээн авагч / Байгууллага</th>
                    <th>Баримт №</th>
                    <th style={{ textAlign: 'right' }}>Дүн</th>
                    <th>Нягтлан</th>
                  </tr>
                </thead>
                <tbody>
                  {sohExpenses.map((exp) => (
                    <tr key={exp.id}>
                      <td><strong>{exp.date}</strong></td>
                      <td>
                        <span className="badge-pill bg-blue-glow">{exp.category}</span>
                      </td>
                      <td>
                        <strong>{exp.title}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{exp.account}</div>
                      </td>
                      <td>{exp.recipient}</td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{exp.receiptNo}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <strong style={{ fontSize: '14px', color: '#e11d48' }}>-{exp.amount?.toLocaleString()} ₮</strong>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{exp.payer}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DAILY CASH FLOW JOURNAL */}
      {/* ========================================================================= */}
      {activeTab === 'DAILY_CASH' && (
        <div className="accountant-daily-cash card-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                🧾 Өдрийн Кассын Орлогын Журнал & Тайлан
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                Өнөөдөр кассаар бэлнээр, ХААН банкаар (Түрээс), Голомт банкаар (СӨХ) орсон орлогын тайлан
              </p>
            </div>

            <button className="btn-primary" onClick={() => setShowCashVoucherModal(true)}>
              <Printer size={15} /> Кассын Баримт Хэвлэх (Print Cash Voucher)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
            <div className="card-box" style={{ background: '#f8fafc' }}>
              <span className="kpi-label">Бэлэн Касс (Орлого)</span>
              <div className="kpi-value text-slate">1,343,640 ₮</div>
              <span className="kpi-sub">Кассын сейфэнд бэлэн байгаа</span>
            </div>
            <div className="card-box" style={{ background: '#eff6ff' }}>
              <span className="kpi-label">ХААН Банк (Түрээс)</span>
              <div className="kpi-value text-primary">1,294,900 ₮</div>
              <span className="kpi-sub">Данс: 5070123456</span>
            </div>
            <div className="card-box" style={{ background: '#f0fdf4' }}>
              <span className="kpi-label">Голомт Банк (СӨХ)</span>
              <div className="kpi-value text-emerald">45,040 ₮</div>
              <span className="kpi-sub">Данс: 1605987654</span>
            </div>
            <div className="card-box bg-emerald-glow" style={{ border: '1px solid #86efac' }}>
              <span className="kpi-label" style={{ color: '#166534' }}>Өдрийн Нийт Орлого</span>
              <div className="kpi-value text-emerald">2,683,580 ₮</div>
              <span className="kpi-sub">Нийт баталгаажсан дүн</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Цаг</th>
                  <th>Оршин суугч / Тоот</th>
                  <th>Төлбөрийн Төрөл</th>
                  <th>Төлсөн Суваг / Данс</th>
                  <th style={{ textAlign: 'right' }}>Дүн</th>
                  <th style={{ textAlign: 'center' }}>Төлөв</th>
                </tr>
              </thead>
              <tbody>
                {dailyCashTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td><strong>{tx.time}</strong></td>
                    <td>
                      <strong>{tx.residentName}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{tx.apartment}</div>
                    </td>
                    <td>{tx.type}</td>
                    <td>
                      <span className="badge-pill bg-blue-glow">{tx.channel}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>{tx.amount?.toLocaleString()} ₮</strong>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="status-pill status-paid">Кассад орсон</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: 502 RESIDENTS & DOCUMENT ARCHIVE */}
      {/* ========================================================================= */}
      {activeTab === 'RESIDENTS_DOCS' && (
        <div className="accountant-residents-docs">
          {/* Quick Status Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <button 
              className={`tab-btn ${statusFilter === 'ALL' ? 'active-auth-tab' : ''}`}
              style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, border: '1px solid #cbd5e1', cursor: 'pointer', background: statusFilter === 'ALL' ? '#2563eb' : '#fff', color: statusFilter === 'ALL' ? '#fff' : '#334155' }}
              onClick={() => setStatusFilter('ALL')}
            >
              Бүх 169 Өрх ({residents.length})
            </button>
            <button 
              className={`tab-btn ${statusFilter === 'OVERDUE' ? 'active-auth-tab' : ''}`}
              style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, border: '1px solid #fecdd3', cursor: 'pointer', background: statusFilter === 'OVERDUE' ? '#e11d48' : '#fff1f2', color: statusFilter === 'OVERDUE' ? '#fff' : '#9f1239' }}
              onClick={() => setStatusFilter('OVERDUE')}
            >
              🔴 Алдангитай ({residents.filter(r => r.status === 'Хугацаа хэтэрсэн' || r.overdueDays > 0).length})
            </button>
            <button 
              className={`tab-btn ${statusFilter === 'UNDERPAID' ? 'active-auth-tab' : ''}`}
              style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, border: '1px solid #fde68a', cursor: 'pointer', background: statusFilter === 'UNDERPAID' ? '#d97706' : '#fef3c7', color: statusFilter === 'UNDERPAID' ? '#fff' : '#92400e' }}
              onClick={() => setStatusFilter('UNDERPAID')}
            >
              🟡 СӨХ / Дутуу Төлсөн ({residents.filter(r => r.status === 'Дутуу төлсөн' || r.status === 'СӨХ төлөөгүй').length})
            </button>
            <button 
              className={`tab-btn ${statusFilter === 'PAID' ? 'active-auth-tab' : ''}`}
              style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, border: '1px solid #bbf7d0', cursor: 'pointer', background: statusFilter === 'PAID' ? '#059669' : '#f0fdf4', color: statusFilter === 'PAID' ? '#fff' : '#166534' }}
              onClick={() => setStatusFilter('PAID')}
            >
              🟢 Бүрэн Төлсөн ({residents.filter(r => r.status === 'Бүрэн төлсөн').length})
            </button>
          </div>

          {/* Controls Bar */}
          <div className="card-box" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px' }}>
                <div className="search-bar-wrap" style={{ flex: 1 }}>
                  <Search size={16} className="search-icon" />
                  <input 
                    type="text"
                    placeholder="Нэр, тоот (502В-1, 502Д-2), утас, РД, гэрээгээр хайх..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field search-input"
                  />
                </div>

                <select 
                  value={blockFilter} 
                  onChange={(e) => setBlockFilter(e.target.value)}
                  className="input-field"
                  style={{ width: '130px' }}
                >
                  <option value="ALL">Бүх Блок</option>
                  <option value="502В">502В Блок</option>
                  <option value="502Д">502Д Блок</option>
                  <option value="502А">502А Блок</option>
                </select>

                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field"
                  style={{ width: '150px' }}
                >
                  <option value="ALL">Бүх Төлөв</option>
                  <option value="PAID">Бүрэн төлсөн</option>
                  <option value="OVERDUE">Хугацаа хэтэрсэн</option>
                  <option value="UNDERPAID">Дутуу төлсөн</option>
                  <option value="SOH_UNPAID">СӨХ төлөөгүй</option>
                </select>
              </div>

              {/* 1-Click Excel Monthly Report Export Button (Feature 1) */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" onClick={() => exportMonthlyFinancialReport(residents)}>
                  <Download size={15} /> 📥 Сарын Нэгдсэн Тайлан (.xlsx)
                </button>
              </div>
            </div>
          </div>

          {/* 502 Residents Table */}
          <div className="card-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
                502-р Байрны Нийт Оршин Суугчдын Жагсаалт ({filteredResidents.length})
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Excel-ээс импортлогдсон 169 бодит айл өрх
              </span>
            </div>

            <div className="table-responsive">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th>Байршил / Тоот</th>
                    <th>Оршин суугч / Ажлын газар</th>
                    <th>РД / Утас</th>
                    <th>Гэрээний №</th>
                    <th style={{ textAlign: 'center' }}>5 Жилийн Өмчлөл</th>
                    <th style={{ textAlign: 'right' }}>Сар Төлөх (Түрээс+СӨХ)</th>
                    <th style={{ textAlign: 'center' }}>Төлөв</th>
                    <th style={{ textAlign: 'center' }}>Архив & Үйлдэл</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResidents.map((res) => (
                    <React.Fragment key={res.id}>
                      <tr>
                        <td>
                          <strong>{res.apartment}</strong>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{res.areaSqm} м² ({res.rooms} өрөө)</div>
                        </td>
                        <td>
                          <strong>{res.fullName || res.name}</strong>
                          {res.workplace && (
                            <div style={{ fontSize: '11px', color: '#2563eb' }}>{res.workplace}</div>
                          )}
                        </td>
                        <td>
                          <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>{res.regNo}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{res.phone}</div>
                        </td>
                        <td>
                          <span className="badge-contract">{res.contractNo}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                            <strong className="text-primary">{res.currentOwnershipPercent}%</strong>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>({res.paidMonths}/60 сар)</span>
                          </div>
                          <div className="progress-track" style={{ height: '4px', width: '90px', margin: '3px auto 0' }}>
                            <div style={{ width: `${res.currentOwnershipPercent}%`, backgroundColor: '#2563eb' }} />
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div><strong>{(res.monthlyRent + res.monthlySOH)?.toLocaleString()} ₮</strong></div>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>
                            (Түрээс {res.monthlyRent?.toLocaleString()} + СӨХ {res.monthlySOH?.toLocaleString()})
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`status-pill ${
                            res.status === 'Бүрэн төлсөн' ? 'status-paid' :
                            res.status === 'Хугацаа хэтэрсэн' ? 'status-overdue' : 'status-pending'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                            <button 
                              className="btn-icon-sm"
                              title="Гэрээний баримт, файл архив харах"
                              onClick={() => {
                                setExpandedResId(expandedResId === res.id ? null : res.id);
                              }}
                            >
                              <Paperclip size={13} />
                            </button>
                            <button 
                              className="btn-primary-sm"
                              onClick={() => handleOpenSettle(res)}
                              title="Төлбөр бүртгэх"
                            >
                              Төлөлт
                            </button>
                            <button 
                              className="btn-icon-sm"
                              title="Нэхэмжлэх хэвлэх"
                              onClick={() => setSelectedInvoiceData({ resident: res, type: 'INVOICE' })}
                            >
                              <Printer size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Document Archive & Schedule Drawer */}
                      {expandedResId === res.id && (
                        <tr>
                          <td colSpan={8} style={{ background: '#f8fafc', padding: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                              <div className="card-box" style={{ background: '#fff' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>
                                    📁 {res.fullName || res.name}-ийн Гэрээ ба Баримтын Архив
                                  </h4>
                                  <button className="btn-secondary" style={{ padding: '3px 8px', fontSize: '11px' }} onClick={() => setShowUploadDocModal(true)}>
                                    + Баримт Хавсаргах
                                  </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  {attachedDocs.map(doc => (
                                    <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FileText size={16} className="text-primary" />
                                        <div>
                                          <div style={{ fontSize: '12px', fontWeight: 600 }}>{doc.name}</div>
                                          <div style={{ fontSize: '10px', color: '#64748b' }}>{doc.size} • {doc.date} • {doc.uploadedBy}</div>
                                        </div>
                                      </div>
                                      <button className="btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => alert(`"${doc.name}" файлыг нээж байна...`)}>
                                        Харах
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="card-box" style={{ background: '#fff' }}>
                                <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700 }}>
                                  60 Сарын Түрээслээд Өмчлөх Явцын Товчоо
                                </h4>
                                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                                  <div>25% Урьдчилгаа төлсөн: <strong>{res.downPayment?.toLocaleString()} ₮</strong></div>
                                  <div>Үлдсэн 75% үндсэн төлбөр: <strong>{res.remainingPrincipal?.toLocaleString()} ₮</strong></div>
                                  <div>Сар бүрийн хүүгүй төлөлт: <strong>{res.monthlyRent?.toLocaleString()} ₮</strong></div>
                                  <div>Төлсөн сар: <strong>{res.paidMonths} / 60 сар</strong></div>
                                  <div>Нийт өмчилсөн дүн: <strong className="text-primary">{res.totalPrincipalPaid?.toLocaleString()} ₮ ({res.currentOwnershipPercent}%)</strong></div>
                                  <div>Үлдэгдэл төлбөр: <strong className="text-emerald">{res.remainingBalance?.toLocaleString()} ₮</strong></div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: OVERVIEW & EXPORT KPI */}
      {/* ========================================================================= */}
      {activeTab === 'OVERVIEW' && (
        <div className="accountant-overview-view">
          <div className="kpi-cards-grid">
            <div className="kpi-card card-box">
              <span className="kpi-label">502 Байрны Багцын Үнэлгээ</span>
              <div className="kpi-value text-primary">
                {(stats.portfolio.totalValue / 1000000000).toFixed(2)} <span className="kpi-unit">тэрбум ₮</span>
              </div>
              <span className="kpi-sub">169 айлын 5 жилийн гэрээ</span>
            </div>

            <div className="kpi-card card-box">
              <span className="kpi-label">25% Урьдчилгааны Нийт Сан</span>
              <div className="kpi-value text-purple">
                {(stats.portfolio.downPaymentCollected / 1000000000).toFixed(2)} <span className="kpi-unit">тэрбум ₮</span>
              </div>
              <span className="kpi-sub">Эхний баталгаат хөрөнгө</span>
            </div>

            <div className="kpi-card card-box">
              <span className="kpi-label">Сарын Түрээсийн Орлого (75%)</span>
              <div className="kpi-value text-emerald">
                {(stats.rent.collected / 1000000).toFixed(1)} <span className="kpi-unit">сая ₮</span>
              </div>
              <span className="kpi-sub">60 сарын 0% хүүтэй төлөлт</span>
            </div>

            <div className="kpi-card card-box">
              <span className="kpi-label">СӨХ-ийн Сарын Нийт Сан</span>
              <div className="kpi-value text-amber">
                {(stats.soh.collected / 1000000).toFixed(1)} <span className="kpi-unit">сая ₮</span>
              </div>
              <span className="kpi-sub">1,000₮/м² хураамж</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SETTLE PAYMENT & PENALTY WAIVER */}
      {/* ========================================================================= */}
      {settlingResident && (
        <div className="modal-overlay">
          <div className="modal-content card-box" style={{ maxWidth: '550px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700 }}>
              Төлбөр Кассад Бүртгэх & Баталгаажуулах
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
              <strong>{settlingResident.apartment}</strong> | {settlingResident.fullName || settlingResident.name}
            </p>

            <form onSubmit={handleConfirmSettle}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Төлбөрийн төрөл:</label>
                <select 
                  className="input-field"
                  value={settleType}
                  onChange={(e) => setSettleType(e.target.value)}
                >
                  <option value="ALL">Түрээс + СӨХ (Бүгд)</option>
                  <option value="RENT">Зөвхөн Түрээс / Өмчлөл</option>
                  <option value="SOH">Зөвхөн СӨХ-ийн хураамж</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Төлбөрийн суваг / Данс:</label>
                <select 
                  className="input-field"
                  value={settleChannel}
                  onChange={(e) => setSettleChannel(e.target.value)}
                >
                  <option value="ХААН Банк (Шилжүүлэг)">ХААН Банк (Түрээсийн данс: 5070123456)</option>
                  <option value="Голомт Банк (СӨХ данс)">Голомт Банк (СӨХ данс: 1605987654)</option>
                  <option value="Бэлэн касс">Бэлэн мөнгө (Кассаар)</option>
                  <option value="QPay QR">QPay QR төлөлт</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Төлөх дүн (₮):</label>
                <input 
                  type="number"
                  required
                  className="input-field"
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                />
              </div>

              {/* Penalty Waiver Section */}
              {(settlingResident.rentPenalty > 0 || settlingResident.sohPenalty > 0) && (
                <div style={{ padding: '12px', background: '#fff1f2', borderRadius: '8px', border: '1px solid #fecdd3', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <input 
                      type="checkbox"
                      id="waiveChk"
                      checked={waivePenalty}
                      onChange={(e) => setWaivePenalty(e.target.checked)}
                    />
                    <label htmlFor="waiveChk" style={{ fontWeight: 700, color: '#9f1239', cursor: 'pointer', margin: 0 }}>
                      Хоног тутмын алдангийг ({((settlingResident.rentPenalty || 0) + (settlingResident.sohPenalty || 0)).toLocaleString()} ₮) чөлөөлөх / тэглэх
                    </label>
                  </div>
                  {waivePenalty && (
                    <div style={{ marginTop: '8px' }}>
                      <label style={{ fontSize: '11px', color: '#64748b' }}>Алданги чөлөөлөх шалтгаан / Захирлын тушаал:</label>
                      <input 
                        type="text"
                        required={waivePenalty}
                        className="input-field"
                        value={waiveReason}
                        onChange={(e) => setWaiveReason(e.target.value)}
                        placeholder="Жишээ: Захирлын 2026/08/25-ны 15-р тушаал"
                      />
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setSettlingResident(null)}>
                  Цуцлах
                </button>
                <button type="submit" className="btn-primary">
                  <CheckCircle2 size={16} /> Төлбөр Баталгаажуулах
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 3: MONTH-END CLOSING WIZARD MODAL (Сар Хаах Модал) */}
      {/* ========================================================================= */}
      {showMonthCloseModal && (
        <div className="modal-overlay">
          <div className="modal-content card-box" style={{ maxWidth: '520px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarCheck size={20} className="text-primary" /> 2026 Оны 8-р Сарын Тооцоог Хаах
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
              Сар хаах үед бүрэн төлөлттэй 132 өрхийн өмчлөлийн сар (+1 сар) ахиж, төлөөгүй өрхүүдийн үлдэгдэл 9-р сарын нэхэмжлэх рүү автоматаар шилжинэ.
            </p>

            <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Бүрэн төлсөн өрхүүд:</span>
                <strong className="text-emerald">{residents.filter(r => r.status === 'Бүрэн төлсөн').length} өрх (+1 сар өмчлөл)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Хугацаа хэтэрсэн / Үлдэгдэлтэй өрхүүд:</span>
                <strong className="text-rose">{overdueResidents.length} өрх (Өр шилжих)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '6px', fontWeight: 700 }}>
                <span>8-р сарын нийт түрээсийн орлого:</span>
                <span className="text-primary">{(stats.rent.collected / 1000000).toFixed(1)} сая ₮</span>
              </div>
            </div>

            {monthCloseSuccess && (
              <div style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', color: '#166534', fontSize: '13px', marginBottom: '14px', textAlign: 'center' }}>
                ✓ 8-р сарын тооцоо амжилттай хаагдаж, 9-р сарын нэхэмжлэхүүд үүслээ!
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowMonthCloseModal(false)}>
                Цуцлах
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
                onClick={handleExecuteMonthClose}
              >
                🏁 Сар Хааж, Дараа Сар руу Шилжүүлэх
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD SOH EXPENSE */}
      {/* ========================================================================= */}
      {showAddExpenseModal && (
        <div className="modal-overlay">
          <div className="modal-content card-box" style={{ maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700 }}>
              🏢 СӨХ-ийн Шинэ Зардал Бүртгэх
            </h3>
            <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#64748b' }}>
              502-р байрны дундын ашиглалт, засвар, үйлчилгээний зарлагын баримт
            </p>

            <form onSubmit={handleAddSohExpense}>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label>Зардлын ангилал:</label>
                <select 
                  className="input-field"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                >
                  <option value="Лифт үйлчилгээ">Лифт үйлчилгээ, үзлэг</option>
                  <option value="Цэвэрлэгээний материал">Цэвэрлэгээний бодис, хэрэгсэл</option>
                  <option value="Харуул хамгаалалт">Харуул хамгаалалтын төлбөр</option>
                  <option value="Хог тээвэрлэлт">Хог тээвэрлэлт, ариутгал</option>
                  <option value="Дундын урсгал засвар">Дундын урсгал засвар (Сантехник, гэрэлтүүлэг)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label>Зардлын утга / Тайлбар:</label>
                <input 
                  type="text"
                  required
                  placeholder="Жишээ: 502Д орцны халаалтын паарны хаалт солих"
                  className="input-field"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label>Зардлын дүн (₮):</label>
                <input 
                  type="number"
                  required
                  placeholder="Жишээ: 150000"
                  className="input-field"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label>Хүлээн авагч байгууллага / Хүн:</label>
                <input 
                  type="text"
                  placeholder="Жишээ: Дорноговь Сантехник Сервис"
                  className="input-field"
                  value={newExpense.recipient}
                  onChange={(e) => setNewExpense({ ...newExpense, recipient: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label>Баримт / Падангийн дугаар:</label>
                <input 
                  type="text"
                  placeholder="Жишээ: INV-9901"
                  className="input-field"
                  value={newExpense.receiptNo}
                  onChange={(e) => setNewExpense({ ...newExpense, receiptNo: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddExpenseModal(false)}>
                  Цуцлах
                </button>
                <button type="submit" className="btn-primary">
                  <CheckCircle2 size={16} /> Зардал Бүртгэх
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: UPLOAD DOCUMENT MODAL */}
      {/* ========================================================================= */}
      {showUploadDocModal && (
        <div className="modal-overlay">
          <div className="modal-content card-box" style={{ maxWidth: '450px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700 }}>
              📁 Гэрээний Баримт Хавсаргах
            </h3>
            <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#64748b' }}>
              Оршин суугчийн профайлд хавсаргагдах сканердсан баримт
            </p>

            <form onSubmit={handleUploadDocument}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Баримтын нэр:</label>
                <input 
                  type="text"
                  required
                  placeholder="Жишээ: 25% Урьдчилгаа төлсөн баримт"
                  className="input-field"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                />
              </div>

              <div style={{ border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '16px', textAlign: 'center', background: '#f8fafc', marginBottom: '14px' }}>
                <Paperclip size={24} className="text-muted" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '12px', color: '#64748b' }}>Файл сонгох (PDF, JPG, PNG)</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowUploadDocModal(false)}>
                  Цуцлах
                </button>
                <button type="submit" className="btn-primary">
                  Хавсаргах
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 2: LEGAL DEMAND NOTICE MODAL (Албан Шаардах Хуудас) */}
      {/* ========================================================================= */}
      {selectedLegalResident && (
        <LegalNoticeModal 
          resident={selectedLegalResident}
          onClose={() => setSelectedLegalResident(null)}
        />
      )}

      {/* Invoice / Receipt Modal */}
      {selectedInvoiceData && (
        <InvoiceModal 
          resident={selectedInvoiceData.resident}
          type={selectedInvoiceData.type}
          transaction={selectedInvoiceData.transaction}
          onClose={() => setSelectedInvoiceData(null)}
        />
      )}

      {/* Daily Cash Voucher Modal */}
      {showCashVoucherModal && (
        <CashVoucherModal 
          date={new Date().toISOString().split('T')[0]}
          totalCash={1343640}
          totalKhan={1294900}
          totalGolomt={45040}
          transactionList={dailyCashTransactions}
          accountantName={currentUser.name}
          onClose={() => setShowCashVoucherModal(false)}
        />
      )}
    </div>
  );
}
