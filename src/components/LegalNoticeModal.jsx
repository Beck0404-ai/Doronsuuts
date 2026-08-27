import React from 'react';
import { Printer, X, ShieldAlert } from 'lucide-react';
import { BANK_ACCOUNTS } from '../data/mockData';

export default function LegalNoticeModal({ resident, onClose }) {
  if (!resident) return null;

  const totalPenalty = (resident.rentPenalty || 0) + (resident.sohPenalty || 0);
  const totalPrincipalDue = (resident.rentUnpaid || 0) + (resident.sohUnpaid || 0);
  const grandTotalDue = totalPrincipalDue + totalPenalty;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content invoice-modal-container" style={{ maxWidth: '850px' }}>
        {/* Modal Header Actions */}
        <div className="modal-header-actions no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} className="text-rose" />
            <strong style={{ fontSize: '15px' }}>Албан Шаардах Хуудас (Legal Notice) Хэвлэх</strong>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-primary" onClick={handlePrint} style={{ background: '#e11d48', borderColor: '#e11d48' }}>
              <Printer size={16} /> Албан Бичиг Хэвлэх (Print)
            </button>
            <button className="btn-icon-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Legal Notice Document */}
        <div className="printable-invoice" style={{ border: '2px solid #e11d48', borderRadius: '8px', padding: '32px' }}>
          {/* Header */}
          <div className="invoice-header" style={{ borderBottom: '2px solid #e11d48', paddingBottom: '16px' }}>
            <div className="company-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <img src="/logo.png" alt="Дорноговь Апартмент" style={{ width: '46px', height: '46px', objectFit: 'contain' }} />
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                    ДОРНОГОВЬ АПАРТМЕНТ ХХК
                  </h2>
                  <div style={{ fontSize: '11px', color: '#e11d48', fontWeight: 700, letterSpacing: '0.5px' }}>
                    ХУУЛЬ, САНХҮҮГИЙН АЛБА • ШААРДАХ ХУУДАС
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Дорноговь аймаг, Сайншанд сум | Утас: 7700-1122 | И-мэйл: legal@dornogobi-apartment.mn
              </p>
            </div>
            <div className="invoice-meta" style={{ textAlign: 'right' }}>
              <div className="invoice-badge" style={{ background: '#e11d48', color: '#fff', fontSize: '13px', fontWeight: 800 }}>
                МЭДЭГДЭХ ШААРДАХ ХУУДАС
              </div>
              <p style={{ margin: '6px 0 2px', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                Огноо: {new Date().toISOString().split('T')[0]}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Дугаар: NOT-502-{resident.id.replace(/[^0-9]/g, '')}-{Date.now().toString().slice(-4)}
              </p>
            </div>
          </div>

          {/* Addressee Info */}
          <div style={{ margin: '20px 0', padding: '14px 18px', background: '#fff1f2', borderRadius: '8px', border: '1px solid #fecdd3' }}>
            <div style={{ fontSize: '12px', color: '#9f1239', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              Хүлээн авагч (Түрээслэгч / Хамтран өмчлөгч):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '13px' }}>
              <div>Иргэний овог нэр: <strong>{resident.fullName || resident.name}</strong></div>
              <div>Регистрийн дугаар: <strong>{resident.regNo || 'Тодорхойгүй'}</strong></div>
              <div>Гэрээний дугаар: <strong>{resident.contractNo}</strong></div>
              <div>Байршил / Тоот: <strong>{resident.apartment}</strong></div>
              <div>Холбогдох утас: <strong>{resident.phone}</strong></div>
              <div>Хугацаа хоцорсон: <strong style={{ color: '#e11d48' }}>{resident.overdueDays} хоног</strong></div>
            </div>
          </div>

          {/* Body Statement */}
          <div style={{ fontSize: '13px', color: '#1e293b', lineHeight: 1.7, marginBottom: '20px' }}>
            <p style={{ marginBottom: '10px' }}>
              Тус компанитай байгуулсан <strong>{resident.contractNo}</strong> тоот <em>"Түрээслээд өмчлөх орон сууцны гэрээ"</em>-ний дагуу та сар бүрийн 25-ны өдрийн дотор тухайн сарын төлбөр болон СӨХ-ийн хураамжаа төлөх үүрэгтэй билээ.
            </p>
            <p style={{ marginBottom: '10px' }}>
              Гэвч та 2026 оны 08-р сарын байдлаар төлбөрөө хугацаандаа төлөөгүй <strong>{resident.overdueDays} хоног</strong> хоцорч байгаа тул Монгол Улсын Иргэний хуулийн 232 дугаар зүйл болон гэрээний 4.2-т заасны дагуу хоног тутамд 0.1%-ийн алданги тооцогдож дараах өр төлбөр үүссэнийг албан ёсоор мэдэгдэж байна.
            </p>
          </div>

          {/* Itemized Debt Table */}
          <table className="invoice-items-table" style={{ marginBottom: '20px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th>№</th>
                <th>Төлбөрийн Төрөл</th>
                <th>Хэтэрсэн Хугацаа</th>
                <th style={{ textAlign: 'right' }}>Үндсэн Өр</th>
                <th style={{ textAlign: 'right' }}>Тооцсон Алданги (0.1%)</th>
                <th style={{ textAlign: 'right' }}>Нийт Төлөх Дүн</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td><strong>Байрны Үндсэн Түрээс (75%)</strong></td>
                <td>{resident.overdueDays} хоног</td>
                <td style={{ textAlign: 'right' }}>{resident.rentUnpaid?.toLocaleString()} ₮</td>
                <td style={{ textAlign: 'right', color: '#e11d48' }}>+{resident.rentPenalty?.toLocaleString()} ₮</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{(resident.rentUnpaid + resident.rentPenalty)?.toLocaleString()} ₮</td>
              </tr>
              <tr>
                <td>2</td>
                <td><strong>СӨХ-ийн Сарын Хураамж</strong></td>
                <td>{resident.overdueDays} хоног</td>
                <td style={{ textAlign: 'right' }}>{resident.sohUnpaid?.toLocaleString()} ₮</td>
                <td style={{ textAlign: 'right', color: '#e11d48' }}>+{resident.sohPenalty?.toLocaleString()} ₮</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{(resident.sohUnpaid + resident.sohPenalty)?.toLocaleString()} ₮</td>
              </tr>
              <tr style={{ background: '#fff1f2', fontWeight: 800 }}>
                <td colSpan={5} style={{ textAlign: 'right', color: '#9f1239', fontSize: '14px' }}>
                  НИЙТ БАРАГДУУЛАХ ТӨЛБӨРИЙН ДҮН:
                </td>
                <td style={{ textAlign: 'right', color: '#e11d48', fontSize: '16px' }}>
                  {grandTotalDue?.toLocaleString()} ₮
                </td>
              </tr>
            </tbody>
          </table>

          {/* Legal Warning Notice */}
          <div style={{ padding: '12px 16px', background: '#fef2f2', borderLeft: '4px solid #e11d48', borderRadius: '4px', fontSize: '12px', color: '#991b1b', lineHeight: 1.6, marginBottom: '24px' }}>
            <strong>ШААРДЛАГА:</strong> Та дээрх нийт <strong>{grandTotalDue?.toLocaleString()} ₮</strong>-ийн төлбөрийг энэхүү мэдэгдлийг хүлээн авснаас хойш <strong>хуанлийн 5 (тав) хоногийн дотор</strong> компанийн албан ёсны дансанд бүрэн төлж барагдуулна уу. Заасан хугацаанд төлөөгүй тохиолдолд гэрээг цуцлах болон шүүхийн байгууллагад хандах болохыг хатуу анхааруулж байна.
          </div>

          {/* Official Bank Accounts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px', fontSize: '12px' }}>
            <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <div>Түрээсийн данс: <strong>{BANK_ACCOUNTS.RENT.bank} - {BANK_ACCOUNTS.RENT.number}</strong></div>
              <div>Хүлээн авагч: {BANK_ACCOUNTS.RENT.holder}</div>
            </div>
            <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <div>СӨХ-ийн данс: <strong>{BANK_ACCOUNTS.SOH.bank} - {BANK_ACCOUNTS.SOH.number}</strong></div>
              <div>Хүлээн авагч: {BANK_ACCOUNTS.SOH.holder}</div>
            </div>
          </div>

          {/* Signatures and Stamp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '30px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                Шаардах хуудас үйлдсэн: <strong>Соёл-Ундараа (Ахлах Нягтлан)</strong>
              </p>
              <div style={{ marginTop: '35px', borderTop: '1px dashed #94a3b8', width: '220px', paddingTop: '4px', fontSize: '11px', color: '#64748b' }}>
                (Гарын үсэг)
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div className="official-seal" style={{ borderColor: '#e11d48', color: '#e11d48' }}>
                <div className="seal-inner">
                  <span>ДОРНОГОВЬ</span>
                  <span>АПАРТМЕНТ ХХК</span>
                  <span style={{ fontSize: '8px' }}>ХУУЛЬ, САНХҮҮ</span>
                </div>
              </div>
            </div>

            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                Гүйцэтгэх удирдлага: <strong>Энхцэцэг (Гүйцэтгэх Захирал)</strong>
              </p>
              <div style={{ marginTop: '35px', borderTop: '1px dashed #94a3b8', width: '220px', paddingTop: '4px', fontSize: '11px', color: '#64748b' }}>
                (Гарын үсэг, тамга)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
