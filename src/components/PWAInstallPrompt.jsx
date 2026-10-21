import { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share2, PlusSquare } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode (already installed as PWA)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;

    if (isStandalone) {
      return; // Already running as installed app!
    }

    // Check if dismissed recently (within 3 days)
    const dismissedTime = localStorage.getItem('dga_pwa_dismissed');
    if (dismissedTime && Date.now() - Number(dismissedTime) < 3 * 24 * 60 * 60 * 1000) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);

    if (isAppleDevice) {
      setIsIOS(true);
      // Show prompt after a slight delay on iOS Safari
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Standard Android / Chrome / Edge install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    localStorage.setItem('dga_pwa_dismissed', String(Date.now()));
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Floating PWA Install Banner */}
      <div 
        className="pwa-install-banner no-print"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '460px',
          backgroundColor: '#1e293b',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '14px 16px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          animation: 'pwaSlideUp 0.3s ease-out',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="./logo.png" 
            alt="Дорноговь Апартмент" 
            style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '10px', 
              objectFit: 'cover',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }} 
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: '13px', color: '#f8fafc', lineHeight: 1.2 }}>
              Дорноговь Апартмент Апп
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              Утсан дээрээ суулгаж, түргэн нэвтрэх
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleInstallClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(37,99,235,0.4)'
            }}
          >
            <Download size={14} /> Суулгах
          </button>
          
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Хаах"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setShowIOSGuide(false)}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              borderRadius: '20px',
              padding: '24px 20px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '50px', height: '50px', margin: '0 auto 12px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src="./logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px', color: '#1e3a8a' }}>
              iPhone дээр апп суулгах
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px', lineHeight: 1.4 }}>
              Safari хөтчөөс 2 товшилтоор дэлгэцэндээ апп болгон суулгана:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>
                  1
                </div>
                <div style={{ fontSize: '12px', color: '#334155' }}>
                  Хөтчийн доор байх <Share2 size={14} style={{ display: 'inline', verticalAlign: 'middle', color: '#2563eb' }} /> <strong>Хуваалцах (Share)</strong> товчийг дарна
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>
                  2
                </div>
                <div style={{ fontSize: '12px', color: '#334155' }}>
                  Цэснээс <PlusSquare size={14} style={{ display: 'inline', verticalAlign: 'middle', color: '#2563eb' }} /> <strong>"Дэлгэцэнд нэмэх" (Add to Home Screen)</strong>-ийг сонгоно
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: '#1e3a8a',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Ойлголоо
            </button>
          </div>
        </div>
      )}
    </>
  );
}
