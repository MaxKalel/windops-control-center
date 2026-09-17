export interface Telemetry {
  assetId: string;
  powerMw: number;
  windSpeedMs?: number;
  temperatureC: number;
  timestamp: string;
}