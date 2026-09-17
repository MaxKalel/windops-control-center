import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { WindOpsApiService } from '../../services/windops-api.service';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-telemetry-form',
  imports: [ReactiveFormsModule],
  templateUrl: './telemetry-form.html',
  styleUrl: './telemetry-form.scss',
})
export class TelemetryForm {
  @Input() assetId = '';
  @Output() saved = new EventEmitter<void>();

  protected readonly form: FormGroup;
  protected readonly submitStatus = signal<SubmitStatus>('idle');
  protected readonly errorMessage = signal('');

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: WindOpsApiService,
  ) {
    this.form = this.fb.group({
      powerMw: [null, [Validators.required, Validators.min(0)]],
      windSpeedMs: [null, [Validators.min(0)]],
      temperatureC: [null, [Validators.required]],
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const { powerMw, windSpeedMs, temperatureC } = this.form.value;

    this.submitStatus.set('submitting');
    this.errorMessage.set('');

    this.api
      .createTelemetry(this.assetId, {
        powerMw,
        windSpeedMs: windSpeedMs ?? undefined,
        temperatureC,
        timestamp: new Date().toISOString(),
      })
      .subscribe({
        next: () => {
          this.form.reset();
          this.submitStatus.set('success');
          this.saved.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.submitStatus.set('error');
          if (err.status === 400) {
            this.errorMessage.set('Dados inválidos. Confira os valores enviados.');
          } else if (err.status === 404) {
            this.errorMessage.set('Ativo não encontrado.');
          } else {
            this.errorMessage.set('Não foi possível enviar a leitura.');
          }
        },
      });
  }
}