import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TelemetryForm } from './telemetry-form';

describe('TelemetryForm', () => {
  let component: TelemetryForm;
  let fixture: ComponentFixture<TelemetryForm>;
  let http: HttpTestingController;
  const c = (): any => component as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelemetryForm],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TelemetryForm);
    component = fixture.componentInstance;
    component.assetId = 'WT-001';
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function submitValidForm(): void {
    c().form.setValue({
      powerMw: 2.5,
      windSpeedMs: 10,
      temperatureC: 80,
    });
    c().onSubmit();
  }

  it('não envia quando o form é inválido', () => {
    const saved = vi.fn();
    component.saved.subscribe(saved);

    c().form.setValue({ powerMw: -5, windSpeedMs: null, temperatureC: 80 });
    c().onSubmit();

    http.expectNone('/api/assets/WT-001/telemetry');
    expect(c().submitStatus()).toBe('idle');
    expect(saved).not.toHaveBeenCalled();
  });

  it('envia 90°C e emite saved no sucesso', () => {
    const saved = vi.fn();
    component.saved.subscribe(saved);

    c().form.setValue({
      powerMw: 2.8,
      windSpeedMs: 10,
      temperatureC: 90,
    });
    c().onSubmit();

    const req = http.expectOne('/api/assets/WT-001/telemetry');
    expect(req.request.method).toBe('POST');
    expect(req.request.body?.temperatureC).toBe(90);
    expect(c().submitStatus()).toBe('submitting');

    req.flush({
      telemetry: { powerMw: 2.8, temperatureC: 90 },
      alert: { id: 'AL-001' },
    });

    expect(c().submitStatus()).toBe('success');
    expect(saved).toHaveBeenCalledTimes(1);
  });

  it('trata 400 como dados inválidos', () => {
    c().form.setValue({
      powerMw: 2.5,
      windSpeedMs: 10,
      temperatureC: 80,
    });
    c().onSubmit();

    const req = http.expectOne('/api/assets/WT-001/telemetry');
    req.flush({ message: 'validation failed' }, { status: 400, statusText: 'Bad Request' });

    expect(c().submitStatus()).toBe('error');
    expect(c().errorMessage()).toContain('Dados inválidos');
  });

  it('trata 404 como ativo não encontrado', () => {
    submitValidForm();

    const req = http.expectOne('/api/assets/WT-001/telemetry');
    req.flush({ message: 'not found' }, { status: 404, statusText: 'Not Found' });

    expect(c().submitStatus()).toBe('error');
    expect(c().errorMessage()).toContain('Ativo não encontrado');
  });

  it('trata erros de rede como falha genérica', () => {
    submitValidForm();

    const req = http.expectOne('/api/assets/WT-001/telemetry');
    req.error(new ProgressEvent('network error'));

    expect(c().submitStatus()).toBe('error');
    expect(c().errorMessage()).toContain('Não foi possível enviar');
  });
});