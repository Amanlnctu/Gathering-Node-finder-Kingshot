import React, { useState } from 'react';
import { ReferenceCoords } from '../types/gathering';
import { Crosshair, Check, RotateCcw } from 'lucide-react';

interface ReferenceCoordinateFormProps {
  currentCoords: ReferenceCoords;
  onApplyCoords: (coords: ReferenceCoords) => void;
}

export const ReferenceCoordinateForm: React.FC<ReferenceCoordinateFormProps> = ({
  currentCoords,
  onApplyCoords
}) => {
  const [inputX, setInputX] = useState<string>(String(currentCoords.x));
  const [inputY, setInputY] = useState<string>(String(currentCoords.y));
  const [appliedNotice, setAppliedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const x = parseFloat(inputX);
    const y = parseFloat(inputY);

    if (!isNaN(x) && !isNaN(y)) {
      onApplyCoords({ x, y });
      setAppliedNotice(true);
      setTimeout(() => setAppliedNotice(false), 2000);
    }
  };

  const handleResetDefault = () => {
    setInputX('520');
    setInputY('717');
    onApplyCoords({ x: 520, y: 717 });
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '16px 20px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          backgroundColor: 'rgba(229, 169, 59, 0.12)',
          border: '1px solid var(--accent-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-gold)'
        }}>
          <Crosshair size={18} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Reference Coordinate (Origin)
            </span>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--accent-gold)',
              backgroundColor: 'rgba(229, 169, 59, 0.1)',
              padding: '1px 6px',
              borderRadius: '3px',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              Active: ({currentCoords.x}, {currentCoords.y})
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Distances to all resource gathering nodes are calculated from this point (Euclidean grid: √[(x-x₀)² + (y-y₀)²])
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label htmlFor="ref-x" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            X:
          </label>
          <input
            id="ref-x"
            type="number"
            step="any"
            value={inputX}
            onChange={(e) => setInputX(e.target.value)}
            style={{
              width: '80px',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'JetBrains Mono, monospace',
              textAlign: 'center',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label htmlFor="ref-y" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Y:
          </label>
          <input
            id="ref-y"
            type="number"
            step="any"
            value={inputY}
            onChange={(e) => setInputY(e.target.value)}
            style={{
              width: '80px',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'JetBrains Mono, monospace',
              textAlign: 'center',
              outline: 'none'
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: appliedNotice ? 'var(--accent-emerald)' : 'var(--forge-orange)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '7px 16px',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.2s ease'
          }}
        >
          {appliedNotice ? <Check size={14} /> : null}
          <span>{appliedNotice ? 'Recalculated!' : 'Apply Coordinates'}</span>
        </button>

        <button
          type="button"
          onClick={handleResetDefault}
          style={{
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '7px 10px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Reset to default (520, 717)"
        >
          <RotateCcw size={13} />
          <span>Default</span>
        </button>
      </form>
    </div>
  );
};
