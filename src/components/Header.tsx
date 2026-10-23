import React from 'react';
import { DataSourceStatus } from '../types/gathering';
import { RefreshCw, MapPin, ExternalLink } from 'lucide-react';

interface HeaderProps {
  kingdomId: number;
  onKingdomChange: (kid: number) => void;
  status: DataSourceStatus;
  isLoading: boolean;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  kingdomId,
  onKingdomChange,
  status,
  isLoading,
  onRefresh
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-surface)',
      padding: '16px 24px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Brand & Kingdom Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(238, 106, 31, 0.15)',
              border: '1px solid var(--forge-orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--forge-orange)'
            }}>
              <MapPin size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  Kingshot <span style={{ color: 'var(--forge-orange)' }}>Gathering Finder</span>
                </h1>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(238, 106, 31, 0.2)',
                  color: 'var(--forge-orange)',
                  border: '1px solid rgba(238, 106, 31, 0.4)'
                }}>
                  STRATFORGE INTEL
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(244, 63, 94, 0.15)',
                  color: '#fb7185',
                  border: '1px solid rgba(244, 63, 94, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  letterSpacing: '0.02em'
                }}>
                  MADE WITH LOVE BY [ETE] Spiderman ❤️
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Target distance radar & resource node tracking for Kingdom {kingdomId}
              </p>
            </div>
          </div>

          {/* Kingdom Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
            <label htmlFor="kingdom-select" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Kingdom:
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="kingdom-select"
                value={kingdomId}
                onChange={(e) => onKingdomChange(Number(e.target.value))}
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '6px 28px 6px 12px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value={1870}>Kingdom 1870 (Active)</option>
                <option value={1877}>Kingdom 1877</option>
                <option value={1869}>Kingdom 1869</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status & Refresh Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Connection Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className={`badge ${status.isLive ? 'badge-live' : 'badge-stale'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px' }}
            >
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: status.isLive ? 'var(--accent-emerald)' : 'var(--accent-gold)',
                display: 'inline-block'
              }} />
              {status.isLive ? 'Live Verified Connection' : 'Verified Real Snapshot'}
            </span>
          </div>

          {/* Freshness Indicator */}
          {status.observedAtStr && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Last observed: <strong style={{ color: 'var(--text-primary)' }}>{status.observedAtStr}</strong>
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '7px 14px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.15s ease'
            }}
            title="Refresh verified gathering nodes"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>{isLoading ? 'Scanning...' : 'Refresh'}</span>
          </button>

          {/* StratForge Map Link */}
          <a
            href={`https://stratforge.tools/dashboard/kingshot/tools/kingdom-map?kid=${kingdomId}&aid=187900183&c=520.19,716.98,1.13&layers=marches`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: 'rgba(238, 106, 31, 0.1)',
              color: 'var(--forge-orange)',
              border: '1px solid rgba(238, 106, 31, 0.3)',
              borderRadius: '6px',
              padding: '7px 12px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
          >
            <span>Open Map</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </header>
  );
};
