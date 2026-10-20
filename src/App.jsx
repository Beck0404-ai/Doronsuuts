import { useState, useEffect } from 'react';
import { User, Briefcase, ShieldCheck, LogOut } from 'lucide-react';
import { generateResidents } from './data/mockData';
import { fetchResidentsFromSupabase, updateResidentInSupabase, mapDbToResident } from './services/residentService';
import { supabase } from './lib/supabaseClient';
import FrontLoginPage from './components/FrontLoginPage';
import ResidentPortal from './components/ResidentPortal';
import AccountantPortal from './components/AccountantPortal';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';

function App() {
  const [residents, setResidents] = useState(() => generateResidents());
  
  // Active Navigation Portal
  const [activePortal, setActivePortal] = useState('LANDING'); // 'LANDING' | 'RESIDENT' | 'ACCOUNTANT' | 'ADMIN'
  
  // Auth state: Separate Resident session vs Staff session (Accountant / Admin)
  const [loggedInResident, setLoggedInResident] = useState(null); // Default to null for clean login front page
  const [loggedInStaff, setLoggedInStaff] = useState(null); // Staff user: { name, role: 'ACCOUNTANT' | 'ADMIN', roleTitle }

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('LOGIN'); // 'LOGIN' | 'REGISTER' | 'STAFF'

  // Fetch residents from Supabase on mount & listen to realtime updates
  useEffect(() => {
    let isMounted = true;
    
    async function loadData() {
      const dbResidents = await fetchResidentsFromSupabase();
      if (isMounted && dbResidents && dbResidents.length > 0) {
        setResidents(dbResidents);
      }
    }

    loadData();

    // Subscribe to Realtime Postgres changes on the residents table
    if (supabase) {
      const channel = supabase
        .channel('realtime-residents')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'residents' },
          (payload) => {
            if (payload.new) {
              const mapped = mapDbToResident(payload.new);
              setResidents((prev) =>
                prev.map((r) => (r.id === mapped.id ? mapped : r))
              );
              setLoggedInResident((prev) => (prev && prev.id === mapped.id ? mapped : prev));
            }
          }
        )
        .subscribe();

      return () => {
        isMounted = false;
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // Update a single resident's payment status and propagate to list & Supabase
  const handleUpdateResident = (updatedRes) => {
    setResidents((prev) => 
      prev.map((r) => (r.id === updatedRes.id ? updatedRes : r))
    );
    if (loggedInResident && loggedInResident.id === updatedRes.id) {
      setLoggedInResident(updatedRes);
    }
    // Async persist to Supabase Database
    updateResidentInSupabase(updatedRes);
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
      setLoggedInResident(null); // Clear any resident session when logging in as staff
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
          </div>
        </div>

        {/* Navigation Section */}
        <div className="controls-section" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Active Portal Toggle (Only shown when a user is logged in) */}
          {(loggedInResident || loggedInStaff) && (
            <div className="role-toggle">
              {/* Resident Portal Tab (Зөвхөн оршин суугч нэвтэрсэн үед л харагдана) */}
              {loggedInResident && !loggedInStaff && (
                <button 
                  className={`role-btn ${activePortal === 'RESIDENT' ? 'active' : ''}`}
                  onClick={() => setActivePortal('RESIDENT')}
                >
                  <User size={15} /> Оршин Суугчийн Портал
                </button>
              )}

              {/* Accountant Portal Tab */}
              {loggedInStaff && (loggedInStaff.role === 'ACCOUNTANT' || loggedInStaff.role === 'ADMIN') && (
                <button 
                  className={`role-btn ${activePortal === 'ACCOUNTANT' ? 'active' : ''}`}
                  style={{ background: activePortal === 'ACCOUNTANT' ? '#2563eb' : 'rgba(37,99,235,0.08)', color: activePortal === 'ACCOUNTANT' ? '#fff' : '#1e40af' }}
                  onClick={() => setActivePortal('ACCOUNTANT')}
                >
                  <Briefcase size={15} /> Нягтлан Бодогч
                </button>
              )}

              {/* Admin Portal Tab */}
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
          )}

          {/* User Session Badges or Front Notice */}
          <div className="auth-profile-badge">
            {/* Case A: Staff Logged In */}
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
                  style={{ marginLeft: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
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
                      {loggedInResident.residentCode || (loggedInResident.apartment ? loggedInResident.apartment.split(' ')[0] : '502 байр')}
                    </div>
                  </div>
                </div>
                <button 
                  className="btn-icon-sm"
                  title="Гарах (Logout)"
                  onClick={handleLogout}
                  style={{ marginLeft: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              /* Case C: Front Page (Not logged in) */
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '6px 14px', borderRadius: '20px', border: '1px solid #bfdbfe' }}>
                  🔐 Нэвтрэх хэсэг
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content-wrapper">
        {activePortal === 'LANDING' && (
          <FrontLoginPage 
            residents={residents} 
            onLoginSuccess={handleAuthSuccess} 
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
              © {new Date().getFullYear()} Дорноговь Апартмент ХХК. Бүх эрх хуулиар хамгаалагдсан.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
