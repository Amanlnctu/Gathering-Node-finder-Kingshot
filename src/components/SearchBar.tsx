import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div style={{ position: 'relative', width: '280px' }}>
      <Search
        size={14}
        style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-dim)',
          pointerEvents: 'none'
        }}
      />
      <input
        type="text"
        placeholder="Search player, alliance, (x,y)..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '6px 30px 6px 32px',
          fontSize: '0.8rem',
          outline: 'none'
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px'
          }}
          title="Clear search"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
};
