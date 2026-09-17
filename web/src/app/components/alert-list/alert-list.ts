import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WindOpsApiService } from '../../services/windops-api.service';
import { Alert } from '../../models/alert.model';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-alert-list',
  imports: [DatePipe],
  templateUrl: './alert-list.html',
  styleUrl: './alert-list.scss',
})
export class AlertList implements OnInit {
  @Input() assetId?: string;
  @Input() title = 'Alertas recentes';

  protected readonly status = signal<LoadStatus>('idle');
  protected readonly alerts = signal<Alert[]>([]);
  protected readonly errorMessage = signal('');

  protected readonly visibleAlerts = computed(() =>
    this.assetId
      ? this.alerts().filter((a) => a.assetId === this.assetId)
      : this.alerts(),
  );

  constructor(private readonly api: WindOpsApiService) {}

  ngOnInit(): void {
    this.status.set('loading');
    this.api.getAlerts().subscribe({
      next: (alerts) => {
        this.alerts.set(alerts);
        this.status.set('success');
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar os alertas.');
        this.status.set('error');
      },
    });
  }
}