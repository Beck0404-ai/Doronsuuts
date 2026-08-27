import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Users, TrendingUp, 
  CheckCircle2, Edit, Save, 
  Lock, Sliders, Activity, Clock
} from 'lucide-react';
import { 
  getStatistics, SYSTEM_USERS, SYSTEM_CONFIG, BANK_ACCOUNTS 
} from '../data/mockData';

export default function AdminPortal({ residents }) {
  // Current active admin
  const [adminUser] = useState(SYSTEM_USERS[2]); // Билгүүн (Системийн Админ)

  // Sub tabs
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW, CONFIG, STAFF, AUDIT

  // System Configuration State
  const [config, setConfig] = useState(SYSTEM_CONFIG);
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Staff members state
  const [staffList] = useState(SYSTEM_USERS);

  // Mock Audit Logs
  const [auditLogs] = useState([
    {
      id: 'LOG-881',
      time: '2026-08-25 15:42',
      user: 'Соёл-Ундараа (Ахлах Нягтлан)',
      action: 'Төлбөр Баталгаажуулсан',
      details: 'RES-502-001 оршин суугчийн 1,339,940₮ төлбөрийг кассад бүртгэв.'
    },
    {
      id: 'LOG-880',
      time: '2026-08-25 14:15',
      user: 'Соёл-Ундараа (Ахлах Нягтлан)',
      action: 'Алданги Чөлөөлсөн',
      details: 'RES-502-004 оршин суугчийн 19,500₮ алдангийг Захирал Энхцэцэгийн шийдвэрээр чөлөөлөв.'
    },
    {
      id: 'LOG-879',
      time: '2026-08-24 11:20',
      user: 'Билгүүн (Системийн Админ)',
      action: 'Системийн Тохиргоо',
      details: 'СӨХ-ийн тарифын м² суурийг 1,000₮ болгон шинэчлэв.'
    },
    {
      id: 'LOG-878',
      time: '2026-08-23 09:30',
      user: 'Орхонсэлэнгэ (Нярав)',
      action: 'Кассын Орлогын Ордер',
      details: '502-р байрны өдрийн 2,683,580₮ кассын орлогыг баталгаажуулав.'
    }
  ]);

  const stats = useMemo(() => getStatistics(residents), [residents]);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setIsEditingConfig(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="admin-portal-layout">
      {/* Admin Header with Security & Executive Badge */}
      <div className="accountant-header card-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="profile-avatar bg-purple-glow" style={{ width: '48px', height: '48px' }}>
            <ShieldCheck size={28} className="text-purple" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 700 }}>
                {adminUser.name}
              </h2>
              <span className="badge-pill bg-purple-glow">{adminUser.roleTitle}</span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
              {adminUser.department} | {adminUser.email} | Ерөнхий удирдлага, тохиргоо ба аудитын систем
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge-pill bg-emerald-glow">
            <Lock size={12} /> Систем Хэвийн Ажиллаж Байна
          </span>
        </div>
      </div>

      {/* Tabs Nav */}
      <div className="portal-tabs-nav">
        <button 
          className={`tab-item ${activeTab === 'OVERVIEW' ? 'active' : ''}`}
          onClick={() => setActiveTab('OVERVIEW')}
        >
          <TrendingUp size={16} /> Компанийн Багц & Хөрөнгө
        </button>
        <button 
          className={`tab-item ${activeTab === 'CONFIG' ? 'active' : ''}`}
          onClick={() => setActiveTab('CONFIG')}
        >
          <Sliders size={16} /> Системийн Дүрэм & Алдангийн Тохиргоо
        </button>
        <button 
          className={`tab-item ${activeTab === 'STAFF' ? 'active' : ''}`}
          onClick={() => setActiveTab('STAFF')}
        >
          <Users size={16} /> Нягтлан & Ажилтнуудын Эрх ({staffList.length})
        </button>
        <button 
          className={`tab-item ${activeTab === 'AUDIT' ? 'active' : ''}`}
          onClick={() => setActiveTab('AUDIT')}
        >
          <Activity size={16} /> Үйлдлийн Бүртгэл & Аудит
        </button>
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="admin-overview-view">
          <div className="kpi-cards-grid">
            <div className="kpi-card card-box">
              <span className="kpi-label">Нийт Орон Сууцны Багцын Үнэлгээ</span>
              <div className="kpi-value text-primary">
                {(stats.portfolio.totalValue / 1000000000).toFixed(2)} <span className="kpi-unit">тэрбум ₮</span>
              </div>
              <span className="kpi-sub">{stats.portfolio.totalResidents} айлын 5 жилийн гэрээ</span>
            </div>

            <div className="kpi-card card-box bg-purple-subtle" style={{ border: '1px solid #ddd6fe' }}>
              <span className="kpi-label" style={{ color: '#5b21b6' }}>25% Урьдчилгааны Нийт Сан</span>
              <div className="kpi-value text-purple">
                {(stats.portfolio.downPaymentCollected / 1000000000).toFixed(2)} <span className="kpi-unit">тэрбум ₮</span>
              </div>
              <span className="kpi-sub">Гэрээний эхний баталгаат хөрөнгө</span>
            </div>

            <div className="kpi-card card-box">
              <span className="kpi-label">5 Жилийн Нийт Түрээсийн Орлого</span>
              <div className="kpi-value text-emerald">
                {(stats.rent.collected / 1000000).toFixed(1)} <span className="kpi-unit">сая ₮/сар</span>
              </div>
              <span className="kpi-sub">60 сарын 0% хүүтэй хуримтлал</span>
            </div>

            <div className="kpi-card card-box">
              <span className="kpi-label">СӨХ-ийн Нийт Сарын Сан</span>
              <div className="kpi-value text-amber">
                {(stats.soh.collected / 1000000).toFixed(1)} <span className="kpi-unit">сая ₮/сар</span>
              </div>
              <span className="kpi-sub">Байрны урсгал засвар, харуул хамгаалалт</span>
            </div>

            <div className="kpi-card card-box">
              <span className="kpi-label">Нийт Тооцогдсон Алданги</span>
              <div className="kpi-value text-rose">
                {((stats.rent.penalty + stats.soh.penalty)).toLocaleString()} <span className="kpi-unit">₮</span>
              </div>
              <span className="kpi-sub">Хоног тутамд 0.1%-иар бодогдсон</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div className="card-box">
              <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 700 }}>
                Хөтөлбөрийн 5 Жилийн Санхүүгийн Төлөвлөлт & Явц
              </h3>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                Манай компани нь оршин суугчдад байрны 25%-ийн урьдчилгаа төлбөрөөр байранд нь нүүлгэн оруулж, үлдсэн 75%-ийг 5 жилийн (60 сар) хугацаанд ямар ч банкны хүүгүйгээр сар бүр тэнцүү төлүүлж байна.
              </p>
              <div style={{ marginTop: '16px', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span>5 жилийн нийт өмчлөлийн явцын дундаж:</span>
                  <strong className="text-primary">48.2% (2-3-р жил)</strong>
                </div>
                <div className="progress-track" style={{ height: '10px' }}>
                  <div style={{ width: '48.2%', backgroundColor: '#2563eb' }} />
                </div>
              </div>
            </div>

            <div className="card-box">
              <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 700 }}>
                Албан Ёсны Банкны Дансны Хяналт
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Түрээс / Өмчлөлийн Данс:</div>
                  <strong style={{ fontSize: '14px' }}>{BANK_ACCOUNTS.RENT.bank} - {BANK_ACCOUNTS.RENT.number}</strong>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{BANK_ACCOUNTS.RENT.holder}</div>
                </div>

                <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>СӨХ-ийн Данс:</div>
                  <strong style={{ fontSize: '14px' }}>{BANK_ACCOUNTS.SOH.bank} - {BANK_ACCOUNTS.SOH.number}</strong>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{BANK_ACCOUNTS.SOH.holder}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM CONFIGURATION & PENALTY SETTINGS */}
      {activeTab === 'CONFIG' && (
        <div className="admin-config-view card-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                Системийн Санхүүгийн Дүрэм & Алдангийн Тохиргоо
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                Төлбөр төлөх хугацаа, хоног тутмын алдангийн хувь, СӨХ-ийн суурь тарифыг эндээс тохируулна.
              </p>
            </div>

            {!isEditingConfig ? (
              <button className="btn-secondary" onClick={() => setIsEditingConfig(true)}>
                <Edit size={15} /> Тохиргоо Засах
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" onClick={() => setIsEditingConfig(false)}>
                  Цуцлах
                </button>
                <button className="btn-primary" onClick={handleSaveConfig}>
                  <Save size={15} /> Хадгалах
                </button>
              </div>
            )}
          </div>

          {savedSuccess && (
            <div className="success-banner" style={{ padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> Системийн санхүүгийн шинэ дүрэм амжилттай хадгалагдлаа!
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div className="card-box" style={{ background: '#f8fafc' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                1. Алданги & Төлбөрийн Хугацааны Дүрэм
              </h4>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label>Хоног тутмын алдангийн хувь (%):</label>
                <input 
                  type="number"
                  step="0.01"
                  disabled={!isEditingConfig}
                  value={(config.dailyPenaltyRate * 100).toFixed(2)}
                  onChange={(e) => setConfig({ ...config, dailyPenaltyRate: (Number(e.target.value) || 0) / 100 })}
                  className="input-field"
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Одоогийн хувь: Өдөрт <strong>{(config.dailyPenaltyRate * 100).toFixed(2)}%</strong> (Иргэний хуулийн стандартын дагуу)
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label>Сар бүрийн төлбөр төлөх эцсийн өдөр:</label>
                <input 
                  type="number"
                  min="1"
                  max="31"
                  disabled={!isEditingConfig}
                  value={config.paymentDueDay}
                  onChange={(e) => setConfig({ ...config, paymentDueDay: Number(e.target.value) || 25 })}
                  className="input-field"
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Сар бүрийн <strong>{config.paymentDueDay}</strong>-ны өдрөөс хойш алданги бодогдож эхэлнэ.
                </span>
              </div>
            </div>

            <div className="card-box" style={{ background: '#f8fafc' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                2. СӨХ & Гэрээний Дүрэм
              </h4>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label>СӨХ-ийн м² тутамд ногдох суурь тариф (₮):</label>
                <input 
                  type="number"
                  step="100"
                  disabled={!isEditingConfig}
                  value={config.sohRatePerSqm}
                  onChange={(e) => setConfig({ ...config, sohRatePerSqm: Number(e.target.value) || 1000 })}
                  className="input-field"
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  1 м² тутамд: <strong>{config.sohRatePerSqm?.toLocaleString()} ₮</strong>
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label>Гэрээний нийт сарын тоо (Хүүгүй хугацаа):</label>
                <input 
                  type="number"
                  disabled
                  value={config.totalMonths}
                  className="input-field"
                  style={{ background: '#f1f5f9' }}
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Тогтмол 5 жил буюу <strong>60 сар</strong>.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STAFF USERS & ROLES */}
      {activeTab === 'STAFF' && (
        <div className="admin-staff-view card-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                Системийн Нягтлан Бодогч ба Ажилтнуудын Эрх
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                Төлбөр бүртгэх, алданги тооцох, тайлан харах эрх бүхий албан тушаалтнууд
              </p>
            </div>
            <button className="btn-primary" onClick={() => alert('Шинэ нягтлан бүртгэх цонх нээгдэнэ.')}>
              + Шинэ Нягтлан Нэмэх
            </button>
          </div>

          <div className="table-responsive">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Нэр</th>
                  <th>Хэлтэс / Алба</th>
                  <th>Албан Тушаал</th>
                  <th>И-мэйл</th>
                  <th style={{ textAlign: 'center' }}>Системийн Эрх</th>
                  <th style={{ textAlign: 'center' }}>Төлөв</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>ID: {user.id}</div>
                    </td>
                    <td>{user.department}</td>
                    <td>{user.roleTitle}</td>
                    <td>{user.email}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge-pill ${user.role === 'ADMIN' ? 'bg-purple-glow' : 'bg-blue-glow'}`}>
                        {user.role === 'ADMIN' ? 'Бүрэн Админ Эрх' : 'Төлбөр & Алдангийн Эрх'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="status-pill status-paid">Идэвхтэй</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'AUDIT' && (
        <div className="admin-audit-view card-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
              Санхүүгийн Үйлдлийн Түүх & Аудит Бүртгэл
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Бүх төлбөрийн баталгаажуулалт, алданги чөлөөлөлт бүртгэгдэнэ
            </span>
          </div>

          <div className="table-responsive">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Огноо / Цаг</th>
                  <th>Ажилтан / Нягтлан</th>
                  <th>Үйлдлийн Төрөл</th>
                  <th>Дэлгэрэнгүй Мэдээлэл</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} className="text-muted" />
                        <span>{log.time}</span>
                      </div>
                    </td>
                    <td><strong>{log.user}</strong></td>
                    <td>
                      <span className="badge-pill bg-blue-glow">{log.action}</span>
                    </td>
                    <td>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
