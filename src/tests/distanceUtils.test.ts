import { describe, it, expect } from 'vitest';
import {
  calculateGridDistance,
  recalculateDistances,
  filterGatheringRecords,
  searchGatheringRecords,
  sortGatheringRecords
} from '../services/distanceUtils';
import { NormalizedGatheringRecord } from '../types/gathering';

// TEST FIXTURES: Isolated mock data strictly for testing calculation and sorting algorithms
const MOCK_TEST_RECORDS: NormalizedGatheringRecord[] = [
  {
    id: 'test_node_508_779',
    playerId: 'p1',
    playerName: 'AlphaPlayer',
    allianceTag: '[ETE]',
    allianceName: 'EternalEmpire',
    allianceId: 'a1',
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
    source: 'Test Data',
    stratforgeMapUrl: 'https://test.map'
  },
  {
    id: 'test_node_747_715',
    playerId: 'p2',
    playerName: 'BravoPlayer',
    allianceTag: '[AMZ]',
    allianceName: 'Amazonia',
    allianceId: 'a2',
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
    source: 'Test Data',
    stratforgeMapUrl: 'https://test.map'
  },
  {
    id: 'test_node_842_1063',
    playerId: null,
    playerName: null,
    allianceTag: '[VNV]',
    allianceName: 'VNVNation',
    allianceId: 'a3',
    kingdomId: 1870,
    resourceType: 'Wood',
    resourceLevel: 4,
    resourceX: 842,
    resourceY: 1063,
    playerX: null,
    playerY: null,
    distance: 472.65,
    gatheringStatus: 'gathering',
    observedAt: '2026-10-24 00:00:00',
    capturedAtTimestamp: 1792783843261,
    source: 'Test Data',
    stratforgeMapUrl: 'https://test.map'
  },
  {
    id: 'test_node_870_558',
    playerId: 'p4',
    playerName: 'CharliePlayer',
    allianceTag: '[DZA]',
    allianceName: 'Algerien',
    allianceId: 'a4',
    kingdomId: 1870,
    resourceType: 'Stone',
    resourceLevel: 7,
    resourceX: 870,
    resourceY: 558,
    playerX: null,
    playerY: null,
    distance: 384.42,
    gatheringStatus: 'gathering',
    observedAt: '2026-10-24 00:00:00',
    capturedAtTimestamp: 1792783843261,
    source: 'Test Data',
    stratforgeMapUrl: 'https://test.map'
  }
];

describe('Distance Calculations & Edge Cases', () => {
  it('calculates exact Euclidean grid distance for default reference (520, 717)', () => {
    // Target (508, 779): dx = -12, dy = 62 -> sqrt(144 + 3844) = sqrt(3988) = 63.1506... -> 63.15
    const dist = calculateGridDistance(508, 779, 520, 717);
    expect(dist).toBe(63.15);
  });

  it('handles zero distance when target is exactly at reference point', () => {
    const dist = calculateGridDistance(520, 717, 520, 717);
    expect(dist).toBe(0);
  });

  it('handles missing, null, undefined, or NaN coordinates safely without returning NaN or Infinity', () => {
    expect(calculateGridDistance(null, 717, 520, 717)).toBe(0);
    expect(calculateGridDistance(520, undefined, 520, 717)).toBe(0);
    expect(calculateGridDistance(NaN, 717, 520, 717)).toBe(0);
    expect(calculateGridDistance(Infinity, 717, 520, 717)).toBe(0);
    expect(calculateGridDistance(520, 717, NaN, 717)).toBe(0);
  });

  it('recalculates distances when reference coordinates change', () => {
    // New origin at (0, 0)
    const recalculated = recalculateDistances(MOCK_TEST_RECORDS, { x: 0, y: 0 });
    // For (508, 779): sqrt(508^2 + 779^2) = sqrt(258064 + 606841) = sqrt(864905) = 930.00
    expect(recalculated[0].distance).toBe(930.0);
  });
});

describe('Sorting Functions', () => {
  it('sorts nearest to farthest (ascending)', () => {
    const sorted = sortGatheringRecords(MOCK_TEST_RECORDS, 'distance_asc');
    expect(sorted.map(r => r.distance)).toEqual([63.15, 227.01, 384.42, 472.65]);
  });

  it('sorts farthest to nearest (descending)', () => {
    const sorted = sortGatheringRecords(MOCK_TEST_RECORDS, 'distance_desc');
    expect(sorted.map(r => r.distance)).toEqual([472.65, 384.42, 227.01, 63.15]);
  });

  it('sorts by player / alliance name A-Z', () => {
    const sorted = sortGatheringRecords(MOCK_TEST_RECORDS, 'player_asc');
    expect(sorted[0].playerName).toBe('AlphaPlayer');
    expect(sorted[1].playerName).toBe('BravoPlayer');
    expect(sorted[2].playerName).toBe('CharliePlayer');
    expect(sorted[3].allianceTag).toBe('[VNV]'); // When playerName is null, falls back to allianceTag
  });

  it('sorts by resource type', () => {
    const sorted = sortGatheringRecords(MOCK_TEST_RECORDS, 'resource_type');
    const types = sorted.map(r => r.resourceType);
    expect(types).toEqual(['Bread', 'Iron', 'Stone', 'Wood']);
  });
});

describe('Filtering and Search', () => {
  it('filters by resource type correctly', () => {
    const breadOnly = filterGatheringRecords(MOCK_TEST_RECORDS, 'Bread');
    expect(breadOnly.length).toBe(1);
    expect(breadOnly[0].resourceType).toBe('Bread');

    const all = filterGatheringRecords(MOCK_TEST_RECORDS, 'All');
    expect(all.length).toBe(4);
  });

  it('searches by player name', () => {
    const res = searchGatheringRecords(MOCK_TEST_RECORDS, 'Alpha');
    expect(res.length).toBe(1);
    expect(res[0].playerName).toBe('AlphaPlayer');
  });

  it('searches by alliance tag', () => {
    const res = searchGatheringRecords(MOCK_TEST_RECORDS, 'AMZ');
    expect(res.length).toBe(1);
    expect(res[0].allianceTag).toBe('[AMZ]');
  });

  it('searches by coordinates', () => {
    const res = searchGatheringRecords(MOCK_TEST_RECORDS, '508,779');
    expect(res.length).toBe(1);
    expect(res[0].id).toBe('test_node_508_779');
  });
});
