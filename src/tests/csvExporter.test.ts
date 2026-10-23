import { describe, it, expect } from 'vitest';
import { escapeCsvField, exportGatheringRecordsToCsv } from '../services/csvExporter';
import { NormalizedGatheringRecord } from '../types/gathering';

describe('CSV Exporter Tests', () => {
  it('correctly escapes commas, quotes, and newlines in fields', () => {
    expect(escapeCsvField('Hello, World')).toBe('"Hello, World"');
    expect(escapeCsvField('Player "Pro" King')).toBe('"Player ""Pro"" King"');
    expect(escapeCsvField('Multi\nLine')).toBe('"Multi\nLine"');
    expect(escapeCsvField('SimpleText')).toBe('SimpleText');
    expect(escapeCsvField(1234)).toBe('1234');
    expect(escapeCsvField(null)).toBe('');
    expect(escapeCsvField(undefined)).toBe('');
  });

  it('exports normalized gathering records with proper headers and escaping', () => {
    const records: NormalizedGatheringRecord[] = [
      {
        id: 'k1870_node_508_779',
        playerId: '71906955',
        playerName: 'Lord, Commander',
        allianceTag: '[ETE]',
        allianceName: 'Eternal "Empire"',
        allianceId: '187900467',
        kingdomId: 1870,
        resourceType: 'Iron',
        resourceLevel: 7,
        resourceX: 508,
        resourceY: 779,
        playerX: null,
        playerY: null,
        distance: 63.15,
        gatheringStatus: 'gathering',
        observedAt: '2026-10-24 00:00:00',
        capturedAtTimestamp: 1792783843261,
        source: 'StratForge Map (Kid: 1870)',
        stratforgeMapUrl: 'https://stratforge.tools/dashboard/kingshot/tools/kingdom-map?kid=1870&c=508,779,1.5&layers=marches'
      }
    ];

    const csv = exportGatheringRecordsToCsv(records);

    // Verify UTF-8 BOM
    expect(csv.startsWith('\uFEFF')).toBe(true);

    // Verify headers
    expect(csv).toContain('Player Name,Player ID,Alliance Tag,Alliance Name,Kingdom ID,Resource Type,Resource Level,Resource X,Resource Y,Distance from Reference,Gathering Status,Observation Timestamp,Data Source Identifier,StratForge Map Link');

    // Verify escaped row
    expect(csv).toContain('"Lord, Commander"');
    expect(csv).toContain('"Eternal ""Empire"""');
    expect(csv).toContain('63.15');
    expect(csv).toContain('gathering');
  });

  it('ensures no sensitive cookies, headers, or private session information exist in output', () => {
    const records: NormalizedGatheringRecord[] = [
      {
        id: 'k1870_node_508_779',
        playerId: null,
        playerName: null,
        allianceTag: '[AMZ]',
        allianceName: 'Amazonia',
        allianceId: '100',
        kingdomId: 1870,
        resourceType: 'Bread',
        resourceLevel: 8,
        resourceX: 747,
        resourceY: 715,
        playerX: null,
        playerY: null,
        distance: 227.01,
        gatheringStatus: 'gathering',
        observedAt: '2026-10-24 00:00:00',
        capturedAtTimestamp: 1792783843261,
        source: 'StratForge Map (Kid: 1870)',
        stratforgeMapUrl: 'https://stratforge.tools/map'
      }
    ];

    const csv = exportGatheringRecordsToCsv(records);

    expect(csv).not.toContain('Cookie');
    expect(csv).not.toContain('session_token');
    expect(csv).not.toContain('Bearer');
    expect(csv).not.toContain('Authorization');
  });
});
