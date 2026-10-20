import { useState } from 'react';
import { 
  Calculator, ShieldCheck, Key, CheckCircle, ArrowRight, 
  Home, UserCheck
} from 'lucide-react';
import { APARTMENT_TYPES, calculateContractDetails } from '../data/mockData';

export default function PublicLanding({ onNavigateResident }) {
  // Calculator State
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(1); // Default to 2-room (52 sqm)
  const [customPrice, setCustomPrice] = useState(130000000);
  const [customArea, setCustomArea] = useState(52);
  const [isCustom, setIsCustom] = useState(false);

  // Application Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    workplace: '',
    income: '',
    selectedApt: '2 өрөө (52 м²)'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Calculate current figures
  const currentPrice = isCustom ? customPrice : APARTMENT_TYPES[selectedTypeIndex].price;
  const currentArea = isCustom ? customArea : APARTMENT_TYPES[selectedTypeIndex].areaSqm;
  const calc = calculateContractDetails(currentPrice, currentArea, 0, 0);

  // Bank comparison comparison calculation (e.g., standard 18% annual mortgage over 5 years)
  const bankMonthlyRate = 0.18 / 12;
  const bankPrincipal = currentPrice * 0.75;
  const bankMonthlyPayment = Math.round(
    (bankPrincipal * bankMonthlyRate * Math.pow(1 + bankMonthlyRate, 60)) / 
    (Math.pow(1 + bankMonthlyRate, 60) - 1)
  );
  const totalBankPaid = bankMonthlyPayment * 60;
  const bankInterestPaid = Math.round(totalBankPaid - bankPrincipal);

  const handleSelectPreset = (index) => {
    setSelectedTypeIndex(index);
    setIsCustom(false);
    setFormData(prev => ({ ...prev, selectedApt: APARTMENT_TYPES[index].description }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Үндсэн төлбөрийн <span className="highlight-gradient">25%-ийг төлөөд</span>, 
          үлдсэнийг <span className="highlight-gradient">5 жилд 0% хүүгүй</span> өмчил
        </h1>

        <div className="hero-cta-group">
          <a href="#calculator" className="btn-primary-large">
            <Calculator size={18} /> Төлбөр Тооцоолох
          </a>
          <button onClick={onNavigateResident} className="btn-secondary-large">
            <Key size={18} /> Оршин Суугчийн Нэвтрэх
          </button>
        </div>
      </section>

      {/* Interactive Calculator Section */}
      <section id="calculator" className="calculator-section">
        <div className="section-header">
          <div className="badge-pill">Интерактив Тооцоолуур</div>
          <h2>Түрээслээд Өмчлөх Сар Бүрийн Төлбөрөө Тооцоолох</h2>
          <p>Байрны төрөл эсвэл талбайгаа сонгон сар бүрийн хүүгүй төлөлт болон СӨХ-ийн хураамжаа тооцоолж үзээрэй.</p>
        </div>

        <div className="calculator-layout">
          {/* Controls Column */}
          <div className="calculator-controls card-box">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Home size={18} className="text-primary" /> 1. Байрны хэмжээ / Төрөл сонгох
            </h3>

            <div className="preset-grid">
              {APARTMENT_TYPES.map((apt, idx) => (
                <button
                  key={idx}
                  className={`preset-btn ${!isCustom && selectedTypeIndex === idx ? 'active' : ''}`}
                  onClick={() => handleSelectPreset(idx)}
                >
                  <div className="preset-rooms">{apt.rooms} өрөө</div>
                  <div className="preset-area">{apt.areaSqm} м²</div>
                  <div className="preset-price">{(apt.price / 1000000).toFixed(0)} сая ₮</div>
                </button>
              ))}
            </div>

            <div className="custom-toggle-wrap" style={{ marginTop: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                <input 
                  type="checkbox" 
                  checked={isCustom} 
                  onChange={(e) => setIsCustom(e.target.checked)} 
                  style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                />
                Өөрийн үнэ, талбайг гараар оруулах
              </label>
            </div>

            {isCustom && (
              <div className="custom-inputs-box" style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Байрны нийт үнэ (₮):</label>
                  <input 
                    type="number" 
                    value={customPrice} 
                    onChange={(e) => setCustomPrice(Number(e.target.value) || 0)}
                    className="input-field"
                    step="5000000"
                  />
                </div>
                <div className="form-group">
                  <label>Талбай (м²):</label>
                  <input 
                    type="number" 
                    value={customArea} 
                    onChange={(e) => setCustomArea(Number(e.target.value) || 0)}
                    className="input-field"
                  />
                </div>
              </div>
            )}

            <div className="program-summary-note">
              <ShieldCheck size={18} className="text-emerald" />
              <span>
                Гэрээ байгуулахад <strong>25% урьдчилгаа</strong> төлөгдөж, таны өмчлөл эхний сараас <strong>25%</strong>-аар шууд эхэлнэ.
              </span>
            </div>
          </div>

          {/* Results Column */}
          <div className="calculator-results card-box-accent">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#1e293b' }}>
              Төлбөрийн Нэгдсэн Задаргаа
            </h3>

            {/* Big Headline Stat */}
            <div className="result-headline-card">
              <span className="sub-label">Сар бүрийн нийт төлбөр (Түрээс + СӨХ)</span>
              <div className="big-amount">
                {(calc.monthlyRent + calc.monthlySOH).toLocaleString()} <span className="currency">₮/сар</span>
              </div>
              <div className="badge-zero-interest">5 ЖИЛ ХҮҮГҮЙ (0% INTEREST)</div>
            </div>

            {/* Breakdown List */}
            <div className="result-breakdown-list">
              <div className="breakdown-row">
                <span className="label">Орон сууцны нийт үнэ:</span>
                <span className="value font-bold">{calc.totalPrice.toLocaleString()} ₮</span>
              </div>

              <div className="breakdown-row highlight-blue">
                <span className="label">
                  <strong>25% Урьдчилгаа төлбөр</strong> (Гэрээ эхлэхэд):
                </span>
                <span className="value font-bold text-primary">
                  {calc.downPayment.toLocaleString()} ₮
                </span>
              </div>

              <div className="breakdown-row">
                <span className="label">75% Үлдэгдэл дүн (5 жилд хуваах):</span>
                <span className="value">{calc.remainingPrincipal.toLocaleString()} ₮</span>
              </div>

              <div className="breakdown-row">
                <span className="label">Хугацаа:</span>
                <span className="value font-semibold">5 жил (60 сар)</span>
              </div>

              <div className="breakdown-row highlight-green">
                <span className="label">
                  <strong>Сар бүрийн үндсэн түрээс/өмчлөл</strong>:
                </span>
                <span className="value font-bold text-emerald">
                  {calc.monthlyRent.toLocaleString()} ₮/сар
                </span>
              </div>

              <div className="breakdown-row">
                <span className="label">СӨХ-ийн хураамж ({currentArea} м² × 1,000₮):</span>
                <span className="value">{calc.monthlySOH.toLocaleString()} ₮/сар</span>
              </div>
            </div>

            {/* Comparison with Commercial Bank Loan */}
            <div className="bank-comparison-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#047857' }}>
                  Хэмнэлт: Банкны зээлтэй харьцуулахад
                </span>
                <span style={{ fontSize: '11px', color: '#065f46', backgroundColor: '#d1fae5', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                  0% ХҮҮ
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#065f46', lineHeight: 1.4 }}>
                Хэрэв банкны жилийн 18%-ийн хүүтэй 5 жилийн зээлээр авбал нийт <strong>{bankInterestPaid.toLocaleString()} ₮</strong>-ийн хүү төлөх байсан. 
                Манай хөтөлбөрөөр энэхүү <strong>хүүгийн зардлыг 100% хэмнэнэ</strong>.
              </p>
            </div>

            <a href="#apply" className="btn-primary" style={{ width: '100%', marginTop: '16px', textAlign: 'center', justifyContent: 'center' }}>
              Хөтөлбөрт Хамрагдах Хүсэлт Илгээх <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* How it works 4 steps */}
      <section className="how-it-works-section">
        <div className="section-header">
          <div className="badge-pill">Алхам алхмаар</div>
          <h2>Хөтөлбөрт хамрагдах үйл явц</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h4>Байраа Сонгох</h4>
            <p>Өөрийн хэрэгцээ шаардлагад нийцсэн 1-4 өрөө байрнаас сонгож, тооцоолуураар төлбөрөө шалгана.</p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h4>25% Урьдчилгаа</h4>
            <p>Үндсэн төлбөрийн 25%-ийг өгч гэрээ байгуулснаар байрандаа шууд нүүж орно. Өмчлөл 25%-аар эхэлнэ.</p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h4>5 Жил Сарын Төлөлт</h4>
            <p>Үлдсэн 75%-ийг 60 сарын турш сар бүр тэнцүү хүүгүй төлнө. Профайл дээрээсээ явцаа хянана.</p>
          </div>

          <div className="step-card">
            <div className="step-number">04</div>
            <h4>100% Өмчлөлийн Гэрчилгээ</h4>
            <p>60 дахь сарын төлөлт дуусмагц Үл хөдлөх хөрөнгийн гэрчилгээ таны нэр дээр 100% шилжинэ.</p>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" className="application-section">
        <div className="application-card card-box">
          <div className="app-form-header">
            <UserCheck size={28} className="text-primary" />
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
                Түрээслээд Өмчлөх Хөтөлбөрт Бүртгүүлэх
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                Та хүсэлтээ илгээснээр манай зөвлөх 24 цагийн дотор холбогдож гэрээний нөхцөлийг танилцуулна.
              </p>
            </div>
          </div>

          {formSubmitted ? (
            <div className="success-banner" style={{ padding: '24px', textAlign: 'center' }}>
              <CheckCircle size={48} style={{ color: '#10b981', margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '18px', margin: '0 0 6px', color: '#065f46' }}>
                Таны хүсэлтийг амжилттай хүлээн авлаа!
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#047857' }}>
                Манай борлуулалтын зөвлөх <strong>{formData.phone || 'таны дугаар'}</strong> луу удахгүй холбогдоно.
              </p>
              <button 
                className="btn-secondary" 
                onClick={() => setFormSubmitted(false)}
                style={{ marginTop: '16px', marginInline: 'auto' }}
              >
                Дахин хүсэлт илгээх
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="application-form-grid">
              <div className="form-group">
                <label>Овог, Нэр *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Батбаяр Тэмүүлэн"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Утасны дугаар *</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="9911-XXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>И-мэйл хаяг</label>
                <input 
                  type="email" 
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Сонгосон байр</label>
                <select 
                  value={formData.selectedApt}
                  onChange={(e) => setFormData({ ...formData, selectedApt: e.target.value })}
                  className="input-field"
                >
                  {APARTMENT_TYPES.map((apt, idx) => (
                    <option key={idx} value={apt.description}>
                      {apt.description} — {(apt.price / 1000000).toFixed(0)} сая ₮
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Сарын өрхийн дундаж орлого</label>
                <select 
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  className="input-field"
                >
                  <option value="">Сонгоно уу...</option>
                  <option value="2-3 сая">2,000,000₮ - 3,500,000₮</option>
                  <option value="3.5-5 сая">3,500,000₮ - 5,000,000₮</option>
                  <option value="5 саяас дээш">5,000,000₮-өөс дээш</option>
                </select>
              </div>

              <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
                  Бүртгүүлэх & Зөвлөхтэй холбогдох
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
