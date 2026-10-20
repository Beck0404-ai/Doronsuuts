import { useState } from 'react';
import { 
  User, ShieldCheck, LogIn, KeyRound, CheckCircle2, 
  Lock, Mail, Phone, Briefcase
} from 'lucide-react';
import { SYSTEM_USERS } from '../data/mockData';

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
  const [staffRole, setStaffRole] = useState('ACCOUNTANT'); // 'ACCOUNTANT' | 'ADMIN'
  const [staffUsername, setStaffUsername] = useState('accountant');
  const [staffPassword, setStaffPassword] = useState('••••••••');
  const [staffError, setStaffError] = useState('');

  // Handle Resident Login
  const handleResidentLogin = (e) => {
    e.preventDefault();
    setResidentError('');

    const clean = residentInput.trim().toLowerCase();
    if (!clean) {
      setResidentError('И-мэйл эсвэл утасны дугаараа оруулна уу');
      return;
    }

    // Match resident by email, phone, name, or door number
    const found = residents.find(r => {
      const matchEmail = r.email && r.email.toLowerCase() === clean;
      const matchPhone = r.phone && r.phone.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, ''));
      const matchName = (r.firstName && r.firstName.toLowerCase() === clean) || (r.name && r.name.toLowerCase() === clean);
      const matchDoor = r.door && String(r.door) === clean;
      return matchEmail || matchPhone || matchName || matchDoor;
    });

    if (found) {
      onLoginSuccess({ type: 'RESIDENT', resident: found });
    } else {
      // Fallback guest session for instant demonstration
      const guestResident = {
        id: `RES-502-USR-${Date.now().toString().slice(-4)}`,
        contractNo: `DGA-502-${Math.floor(Math.random() * 900 + 100)}`,
        contractDate: '2024-01-01',
        name: clean.includes('@') ? clean.split('@')[0] : `Оршин Суугч (${clean})`,
        fullName: clean.includes('@') ? clean.split('@')[0] : `Оршин Суугч (${clean})`,
        phone: clean.includes('@') ? '8811-2233' : clean,
        email: clean.includes('@') ? clean : `${clean}@gmail.com`,
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
    }
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

    if (staffRole === 'ACCOUNTANT') {
      const acc = SYSTEM_USERS.find(u => u.role === 'ACCOUNTANT') || SYSTEM_USERS[1];
      onLoginSuccess({ type: 'STAFF', user: acc, role: 'ACCOUNTANT' });
    } else {
      const adm = SYSTEM_USERS.find(u => u.role === 'ADMIN') || SYSTEM_USERS[0];
      onLoginSuccess({ type: 'STAFF', user: adm, role: 'ADMIN' });
    }
  };

  // Sample residents for 1-click test
  const demoResidents = [
    residents[0] || { name: 'Б. Содномпунцаг (502В-1)', id: 'RES-01' },
    residents[1] || { name: 'Д. Энхтогтох (502Д-2)', id: 'RES-02' },
    residents[2] || { name: 'Т. Мөнхзул (502А-1)', id: 'RES-03' }
  ];

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
                <label>И-мэйл эсвэл Утасны дугаар:</label>
                <div className="input-with-icon">
                  <Mail size={16} className="field-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Жишээ: 99112233 эсвэл email@gmail.com"
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
                    placeholder="••••••••"
                    value={residentPassword}
                    onChange={(e) => setResidentPassword(e.target.value)}
                    className="input-field-custom"
                  />
                </div>
              </div>

              <button type="submit" className="front-submit-btn btn-resident">
                <LogIn size={18} /> Оршин Суугчаар Нэвтрэх
              </button>

              {/* Quick Demo Residents */}
              <div className="demo-chips-box">
                <span className="demo-label">Шуурхай туршилтаар нэвтрэх өрхүүд:</span>
                <div className="demo-chips-grid">
                  {demoResidents.map((res, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="demo-chip-btn"
                      onClick={() => onLoginSuccess({ type: 'RESIDENT', resident: res })}
                    >
                      <span>🏢 {res.name || res.fullName}</span>
                      <small>{res.apartment ? res.apartment.split(' ')[0] : '502 байр'}</small>
                    </button>
                  ))}
                </div>
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
              <h2 className="front-card-title">🛡️ Админ & Ажилтан Нэвтрэх</h2>
              <p className="front-card-subtitle">Санхүү, удирдлага, СӨХ-ийн дотоод систем</p>
            </div>
          </div>

          {/* Role selector: Нягтлан vs Админ */}
          <div className="front-role-switch">
            <button
              type="button"
              className={`role-tab-btn ${staffRole === 'ACCOUNTANT' ? 'active-acc' : ''}`}
              onClick={() => { setStaffRole('ACCOUNTANT'); setStaffUsername('accountant'); }}
            >
              <Briefcase size={16} /> Нягтлан Бодогч
            </button>
            <button
              type="button"
              className={`role-tab-btn ${staffRole === 'ADMIN' ? 'active-adm' : ''}`}
              onClick={() => { setStaffRole('ADMIN'); setStaffUsername('admin'); }}
            >
              <ShieldCheck size={16} /> Системийн Админ
            </button>
          </div>

          <form onSubmit={handleStaffLogin} className="front-form">
            {staffError && (
              <div className="front-error-banner">{staffError}</div>
            )}

            <div className="form-group">
              <label>Ажилтны нэвтрэх нэр / И-мэйл:</label>
              <div className="input-with-icon">
                <Mail size={16} className="field-icon" />
                <input
                  type="text"
                  required
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
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  className="input-field-custom"
                />
              </div>
            </div>

            <button type="submit" className="front-submit-btn btn-staff">
              <KeyRound size={18} />
              {staffRole === 'ACCOUNTANT' ? 'Нягтлангийн Самбарт Нэвтрэх' : 'Админ Системд Нэвтрэх'}
            </button>

            {/* 5 Official Staff 1-Click Fast Access Chips */}
            <div className="demo-chips-box staff-chips-box">
              <span className="demo-label">Байгууллагын бодит 5 ажилтны шуурхай хандалт:</span>
              <div className="staff-chips-grid">
                {/* 1. Соёл-Ундараа */}
                <button
                  type="button"
                  className="staff-chip-btn chip-acc"
                  onClick={() => onLoginSuccess({ type: 'STAFF', user: SYSTEM_USERS[1], role: 'ACCOUNTANT' })}
                >
                  <div className="chip-avatar acc">💼</div>
                  <div>
                    <strong>Соёл-Ундараа</strong>
                    <small>Ахлах Нягтлан Бодогч</small>
                  </div>
                </button>

                {/* 2. Билгүүн */}
                <button
                  type="button"
                  className="staff-chip-btn chip-adm"
                  onClick={() => onLoginSuccess({ type: 'STAFF', user: SYSTEM_USERS[2], role: 'ADMIN' })}
                >
                  <div className="chip-avatar adm">🛡️</div>
                  <div>
                    <strong>Билгүүн</strong>
                    <small>Системийн Админ</small>
                  </div>
                </button>

                {/* 3. Энхцэцэг */}
                <button
                  type="button"
                  className="staff-chip-btn chip-adm"
                  onClick={() => onLoginSuccess({ type: 'STAFF', user: SYSTEM_USERS[0], role: 'ADMIN' })}
                >
                  <div className="chip-avatar ceo">👑</div>
                  <div>
                    <strong>Энхцэцэг</strong>
                    <small>Гүйцэтгэх Захирал</small>
                  </div>
                </button>

                {/* 4. Орхонсэлэнгэ */}
                <button
                  type="button"
                  className="staff-chip-btn chip-acc"
                  onClick={() => onLoginSuccess({ type: 'STAFF', user: SYSTEM_USERS[3], role: 'ACCOUNTANT' })}
                >
                  <div className="chip-avatar csh">🧾</div>
                  <div>
                    <strong>Орхонсэлэнгэ</strong>
                    <small>Кассын Нярав</small>
                  </div>
                </button>

                {/* 5. Нямсүрэн */}
                <button
                  type="button"
                  className="staff-chip-btn chip-adm"
                  style={{ gridColumn: 'span 2' }}
                  onClick={() => onLoginSuccess({ type: 'STAFF', user: SYSTEM_USERS[4], role: 'ADMIN' })}
                >
                  <div className="chip-avatar proc">📦</div>
                  <div>
                    <strong>Нямсүрэн</strong>
                    <small>Худалдан Авах Мэргэжилтэн</small>
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
