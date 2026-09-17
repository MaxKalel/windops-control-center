import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WindOpsApiService } from './windops-api.service';

describe('WindOpsApiService', () => {
  let service: WindOpsApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WindOpsApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('health busca GET em /api/health', () => {
    service.health().subscribe();
    const req = http.expectOne('/api/health');
    expect(req.request.method).toBe('GET');
    req.flush({ status: 'ok' });
  });

  it('getAssets busca GET em /api/assets', () => {
    service.getAssets().subscribe();
    const req = http.expectOne('/api/assets');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getAsset monta a URL com o id', () => {
    service.getAsset('WT-001').subscribe();
    const req = http.expectOne('/api/assets/WT-001');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('getTelemetry monta a URL com o id', () => {
    service.getTelemetry('WT-001').subscribe();
    const req = http.expectOne('/api/assets/WT-001/telemetry');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getSummary monta a URL com o id', () => {
    service.getSummary('WT-001').subscribe();
    const req = http.expectOne('/api/assets/WT-001/summary');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('getDashboardOverview busca GET em /api/dashboard/overview', () => {
    service.getDashboardOverview().subscribe();
    const req = http.expectOne('/api/dashboard/overview');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('getAlerts busca GET em /api/alerts', () => {
    service.getAlerts().subscribe();
    const req = http.expectOne('/api/alerts');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('createTelemetry faz POST com o DTO na URL do ativo', () => {
    const dto = {
      powerMw: 2.5,
      temperatureC: 90,
      timestamp: '2026-09-16T12:00:00.000Z',
    };

    service.createTelemetry('WT-001', dto).subscribe();

    const req = http.expectOne('/api/assets/WT-001/telemetry');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush({ telemetry: { ...dto, assetId: 'WT-001' } });
  });
});