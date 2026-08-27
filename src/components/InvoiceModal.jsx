import { Printer, X, FileText } from 'lucide-react';
import { BANK_ACCOUNTS } from '../data/mockData';

export default function InvoiceModal({ resident, type = 'INVOICE', transaction = null, onClose }) {
  if (!resident) return null;

  const isReceipt = type === 'RECEIPT';
  const today = new Date().toISOString().split('T')[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content invoice-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Controls */}
        <div className="modal-header-actions no-print">
          <div className="modal-title-wrap">
            <FileText size={20} className="text-primary" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
              {isReceipt ? 'Төлбөрийн Баримт (Receipt)' : 'Сар Бүрийн Нэхэмжлэх (Invoice)'}
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={handlePrint} style={{ padding: '6px 14px', fontSize: '13px' }}>
              <Printer size={15} /> Хэвлэх
            </button>
            <button className="btn-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="printable-invoice">
          {/* Header */}
          <div className="invoice-header">
            <div className="company-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <img src="/logo.png" alt="Дорноговь Апартмент" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
                <div>
                  <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 800, color: '#0f172a' }}>
                    ДОРНОГОВЬ АПАРТМЕНТ ХХК
                  </h2>
                  <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>
                    Түрээслээд Өмчлөх Орон Сууц & СӨХ
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Дорноговь аймаг, Сайншанд сум | Утас: 7700-1122 | И-мэйл: info@dornogobi-apartment.mn
              </p>
            </div>
            <div className="invoice-meta" style={{ textAlign: 'right' }}>
              <div className="invoice-badge">
                {isReceipt ? 'ТӨЛБӨРИЙН БАРИМТ' : 'НЭХЭМЖЛЭХ'}
              </div>
              <p style={{ margin: '6px 0 2px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                Дугаар: {isReceipt ? (transaction?.id || `REC-${resident.id}-${Date.now().toString().slice(-4)}`) : `INV-${resident.id}-2026-08`}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Огноо: {transaction?.date || today}
              </p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />

          {/* Resident & Contract Information */}
          <div className="invoice-grid-2">
            <div className="invoice-info-card">
              <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b', margin: '0 0 8px' }}>
                Төлөгч / Оршин суугчийн мэдээлэл
              </h4>
              <p style={{ margin: '3px 0', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                {resident.fullName || resident.name}
              </p>
              <p style={{ margin: '3px 0', fontSize: '13px', color: '#475569' }}>
                Регистрийн №: <strong style={{ color: '#0f172a' }}>{resident.regNo || 'УП88010111'}</strong>
              </p>
              <p style={{ margin: '3px 0', fontSize: '13px', color: '#475569' }}>
                Байршил: {resident.apartment}
              </p>
              <p style={{ margin: '3px 0', fontSize: '13px', color: '#475569' }}>
                Утас: {resident.phone} | И-мэйл: {resident.email || '-'}
              </p>
            </div>

            <div className="invoice-info-card">
              <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b', margin: '0 0 8px' }}>
                Гэрээ ба Өмчлөлийн мэдээлэл
              </h4>
              <p style={{ margin: '3px 0', fontSize: '13px', color: '#475569' }}>
                Гэрээний №: <strong style={{ color: '#0f172a' }}>{resident.contractNo || 'RTO-2022-0001'}</strong>
              </p>
              <p style={{ margin: '3px 0', fontSize: '13px', color: '#475569' }}>
                Байрны нийт үнэ: <strong>{resident.totalPrice?.toLocaleString()} ₮</strong>
              </p>
              <p style={{ margin: '3px 0', fontSize: '13px', color: '#475569' }}>
                25% Урьдчилгаа төлбөр: <strong>{resident.downPayment?.toLocaleString()} ₮ (Төлөгдсөн)</strong>
              </p>
              <p style={{ margin: '3px 0', fontSize: '13px', color: '#475569' }}>
                Өмчлөлийн явц: <strong style={{ color: '#2563eb' }}>{resident.currentOwnershipPercent}%</strong> ({resident.paidMonths}/60 сар төлсөн)
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="invoice-table" style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: '#475569' }}>№</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: '#475569' }}>Тайлбар / Зориулалт</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: '#475569' }}>Хугацаа / Талбай</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Үндсэн дүн</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Алданги</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Нийт төлөх</th>
              </tr>
            </thead>
            <tbody>
              {/* Rent / Buyout Row */}
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px 12px', fontSize: '13px' }}>1</td>
                <td style={{ padding: '10px 12px', fontSize: '13px' }}>
                  <strong>Түрээслээд өмчлөх сарын төлбөр</strong>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {resident.paidMonths}-р сарын төлбөр (5 жил / 60 сар хүүгүй хуваарь)
                  </div>
                </td>
                <td style={{ padding: '10px 12px', fontSize: '13px' }}>1 сар</td>
                <td style={{ padding: '10px 12px', fontSize: '13px', textAlign: 'right' }}>
                  {resident.monthlyRent?.toLocaleString()} ₮
                </td>
                <td style={{ padding: '10px 12px', fontSize: '13px', textAlign: 'right', color: resident.rentPenalty > 0 ? '#dc2626' : '#64748b' }}>
                  {resident.rentPenalty > 0 ? `+${resident.rentPenalty.toLocaleString()} ₮` : '0 ₮'}
                </td>
                <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>
                  {(resident.monthlyRent + (resident.rentPenalty || 0)).toLocaleString()} ₮
                </td>
              </tr>

              {/* SOH Row */}
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px 12px', fontSize: '13px' }}>2</td>
                <td style={{ padding: '10px 12px', fontSize: '13px' }}>
                  <strong>СӨХ-ийн ашиглалт, үйлчилгээний хураамж</strong>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Цэвэрлэгээ, харуул хамгаалалт, лифт, дундын өмчлөлийн урсгал засвар (1м² = 1,000₮)
                  </div>
                </td>
                <td style={{ padding: '10px 12px', fontSize: '13px' }}>{resident.areaSqm} м²</td>
                <td style={{ padding: '10px 12px', fontSize: '13px', textAlign: 'right' }}>
                  {resident.monthlySOH?.toLocaleString()} ₮
                </td>
                <td style={{ padding: '10px 12px', fontSize: '13px', textAlign: 'right', color: resident.sohPenalty > 0 ? '#dc2626' : '#64748b' }}>
                  {resident.sohPenalty > 0 ? `+${resident.sohPenalty.toLocaleString()} ₮` : '0 ₮'}
                </td>
                <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>
                  {(resident.monthlySOH + (resident.sohPenalty || 0)).toLocaleString()} ₮
                </td>
              </tr>
            </tbody>
          </table>

          {/* Totals & Calculations Breakdown */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '20px 0' }}>
            <div style={{ maxWidth: '55%' }}>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h5 style={{ margin: '0 0 6px', fontSize: '12px', color: '#334155', fontWeight: 600 }}>
                  Банкны төлбөр хүлээн авах данс:
                </h5>
                <p style={{ margin: '2px 0', fontSize: '12px', color: '#475569' }}>
                  • <strong>Түрээс / Өмчлөл:</strong> {BANK_ACCOUNTS.RENT.bank} - <code>{BANK_ACCOUNTS.RENT.number}</code> ({BANK_ACCOUNTS.RENT.holder})
                </p>
                <p style={{ margin: '2px 0', fontSize: '12px', color: '#475569' }}>
                  • <strong>СӨХ-ийн төлбөр:</strong> {BANK_ACCOUNTS.SOH.bank} - <code>{BANK_ACCOUNTS.SOH.number}</code> ({BANK_ACCOUNTS.SOH.holder})
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748b' }}>
                  * Гүйлгээний утга дээр: <strong>{resident.contractNo} {resident.apartment.split(',')[0]}</strong> гэж бичнэ үү.
                </p>
              </div>

              {resident.overdueDays > 0 && (
                <div style={{ marginTop: '8px', padding: '10px 12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '12px', color: '#991b1b' }}>
                  <strong>Төлбөрийн алдангийн тооцоолол:</strong>
                  <div>Сар бүрийн 25-наас хойш {resident.overdueDays} хоног хэтэрсэн тул өдрийн 0.1%-ийн алданги тооцогдсон болно.</div>
                </div>
              )}
            </div>

            <div style={{ minWidth: '260px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px', color: '#64748b' }}>
                <span>Үндсэн төлбөр:</span>
                <span>{(resident.monthlyRent + resident.monthlySOH).toLocaleString()} ₮</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px', color: '#dc2626' }}>
                <span>Нийт алданги ({resident.overdueDays || 0} хоног):</span>
                <span>+{(resident.rentPenalty + resident.sohPenalty).toLocaleString()} ₮</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                <span>НИЙТ ТӨЛӨХ:</span>
                <span style={{ color: '#2563eb' }}>
                  {(resident.monthlyRent + resident.monthlySOH + resident.rentPenalty + resident.sohPenalty).toLocaleString()} ₮
                </span>
              </div>
            </div>
          </div>

          {/* Footer & Signature Stamp */}
          <div className="invoice-footer" style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px', borderTop: '1px dashed #cbd5e1' }}>
            <div>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                Энэхүү баримт нь цахим системээр баталгаажсан тул тамга гарын үсэггүйгээр хүчинтэй.
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94a3b8' }}>
                Үүсгэсэн огноо: {today} | Систем: Түрээслээд Өмчлөх Нэгдсэн Платформ v2.0
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="seal-box" style={{ border: '2px solid #2563eb', padding: '6px 14px', borderRadius: '8px', color: '#2563eb', fontWeight: 700, fontSize: '12px' }}>
                ЦАХИМ БАТАЛГААЖУУЛАЛТ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
