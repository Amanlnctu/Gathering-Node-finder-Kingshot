import React from 'react';
import { SortOrderType } from '../types/gathering';
import { ArrowDownUp } from 'lucide-react';

interface SortSelectorProps {
  currentSort: SortOrderType;
  onSortChange: (sort: SortOrderType) => void;
}

export const SortSelector: React.FC<SortSelectorProps> = ({ currentSort, onSortChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label htmlFor="sort-select" style={{
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <ArrowDownUp size={13} />
        <span>Sort by:</span>
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOrderType)}
        style={{
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '6px 12px',
          fontSize: '0.8rem',
          fontWeight: 600,
          outline: 'none',
          cursor: 'pointer'
        }}
      >
        <option value="distance_asc">Nearest to farthest (Default)</option>
        <option value="distance_desc">Farthest to nearest</option>
        <option value="level_desc">Resource Level (High → Low)</option>
        <option value="player_asc">Player / Alliance (A–Z)</option>
        <option value="resource_type">Resource Type</option>
      </select>
    </div>
  );
};
