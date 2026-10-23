export interface RawStratforgeAlliance {
  aid: string;
  abbr: string;
  name: string;
  members: number;
  power: number;
}

export interface RawStratforgePresence {
  x: number;
  y: number;
  kind: 'gather' | 'camp' | string;
  allianceIdx: number;
  resource: number; // 0: Unknown, 1: Bread, 2: Wood, 3: Stone, 4: Iron
  level: number;
  name?: string;
}

export interface RawStratforgePacked {
  kid: number;
  capturedAt: number;
  pro: boolean;
  alliances: RawStratforgeAlliance[];
  presence: RawStratforgePresence[];
  cities?: number[];
  names?: string;
}

export interface NormalizedGatheringRecord {
  id: string; // Stable record identifier for deduplication
  playerId: string | null;
  playerName: string | null;
  allianceTag: string | null;
  allianceName: string | null;
  allianceId: string | null;
  kingdomId: number;
  resourceType: 'Bread' | 'Wood' | 'Stone' | 'Iron' | 'Unknown';
  resourceLevel: number;
  resourceX: number;
  resourceY: number;
  playerX: number | null;
  playerY: number | null;
  distance: number;
  gatheringStatus: string;
  observedAt: string | null;
  capturedAtTimestamp: number | null;
  source: string;
  stratforgeMapUrl: string;
}

export type ResourceFilterType = 'All' | 'Bread' | 'Wood' | 'Stone' | 'Iron';

export type SortOrderType =
  | 'distance_asc'
  | 'distance_desc'
  | 'player_asc'
  | 'resource_type'
  | 'level_desc';

export interface ReferenceCoords {
  x: number;
  y: number;
}

export interface DataSourceStatus {
  connected: boolean;
  sourceName: string;
  isPro: boolean;
  kingdomId: number;
  capturedAt: number | null;
  observedAtStr: string | null;
  isStale: boolean;
  isLive: boolean;
  error?: string | null;
  limitationNotice?: string | null;
}
