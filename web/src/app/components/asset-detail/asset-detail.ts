import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { WindOpsApiService } from '../../services/windops-api.service';
import { Asset } from '../../models/asset.model';
import { AssetSummary, Telemetry } from '../../models/telemetry.model';
import { TelemetryForm } from '../telemetry-form/telemetry-form';
import { AlertList } from '../alert-list/alert-list';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-asset-detail',
  imports: [RouterLink, DatePipe, TelemetryForm, AlertList],
  templateUrl: './asset-detail.html',
  styleUrl: './asset-detail.scss',
})
export class AssetDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(WindOpsApiService);

  protected readonly status = signal<LoadStatus>('idle');
  protected readonly asset = signal<Asset | null>(null);
  protected readonly summary = signal<AssetSummary | null>(null);
  protected readonly telemetry = signal<Telemetry[]>([]);
  protected readonly errorMessage = signal('');
  protected assetId = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('Identificador do ativo não informado.');
      this.status.set('error');
      return;
    }

    this.assetId = id;
    this.loadData();
  }

  protected onSaved(): void {
    this.loadData();
  }

  private loadData(): void {
    this.status.set('loading');
    forkJoin({
      asset: this.api.getAsset(this.assetId),
      summary: this.api.getSummary(this.assetId),
      telemetry: this.api.getTelemetry(this.assetId),
    }).subscribe({
      next: ({ asset, summary, telemetry }) => {
        this.asset.set(asset);
        this.summary.set(summary);
        this.telemetry.set(telemetry);
        this.status.set('success');
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar o detalhe do ativo.');
        this.status.set('error');
      },
    });
  }
}