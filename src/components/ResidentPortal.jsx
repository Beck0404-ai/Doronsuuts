import React, { useState, useMemo } from 'react';
import { 
  User, Calendar, CreditCard, Building2, 
  FileText, Download, Check, Clock, 
  Wrench, Send, QrCode, Paperclip, Printer
} from 'lucide-react';
import { 
  BANK_ACCOUNTS, SOH_BREAKDOWN_PERCENT, generateFullSchedule, 
  getPaymentHistory, SAMPLE_SERVICE_REQUESTS, SAMPLE_ATTACHED_DOCUMENTS
} from '../data/mockData';
import InvoiceModal from './InvoiceModal';

const DEMO_PRESET_IDS = [
  'RES-502-001', // Б. Содномпунцаг (502В-1)
  'RES-502-002', // Т. Норжинсүрэн (502Д-1)
  'RES-502-003', // Ц. Хөхцэцэг (502В-2)
  'RES-502-004', // Д. Энхтогтох (502Д-2)
  'RES-502-006', // Е. Өнөболд (502Д-3)
  'RES-502-008', // Л. Сүхбаатар (502Д-4)
  'RES-502-014', // С. Одгэрэл (502Д-7)
  'RES-502-146'  // Н. Алдарбаяр (502А-32)
];

export default function ResidentPortal({ residents, activeResidentProp, onUpdateResident, onOpenAuth }) {
  // Active selected resident ID
  const [selectedResId, setSelectedResId] = useState(
    activeResidentProp ? activeResidentProp.id : (residents && residents.length > 0 ? residents[0].id : 'RES-502-001')
  );
  const [activeTab, setActiveTab] = useState('PROFILE'); // PROFILE, SCHEDULE, SOH, DOCS, HISTORY

  // Sync if parent prop changes
  React.useEffect(() => {
    if (activeResidentProp && activeResidentProp.id) {
      setSelectedResId(activeResidentProp.id);
    }
  }, [activeResidentProp]);

  // Dynamically find current resident
  const resident = useMemo(() => {
    if (!residents || residents.length === 0) return null;
    return residents.find(r => r.id === selectedResId) || residents[0];
  }, [residents, selectedResId]);

  // 60-Month Schedule for the active resident
  const schedule = useMemo(() => {
    if (!resident) return [];
    return generateFullSchedule(resident);
  }, [resident]);

  // Payment history for the active resident
  const history = useMemo(() => {
    if (!resident) return [];
    return getPaymentHistory(resident);
  }, [resident]);

  // SOH Service Requests State
  const [serviceRequests, setServiceRequests] = useState(SAMPLE_SERVICE_REQUESTS);
  const [showReqForm, setShowReqForm] = useState(false);
  const [newReq, setNewReq] = useState({ category: 'Сантехник', title: '', description: '' });

  // Invoice / Receipt Modal State
  const [invoiceModalData, setInvoiceModalData] = useState(null); // { type: 'INVOICE' | 'RECEIPT', transaction?: any }

  // Interactive Payment Modal State
  const [showPayModal, setShowPayModal] = useState(false);
  const [payTarget] = useState('ALL'); // ALL, RENT, SOH
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Demo presets for quick testing
  const demoResidents = useMemo(() => {
    return residents.filter(r => DEMO_PRESET_IDS.includes(r.id));
  }, [residents]);

  if (!resident) {
    return (
      <div className="card-box" style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Оршин суугчийн мэдээлэл олдсонгүй</h3>
      </div>
    );
  }


  // Submit new SOH service ticket
  const handleAddRequest = (e) => {
    e.preventDefault();
    if (!newReq.title) return;
    const reqObj = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      residentId: resident.id,
      residentName: resident.name,
      apartment: resident.apartment,
      category: newReq.category,
      title: newReq.title,
      description: newReq.description,
      date: new Date().toISOString().split('T')[0],
      status: 'Хүлээгдэж буй',
      priority: 'Энгийн'
    };
    setServiceRequests([reqObj, ...serviceRequests]);
    setNewReq({ category: 'Сантехник', title: '', description: '' });
    setShowReqForm(false);
  };

  // Confirm Simulated Payment
  const handleProcessPayment = (e) => {
    e.preventDefault();
    setPaymentSuccess(true);
    
    setTimeout(() => {
      let updatedRentPaid = resident.rentPaidThisMonth;
      let updatedRentUnpaid = resident.rentUnpaid;
      let updatedSohPaid = resident.sohPaidThisMonth;
      let updatedSohUnpaid = resident.sohUnpaid;
      let updatedRentPenalty = resident.rentPenalty;
      let updatedSohPenalty = resident.sohPenalty;

      if (payTarget === 'ALL' || payTarget === 'RENT') {
        updatedRentPaid = resident.monthlyRent;
        updatedRentUnpaid = 0;
        updatedRentPenalty = 0;
      }
      if (payTarget === 'ALL' || payTarget === 'SOH') {
        updatedSohPaid = resident.monthlySOH;
        updatedSohUnpaid = 0;
        updatedSohPenalty = 0;
      }

      const totalUnpaid = updatedRentUnpaid + updatedSohUnpaid;
      const updatedStatus = totalUnpaid === 0 ? 'Бүрэн төлсөн' : 'Дутуу төлсөн';
      const updatedDue = updatedRentUnpaid + updatedRentPenalty + updatedSohUnpaid + updatedSohPenalty;

      const updatedResident = {
        ...resident,
        rentPaidThisMonth: updatedRentPaid,
        rentUnpaid: updatedRentUnpaid,
        sohPaidThisMonth: updatedSohPaid,
        sohUnpaid: updatedSohUnpaid,
        rentPenalty: updatedRentPenalty,
        sohPenalty: updatedSohPenalty,
        overdueDays: 0,
        status: updatedStatus,
        totalDueThisMonth: updatedDue
      };

      onUpdateResident(updatedResident);
      setPaymentSuccess(false);
      setShowPayModal(false);
    }, 1500);
  };

  return (
    <div className="resident-portal-layout">
      {/* Resident Switcher Bar (Demo helper) */}
      <div className="resident-demo-bar glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <User size={16} className="text-primary" />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>502-р байрны оршин суугч сонгох:</span>
          
          <select 
            value={selectedResId}
            onChange={(e) => setSelectedResId(e.target.value)}
            className="input-field"
            style={{ padding: '4px 10px', fontSize: '12px', minWidth: '220px' }}
          >
            {residents.map(r => (
              <option key={r.id} value={r.id}>
                {r.apartment} — {r.fullName || r.name} ({r.phone})
              </option>
            ))}
          </select>

          <button
            className="btn-primary"
            style={{ padding: '4px 10px', fontSize: '12px', marginLeft: 'auto' }}
            onClick={onOpenAuth}
          >
            + Шинээр Бүртгүүлэх / Нэвтрэх
          </button>
        </div>
        <div className="demo-chips-list">
          {demoResidents.map(r => (
            <button
              key={r.id}
              className={`demo-chip ${r.id === selectedResId ? 'active' : ''}`}
              onClick={() => setSelectedResId(r.id)}
            >
              <span>{r.name} ({r.apartment.split(' ')[0]})</span>
              <span className={`chip-badge ${r.overdueDays > 0 ? 'badge-danger-sm' : 'badge-success-sm'}`}>
                {r.overdueDays > 0 ? `-${r.overdueDays} хоног` : 'Хэвийн'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TIER 1: SMART 3-CARD HERO SUMMARY (Bank-App Style) */}
      {/* ========================================================================= */}
      <div className="resident-hero-cards-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* Card 1: Circular Ownership Progress */}
        <div className="card-box bg-gradient-hero" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)', color: '#fff', borderRadius: '14px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#bfdbfe', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                  Түрээслээд Өмчлөх Хөтөлбөр
                </span>
                <h2 style={{ margin: '4px 0 0', fontSize: '22px', fontWeight: 800 }}>
                  {resident.fullName || resident.name}
                </h2>
                <div style={{ fontSize: '12px', color: '#93c5fd', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span>{resident.apartment}</span>
                  <span>•</span>
                  <span>Нэвтрэх код: <strong style={{ color: '#fff', background: 'rgba(255,255,255,0.25)', padding: '1px 6px', borderRadius: '4px' }}>{resident.residentCode || '502-1'}</strong></span>
                  <span>•</span>
                  <span>РД: {resident.regNo}</span>
                </div>
              </div>

              <span className="badge-pill" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                Гэрээ: {resident.contractNo}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '20px 0' }}>
            <div className="ownership-ring-wrapper" style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="3.8"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="3.8"
                  strokeDasharray={`${resident.currentOwnershipPercent}, 100`}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 800 }}>{resident.currentOwnershipPercent}%</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '13px', color: '#bfdbfe' }}>5 Жилийн Өмчлөлийн Явц:</div>
              <div style={{ fontSize: '16px', fontWeight: 700, margin: '2px 0' }}>
                {resident.paidMonths} дахь сар / 60 сар
              </div>
              <div style={{ fontSize: '11px', color: '#93c5fd' }}>
                25% урьдчилгаа баталгаажсан + {resident.paidMonths} сар 0% хүүтэй төлөгдсөн
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '12px', fontSize: '12px' }}>
            <span>Төлсөн: <strong>{resident.totalPrincipalPaid?.toLocaleString()} ₮</strong></span>
            <span>Үлдэгдэл: <strong>{resident.remainingBalance?.toLocaleString()} ₮</strong></span>
          </div>
        </div>

        {/* Card 2: Current Month Due & Quick Pay Actions */}
        <div className="card-box" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: resident.overdueDays > 0 ? '2px solid #f87171' : '1px solid #e2e8f0', borderRadius: '14px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                  2026 Оны 8-р Сарын Төлбөр
                </span>
                <div style={{ fontSize: '13px', color: resident.overdueDays > 0 ? '#e11d48' : '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <Clock size={13} />
                  {resident.overdueDays > 0 
                    ? `Төлөх хугацаа ${resident.overdueDays} хоног хэтэрсэн` 
                    : 'Сар бүрийн 25-ны дотор төлнө (Хэвийн)'}
                </div>
              </div>

              <span className={`status-pill ${
                resident.status === 'Бүрэн төлсөн' ? 'status-paid' :
                resident.status === 'Хугацаа хэтэрсэн' ? 'status-overdue' : 'status-pending'
              }`}>
                {resident.status}
              </span>
            </div>

            {/* Split Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <span style={{ fontSize: '11px', color: '#1e40af', display: 'block' }}>🔵 Түрээс (75%):</span>
                <strong style={{ fontSize: '14px', color: '#1e3a8a' }}>{resident.monthlyRent?.toLocaleString()} ₮</strong>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>
                  {resident.rentUnpaid === 0 ? '✓ Төлөгдсөн' : 'Төлөөгүй'}
                </span>
              </div>

              <div style={{ padding: '10px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <span style={{ fontSize: '11px', color: '#166534', display: 'block' }}>🟢 СӨХ хураамж:</span>
                <strong style={{ fontSize: '14px', color: '#166534' }}>{resident.monthlySOH?.toLocaleString()} ₮</strong>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>
                  {resident.sohUnpaid === 0 ? '✓ Төлөгдсөн' : 'Төлөөгүй'}
                </span>
              </div>

              <div style={{ padding: '10px', background: resident.overdueDays > 0 ? '#fff1f2' : '#f8fafc', borderRadius: '8px', border: resident.overdueDays > 0 ? '1px solid #fecdd3' : '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', color: resident.overdueDays > 0 ? '#9f1239' : '#64748b', display: 'block' }}>🔴 Алданги (0.1%):</span>
                <strong style={{ fontSize: '14px', color: resident.overdueDays > 0 ? '#e11d48' : '#64748b' }}>
                  {(resident.rentPenalty + resident.sohPenalty).toLocaleString()} ₮
                </strong>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>
                  {resident.overdueDays > 0 ? `-${resident.overdueDays} хоног` : '0 хоног'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Нийт төлөх дүн:</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: resident.totalDueThisMonth > 0 ? '#0f172a' : '#166534' }}>
                {resident.totalDueThisMonth > 0 ? `${resident.totalDueThisMonth.toLocaleString()} ₮` : '0 ₮ (Бүрэн төлөгдсөн)'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn-secondary"
                onClick={() => setInvoiceModalData({ type: 'INVOICE' })}
              >
                <Printer size={15} /> Нэхэмжлэх
              </button>
              {resident.totalDueThisMonth > 0 ? (
                <button 
                  className="btn-primary"
                  style={{ background: '#059669', borderColor: '#059669', padding: '10px 18px', fontSize: '14px' }}
                  onClick={() => setShowPayModal(true)}
                >
                  <CreditCard size={16} /> QPay-ээр Төлөх
                </button>
              ) : (
                <button 
                  className="btn-secondary"
                  onClick={() => setInvoiceModalData({ type: 'RECEIPT' })}
                >
                  <Check size={15} /> Төлбөрийн Баримт
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TIER 2: SUB-NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div className="portal-tabs-nav">
        <button 
          className={`tab-item ${activeTab === 'PROFILE' ? 'active' : ''}`}
          onClick={() => setActiveTab('PROFILE')}
        >
          <Calendar size={16} /> 60 Сарын Төлбөрийн График
        </button>
        <button 
          className={`tab-item ${activeTab === 'SOH' ? 'active' : ''}`}
          onClick={() => setActiveTab('SOH')}
        >
          <Building2 size={16} /> СӨХ-ийн Үйлчилгээ & Ил Тод Зардал
        </button>
        <button 
          className={`tab-item ${activeTab === 'DOCS' ? 'active' : ''}`}
          onClick={() => setActiveTab('DOCS')}
        >
          <Paperclip size={16} /> Гэрээ & Баримтын Архив
        </button>
        <button 
          className={`tab-item ${activeTab === 'HISTORY' ? 'active' : ''}`}
          onClick={() => setActiveTab('HISTORY')}
        >
          <FileText size={16} /> Төлбөрийн Түүх & Баримт ({history.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 60-MONTH PAYMENT SCHEDULE */}
      {/* ========================================================================= */}
      {activeTab === 'PROFILE' && (
        <div className="card-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
                📅 60 Сарын Түрээслээд Өмчлөх Төлбөрийн График (5 Жил 0% Хүүгүй)
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                Сар бүр төлснөөр таны байрны өмчлөлийн хувь сар бүр тэнцүү өснө.
              </p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Сар / Огноо</th>
                  <th>Төлбөрийн Төрөл</th>
                  <th style={{ textAlign: 'right' }}>Сар Төлөх Дүн</th>
                  <th style={{ textAlign: 'center' }}>Өмчлөлийн Хувь</th>
                  <th style={{ textAlign: 'center' }}>Төлөв</th>
                  <th style={{ textAlign: 'center' }}>Баримт</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item) => (
                  <tr key={item.monthIndex} style={{ background: item.monthIndex === resident.paidMonths ? '#eff6ff' : 'inherit' }}>
                    <td>
                      <strong>{item.label}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.date}</div>
                    </td>
                    <td>{item.type}</td>
                    <td style={{ textAlign: 'right' }}>
                      <strong>{item.amount?.toLocaleString()} ₮</strong>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <strong className="text-primary">{item.ownershipPercent}%</strong>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status-pill ${item.status === 'Төлөгдсөн' ? 'status-paid' : item.status === 'Хугацаа хэтэрсэн' ? 'status-overdue' : 'status-pending'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {item.status === 'Төлөгдсөн' ? (
                        <button 
                          className="btn-icon-sm"
                          onClick={() => setInvoiceModalData({ type: 'RECEIPT' })}
                          title="Төлбөрийн баримт харах"
                        >
                          <Printer size={13} />
                        </button>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>-</span>
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
      {/* TAB 2: SOH SERVICES & TRANSPARENCY */}
      {/* ========================================================================= */}
      {activeTab === 'SOH' && (
        <div className="soh-tab-view">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
            {/* SOH Tariff Breakdown */}
            <div className="card-box">
              <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 700 }}>
                🏢 СӨХ-ийн Төлбөрийн Задаргаа (1,000₮/м²)
              </h3>
              <div className="soh-breakdown-list">
                <div className="soh-breakdown-item">
                  <div className="soh-item-header">
                    <span>Харуул хамгаалалт, 24/7 хяналтын камер</span>
                    <strong>{(resident.monthlySOH * SOH_BREAKDOWN_PERCENT.security).toLocaleString()} ₮ (35%)</strong>
                  </div>
                  <div className="bar-sub"><div style={{ width: '35%', backgroundColor: '#2563eb' }} /></div>
                </div>

                <div className="soh-breakdown-item">
                  <div className="soh-item-header">
                    <span>Орц, давхрын нийтийн цэвэрлэгээ</span>
                    <strong>{(resident.monthlySOH * SOH_BREAKDOWN_PERCENT.cleaning).toLocaleString()} ₮ (25%)</strong>
                  </div>
                  <div className="bar-sub"><div style={{ width: '25%', backgroundColor: '#10b981' }} /></div>
                </div>

                <div className="soh-breakdown-item">
                  <div className="soh-item-header">
                    <span>Лифтний сар бүрийн үзлэг, үйлчилгээ</span>
                    <strong>{(resident.monthlySOH * SOH_BREAKDOWN_PERCENT.elevator).toLocaleString()} ₮ (15%)</strong>
                  </div>
                  <div className="bar-sub"><div style={{ width: '15%', backgroundColor: '#8b5cf6' }} /></div>
                </div>

                <div className="soh-breakdown-item">
                  <div className="soh-item-header">
                    <span>Дундын сантехник, гэрэлтүүлгийн урсгал засвар</span>
                    <strong>{(resident.monthlySOH * SOH_BREAKDOWN_PERCENT.maintenance).toLocaleString()} ₮ (15%)</strong>
                  </div>
                  <div className="bar-sub"><div style={{ width: '15%', backgroundColor: '#f59e0b' }} /></div>
                </div>
              </div>

              <div style={{ marginTop: '16px', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                СӨХ-ийн тусдаа данс: <strong>{BANK_ACCOUNTS.SOH.bank} - {BANK_ACCOUNTS.SOH.number}</strong>
              </div>
            </div>

            {/* SOH Service Ticket Form */}
            <div className="card-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                  <Wrench size={16} className="text-primary" /> СӨХ-д Засвар / Хүсэлт Илгээх
                </h3>
                <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => setShowReqForm(!showReqForm)}>
                  {showReqForm ? 'Цуцлах' : '+ Шинэ Хүсэлт'}
                </button>
              </div>

              {showReqForm && (
                <form onSubmit={handleAddRequest} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                  <div className="form-group" style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '11px' }}>Ангилал:</label>
                    <select className="input-field" value={newReq.category} onChange={(e) => setNewReq({ ...newReq, category: e.target.value })}>
                      <option value="Сантехник">Сантехник (Ус, халаалт)</option>
                      <option value="Цахилгаан">Цахилгаан (Гэрэл, щит)</option>
                      <option value="Лифт">Лифт үйлчилгээ</option>
                      <option value="Цэвэрлэгээ">Орцны цэвэрлэгээ</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '11px' }}>Гарчиг:</label>
                    <input type="text" required placeholder="Жишээ: Паарны хаалт солих" className="input-field" value={newReq.title} onChange={(e) => setNewReq({ ...newReq, title: e.target.value })} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '8px' }}>
                    <Send size={13} /> Хүсэлт Илгээх
                  </button>
                </form>
              )}

              <div className="service-requests-list">
                {serviceRequests.map((req) => (
                  <div key={req.id} className="service-request-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge-pill bg-blue-glow">{req.category}</span>
                      <span className="status-pill status-pending" style={{ fontSize: '10px' }}>{req.status}</span>
                    </div>
                    <strong style={{ fontSize: '13px', display: 'block', margin: '4px 0 2px' }}>{req.title}</strong>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>{req.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CONTRACT DOCUMENTS ARCHIVE */}
      {/* ========================================================================= */}
      {activeTab === 'DOCS' && (
        <div className="card-box">
          <h3 style={{ margin: '0 0 14px', fontSize: '17px', fontWeight: 700 }}>
            📁 Таны Гэрээ & Санхүүгийн Баримтын Архив
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {SAMPLE_ATTACHED_DOCUMENTS.map(doc => (
              <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={20} className="text-primary" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{doc.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{doc.size} • Баталгаажсан • {doc.date}</div>
                  </div>
                </div>
                <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => alert(`"${doc.name}" файлыг нээж байна...`)}>
                  <Download size={13} /> Татах
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PAYMENT HISTORY */}
      {/* ========================================================================= */}
      {activeTab === 'HISTORY' && (
        <div className="card-box">
          <h3 style={{ margin: '0 0 14px', fontSize: '17px', fontWeight: 700 }}>
            🧾 Төлбөрийн Баримтын Түүх ({history.length})
          </h3>
          <div className="table-responsive">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Огноо</th>
                  <th>Гүйлгээний Утга</th>
                  <th>Данс / Суваг</th>
                  <th style={{ textAlign: 'right' }}>Төлсөн Дүн</th>
                  <th style={{ textAlign: 'center' }}>Төлөв</th>
                  <th style={{ textAlign: 'center' }}>Баримт</th>
                </tr>
              </thead>
              <tbody>
                {history.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td><strong>{tx.type}</strong></td>
                    <td>{tx.account}</td>
                    <td style={{ textAlign: 'right' }}>
                      <strong>{tx.amount?.toLocaleString()} ₮</strong>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="status-pill status-paid">{tx.status}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn-icon-sm"
                        onClick={() => setInvoiceModalData({ type: 'RECEIPT', transaction: tx })}
                        title="Баримт хэвлэх"
                      >
                        <Printer size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAYMENT MODAL (QPAY & BANK TRANSFER) */}
      {/* ========================================================================= */}
      {showPayModal && (
        <div className="modal-overlay">
          <div className="modal-content card-box" style={{ maxWidth: '460px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800 }}>
              Төлбөр Төлөх (QPay QR & Шилжүүлэг)
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#64748b' }}>
              {resident.apartment} • {resident.fullName || resident.name}
            </p>

            <form onSubmit={handleProcessPayment}>
              <div style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <div style={{ width: '140px', height: '140px', margin: '0 auto 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={110} className="text-primary" />
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Khan Bank, SocialPay, MBank, Golomt зэрэг бүх банкны апп-аар уншуулна</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669', marginTop: '6px' }}>
                  {resident.totalDueThisMonth?.toLocaleString()} ₮
                </div>
              </div>

              {paymentSuccess && (
                <div style={{ padding: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', color: '#166534', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>
                  ✓ Төлбөр амжилттай баталгаажлаа!
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowPayModal(false)}>
                  Цуцлах
                </button>
                <button type="submit" className="btn-primary" style={{ background: '#059669', borderColor: '#059669' }}>
                  Төлбөр Шалгах & Батлах
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice / Receipt Modal */}
      {invoiceModalData && (
        <InvoiceModal 
          resident={resident}
          type={invoiceModalData.type}
          transaction={invoiceModalData.transaction}
          onClose={() => setInvoiceModalData(null)}
        />
      )}
    </div>
  );
}
