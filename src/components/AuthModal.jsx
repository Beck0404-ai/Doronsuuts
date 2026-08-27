import React, { useState } from 'react';
import { Mail, Lock, CheckCircle2, X, ArrowRight, ShieldCheck, Briefcase, User, KeyRound } from 'lucide-react';
import { SYSTEM_USERS } from '../data/mockData';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess, 
  initialMode = 'LOGIN', 
  residents = [] 
}) {
  const [mode, setMode] = useState(initialMode); // 'LOGIN' | 'REGISTER' | 'STAFF'

  // Resident Login form state
  const [loginIdentifier, setLoginIdentifier] = useState(''); // email or phone
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Staff Login form state
  const [staffRole, setStaffRole] = useState('ACCOUNTANT'); // 'ACCOUNTANT' | 'ADMIN'
  const [staffUsername, setStaffUsername] = useState('accountant');
  const [staffPassword, setStaffPassword] = useState('••••••••');
  const [staffError, setStaffError] = useState('');

  // Registration form state
  const [regData, setRegData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    regNo: '',
    block: '502В байр',
    door: '1',
    password: '',
    confirmPassword: ''
  });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!isOpen) return null;

  // Handle Resident Sign In
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const cleanInput = loginIdentifier.trim().toLowerCase();

    // Look for matching resident in 502 residents list by email, phone, or name
    const found = residents.find(r => {
      const matchEmail = r.email && r.email.toLowerCase() === cleanInput;
      const matchPhone = r.phone && r.phone.replace(/[^0-9]/g, '').includes(cleanInput.replace(/[^0-9]/g, ''));
      const matchName = r.firstName && r.firstName.toLowerCase() === cleanInput;
      const matchApt = r.door && String(r.door) === cleanInput;
      return matchEmail || matchPhone || matchName || matchApt;
    });

    if (found) {
      onLoginSuccess({ type: 'RESIDENT', resident: found });
      onClose();
    } else {
      if (cleanInput === 'demo' || cleanInput === 'test') {
        onLoginSuccess({ type: 'RESIDENT', resident: residents[0] });
        onClose();
        return;
      }
      // If not found in mock, create a session for this resident
      const guestResident = {
        id: `RES-502-USER-${Date.now().toString().slice(-4)}`,
        contractNo: `DGA-502-${Math.floor(Math.random() * 900 + 100)}`,
        contractDate: '2024-01-01',
        name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : `Хэрэглэгч (${loginIdentifier})`,
        fullName: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : `Хэрэглэгч (${loginIdentifier})`,
        phone: loginIdentifier.includes('@') ? '88112233' : loginIdentifier,
        email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@gmail.com`,
        apartment: '502В байр, 1 тоот',
        block: '502В байр',
        door: '1',
        areaSqm: 45.04,
        rooms: 2,
        totalPrice: 103592000,
        downPayment: 25898000,
        remainingPrincipal: 77694000,
        monthlyRent: 1294900,
        monthlySOH: 45040,
        paidMonths: 8,
        totalMonths: 60,
        currentOwnershipPercent: 35,
        totalPrincipalPaid: 36257200,
        remainingBalance: 67334800,
        remainingMonths: 52,
        rentPaidThisMonth: 1294900,
        rentUnpaid: 0,
        sohPaidThisMonth: 45040,
        sohUnpaid: 0,
        overdueDays: 0,
        rentPenalty: 0,
        sohPenalty: 0,
        status: 'Бүрэн төлсөн',
        totalDueThisMonth: 0
      };
      onLoginSuccess({ type: 'RESIDENT', resident: guestResident });
      onClose();
    }
  };

  // Handle Staff Sign In (Accountant / Admin)
  const handleStaffLoginSubmit = (e) => {
    e.preventDefault();
    setStaffError('');

    if (staffRole === 'ACCOUNTANT') {
      const accountantUser = SYSTEM_USERS.find(u => u.role === 'ACCOUNTANT') || SYSTEM_USERS[1];
      onLoginSuccess({ type: 'STAFF', user: accountantUser, role: 'ACCOUNTANT' });
      onClose();
    } else if (staffRole === 'ADMIN') {
      const adminUser = SYSTEM_USERS.find(u => u.role === 'ADMIN') || SYSTEM_USERS[0];
      onLoginSuccess({ type: 'STAFF', user: adminUser, role: 'ADMIN' });
      onClose();
    }
  };

  // Handle Quick Demo Login
  const handleQuickResidentLogin = (res) => {
    onLoginSuccess({ type: 'RESIDENT', resident: res });
    onClose();
  };

  // Handle Registration
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!regData.phone || !regData.email || !regData.firstName) {
      setRegError('Бүх шаардлагатай талбарыг бөглөнө үү.');
      return;
    }

    if (regData.password && regData.password !== regData.confirmPassword) {
      setRegError('Нууц үг тохирохгүй байна.');
      return;
    }

    // Check if an existing 502 apartment matches this block & door
    const existing = residents.find(r => 
      r.apartment && r.apartment.includes(regData.block) && String(r.door) === String(regData.door)
    );

    const newResidentProfile = {
      id: `RES-502-${Date.now().toString().slice(-4)}`,
      contractNo: existing ? existing.contractNo : `DGA-502-${Math.floor(Math.random() * 900 + 100)}`,
      contractDate: '2024-01-01',
      name: regData.lastName ? `${regData.lastName.charAt(0)}. ${regData.firstName}` : regData.firstName,
      fullName: regData.lastName ? `${regData.lastName} ${regData.firstName}` : regData.firstName,
      lastName: regData.lastName,
      firstName: regData.firstName,
      regNo: regData.regNo || 'ЕГ88010101',
      phone: regData.phone,
      email: regData.email,
      workplace: 'Хувийн бүртгэл',
      apartment: `${regData.block}, ${regData.door} тоот`,
      block: regData.block,
      door: regData.door,
      areaSqm: existing ? existing.areaSqm : 48.74,
      rooms: existing ? existing.rooms : 2,
      totalPrice: existing ? existing.totalPrice : 112102000,
      downPayment: existing ? existing.downPayment : 28025500,
      remainingPrincipal: existing ? existing.remainingPrincipal : 84076500,
      monthlyRent: existing ? existing.monthlyRent : 1401275,
      monthlySOH: existing ? existing.monthlySOH : 48740,
      paidMonths: 6,
      totalMonths: 60,
      currentOwnershipPercent: 32.5,
      totalPrincipalPaid: existing ? existing.totalPrincipalPaid : 36433150,
      remainingBalance: existing ? existing.remainingBalance : 75668850,
      remainingMonths: 54,
      rentPaidThisMonth: existing ? existing.rentPaidThisMonth : 1401275,
      rentUnpaid: 0,
      sohPaidThisMonth: existing ? existing.sohPaidThisMonth : 48740,
      sohUnpaid: 0,
      overdueDays: 0,
      rentPenalty: 0,
      sohPenalty: 0,
      status: 'Бүрэн төлсөн',
      totalDueThisMonth: 0
    };

    setRegSuccess(true);
    setTimeout(() => {
      onLoginSuccess({ type: 'RESIDENT', resident: newResidentProfile });
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card-box auth-modal-box" style={{ maxWidth: '480px', padding: '28px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="Дорноговь Апартмент" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                ДОРНОГОВЬ АПАРТМЕНТ
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: mode === 'STAFF' ? '#7c3aed' : '#2563eb', fontWeight: 700 }}>
                {mode === 'STAFF' ? '🔐 Байгууллагын Ажилтны Хаалга' : '👤 Оршин Суугчийн Нэвтрэх & Бүртгэл'}
              </p>
            </div>
          </div>
          <button className="btn-icon-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher: Resident Sign In vs Sign Up (Normal Users) */}
        {mode !== 'STAFF' ? (
          <div className="auth-tab-toggle" style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px', marginBottom: '20px' }}>
            <button 
              type="button"
              className={`tab-btn ${mode === 'LOGIN' ? 'active-auth-tab' : ''}`}
              style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: mode === 'LOGIN' ? '#fff' : 'transparent', color: mode === 'LOGIN' ? '#2563eb' : '#64748b', boxShadow: mode === 'LOGIN' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none' }}
              onClick={() => { setMode('LOGIN'); setLoginError(''); }}
            >
              Оршин Суугч Нэвтрэх
            </button>
            <button 
              type="button"
              className={`tab-btn ${mode === 'REGISTER' ? 'active-auth-tab' : ''}`}
              style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: mode === 'REGISTER' ? '#fff' : 'transparent', color: mode === 'REGISTER' ? '#2563eb' : '#64748b', boxShadow: mode === 'REGISTER' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none' }}
              onClick={() => { setMode('REGISTER'); setRegError(''); }}
            >
              Шинээр Бүртгүүлэх
            </button>
          </div>
        ) : (
          /* Staff Mode Header Indicator */
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f5f3ff', borderRadius: '8px', border: '1px solid #ddd6fe', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6d28d9', fontSize: '13px', fontWeight: 700 }}>
              <KeyRound size={16} /> Ажилтан / Нягтлан / Админ Нэвтрэх
            </div>
            <button 
              type="button"
              style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => setMode('LOGIN')}
            >
              ← Оршин суугч руу буцах
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: RESIDENT SIGN IN / LOGIN */}
        {/* ========================================================================= */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit}>
            {loginError && (
              <div style={{ padding: '10px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '6px', color: '#e11d48', fontSize: '12px', marginBottom: '14px' }}>
                {loginError}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px', display: 'block' }}>
                И-мэйл эсвэл Утасны дугаар:
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input 
                  type="text"
                  required
                  placeholder="Жишээ: 88963373 эсвэл namsrai@gmail.com"
                  className="input-field"
                  style={{ paddingLeft: '36px' }}
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                  Нууц үг:
                </label>
                <span style={{ fontSize: '11px', color: '#2563eb', cursor: 'pointer' }} onClick={() => alert('Утасны дугаараар нууц үг сэргээх код илгээгдлээ.')}>
                  Мартсан уу?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-field"
                  style={{ paddingLeft: '36px' }}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '11px', fontSize: '14px', justifyContent: 'center' }}>
              Оршин Суугчаар Нэвтрэх <ArrowRight size={16} />
            </button>

            {/* Quick Demo Logins for 502 residents */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>
                Шуурхай тест нэвтрэлт (502-р байрны оршин суугчид):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {residents.slice(0, 4).map(r => (
                  <button
                    key={r.id}
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '6px 8px', fontSize: '11px', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: 'auto' }}
                    onClick={() => handleQuickResidentLogin(r)}
                  >
                    <strong style={{ fontSize: '11px' }}>{r.name}</strong>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>{r.apartment.split(' ')[0]} • {r.phone.split(',')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Discrete link for staff login */}
            <div style={{ marginTop: '16px', textAlign: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '12px' }}>
              <span 
                style={{ fontSize: '12px', color: '#64748b', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                onClick={() => setMode('STAFF')}
              >
                🔐 <strong>Ажилтны нэвтрэх (Нягтлан / Админ)</strong> →
              </span>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: RESIDENT REGISTER / SIGN UP */}
        {/* ========================================================================= */}
        {mode === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit}>
            {regError && (
              <div style={{ padding: '10px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '6px', color: '#e11d48', fontSize: '12px', marginBottom: '14px' }}>
                {regError}
              </div>
            )}

            {regSuccess && (
              <div style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', color: '#166534', fontSize: '13px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} /> Бүртгэл амжилттай үүслээ! Таны профайл руу шилжиж байна...
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '10px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>Овог:</label>
                <input 
                  type="text"
                  placeholder="Балжинням"
                  className="input-field"
                  value={regData.lastName}
                  onChange={(e) => setRegData({ ...regData, lastName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>Нэр *:</label>
                <input 
                  type="text"
                  required
                  placeholder="Содномпунцаг"
                  className="input-field"
                  value={regData.firstName}
                  onChange={(e) => setRegData({ ...regData, firstName: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '10px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>И-мэйл хаяг *:</label>
                <input 
                  type="email"
                  required
                  placeholder="example@gmail.com"
                  className="input-field"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>Утасны дугаар *:</label>
                <input 
                  type="tel"
                  required
                  placeholder="88963373"
                  className="input-field"
                  value={regData.phone}
                  onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Apartment Block & Door Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>502 Байрны Блок:</label>
                <select 
                  className="input-field"
                  value={regData.block}
                  onChange={(e) => setRegData({ ...regData, block: e.target.value })}
                >
                  <option value="502В байр">502В Блок</option>
                  <option value="502Д байр">502Д Блок</option>
                  <option value="502А байр">502А Блок</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>Хаалганы тоот:</label>
                <input 
                  type="number"
                  min="1"
                  max="70"
                  required
                  placeholder="Тоот"
                  className="input-field"
                  value={regData.door}
                  onChange={(e) => setRegData({ ...regData, door: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>Нууц үг *:</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-field"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>Нууц үг давтах *:</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-field"
                  value={regData.confirmPassword}
                  onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '11px', fontSize: '14px', justifyContent: 'center' }}>
              <CheckCircle2 size={16} /> Бүртгэл Үүсгэх
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: STAFF LOGIN (НЯГТЛАН БОДОГЧ & СИСТЕМИЙН АДМИН ТУСДАА) */}
        {/* ========================================================================= */}
        {mode === 'STAFF' && (
          <form onSubmit={handleStaffLoginSubmit}>
            {staffError && (
              <div style={{ padding: '10px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '6px', color: '#e11d48', fontSize: '12px', marginBottom: '14px' }}>
                {staffError}
              </div>
            )}

            {/* Staff Role Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <div 
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: staffRole === 'ACCOUNTANT' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: staffRole === 'ACCOUNTANT' ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onClick={() => { setStaffRole('ACCOUNTANT'); setStaffUsername('accountant'); }}
              >
                <Briefcase size={22} color={staffRole === 'ACCOUNTANT' ? '#2563eb' : '#64748b'} style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '13px', fontWeight: 700, color: staffRole === 'ACCOUNTANT' ? '#1e3a8a' : '#334155' }}>
                  Нягтлан Бодогч
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Санхүү, төлөлт, СӨХ</div>
              </div>

              <div 
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: staffRole === 'ADMIN' ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                  background: staffRole === 'ADMIN' ? '#f5f3ff' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onClick={() => { setStaffRole('ADMIN'); setStaffUsername('admin'); }}
              >
                <ShieldCheck size={22} color={staffRole === 'ADMIN' ? '#7c3aed' : '#64748b'} style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '13px', fontWeight: 700, color: staffRole === 'ADMIN' ? '#5b21b6' : '#334155' }}>
                  Системийн Админ
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Хандалт, тохиргоо</div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px', display: 'block' }}>
                Ажилтны нэвтрэх нэр / Код:
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input 
                  type="text"
                  required
                  className="input-field"
                  style={{ paddingLeft: '36px' }}
                  value={staffUsername}
                  onChange={(e) => setStaffUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px', display: 'block' }}>
                Ажилтны нууц үг:
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input 
                  type="password"
                  required
                  className="input-field"
                  style={{ paddingLeft: '36px' }}
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                padding: '11px', 
                fontSize: '14px', 
                justifyContent: 'center',
                background: staffRole === 'ACCOUNTANT' ? '#2563eb' : '#7c3aed',
                borderColor: staffRole === 'ACCOUNTANT' ? '#2563eb' : '#7c3aed'
              }}
            >
              {staffRole === 'ACCOUNTANT' ? 'Нягтлангийн Портал руу Нэвтрэх' : 'Админ Удирдлага руу Нэвтрэх'} <ArrowRight size={16} />
            </button>

            {/* Quick Demo Staff Logins */}
            <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>
                Шуурхай ажилтнаар нэвтрэх (502-р байрны алба):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '6px 8px', fontSize: '11px', textAlign: 'left' }}
                  onClick={() => {
                    onLoginSuccess({ type: 'STAFF', user: SYSTEM_USERS[1], role: 'ACCOUNTANT' });
                    onClose();
                  }}
                >
                  <strong>💼 Соёл-Ундараа</strong>
                  <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Ахлах Нягтлан</span>
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '6px 8px', fontSize: '11px', textAlign: 'left' }}
                  onClick={() => {
                    onLoginSuccess({ type: 'STAFF', user: SYSTEM_USERS[2], role: 'ADMIN' });
                    onClose();
                  }}
                >
                  <strong>🛡️ Билгүүн</strong>
                  <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Системийн Админ</span>
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '6px 8px', fontSize: '11px', textAlign: 'left' }}
                  onClick={() => {
                    onLoginSuccess({ type: 'STAFF', user: SYSTEM_USERS[0], role: 'ADMIN' });
                    onClose();
                  }}
                >
                  <strong>👑 Энхцэцэг</strong>
                  <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Гүйцэтгэх Захирал</span>
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '6px 8px', fontSize: '11px', textAlign: 'left' }}
                  onClick={() => {
                    onLoginSuccess({ type: 'STAFF', user: SYSTEM_USERS[3], role: 'ACCOUNTANT' });
                    onClose();
                  }}
                >
                  <strong>🧾 Орхонсэлэнгэ</strong>
                  <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Кассын Нярав</span>
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '6px 8px', fontSize: '11px', textAlign: 'left', gridColumn: 'span 2' }}
                  onClick={() => {
                    onLoginSuccess({ type: 'STAFF', user: SYSTEM_USERS[4], role: 'ADMIN' });
                    onClose();
                  }}
                >
                  <strong>📦 Нямсүрэн</strong>
                  <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Худалдан Авах Мэргэжилтэн</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
