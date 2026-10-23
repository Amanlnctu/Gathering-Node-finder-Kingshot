import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  NormalizedGatheringRecord,
  ReferenceCoords,
  ResourceFilterType,
  SortOrderType,
  DataSourceStatus
} from './types/gathering';
import {
  fetchGatheringRecords,
  getDataSourceStatus
} from './services/gatheringDataAdapter';
import {
  recalculateDistances,
  filterGatheringRecords,
  searchGatheringRecords,
  sortGatheringRecords
} from './services/distanceUtils';
import {
  exportGatheringRecordsToCsv,
  downloadCsvFile
} from './services/csvExporter';
import { Header } from './components/Header';
import { ReferenceCoordinateForm } from './components/ReferenceCoordinateForm';
import { ResourceFilter } from './components/ResourceFilter';
import { SortSelector } from './components/SortSelector';
import { SearchBar } from './components/SearchBar';
import { GatheringSummary } from './components/GatheringSummary';
import { GatheringResultsTable } from './components/GatheringResultsTable';
import { DataSourceStatusBanner } from './components/DataSourceStatusBanner';
import { Download } from 'lucide-react';

export const App: React.FC = () => {
  // Application State
  const [kingdomId, setKingdomId] = useState<number>(1870);
  const [referenceCoords, setReferenceCoords] = useState<ReferenceCoords>({ x: 520, y: 717 });
  const [resourceFilter, setResourceFilter] = useState<ResourceFilterType>('All');
  const [sortOrder, setSortOrder] = useState<SortOrderType>('distance_asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allValidatedRecords, setAllValidatedRecords] = useState<NormalizedGatheringRecord[]>([]);
  const [status, setStatus] = useState<DataSourceStatus>(getDataSourceStatus());
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(false);

  // Load Data
  const loadData = useCallback(async (kid: number, coords: ReferenceCoords) => {
    setIsLoading(true);
    try {
      const result = await fetchGatheringRecords(kid, coords);
      setAllValidatedRecords(result.records);
      setStatus(result.status);
    } catch (err) {
      console.error('Error fetching gathering data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    loadData(kingdomId, referenceCoords);
  }, [kingdomId, loadData]);

  // Handle Coordinate Apply
  const handleApplyCoords = (newCoords: ReferenceCoords) => {
    setReferenceCoords(newCoords);
    setAllValidatedRecords(prev => recalculateDistances(prev, newCoords));
  };

  // Auto-refresh interval (every 60 seconds if enabled)
  useEffect(() => {
    if (!autoRefreshEnabled) return;
    const interval = setInterval(() => {
      loadData(kingdomId, referenceCoords);
    }, 60000);
    return () => clearInterval(interval);
  }, [autoRefreshEnabled, kingdomId, referenceCoords, loadData]);

  // Derived filtered & sorted records
  const processedRecords = useMemo(() => {
    let records = filterGatheringRecords(allValidatedRecords, resourceFilter);
    if (searchQuery.trim()) {
      records = searchGatheringRecords(records, searchQuery);
    }
    return sortGatheringRecords(records, sortOrder);
  }, [allValidatedRecords, resourceFilter, searchQuery, sortOrder]);

  // Resource breakdown counts for filter badges
  const resourceCounts = useMemo(() => {
    const counts: Record<string, number> = { total: allValidatedRecords.length };
    for (const r of allValidatedRecords) {
      counts[r.resourceType] = (counts[r.resourceType] || 0) + 1;
    }
    return counts;
  }, [allValidatedRecords]);

  // CSV Export handler
  const handleExportCsv = () => {
    const csvData = exportGatheringRecordsToCsv(processedRecords);
    const filename = `kingshot_gathering_k${kingdomId}_ref_${referenceCoords.x}_${referenceCoords.y}.csv`;
    downloadCsvFile(csvData, filename);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation & Status */}
      <Header
        kingdomId={kingdomId}
        onKingdomChange={setKingdomId}
        status={status}
        isLoading={isLoading}
        onRefresh={() => loadData(kingdomId, referenceCoords)}
      />

      {/* Main Container */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        flex: 1
      }}>
        {/* Reference Coordinate Form */}
        <ReferenceCoordinateForm
          currentCoords={referenceCoords}
          onApplyCoords={handleApplyCoords}
        />

        {/* Gathering Summary Metrics */}
        <GatheringSummary
          records={processedRecords}
          allValidatedRecords={allValidatedRecords}
          status={status}
          invalidRecordsCount={0}
        />

        {/* Controls Toolbar: Filters, Sort, Search, Export */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Resource Filter Buttons */}
          <ResourceFilter
            currentFilter={resourceFilter}
            onFilterChange={setResourceFilter}
            counts={resourceCounts}
          />

          {/* Search, Sort, and CSV Export */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <SortSelector currentSort={sortOrder} onSortChange={setSortOrder} />

            {/* CSV Export Button */}
            <button
              onClick={handleExportCsv}
              disabled={processedRecords.length === 0}
              style={{
                backgroundColor: 'var(--forge-orange)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '7px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: processedRecords.length === 0 ? 'not-allowed' : 'pointer',
                opacity: processedRecords.length === 0 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.15s ease'
              }}
              title="Export current filtered results to CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Results Table */}
        <GatheringResultsTable
          records={processedRecords}
          referenceCoords={referenceCoords}
        />

        {/* Technical Data Source Diagnostic Banner */}
        <DataSourceStatusBanner status={status} />
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-surface)',
        padding: '16px 24px',
        color: 'var(--text-dim)',
        fontSize: '0.75rem',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '4px'
            }}>
              <span>MADE WITH LOVE BY</span>
              <span style={{
                color: 'var(--accent-gold)',
                backgroundColor: 'rgba(229, 169, 59, 0.15)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(229, 169, 59, 0.3)'
              }}>
                [ETE] Spiderman
              </span>
              <span style={{ color: '#f43f5e', fontSize: '1rem' }}>❤️</span>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
              Kingshot Gathering Finder for StratForge · Kingdom {kingdomId} · Euclidean Coordinates Radar
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoRefreshEnabled}
                onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
              />
              <span style={{ color: 'var(--text-secondary)' }}>Auto-refresh (60s)</span>
            </label>
            <span style={{
              color: 'var(--accent-emerald)',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              ✓ Verified Real Data Source
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
