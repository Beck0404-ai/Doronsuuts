import React from 'react';
import { Printer, X, FileText } from 'lucide-react';

export default function CashVoucherModal({ date, totalCash, totalKhan, totalGolomt, transactionList, accountantName, onClose }) {
  const grandTotal = (totalCash || 0) + (totalKhan || 0) + (totalGolomt || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content invoice-modal-container" style={{ maxWidth: '850px' }}>
        {/* Modal Controls */}
        <div className="modal-header-actions no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} className="text-primary" />
            <strong style={{ fontSize: '15px' }}>Өдрийн Кассын Орлогын Баримт Хэвлэх</strong>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-primary" onClick={handlePrint}>
              <Printer size={16} /> Хэвлэх (Print)
            </button>
            <button className="btn-icon-close" onClick={onClose}>
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
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                    ДОРНОГОВЬ АПАРТМЕНТ ХХК
                  </h2>
                  <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>
                    Санхүү, Бүртгэлийн Алба • 502-р Байр
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Дорноговь аймаг, Сайншанд сум | Утас: 7700-1122
              </p>
            </div>
            <div className="invoice-meta" style={{ textAlign: 'right' }}>
              <div className="invoice-badge" style={{ background: '#0284c7' }}>
                КАССЫН ӨДРИЙН ОРЛОГЫН ТАЙЛАН
              </div>
              <p style={{ margin: '6px 0 2px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                Огноо: {date || new Date().toISOString().split('T')[0]}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Тайлан дугаар: DLY-CSH-{date ? date.replace(/-/g, '') : '20260826'}
              </p>
            </div>
          </div>

          {/* Summary Box */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', margin: '20px 0', padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Бэлэн Касс:</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{totalCash?.toLocaleString()} ₮</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>ХААН Банк (Түрээс):</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#2563eb' }}>{totalKhan?.toLocaleString()} ₮</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Голомт Банк (СӨХ):</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#059669' }}>{totalGolomt?.toLocaleString()} ₮</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Нийт Орлогын Дүн:</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#166534' }}>{grandTotal?.toLocaleString()} ₮</div>
            </div>
          </div>

          {/* Transactions Table */}
          <div style={{ margin: '16px 0' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: '#334155' }}>
              Өдрийн баталгаажсан гүйлгээнүүдийн жагсаалт:
            </h4>
            <table className="invoice-items-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Цаг</th>
                  <th>Оршин суугч / Тоот</th>
                  <th>Төлбөрийн Төрөл</th>
                  <th>Суваг / Данс</th>
                  <th style={{ textAlign: 'right' }}>Дүн</th>
                </tr>
              </thead>
              <tbody>
                {(transactionList && transactionList.length > 0) ? (
                  transactionList.map((tx, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{tx.time || '14:30'}</td>
                      <td>
                        <strong>{tx.residentName}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{tx.apartment}</div>
                      </td>
                      <td>{tx.type}</td>
                      <td>{tx.channel}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{tx.amount?.toLocaleString()} ₮</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>1</td>
                    <td>14:22</td>
                    <td>
                      <strong>Балжинням Содномпунцаг</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>502В байр, 1 тоот</div>
                    </td>
                    <td>Түрээс / Өмчлөл</td>
                    <td>ХААН Банк (Шилжүүлэг)</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>1,294,900 ₮</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Signatures & Seal */}
          <div className="invoice-signatures" style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                Кассын нярав: <strong>Орхонсэлэнгэ (Нярав)</strong>
              </p>
              <div style={{ marginTop: '35px', borderTop: '1px dashed #94a3b8', width: '180px', paddingTop: '4px', fontSize: '11px', color: '#64748b' }}>
                (Хүлээн авсан нярав)
              </div>
            </div>

            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                Ахлах Нягтлан: <strong>{accountantName || 'Соёл-Ундараа'}</strong>
              </p>
              <div style={{ marginTop: '35px', borderTop: '1px dashed #94a3b8', width: '180px', paddingTop: '4px', fontSize: '11px', color: '#64748b' }}>
                (Хянасан нягтлан)
              </div>
            </div>

            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div className="official-seal">
                <div className="seal-inner">
                  <span>ДОРНОГОВЬ</span>
                  <span>АПАРТМЕНТ ХХК</span>
                  <span style={{ fontSize: '8px' }}>САНХҮҮ</span>
                </div>
              </div>
            </div>

            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                Батлав: <strong>Энхцэцэг (Гүйцэтгэх Захирал)</strong>
              </p>
              <div style={{ marginTop: '35px', borderTop: '1px dashed #94a3b8', width: '180px', paddingTop: '4px', fontSize: '11px', color: '#64748b' }}>
                (Тамга, гарын үсэг)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
