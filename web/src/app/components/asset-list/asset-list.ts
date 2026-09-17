import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WindOpsApiService } from '../../services/windops-api.service';
import { Asset } from '../../models/asset.model';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-asset-list',
  imports: [RouterLink],
  templateUrl: './asset-list.html',
  styleUrl: './asset-list.scss',
})
export class AssetList implements OnInit {
  protected readonly status = signal<LoadStatus>('idle');
  protected readonly assets = signal<Asset[]>([]);
  protected readonly errorMessage = signal('');

  constructor(private readonly api: WindOpsApiService) {}

  ngOnInit(): void {
    this.status.set('loading');
    this.api.getAssets().subscribe({
      next: (assets) => {
        this.assets.set(assets);
        this.status.set('success');
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar os ativos.');
        this.status.set('error');
      },
    });
  }
}