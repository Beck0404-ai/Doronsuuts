import { useState } from 'react';
import { 
  User, ShieldCheck, LogIn, KeyRound, CheckCircle2, 
  Lock, Mail, Phone, Home
} from 'lucide-react';
import { SYSTEM_USERS, getResidentCode } from '../data/mockData';

function normalizeCode(str) {
  if (!str) return '';
  return str.toString().toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[,\-_.]/g, '')
    .replace(/БАЙР/g, '')
    .replace(/ТООТ/g, '')
    .replace(/B/g, 'В')
    .replace(/V/g, 'В')
    .replace(/D/g, 'Д')
    .replace(/A/g, 'А');
}

export default function FrontLoginPage({ residents = [], onLoginSuccess }) {
  // Resident Login / Register Mode
  const [residentMode, setResidentMode] = useState('LOGIN'); // 'LOGIN' | 'REGISTER'

  // Resident Login Form
  const [residentInput, setResidentInput] = useState('');
  const [residentPassword, setResidentPassword] = useState('');
  const [residentError, setResidentError] = useState('');

  // Resident Register Form
  const [regData, setRegData] = useState({
    lastName: '',
    firstName: '',
    phone: '',
    email: '',
    block: '502В байр',
    door: '',
    password: ''
  });
  const [regSuccess, setRegSuccess] = useState(false);

  // Staff Login Form
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffError, setStaffError] = useState('');

  // Handle Resident Login by Apartment Code (e.g. 502В-1, 502Д-2) & Password (default 1234)
  const handleResidentLogin = (e) => {
    e.preventDefault();
    setResidentError('');

    const rawInput = residentInput.trim();
    if (!rawInput) {
      setResidentError('Байр, тоотоо (Жишээ нь: 502В-1) эсвэл утасны дугаараа оруулна уу');
      return;
    }

    const pass = residentPassword.trim();
    if (!pass) {
      setResidentError('Нууц үгээ оруулна уу (Анхдагч нууц үг: 1234)');
      return;
    }

    const qClean = normalizeCode(rawInput);
    const qPhone = rawInput.replace(/[^0-9]/g, '');
    const qLower = rawInput.toLowerCase();

    // Match resident by Code (502В-1), Door, Phone, Email, ContractNo, or Name
    const found = residents.find(r => {
      const code = r.residentCode || getResidentCode(r);
      const codeClean = normalizeCode(code);
      if (codeClean === qClean) return true;
      if (normalizeCode(`502-${r.door}`) === qClean) return true;
      if (String(r.door || '').trim() === rawInput) return true;
      if (qPhone.length >= 7 && (r.phone || '').replace(/[^0-9]/g, '').includes(qPhone)) return true;
      if (qLower.includes('@') && r.email && r.email.toLowerCase() === qLower) return true;
      if (r.contractNo && normalizeCode(r.contractNo) === qClean) return true;
      return false;
    });

    if (!found) {
      setResidentError(`"${rawInput}" кодтой өрх бүртгэлд олдсонгүй. Байрны код (Жишээ нь: 502В-1, 502Д-2) эсвэл утасны дугаараа шалгана уу.`);
      return;
    }

    // Verify Password: default is 1234, or resident's password, or phone last 4 digits, or door number
    const phoneLast4 = (found.phone || '').replace(/[^0-9]/g, '').slice(-4);
    const isValidPass = 
      pass === '1234' || 
      (found.password && pass === found.password) ||
      (phoneLast4 && pass === phoneLast4) ||
      pass === String(found.door);

    if (!isValidPass) {
      setResidentError('Нууц үг буруу байна. (Анхдагч нууц үг: 1234)');
      return;
    }

    onLoginSuccess({ type: 'RESIDENT', resident: found });
  };

  // Handle Resident Registration
  const handleRegister = (e) => {
    e.preventDefault();
    if (!regData.phone || !regData.door) return;

    const newResident = {
      id: `RES-502-NEW-${Date.now().toString().slice(-4)}`,
      contractNo: `DGA-502-NEW-${Math.floor(Math.random() * 900 + 100)}`,
      contractDate: '2026-08-01',
      name: `${regData.lastName} ${regData.firstName}`.trim() || `Иргэн (${regData.phone})`,
      fullName: `${regData.lastName} ${regData.firstName}`.trim() || `Иргэн (${regData.phone})`,
      phone: regData.phone,
      email: regData.email || `${regData.phone}@gmail.com`,
      apartment: `${regData.block}, ${regData.door} тоот`,
      block: regData.block,
      door: regData.door,
      areaSqm: 48.74,
      rooms: 2,
      totalPrice: 112102000,
      downPayment: 28025500,
      remainingPrincipal: 84076500,
      monthlyRent: 1401275,
      monthlySOH: 48740,
      paidMonths: 1,
      totalMonths: 60,
      currentOwnershipPercent: 26,
      totalPrincipalPaid: 29426775,
      remainingBalance: 82675225,
      remainingMonths: 59,
      rentPaidThisMonth: 1401275,
      rentUnpaid: 0,
      sohPaidThisMonth: 48740,
      sohUnpaid: 0,
      overdueDays: 0,
      rentPenalty: 0,
      sohPenalty: 0,
      status: 'Бүрэн төлсөн',
      totalDueThisMonth: 0
    };

    setRegSuccess(true);
    setTimeout(() => {
      onLoginSuccess({ type: 'RESIDENT', resident: newResident });
    }, 1000);
  };

  // Handle Staff Login
  const handleStaffLogin = (e) => {
    e.preventDefault();
    setStaffError('');

    const inputUser = staffUsername.trim().toLowerCase();
    const inputPass = staffPassword.trim();

    if (!inputUser || !inputPass) {
      setStaffError('Нэвтрэх нэр болон нууц үгээ оруулна уу');
      return;
    }

    // Match by username, email, or name
    const matched = SYSTEM_USERS.find(u => 
      (u.username && u.username.toLowerCase() === inputUser) ||
      (u.email && u.email.toLowerCase() === inputUser) ||
      (u.name && u.name.toLowerCase() === inputUser)
    );

    if (!matched) {
      setStaffError('Бүртгэлтэй ажилтан олдсонгүй. Нэвтрэх нэрээ шалгана уу.');
      return;
    }

    if (matched.password && matched.password !== inputPass) {
      setStaffError('Нууц үг буруу байна. Дахин оролдоно уу.');
      return;
    }

    onLoginSuccess({ 
      type: 'STAFF', 
      user: matched, 
      role: matched.role 
    });
  };

  return (
    <div className="front-login-page">
      {/* Brand Header */}
      <div className="front-login-header">
        <h1 className="front-brand-title">
          ДОРНОГОВЬ АПАРТМЕНТ
        </h1>
      </div>

      {/* Dual Login Grid */}
      <div className="front-login-grid">
        {/* ==============================================================
            SECTION 1: ХЭРЭГЛЭГЧ / ОРШИН СУУГЧ НЭВТРЭХ ХЭСЭГ
            ============================================================== */}
        <div className="front-login-card resident-card">
          <div className="front-card-top">
            <div className="front-card-icon icon-blue">
              <User size={24} />
            </div>
            <div>
              <h2 className="front-card-title">👤 Хэрэглэгч Нэвтрэх</h2>
              <p className="front-card-subtitle">502-р байрны оршин суугчийн хувийн танхим</p>
            </div>
          </div>

          {/* Mode Switcher: Login vs Register */}
          <div className="front-mode-switch">
            <button
              type="button"
              className={`mode-btn ${residentMode === 'LOGIN' ? 'active' : ''}`}
              onClick={() => { setResidentMode('LOGIN'); setResidentError(''); }}
            >
              Нэвтрэх
            </button>
            <button
              type="button"
              className={`mode-btn ${residentMode === 'REGISTER' ? 'active' : ''}`}
              onClick={() => { setResidentMode('REGISTER'); setResidentError(''); }}
            >
              Шинээр бүртгүүлэх
            </button>
          </div>

          {residentMode === 'LOGIN' ? (
            <form onSubmit={handleResidentLogin} className="front-form">
              {residentError && (
                <div className="front-error-banner">{residentError}</div>
              )}

              <div className="form-group">
                <label>Байр, тоот (Оршин суугчийн код):</label>
                <div className="input-with-icon">
                  <Home size={16} className="field-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Жишээ: 502В-1, 502Д-2, 502А-32..."
                    value={residentInput}
                    onChange={(e) => setResidentInput(e.target.value)}
                    className="input-field-custom"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Нууц үг:</label>
                <div className="input-with-icon">
                  <Lock size={16} className="field-icon" />
                  <input
                    type="password"
                    required
                    placeholder="Анхдагч нууц үг: 1234"
                    value={residentPassword}
                    onChange={(e) => setResidentPassword(e.target.value)}
                    className="input-field-custom"
                  />
                </div>
              </div>

              <button type="submit" className="front-submit-btn btn-resident">
                <LogIn size={18} /> Оршин Суугчаар Нэвтрэх
              </button>

              <div style={{ marginTop: '14px', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', color: '#475569', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 700, color: '#1e40af', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>🔑 Нэвтрэх заавар:</span>
                </div>
                Өөрийн байр, тоотоо (Жишээ: <strong>502В-1</strong>, <strong>502Д-2</strong>) эсвэл бүртгэлтэй утасны дугаараа бичиж, анхдагч нууц үг <strong>1234</strong>-өөр нэвтэрнэ үү.
              </div>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className="front-form">
              {regSuccess ? (
                <div className="front-success-banner">
                  <CheckCircle2 size={24} className="text-emerald" />
                  <div>
                    <strong>Бүртгэл амжилттай үүслээ!</strong>
                    <p style={{ margin: 0, fontSize: '12px' }}>Оршин суугчийн танхим руу шилжиж байна...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label>Овог:</label>
                      <input
                        type="text"
                        placeholder="Бат"
                        value={regData.lastName}
                        onChange={(e) => setRegData({ ...regData, lastName: e.target.value })}
                        className="input-field-custom"
                      />
                    </div>
                    <div className="form-group">
                      <label>Нэр *:</label>
                      <input
                        type="text"
                        required
                        placeholder="Тэмүүлэн"
                        value={regData.firstName}
                        onChange={(e) => setRegData({ ...regData, firstName: e.target.value })}
                        className="input-field-custom"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label>Утас *:</label>
                      <div className="input-with-icon">
                        <Phone size={14} className="field-icon" />
                        <input
                          type="tel"
                          required
                          placeholder="9911-XXXX"
                          value={regData.phone}
                          onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                          className="input-field-custom"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>И-мэйл:</label>
                      <input
                        type="email"
                        placeholder="name@gmail.com"
                        value={regData.email}
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        className="input-field-custom"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label>Байрны блок *:</label>
                      <select
                        value={regData.block}
                        onChange={(e) => setRegData({ ...regData, block: e.target.value })}
                        className="input-field-custom"
                      >
                        <option value="502В байр">502В байр</option>
                        <option value="502Д байр">502Д байр</option>
                        <option value="502А байр">502А байр</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Тоот *:</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="144"
                        placeholder="12"
                        value={regData.door}
                        onChange={(e) => setRegData({ ...regData, door: e.target.value })}
                        className="input-field-custom"
                      />
                    </div>
                  </div>

                  <button type="submit" className="front-submit-btn btn-resident">
                    <CheckCircle2 size={18} /> Шинэ Өрх Бүртгүүлэх
                  </button>
                </>
              )}
            </form>
          )}
        </div>

        {/* ==============================================================
            SECTION 2: АДМИН & АЖИЛТАН НЭВТРЭХ ХЭСЭГ
            ============================================================== */}
        <div className="front-login-card staff-card">
          <div className="front-card-top">
            <div className="front-card-icon icon-purple">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="front-card-title">🛡️ Ажилтан & Админ Нэвтрэх</h2>
              <p className="front-card-subtitle">Санхүү, удирдлага, дотоод хяналтын систем</p>
            </div>
          </div>

          <form onSubmit={handleStaffLogin} className="front-form" style={{ marginTop: '16px' }}>
            {staffError && (
              <div className="front-error-banner">{staffError}</div>
            )}

            <div className="form-group">
              <label>Ажилтны нэвтрэх нэр эсвэл И-мэйл:</label>
              <div className="input-with-icon">
                <Mail size={16} className="field-icon" />
                <input
                  type="text"
                  required
                  placeholder="Жишээ: soyol, bilguun, enkhtsetseg..."
                  value={staffUsername}
                  onChange={(e) => setStaffUsername(e.target.value)}
                  className="input-field-custom"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Нууц үг:</label>
              <div className="input-with-icon">
                <Lock size={16} className="field-icon" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  className="input-field-custom"
                />
              </div>
            </div>

            <button type="submit" className="front-submit-btn btn-staff">
              <KeyRound size={18} /> Системд Нэвтрэх
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
