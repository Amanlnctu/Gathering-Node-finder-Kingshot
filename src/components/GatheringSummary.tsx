import React from 'react';
import { NormalizedGatheringRecord, DataSourceStatus } from '../types/gathering';
import { Target, CheckCircle2, AlertTriangle, Clock, Layers } from 'lucide-react';

interface GatheringSummaryProps {
  records: NormalizedGatheringRecord[];
  allValidatedRecords: NormalizedGatheringRecord[];
  status: DataSourceStatus;
  invalidRecordsCount: number;
}

export const GatheringSummary: React.FC<GatheringSummaryProps> = ({
  records,
  allValidatedRecords,
  status,
  invalidRecordsCount
}) => {
  const nearestTarget = records.length > 0 ? records[0] : null;

  // Resource breakdown
  const resourceCounts = allValidatedRecords.reduce((acc, r) => {
    acc[r.resourceType] = (acc[r.resourceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '12px'
    }}>
      {/* Total Validated Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid var(--accent-emerald)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-emerald)'
        }}>
          <CheckCircle2 size={20} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Validated Gathering Targets
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {allValidatedRecords.length}
            {records.length !== allValidatedRecords.length && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, marginLeft: '6px' }}>
                ({records.length} filtered)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Nearest Gathering Target Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          backgroundColor: 'rgba(238, 106, 31, 0.12)',
          border: '1px solid var(--forge-orange)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--forge-orange)'
        }}>
          <Target size={20} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Nearest Gathering Target
          </div>
          {nearestTarget ? (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--forge-orange)' }}>
                {nearestTarget.distance.toFixed(2)} units
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                ({nearestTarget.resourceX}, {nearestTarget.resourceY})
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {nearestTarget.resourceType} Lv.{nearestTarget.resourceLevel}
              </span>
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>None matching</div>
          )}
        </div>
      </div>

      {/* Resource Breakdown Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          backgroundColor: 'rgba(59, 130, 246, 0.12)',
          border: '1px solid var(--accent-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-blue)'
        }}>
          <Layers size={20} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Resource Type Breakdown
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '2px', fontSize: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--res-bread)' }}>Bread: <strong>{resourceCounts['Bread'] || 0}</strong></span>
            <span style={{ color: 'var(--res-wood)' }}>Wood: <strong>{resourceCounts['Wood'] || 0}</strong></span>
            <span style={{ color: 'var(--res-stone)' }}>Stone: <strong>{resourceCounts['Stone'] || 0}</strong></span>
            <span style={{ color: 'var(--res-iron)' }}>Iron: <strong>{resourceCounts['Iron'] || 0}</strong></span>
          </div>
        </div>
      </div>

      {/* Observation Freshness & Integrity */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          backgroundColor: invalidRecordsCount > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(229, 169, 59, 0.12)',
          border: `1px solid ${invalidRecordsCount > 0 ? '#ef4444' : 'var(--accent-gold)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: invalidRecordsCount > 0 ? '#ef4444' : 'var(--accent-gold)'
        }}>
          {invalidRecordsCount > 0 ? <AlertTriangle size={20} /> : <Clock size={20} />}
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Integrity & Freshness
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '2px' }}>
            <span>Missing Fields: <strong>{invalidRecordsCount}</strong></span>
            <span style={{ margin: '0 6px', color: 'var(--border-color)' }}>|</span>
            <span style={{ color: status.isStale ? 'var(--accent-gold)' : 'var(--accent-emerald)' }}>
              {status.isStale ? 'Snapshot' : 'Live'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
