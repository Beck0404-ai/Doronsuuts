import { useState } from 'react';
import { User, Briefcase, Calculator, ShieldCheck, LogIn, LogOut, KeyRound } from 'lucide-react';
import { generateResidents } from './data/mockData';
import PublicLanding from './components/PublicLanding';
import ResidentPortal from './components/ResidentPortal';
import AccountantPortal from './components/AccountantPortal';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';

function App() {
  const [residents, setResidents] = useState(() => generateResidents());
  
  // Active Navigation Portal
  const [activePortal, setActivePortal] = useState('LANDING'); // 'LANDING' | 'RESIDENT' | 'ACCOUNTANT' | 'ADMIN'
  
  // Auth state: Separate Resident session vs Staff session (Accountant / Admin)
  const [loggedInResident, setLoggedInResident] = useState(residents[0] || null); // Default resident session
  const [loggedInStaff, setLoggedInStaff] = useState(null); // Staff user: { name, role: 'ACCOUNTANT' | 'ADMIN', roleTitle }

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('LOGIN'); // 'LOGIN' | 'REGISTER' | 'STAFF'

  // Update a single resident's payment status and propagate to list
  const handleUpdateResident = (updatedRes) => {
    setResidents((prev) => 
      prev.map((r) => (r.id === updatedRes.id ? updatedRes : r))
    );
    if (loggedInResident && loggedInResident.id === updatedRes.id) {
      setLoggedInResident(updatedRes);
    }
  };

  // Handle successful login (Resident vs Staff)
  const handleAuthSuccess = (authPayload) => {
    if (authPayload.type === 'RESIDENT') {
      const res = authPayload.resident;
      setLoggedInResident(res);
      setLoggedInStaff(null); // Clear staff session if logging in as resident
      if (!residents.some(r => r.id === res.id)) {
        setResidents(prev => [res, ...prev]);
      }
      setActivePortal('RESIDENT');
    } else if (authPayload.type === 'STAFF') {
      const staffUser = authPayload.user;
      setLoggedInStaff(staffUser);
      if (authPayload.role === 'ACCOUNTANT') {
        setActivePortal('ACCOUNTANT');
      } else if (authPayload.role === 'ADMIN') {
        setActivePortal('ADMIN');
      }
    }
  };

  const handleLogout = () => {
    setLoggedInResident(null);
    setLoggedInStaff(null);
    setActivePortal('LANDING');
  };

  return (
    <div className="app-container">
      {/* Global Navigation Header */}
      <header className="app-header glass-panel no-print">
        <div className="logo-section" onClick={() => setActivePortal('LANDING')} style={{ cursor: 'pointer' }}>
          <div className="logo-img-wrap">
            <img src="/logo.png" alt="Дорноговь Апартмент Лого" className="brand-logo-img" />
          </div>
          <div className="logo-text">
            <h1>ДОРНОГОВЬ АПАРТМЕНТ</h1>
            <p>25% Урьдчилгаа • 5 Жил 0% Хүүтэй Түрээслээд Өмчлөх Систем</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="controls-section" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="role-toggle">
            {/* 1. Public Program Landing */}
            <button 
              className={`role-btn ${activePortal === 'LANDING' ? 'active' : ''}`}
              onClick={() => setActivePortal('LANDING')}
            >
              <Calculator size={15} /> Хөтөлбөр & Тооцоолуур
            </button>

            {/* 2. Resident Portal Button */}
            <button 
              className={`role-btn ${activePortal === 'RESIDENT' ? 'active' : ''}`}
              onClick={() => {
                if (loggedInResident) {
                  setActivePortal('RESIDENT');
                } else {
                  setAuthModalMode('LOGIN');
                  setShowAuthModal(true);
                }
              }}
            >
              <User size={15} /> Оршин Суугч
            </button>

            {/* 3. Protected Accountant Portal (Only visible if logged in as Accountant or Admin) */}
            {loggedInStaff && (loggedInStaff.role === 'ACCOUNTANT' || loggedInStaff.role === 'ADMIN') && (
              <button 
                className={`role-btn ${activePortal === 'ACCOUNTANT' ? 'active' : ''}`}
                style={{ background: activePortal === 'ACCOUNTANT' ? '#2563eb' : 'rgba(37,99,235,0.08)', color: activePortal === 'ACCOUNTANT' ? '#fff' : '#1e40af' }}
                onClick={() => setActivePortal('ACCOUNTANT')}
              >
                <Briefcase size={15} /> Нягтлан Бодогч
              </button>
            )}

            {/* 4. Protected Admin Portal (Only visible if logged in as Admin) */}
            {loggedInStaff && loggedInStaff.role === 'ADMIN' && (
              <button 
                className={`role-btn ${activePortal === 'ADMIN' ? 'active' : ''}`}
                style={{ background: activePortal === 'ADMIN' ? '#7c3aed' : 'rgba(124,58,237,0.08)', color: activePortal === 'ADMIN' ? '#fff' : '#6d28d9' }}
                onClick={() => setActivePortal('ADMIN')}
              >
                <ShieldCheck size={15} /> Системийн Админ
              </button>
            )}
          </div>

          {/* User Session Badges or Login Actions */}
          <div className="auth-profile-badge">
            {/* Case A: Staff Logged In (Accountant or Admin) */}
            {loggedInStaff ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: loggedInStaff.role === 'ACCOUNTANT' ? '#eff6ff' : '#f5f3ff', borderRadius: '8px', border: loggedInStaff.role === 'ACCOUNTANT' ? '1px solid #bfdbfe' : '1px solid #ddd6fe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: loggedInStaff.role === 'ACCOUNTANT' ? '#2563eb' : '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                    {loggedInStaff.role === 'ACCOUNTANT' ? 'Н' : 'А'}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: loggedInStaff.role === 'ACCOUNTANT' ? '#1e3a8a' : '#5b21b6', lineHeight: 1.2 }}>
                      {loggedInStaff.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                      {loggedInStaff.roleTitle || (loggedInStaff.role === 'ACCOUNTANT' ? 'Ахлах Нягтлан' : 'Админ')}
                    </div>
                  </div>
                </div>
                <button 
                  className="btn-icon-sm"
                  title="Гарах (Logout)"
                  onClick={handleLogout}
                  style={{ marginLeft: '4px', background: 'transparent', border: 'none', color: '#64748b' }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : loggedInResident ? (
              /* Case B: Resident Logged In */
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                    {loggedInResident.firstName ? loggedInResident.firstName.charAt(0) : 'U'}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e3a8a', lineHeight: 1.2 }}>
                      {loggedInResident.name || loggedInResident.fullName}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                      {loggedInResident.apartment ? loggedInResident.apartment.split(' ')[0] : '502 байр'}
                    </div>
                  </div>
                </div>
                <button 
                  className="btn-icon-sm"
                  title="Гарах (Logout)"
                  onClick={handleLogout}
                  style={{ marginLeft: '4px', background: 'transparent', border: 'none', color: '#64748b' }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              /* Case C: Not logged in (Public user) */
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => { setAuthModalMode('LOGIN'); setShowAuthModal(true); }}
                >
                  <LogIn size={14} /> Оршин Суугч Нэвтрэх
                </button>
                <button 
                  className="btn-primary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => { setAuthModalMode('REGISTER'); setShowAuthModal(true); }}
                >
                  Бүртгүүлэх
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content-wrapper">
        {activePortal === 'LANDING' && (
          <PublicLanding 
            onNavigateResident={() => {
              if (loggedInResident) {
                setActivePortal('RESIDENT');
              } else {
                setAuthModalMode('LOGIN');
                setShowAuthModal(true);
              }
            }}
          />
        )}

        {activePortal === 'RESIDENT' && (
          <ResidentPortal 
            residents={residents} 
            activeResidentProp={loggedInResident}
            onUpdateResident={handleUpdateResident} 
            onOpenAuth={() => { setAuthModalMode('LOGIN'); setShowAuthModal(true); }}
          />
        )}

        {activePortal === 'ACCOUNTANT' && (
          <AccountantPortal 
            residents={residents} 
            onUpdateResident={handleUpdateResident}
          />
        )}

        {activePortal === 'ADMIN' && (
          <AdminPortal 
            residents={residents} 
          />
        )}
      </main>

      {/* Auth Modal for Resident (Login/Register) and Staff (Accountant/Admin) */}
      <AuthModal 
        isOpen={showAuthModal}
        initialMode={authModalMode}
        residents={residents}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleAuthSuccess}
      />

      {/* Global Footer with Protected Staff Login Link */}
      <footer className="app-footer no-print">
        <div className="footer-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="Дорноговь Апартмент" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <div>
              <strong>Дорноговь Апартмент — Түрээслээд Өмчлөх Орон Сууц & СӨХ</strong>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                Оршин суугчдын өөрсдөө бүртгүүлэх, төлбөрөө хянах нэгдсэн систем
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              © {new Date().getFullYear()} Бүх эрх хуулиар хамгаалагдсан.
            </div>

            {/* Protected Staff Entry Door */}
            <button 
              className="btn-secondary"
              style={{ fontSize: '11px', padding: '5px 10px', color: '#64748b', background: '#f8fafc', borderColor: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '5px' }}
              onClick={() => { setAuthModalMode('STAFF'); setShowAuthModal(true); }}
            >
              <KeyRound size={12} /> Ажилтны нэвтрэх (Нягтлан / Админ)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
