export type AssetType = 'WIND_TURBINE' | 'SOLAR_ARRAY';
export type AssetStatus = 'ONLINE' | 'ATTENTION' | 'MAINTENANCE' | 'OFFLINE';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  ratedPowerMw: number;
  location: string;
}