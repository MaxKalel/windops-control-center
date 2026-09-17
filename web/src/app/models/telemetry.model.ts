export interface Telemetry {
  assetId: string;
  powerMw: number;
  windSpeedMs?: number;
  temperatureC: number;
  timestamp: string;
}

export interface AssetSummary {
  assetId: string;
  samples: number;
  averagePowerMw: number | null;
  maxTemperatureC: number | null;
  warningAlerts: number;
  criticalAlerts: number;
}