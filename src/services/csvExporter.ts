import { NormalizedGatheringRecord } from '../types/gathering';

/**
 * Escapes a field for safe CSV output:
 * - Replaces double quotes with two double quotes ("")
 * - Encloses strings containing commas, quotes, or newlines in double quotes
 * - Handles null or undefined values
 */
export function escapeCsvField(val: string | number | null | undefined): string {
  if (val === null || val === undefined) {
    return '';
  }
  const str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converts an array of NormalizedGatheringRecord to a valid CSV string.
 * Strictly avoids exporting any sensitive headers, cookies, or secrets.
 */
export function exportGatheringRecordsToCsv(records: NormalizedGatheringRecord[]): string {
  const headers = [
    'Player Name',
    'Player ID',
    'Alliance Tag',
    'Alliance Name',
    'Kingdom ID',
    'Resource Type',
    'Resource Level',
    'Resource X',
    'Resource Y',
    'Distance from Reference',
    'Gathering Status',
    'Observation Timestamp',
    'Data Source Identifier',
    'StratForge Map Link'
  ];

  const rows = records.map(r => [
    escapeCsvField(r.playerName || '(Unrevealed)'),
    escapeCsvField(r.playerId || ''),
    escapeCsvField(r.allianceTag || ''),
    escapeCsvField(r.allianceName || ''),
    escapeCsvField(r.kingdomId),
    escapeCsvField(r.resourceType),
    escapeCsvField(r.resourceLevel),
    escapeCsvField(r.resourceX),
    escapeCsvField(r.resourceY),
    escapeCsvField(r.distance.toFixed(2)),
    escapeCsvField(r.gatheringStatus),
    escapeCsvField(r.observedAt || ''),
    escapeCsvField(r.source),
    escapeCsvField(r.stratforgeMapUrl)
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\r\n');

  return '\uFEFF' + csvContent; // Add UTF-8 BOM for accurate opening in Excel
}

/**
 * Triggers a browser file download for the CSV data.
 */
export function downloadCsvFile(csvContent: string, filename: string = 'kingshot_gathering_records_1870.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
