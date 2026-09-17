import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

import { AssetDetail } from './asset-detail';
import { Asset } from '../../models/asset.model';
import { AssetSummary } from '../../models/telemetry.model';

const asset: Asset = {
  id: 'WT-001',
  name: 'Turbina 01',
  type: 'WIND_TURBINE',
  ratedPowerMw: 3.2,
  location: 'Parque A',
  status: 'ONLINE',
};

const summary: AssetSummary = {
  assetId: 'WT-001',
  samples: 1,
  averagePowerMw: 2.8,
  maxTemperatureC: 90,
  warningAlerts: 0,
  criticalAlerts: 1,
};

describe('AssetDetail', () => {
  let component: AssetDetail;
  let fixture: ComponentFixture<AssetDetail>;
  let http: HttpTestingController;
  const c = (): any => component as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: (key: string) => (key === 'id' ? 'WT-001' : null) },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetDetail);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('monta asset, summary e telemetry em paralelo no sucesso', () => {
    fixture.detectChanges();

    const reqAsset = http.expectOne('/api/assets/WT-001');
    const reqSummary = http.expectOne('/api/assets/WT-001/summary');
    const reqTelemetry = http.expectOne('/api/assets/WT-001/telemetry');

    reqAsset.flush(asset);
    reqSummary.flush(summary);
    reqTelemetry.flush([]);
    fixture.detectChanges();

    http.expectOne('/api/alerts').flush([]);
    fixture.detectChanges();

    expect(c().status()).toBe('success');

    const title = fixture.nativeElement.querySelector('.asset-detail__title')?.textContent;
    expect(title).toContain('WT-001');
    expect(title).toContain('Turbina 01');
  });

  it('entra em estado de erro se qualquer chamada do forkJoin falhar', () => {
    fixture.detectChanges();

    http.expectOne('/api/assets/WT-001/telemetry').flush([]);
    http.expectOne('/api/assets/WT-001').flush(asset);
    // o erro na última request derruba o forkJoin (tudo-ou-nada)
    http.expectOne('/api/assets/WT-001/summary').error(new ProgressEvent('fail'));

    expect(c().status()).toBe('error');
    expect(c().errorMessage()).toContain('Não foi possível carregar');
  });
});