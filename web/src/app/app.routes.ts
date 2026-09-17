import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { AssetDetail } from './components/asset-detail/asset-detail';
import { AssetList } from './components/asset-list/asset-list';

export const routes: Routes = [
  { path: '', component: Dashboard, title: 'Dashboard — WindOps Control Center' },
  { path: 'assets', component: AssetList, title: 'Ativos — WindOps Control Center' },
  { path: 'assets/:id', component: AssetDetail, title: 'Detalhe do ativo — WindOps Control Center' },
];