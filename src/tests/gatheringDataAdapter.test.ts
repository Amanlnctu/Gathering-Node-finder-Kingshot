import { describe, it, expect } from 'vitest';
import {
  isGatheringPresence,
  normalizeGatheringRecord,
  validateGatheringRecord,
  deduplicateGatheringRecords,
  parsePackedData
} from '../services/gatheringDataAdapter';
import { RawStratforgePacked, RawStratforgePresence, RawStratforgeAlliance } from '../types/gathering';

describe('Gathering Data Adapter Tests', () => {
  const MOCK_ALLIANCES: RawStratforgeAlliance[] = [
    { aid: '101', abbr: 'AMZ', name: 'Amazonia', members: 98, power: 0 },
    { aid: '102', abbr: 'ETE', name: 'EternalEmpire', members: 88, power: 0 }
  ];

  it('correctly distinguishes active gathering troops from parked camps', () => {
    const gatheringTroop: RawStratforgePresence = {
      x: 508,
      y: 779,
      kind: 'gather',
      allianceIdx: 2,
      resource: 4,
      level: 7,
      name: ''
    };

    const parkedCamp: RawStratforgePresence = {
      x: 145,
      y: 434,
      kind: 'camp',
      allianceIdx: 1,
      resource: 0,
      level: 0,
      name: ''
    };

    expect(isGatheringPresence(gatheringTroop)).toBe(true);
    expect(isGatheringPresence(parkedCamp)).toBe(false);
  });

  it('rejects malformed records missing x or y coordinates', () => {
    // @ts-expect-error testing invalid input
    expect(isGatheringPresence({ kind: 'gather', x: null, y: 779 })).toBe(false);
    // @ts-expect-error testing invalid input
    expect(isGatheringPresence({ kind: 'gather', x: 508, y: NaN })).toBe(false);
    // @ts-expect-error testing invalid input
    expect(isGatheringPresence(null)).toBe(false);
  });

  it('normalizes valid raw record with proper alliance and resource mapping', () => {
    const raw: RawStratforgePresence = {
      x: 508,
      y: 779,
      kind: 'gather',
      allianceIdx: 2,
      resource: 4, // 4 = Iron
      level: 7,
      name: ''
    };

    const record = normalizeGatheringRecord(raw, MOCK_ALLIANCES, 1792783843261, 1870, { x: 520, y: 717 });
    expect(record).not.toBeNull();
    expect(record!.resourceType).toBe('Iron');
    expect(record!.resourceLevel).toBe(7);
    expect(record!.allianceTag).toBe('[ETE]');
    expect(record!.allianceName).toBe('EternalEmpire');
    expect(record!.distance).toBe(63.15);
    expect(record!.stratforgeMapUrl).toContain('kid=1870&c=508,779,1.5&layers=marches');
  });

  it('deduplicates duplicate coordinates for the same node', () => {
    const rawList: RawStratforgePresence[] = [
      { x: 508, y: 779, kind: 'gather', allianceIdx: 2, resource: 4, level: 7, name: '' },
      { x: 508, y: 779, kind: 'gather', allianceIdx: 2, resource: 4, level: 7, name: '' }, // Duplicate
      { x: 747, y: 715, kind: 'gather', allianceIdx: 1, resource: 1, level: 8, name: '' }
    ];

    const packed: RawStratforgePacked = {
      kid: 1870,
      capturedAt: 1792783843261,
      pro: false,
      alliances: MOCK_ALLIANCES,
      presence: rawList
    };

    const normalized = parsePackedData(packed);
    expect(normalized.length).toBe(2);
    expect(normalized[0].id).toBe('k1870_node_508_779');
    expect(normalized[1].id).toBe('k1870_node_747_715');

    // Direct deduplication test
    const reDeduplicated = deduplicateGatheringRecords([...normalized, normalized[0]]);
    expect(reDeduplicated.length).toBe(2);
  });

  it('handles empty presence gracefully', () => {
    const packed: RawStratforgePacked = {
      kid: 1870,
      capturedAt: 1792783843261,
      pro: false,
      alliances: MOCK_ALLIANCES,
      presence: []
    };

    const normalized = parsePackedData(packed);
    expect(normalized).toEqual([]);
  });

  it('validates normalized records accurately', () => {
    const valid = normalizeGatheringRecord(
      { x: 508, y: 779, kind: 'gather', allianceIdx: 2, resource: 4, level: 7, name: '' },
      MOCK_ALLIANCES,
      1792783843261,
      1870
    );
    expect(validateGatheringRecord(valid!)).toBe(true);

    // Invalid record with missing kingdom or coords
    // @ts-expect-error testing invalid record
    expect(validateGatheringRecord({ kingdomId: 0, resourceX: 100 })).toBe(false);
  });
});
