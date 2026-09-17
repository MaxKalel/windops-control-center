import type { TemperatureSeverity } from './temperature-rule.js';

export interface Alert {
  id: string;
  assetId: string;
  severity: TemperatureSeverity;
  type: string;
  message: string;
  timestamp: string;
}