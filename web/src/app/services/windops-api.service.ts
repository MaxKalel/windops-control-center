import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asset } from '../models/asset.model';
import { Telemetry, AssetSummary } from '../models/telemetry.model';
import { DashboardOverview } from '../models/dashboard.model';
import { Alert } from '../models/alert.model';

export interface HealthResponse {
  status: string;
}

export interface CreateTelemetryDto {
  powerMw: number;
  windSpeedMs?: number;
  temperatureC: number;
  timestamp: string;
}

export interface CreateTelemetryResult {
  telemetry: Telemetry;
  alert?: {
    id: string;
    assetId: string;
    severity: string;
    type: string;
    message: string;
    timestamp: string;
  };
}

@Injectable({ providedIn: 'root' })
export class WindOpsApiService {
  private readonly baseUrl = '/api';

  constructor(private readonly http: HttpClient) {}

  health(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.baseUrl}/health`);
  }

  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.baseUrl}/assets`);
  }

  getAsset(id: string): Observable<Asset> {
    return this.http.get<Asset>(`${this.baseUrl}/assets/${id}`);
  }

  getTelemetry(id: string): Observable<Telemetry[]> {
    return this.http.get<Telemetry[]>(`${this.baseUrl}/assets/${id}/telemetry`);
  }

  getSummary(id: string): Observable<AssetSummary> {
    return this.http.get<AssetSummary>(`${this.baseUrl}/assets/${id}/summary`);
  }

  getDashboardOverview(): Observable<DashboardOverview> {
    return this.http.get<DashboardOverview>(`${this.baseUrl}/dashboard/overview`);
  }

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.baseUrl}/alerts`);
  }

  createTelemetry(
    id: string,
    dto: CreateTelemetryDto,
  ): Observable<CreateTelemetryResult> {
    return this.http.post<CreateTelemetryResult>(
      `${this.baseUrl}/assets/${id}/telemetry`,
      dto,
    );
  }
}