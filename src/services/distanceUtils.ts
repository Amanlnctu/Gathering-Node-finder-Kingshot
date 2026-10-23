import { NormalizedGatheringRecord, ReferenceCoords, ResourceFilterType, SortOrderType } from '../types/gathering';

/**
 * Calculates Euclidean grid distance between a target resource coordinate and a reference coordinate.
 * Formula: sqrt((resourceX - refX)^2 + (resourceY - refY)^2)
 *
 * Game Grid Notes:
 * Kingshot uses a 2D integer cartesian grid (e.g. 0 to 1200+).
 * Marching time in-game is directly proportional to Euclidean grid distance (v = d / t),
 * rounded to the nearest coordinate unit.
 *
 * Missing or invalid coordinates safely default to 0 to prevent NaN or Infinity.
 */
export function calculateGridDistance(
  targetX: number | null | undefined,
  targetY: number | null | undefined,
  refX: number,
  refY: number
): number {
  if (
    targetX === null ||
    targetX === undefined ||
    isNaN(targetX) ||
    !isFinite(targetX) ||
    targetY === null ||
    targetY === undefined ||
    isNaN(targetY) ||
    !isFinite(targetY) ||
    isNaN(refX) ||
    !isFinite(refX) ||
    isNaN(refY) ||
    !isFinite(refY)
  ) {
    return 0;
  }

  const dx = targetX - refX;
  const dy = targetY - refY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (isNaN(distance) || !isFinite(distance)) {
    return 0;
  }

  return Math.round(distance * 100) / 100;
}

/**
 * Recalculates distance for an array of records given new reference coordinates.
 */
export function recalculateDistances(
  records: NormalizedGatheringRecord[],
  refCoords: ReferenceCoords
): NormalizedGatheringRecord[] {
  return records.map(record => ({
    ...record,
    distance: calculateGridDistance(record.resourceX, record.resourceY, refCoords.x, refCoords.y)
  }));
}

/**
 * Filters gathering records by resource type.
 */
export function filterGatheringRecords(
  records: NormalizedGatheringRecord[],
  filter: ResourceFilterType
): NormalizedGatheringRecord[] {
  if (filter === 'All') {
    return records;
  }
  return records.filter(r => r.resourceType.toLowerCase() === filter.toLowerCase());
}

/**
 * Searches gathering records by player name, alliance tag/name, player ID, or coordinates.
 */
export function searchGatheringRecords(
  records: NormalizedGatheringRecord[],
  query: string
): NormalizedGatheringRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return records;

  return records.filter(r => {
    const playerName = (r.playerName || '').toLowerCase();
    const allianceTag = (r.allianceTag || '').toLowerCase();
    const allianceName = (r.allianceName || '').toLowerCase();
    const playerId = (r.playerId || '').toLowerCase();
    const coordsStr = `${r.resourceX},${r.resourceY}`;
    const formattedCoords = `(${r.resourceX}, ${r.resourceY})`;

    return (
      playerName.includes(q) ||
      allianceTag.includes(q) ||
      allianceName.includes(q) ||
      playerId.includes(q) ||
      coordsStr.includes(q) ||
      formattedCoords.includes(q)
    );
  });
}

/**
 * Sorts gathering records by the specified sort order.
 */
export function sortGatheringRecords(
  records: NormalizedGatheringRecord[],
  order: SortOrderType
): NormalizedGatheringRecord[] {
  const sorted = [...records];

  switch (order) {
    case 'distance_asc':
      return sorted.sort((a, b) => a.distance - b.distance);
    case 'distance_desc':
      return sorted.sort((a, b) => b.distance - a.distance);
    case 'player_asc':
      return sorted.sort((a, b) => {
        const nameA = (a.playerName || a.allianceTag || '').replace(/^\[/, '');
        const nameB = (b.playerName || b.allianceTag || '').replace(/^\[/, '');
        return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
      });
    case 'resource_type':
      return sorted.sort((a, b) => {
        const comp = a.resourceType.localeCompare(b.resourceType);
        if (comp !== 0) return comp;
        return b.resourceLevel - a.resourceLevel;
      });
    case 'level_desc':
      return sorted.sort((a, b) => b.resourceLevel - a.resourceLevel || a.distance - b.distance);
    default:
      return sorted;
  }
}
