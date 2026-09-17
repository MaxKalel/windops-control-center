import { Injectable } from '@nestjs/common';
import { AssetsService } from '../assets/assets.service.js';
import { TelemetryService } from '../assets/telemetry.service.js';
import type { DashboardOverview } from '../domain/dashboard-overview.interface.js';

@Injectable()
export class DashboardService {
  constructor(
    private readonly assetsService: AssetsService,
    private readonly telemetryService: TelemetryService,
  ) {}

  getOverview(): DashboardOverview {
    const assets = this.assetsService.findAll();
    const alerts = this.telemetryService.findAllAlerts();

    const countByStatus = (status: string) =>
      assets.filter((a) => a.status === status).length;

    return {
      totalAssets: assets.length,
      onlineAssets: countByStatus('ONLINE'),
      attentionAssets: countByStatus('ATTENTION'),
      maintenanceAssets: countByStatus('MAINTENANCE'),
      criticalAlerts: alerts.filter((a) => a.severity === 'CRITICAL').length,
      totalAlerts: alerts.length,
    };
  }
}