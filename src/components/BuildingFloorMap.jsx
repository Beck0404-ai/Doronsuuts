import React, { useState, useMemo } from 'react';
import { Building2, DoorClosed } from 'lucide-react';

export default function BuildingFloorMap({ residents, onSelectResident, onOpenSettle }) {
  const [selectedBlock, setSelectedBlock] = useState('502В'); // '502В', '502Д', '502А'
  const [selectedEntrance, setSelectedEntrance] = useState('ALL'); // 'ALL' | 1 | 2 | 3 | 4
  const [hoveredResident, setHoveredResident] = useState(null);

  // Group residents by block
  const blockResidents = useMemo(() => {
    return residents.filter(r => r.apartment && r.apartment.includes(selectedBlock));
  }, [residents, selectedBlock]);

  // Total 4 entrances, each 6 floors, 6 apartments per floor = 36 apts per entrance
  const entrancesData = useMemo(() => {
    const entrances = { 1: {}, 2: {}, 3: {}, 4: {} };

    // Initialize 6 floors (6 down to 1) for each of the 4 entrances
    [1, 2, 3, 4].forEach(ent => {
      for (let f = 6; f >= 1; f--) {
        entrances[ent][f] = [];
      }
    });

    blockResidents.forEach(res => {
      const doorNum = parseInt(res.door) || 1;
      
      // Calculate Entrance (1-4): Each entrance has 36 units (6 floors * 6 units)
      const entrance = Math.min(4, Math.max(1, Math.floor((doorNum - 1) / 36) + 1));
      
      // Calculate Floor (1-6) inside that entrance
      const unitIndexInEntrance = (doorNum - 1) % 36;
      const floor = Math.min(6, Math.max(1, Math.floor(unitIndexInEntrance / 6) + 1));

      if (entrances[entrance] && entrances[entrance][floor]) {
        entrances[entrance][floor].push(res);
      }
    });

    return entrances;
  }, [blockResidents]);

  // Stats for the active block
  const blockStats = useMemo(() => {
    let paid = 0;
    let overdue = 0;
    let partial = 0;
    let totalPenalty = 0;

    blockResidents.forEach(r => {
      if (r.status === 'Бүрэн төлсөн') paid++;
      else if (r.status === 'Хугацаа хэтэрсэн') overdue++;
      else partial++;

      totalPenalty += (r.rentPenalty || 0) + (r.sohPenalty || 0);
    });

    return {
      total: blockResidents.length,
      paid,
      overdue,
      partial,
      totalPenalty
    };
  }, [blockResidents]);

  const activeEntrancesList = selectedEntrance === 'ALL' ? [1, 2, 3, 4] : [Number(selectedEntrance)];

  return (
    <div className="building-floor-map-container card-box">
      {/* Header & Block Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={20} className="text-primary" /> 502-р Байрны Интерактив Бүтэц
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
            <strong>6 Давхар • 4 Орц • Давхар бүрт 6 Айл</strong> (Бодит төлөв, төлбөр ба алдангийн план)
          </p>
        </div>

        {/* Block Selector Buttons */}
        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <button 
            className={`tab-btn ${selectedBlock === '502В' ? 'active-auth-tab' : ''}`}
            style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', background: selectedBlock === '502В' ? '#2563eb' : 'transparent', color: selectedBlock === '502В' ? '#fff' : '#475569' }}
            onClick={() => setSelectedBlock('502В')}
          >
            502В Блок ({residents.filter(r => r.apartment.includes('502В')).length} өрх)
          </button>
          <button 
            className={`tab-btn ${selectedBlock === '502Д' ? 'active-auth-tab' : ''}`}
            style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', background: selectedBlock === '502Д' ? '#2563eb' : 'transparent', color: selectedBlock === '502Д' ? '#fff' : '#475569' }}
            onClick={() => setSelectedBlock('502Д')}
          >
            502Д Блок ({residents.filter(r => r.apartment.includes('502Д')).length} өрх)
          </button>
          <button 
            className={`tab-btn ${selectedBlock === '502А' ? 'active-auth-tab' : ''}`}
            style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', background: selectedBlock === '502А' ? '#2563eb' : 'transparent', color: selectedBlock === '502А' ? '#fff' : '#475569' }}
            onClick={() => setSelectedBlock('502А')}
          >
            502А Блок ({residents.filter(r => r.apartment.includes('502А')).length} өрх)
          </button>
        </div>
      </div>

      {/* Entrance Filter Tabs (4 Орц) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className="btn-secondary"
            style={{ padding: '5px 12px', fontSize: '12px', fontWeight: 700, background: selectedEntrance === 'ALL' ? '#0f172a' : '#fff', color: selectedEntrance === 'ALL' ? '#fff' : '#334155', borderColor: '#cbd5e1' }}
            onClick={() => setSelectedEntrance('ALL')}
          >
            🏢 Бүх 4 Орцыг Зэрэгцээ Харах
          </button>
          {[1, 2, 3, 4].map(entNum => (
            <button
              key={entNum}
              className="btn-secondary"
              style={{ padding: '5px 12px', fontSize: '12px', fontWeight: 700, background: selectedEntrance === String(entNum) ? '#2563eb' : '#fff', color: selectedEntrance === String(entNum) ? '#fff' : '#334155', borderColor: '#cbd5e1' }}
              onClick={() => setSelectedEntrance(String(entNum))}
            >
              🚪 {entNum}-р Орц (36 айл)
            </button>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '14px', fontSize: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981', display: 'inline-block' }} />
            <span>Төлсөн ({blockStats.paid})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444', display: 'inline-block' }} />
            <span>Алдангитай ({blockStats.overdue})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f59e0b', display: 'inline-block' }} />
            <span>Дутуу / СӨХ ({blockStats.partial})</span>
          </div>
        </div>
      </div>

      {/* Architectural Entrance Columns Grid */}
      <div 
        className="building-entrances-container"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${activeEntrancesList.length}, 1fr)`,
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '10px'
        }}
      >
        {activeEntrancesList.map(entNum => {
          const floors = entrancesData[entNum] || {};

          return (
            <div 
              key={entNum} 
              className="entrance-block-card"
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '14px'
              }}
            >
              {/* Entrance Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', marginBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>
                <strong style={{ fontSize: '14px', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DoorClosed size={16} className="text-primary" /> {entNum}-р Орц
                </strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {((entNum - 1) * 36) + 1} - {entNum * 36} тоот
                </span>
              </div>

              {/* 6 Floors from 6 down to 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[6, 5, 4, 3, 2, 1].map(floorNum => {
                  const floorApts = floors[floorNum] || [];

                  return (
                    <div key={floorNum} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '38px', fontSize: '11px', fontWeight: 800, color: '#64748b', textAlign: 'center', flexShrink: 0 }}>
                        {floorNum} дав
                      </div>

                      {/* 6 Units per Floor */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', flex: 1 }}>
                        {[0, 1, 2, 3, 4, 5].map(unitIdx => {
                          const res = floorApts[unitIdx];
                          const fallbackDoorNum = ((entNum - 1) * 36) + ((floorNum - 1) * 6) + unitIdx + 1;

                          if (!res) {
                            return (
                              <div
                                key={unitIdx}
                                style={{
                                  background: '#f1f5f9',
                                  border: '1px dashed #cbd5e1',
                                  borderRadius: '4px',
                                  padding: '6px 2px',
                                  textAlign: 'center',
                                  fontSize: '10px',
                                  color: '#94a3b8'
                                }}
                                title={`${fallbackDoorNum} тоот (Сул эсвэл бүртгэлгүй)`}
                              >
                                {fallbackDoorNum}
                              </div>
                            );
                          }

                          const isOverdue = res.status === 'Хугацаа хэтэрсэн' || res.overdueDays > 0;
                          const isPartial = res.status === 'Дутуу төлсөн' || res.status === 'СӨХ төлөөгүй';
                          const isPaid = res.status === 'Бүрэн төлсөн';

                          const bg = isOverdue ? '#fee2e2' : isPartial ? '#fef3c7' : '#dcfce7';
                          const border = isOverdue ? '#f87171' : isPartial ? '#fbbf24' : '#86efac';
                          const textColor = isOverdue ? '#991b1b' : isPartial ? '#92400e' : '#166534';

                          return (
                            <div 
                              key={res.id}
                              className="apt-cell-box"
                              style={{
                                background: bg,
                                border: `1px solid ${border}`,
                                borderRadius: '4px',
                                padding: '6px 2px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={() => setHoveredResident(res)}
                              onMouseLeave={() => setHoveredResident(null)}
                              onClick={() => onSelectResident && onSelectResident(res)}
                            >
                              <strong style={{ fontSize: '11px', color: textColor, display: 'block', lineHeight: 1.1 }}>
                                {res.door}
                              </strong>
                              <span style={{ fontSize: '9px', color: textColor, fontWeight: 700 }}>
                                {isOverdue ? `-${res.overdueDays}х` : isPaid ? '✓' : '...'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hovered Resident Preview Drawer */}
      {hoveredResident && (
        <div style={{ marginTop: '16px', padding: '12px 16px', background: '#0f172a', color: '#fff', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#60a5fa' }}>{hoveredResident.apartment}</span>
              <span>—</span>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{hoveredResident.fullName || hoveredResident.name}</span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>({hoveredResident.phone})</span>
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '3px' }}>
              Талбай: {hoveredResident.areaSqm} м² | 5 жилийн өмчлөл: <strong>{hoveredResident.currentOwnershipPercent}%</strong> | Нийт үлдэгдэл: {hoveredResident.remainingBalance?.toLocaleString()} ₮
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Энэ сард төлөх:</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: hoveredResident.totalDueThisMonth > 0 ? '#f87171' : '#4ade80' }}>
                {hoveredResident.totalDueThisMonth > 0 ? `${hoveredResident.totalDueThisMonth?.toLocaleString()} ₮` : '0 ₮ (Бүрэн төлөгдсөн)'}
              </div>
            </div>
            {onOpenSettle && (
              <button 
                className="btn-primary-sm"
                onClick={() => onOpenSettle(hoveredResident)}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                Төлөлт авах
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
