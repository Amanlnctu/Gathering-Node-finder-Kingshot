import React from 'react';
import { ResourceFilterType } from '../types/gathering';
import { Wheat, Trees, Mountain, ShieldAlert, Layers } from 'lucide-react';

interface ResourceFilterProps {
  currentFilter: ResourceFilterType;
  onFilterChange: (filter: ResourceFilterType) => void;
  counts: Record<string, number>;
}

export const ResourceFilter: React.FC<ResourceFilterProps> = ({
  currentFilter,
  onFilterChange,
  counts
}) => {
  const filters: { key: ResourceFilterType; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'All', label: 'All Resources', icon: <Layers size={14} />, color: 'var(--text-primary)' },
    { key: 'Bread', label: 'Bread (Food)', icon: <Wheat size={14} />, color: 'var(--res-bread)' },
    { key: 'Wood', label: 'Wood', icon: <Trees size={14} />, color: 'var(--res-wood)' },
    { key: 'Stone', label: 'Stone', icon: <Mountain size={14} />, color: 'var(--res-stone)' },
    { key: 'Iron', label: 'Iron', icon: <ShieldAlert size={14} />, color: 'var(--res-iron)' }
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '4px' }}>
        Filter:
      </span>
      {filters.map((f) => {
        const isSelected = currentFilter === f.key;
        const count = f.key === 'All' ? counts['total'] || 0 : counts[f.key] || 0;

        return (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            style={{
              backgroundColor: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
              color: isSelected ? f.color : 'var(--text-secondary)',
              border: `1px solid ${isSelected ? f.color : 'var(--border-color)'}`,
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ color: f.color }}>{f.icon}</span>
            <span>{f.label}</span>
            <span style={{
              fontSize: '0.7rem',
              padding: '1px 5px',
              borderRadius: '10px',
              backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
