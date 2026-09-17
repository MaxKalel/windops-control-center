import { Component, OnInit, signal } from '@angular/core';
import { WindOpsApiService } from '../../services/windops-api.service';

type ApiHealthState = 'idle' | 'loading' | 'online' | 'offline';

@Component({
  selector: 'app-api-status',
  templateUrl: './api-status.html',
  styleUrl: './api-status.scss',
})
export class ApiStatus implements OnInit {
  protected readonly state = signal<ApiHealthState>('idle');

  constructor(private readonly api: WindOpsApiService) {}

  ngOnInit(): void {
    this.state.set('loading');
    this.api.health().subscribe({
      next: () => this.state.set('online'),
      error: () => this.state.set('offline'),
    });
  }
}