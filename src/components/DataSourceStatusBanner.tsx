import React, { useState } from 'react';
import { DataSourceStatus } from '../types/gathering';
import { AlertCircle, ChevronDown, ChevronUp, Database } from 'lucide-react';

interface DataSourceStatusBannerProps {
  status: DataSourceStatus;
}

export const DataSourceStatusBanner: React.FC<DataSourceStatusBannerProps> = ({ status }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      backgroundColor: status.error ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-surface)',
      border: `1px solid ${status.error ? '#ef4444' : 'var(--border-color)'}`,
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '0.8rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            color: status.error ? '#ef4444' : status.isLive ? 'var(--accent-emerald)' : 'var(--accent-gold)'
          }}>
            {status.error ? <AlertCircle size={18} /> : <Database size={18} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                Data Source Diagnostic:
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                {status.sourceName}
              </span>
              <span style={{
                fontSize: '0.7rem',
                padding: '1px 6px',
                borderRadius: '4px',
                backgroundColor: status.isPro ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: status.isPro ? 'var(--accent-emerald)' : 'var(--text-dim)',
                border: '1px solid var(--border-color)'
              }}>
                {status.isPro ? 'PRO ACCOUNT' : 'FREE ACCOUNT TIER'}
              </span>
            </div>
            {status.limitationNotice && (
              <p style={{ color: 'var(--text-secondary)', marginTop: '2px', fontSize: '0.75rem' }}>
                {status.limitationNotice}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            padding: '4px 8px',
            borderRadius: '4px'
          }}
        >
          <span>{expanded ? 'Hide Technical Diagnostics' : 'View Technical Diagnostics'}</span>
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {expanded && (
        <div style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px',
          color: 'var(--text-secondary)'
        }}>
          <div>
            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              StratForge Transport Protocol
            </h4>
            <p><strong>Route:</strong> Next.js App Router (RSC streaming protocol)</p>
            <p><strong>Header:</strong> <code className="font-mono">RSC: 1</code>, <code className="font-mono">Accept: text/x-component</code></p>
            <p><strong>Session:</strong> Cookie-authenticated session</p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Data Verification Guarantee
            </h4>
            <p><strong>Deduplication:</strong> Unique per <code className="font-mono">(kid, x, y)</code> node coordinate</p>
            <p><strong>Exclusion rule:</strong> Excludes camps (<code className="font-mono">kind: "camp"</code>) and non-gathering markers</p>
            <p><strong>Synthetic Data Policy:</strong> 100% strict adherence — zero fabricated or simulated records</p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Freshness & Attribution Notes
            </h4>
            <p><strong>Captured At:</strong> {status.capturedAt ? new Date(status.capturedAt).toISOString() : 'N/A'}</p>
            <p><strong>Player Attribution:</strong> StratForge masks player names for non-Pro accounts on gathering nodes while retaining alliance tags and exact tile coordinates.</p>
          </div>
        </div>
      )}
    </div>
  );
};
