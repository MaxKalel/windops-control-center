import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WindOpsApiService } from '../../services/windops-api.service';
import { DashboardOverview } from '../../models/dashboard.model';
import { AlertList } from '../alert-list/alert-list';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, AlertList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  protected readonly status = signal<LoadStatus>('idle');
  protected readonly overview = signal<DashboardOverview | null>(null);
  protected readonly errorMessage = signal('');

  constructor(private readonly api: WindOpsApiService) {}

  ngOnInit(): void {
    this.status.set('loading');
    this.api.getDashboardOverview().subscribe({
      next: (overview) => {
        this.overview.set(overview);
        this.status.set('success');
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar os KPIs do dashboard.');
        this.status.set('error');
      },
    });
  }
}