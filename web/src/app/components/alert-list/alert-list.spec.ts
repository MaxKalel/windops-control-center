import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AlertList } from './alert-list';
import { Alert } from '../../models/alert.model';

function alert(id: string, assetId: string, severity: 'WARNING' | 'CRITICAL'): Alert {
  return {
    id,
    assetId,
    severity,
    type: 'HIGH_TEMPERATURE',
    message: 'Temperatura elevada.',
    timestamp: '2026-09-16T12:00:00.000Z',
  };
}

describe('AlertList', () => {
  let component: AlertList;
  let fixture: ComponentFixture<AlertList>;
  let http: HttpTestingController;
  const c = (): any => component as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertList],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertList);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('mostra só os alertas do ativo quando assetId é informado', () => {
    component.assetId = 'WT-001';
    fixture.detectChanges();

    const req = http.expectOne('/api/alerts');
    req.flush([
      alert('AL-001', 'WT-001', 'CRITICAL'),
      alert('AL-002', 'PV-001', 'WARNING'),
    ]);

    expect(c().visibleAlerts().length).toBe(1);
    expect(c().visibleAlerts()[0].id).toBe('AL-001');
  });

  it('mostra todos os alertas quando assetId não é informado', () => {
    fixture.detectChanges();

    const req = http.expectOne('/api/alerts');
    req.flush([
      alert('AL-001', 'WT-001', 'CRITICAL'),
      alert('AL-002', 'PV-001', 'WARNING'),
    ]);

    expect(c().visibleAlerts().length).toBe(2);
  });

  it('entra em estado de erro quando a busca falha', () => {
    fixture.detectChanges();

    const req = http.expectOne('/api/alerts');
    req.error(new ProgressEvent('network error'));

    expect(c().status()).toBe('error');
    expect(c().errorMessage()).toContain('Não foi possível carregar');
  });
});