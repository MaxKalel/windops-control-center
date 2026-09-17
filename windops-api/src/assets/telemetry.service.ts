import { Injectable } from '@nestjs/common';
import { Telemetry } from '../domain/telemetry.interface.js';
import { Alert } from '../domain/alert.interface.js';
import { AssetSummary } from '../domain/asset-summary.interface.js';
import { classifyTemperature } from '../domain/temperature-rule.js';
import { CreateTelemetryDto } from './dto/create-telemetry.dto.js';

interface Result {
  telemetry: Telemetry;
  alert?: Alert;
}

@Injectable()
export class TelemetryService {
  private readonly telemetryByAsset = new Map<string, Telemetry[]>();
  private readonly alerts: Alert[] = [];
  private nextAlertNumber = 1;

  create(assetId: string, dto: CreateTelemetryDto): Result {
    const reading: Telemetry = { assetId, ...dto };
    const list = this.telemetryByAsset.get(assetId) ?? [];
    list.push(reading);
    this.telemetryByAsset.set(assetId, list);

    const severity = classifyTemperature(reading.temperatureC);

    let alert: Alert | undefined;
    if (severity !== 'NORMAL') {
      const number = String(this.nextAlertNumber).padStart(3, '0');
      this.nextAlertNumber += 1;
      alert = {
        id: `AL-${number}`,
        assetId,
        severity,
        type: 'HIGH_TEMPERATURE',
        message:
          severity === 'WARNING'
            ? 'Temperatura acima do limite de atenção.'
            : 'Temperatura em nível crítico.',
        timestamp: reading.timestamp,
      };
      this.alerts.push(alert);
    }

    return { telemetry: reading, alert };
  }

  findAllAlerts(): Alert[] {
    return this.alerts;
  }

  findByAsset(assetId: string): Telemetry[] {
    return this.telemetryByAsset.get(assetId) ?? [];
  }

  findSummaryByAsset(assetId: string): AssetSummary {
    const readings = this.findByAsset(assetId);
    const assetAlerts = this.alerts.filter((a) => a.assetId === assetId);

    const samples = readings.length;
    const averagePowerMw =
      samples === 0
        ? null
        : readings.reduce((sum, r) => sum + r.powerMw, 0) / samples;
    const maxTemperatureC =
      samples === 0
        ? null
        : Math.max(...readings.map((r) => r.temperatureC));

    return {
      assetId,
      samples,
      averagePowerMw,
      maxTemperatureC,
      warningAlerts: assetAlerts.filter((a) => a.severity === 'WARNING').length,
      criticalAlerts: assetAlerts.filter(
        (a) => a.severity === 'CRITICAL',
      ).length,
    };
  }
}