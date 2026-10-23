import React from 'react';
import { NormalizedGatheringRecord } from '../types/gathering';
import { ExternalLink, ShieldCheck, MapPin, Wheat, Trees, Mountain, ShieldAlert } from 'lucide-react';

interface GatheringResultsTableProps {
  records: NormalizedGatheringRecord[];
  referenceCoords: { x: number; y: number };
}

export const GatheringResultsTable: React.FC<GatheringResultsTableProps> = ({
  records,
  referenceCoords
}) => {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Bread': return <Wheat size={14} color="var(--res-bread)" />;
      case 'Wood': return <Trees size={14} color="var(--res-wood)" />;
      case 'Stone': return <Mountain size={14} color="var(--res-stone)" />;
      case 'Iron': return <ShieldAlert size={14} color="var(--res-iron)" />;
      default: return null;
    }
  };

  const getResourceBadgeClass = (type: string) => {
    switch (type) {
      case 'Bread': return 'badge-bread';
      case 'Wood': return 'badge-wood';
      case 'Stone': return 'badge-stone';
      case 'Iron': return 'badge-iron';
      default: return '';
    }
  };

  if (records.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '48px 24px',
        textAlign: 'center'
      }}>
        <div style={{ color: 'var(--text-dim)', marginBottom: '8px' }}>
          <MapPin size={36} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          No gathering targets found
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          No active gathering troops match your current filter or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th style={{ width: '60px' }}>Rank</th>
            <th>Player / Alliance</th>
            <th>Player ID</th>
            <th>Resource Target</th>
            <th style={{ textAlign: 'center' }}>Node (X, Y)</th>
            <th style={{ textAlign: 'right' }}>Distance from ({referenceCoords.x}, {referenceCoords.y})</th>
            <th>Gathering Status</th>
            <th>Last Observed</th>
            <th style={{ textAlign: 'center', width: '100px' }}>Map Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, index) => {
            const isNearest = index === 0;

            return (
              <tr
                key={r.id}
                style={{
                  backgroundColor: isNearest ? 'rgba(238, 106, 31, 0.05)' : undefined
                }}
              >
                {/* Rank */}
                <td style={{ fontWeight: 700, color: isNearest ? 'var(--forge-orange)' : 'var(--text-secondary)' }}>
                  #{index + 1}
                </td>

                {/* Player Name / Alliance */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {r.allianceTag ? (
                      <span style={{
                        color: 'var(--accent-gold)',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        backgroundColor: 'rgba(229, 169, 59, 0.1)',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        {r.allianceTag}
                      </span>
                    ) : null}
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {r.playerName || (r.allianceName ? r.allianceName : '(Unrevealed Player)')}
                      </div>
                      {r.allianceName && r.allianceName !== r.playerName && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {r.allianceName}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Player ID */}
                <td style={{ color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
                  {r.playerId || '—'}
                </td>

                {/* Resource Target */}
                <td>
                  <span className={`badge ${getResourceBadgeClass(r.resourceType)}`}>
                    {getResourceIcon(r.resourceType)}
                    <span>{r.resourceType} Lv.{r.resourceLevel}</span>
                  </span>
                </td>

                {/* Node Coordinates */}
                <td style={{ textAlign: 'center' }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    X: {r.resourceX} · Y: {r.resourceY}
                  </span>
                </td>

                {/* Calculated Distance */}
                <td style={{ textAlign: 'right' }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700,
                    color: isNearest ? 'var(--forge-orange)' : 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}>
                    {r.distance.toFixed(2)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '4px' }}>
                    tiles
                  </span>
                </td>

                {/* Gathering Status */}
                <td>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: 'var(--accent-emerald)',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    <ShieldCheck size={13} />
                    <span>Actively Gathering</span>
                  </span>
                </td>

                {/* Last Observed */}
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  {r.observedAt || 'Recent'}
                </td>

                {/* Map Action */}
                <td style={{ textAlign: 'center' }}>
                  <a
                    href={r.stratforgeMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(238, 106, 31, 0.1)',
                      color: 'var(--forge-orange)',
                      border: '1px solid rgba(238, 106, 31, 0.25)',
                      textDecoration: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                    title={`View (${r.resourceX}, ${r.resourceY}) on StratForge Kingdom Map`}
                  >
                    <span>Inspect</span>
                    <ExternalLink size={12} />
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
