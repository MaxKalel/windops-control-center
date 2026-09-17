export type AlertSeverity = 'NORMAL' | 'WARNING' | 'CRITICAL';

export interface Alert {
  id: string;
  assetId: string;
  severity: AlertSeverity;
  type: string;
  message: string;
  timestamp: string;
}