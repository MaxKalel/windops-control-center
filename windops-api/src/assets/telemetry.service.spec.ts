import { describe, expect, it } from 'vitest';
import { TelemetryService } from './telemetry.service.js';
import { CreateTelemetryDto } from './dto/create-telemetry.dto.js';

function dto(powerMw: number, temperatureC: number): CreateTelemetryDto {
  const item = new CreateTelemetryDto();
  item.powerMw = powerMw;
  item.temperatureC = temperatureC;
  item.timestamp = '2026-09-13T12:00:00.000Z';
  return item;
}

describe('TelemetryService', () => {
  describe('findSummaryByAsset', () => {
    it('calcula média, máximo e contagens com dados', () => {
      const service = new TelemetryService();
      service.create('WT-001', dto(2.5, 80));
      service.create('WT-001', dto(2.8, 90));

      const summary = service.findSummaryByAsset('WT-001');

      expect(summary.samples).toBe(2);
      expect(summary.averagePowerMw).toBe(2.65);
      expect(summary.maxTemperatureC).toBe(90);
      expect(summary.warningAlerts).toBe(1);
      expect(summary.criticalAlerts).toBe(1);
    });

    it('retorna null para métricas sem amostras', () => {
      const service = new TelemetryService();

      const summary = service.findSummaryByAsset('PV-001');

      expect(summary.samples).toBe(0);
      expect(summary.averagePowerMw).toBeNull();
      expect(summary.maxTemperatureC).toBeNull();
      expect(summary.warningAlerts).toBe(0);
      expect(summary.criticalAlerts).toBe(0);
    });
  });

  describe('create', () => {
    it('gera alerta WARNING em 80 e CRITICAL em 90', () => {
      const service = new TelemetryService();

      const warning = service.create('WT-001', dto(2.5, 80));
      const critical = service.create('WT-001', dto(2.8, 90));

      expect(warning.alert?.severity).toBe('WARNING');
      expect(critical.alert?.severity).toBe('CRITICAL');
    });

    it('não gera alerta em NORMAL', () => {
      const service = new TelemetryService();

      const result = service.create('WT-001', dto(2.0, 70));

      expect(result.alert).toBeUndefined();
    });
  });
});