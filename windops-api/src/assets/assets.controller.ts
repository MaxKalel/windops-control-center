import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssetsService } from './assets.service.js';
import { TelemetryService } from './telemetry.service.js';
import { CreateTelemetryDto } from './dto/create-telemetry.dto.js';
import type { Asset } from '../domain/asset.interface.js';
import type { Telemetry } from '../domain/telemetry.interface.js';
import type { Alert } from '../domain/alert.interface.js';
import type { AssetSummary } from '../domain/asset-summary.interface.js';

@ApiTags('assets')
@Controller('assets')
export class AssetsController {
  constructor(
    private readonly assetsService: AssetsService,
    private readonly telemetryService: TelemetryService,
  ) {}

  @Get()
  findAll(): Asset[] {
    return this.assetsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Asset {
    return this.assetsService.findById(id);
  }

  @Get(':id/telemetry')
  findTelemetryByAsset(@Param('id') id: string): Telemetry[] {
    this.assetsService.findById(id);
    return this.telemetryService.findByAsset(id);
  }

  @Get(':id/summary')
  findSummaryByAsset(@Param('id') id: string): AssetSummary {
    this.assetsService.findById(id);
    return this.telemetryService.findSummaryByAsset(id);
  }

  @Post(':id/telemetry')
  createTelemetry(
    @Param('id') id: string,
    @Body() dto: CreateTelemetryDto,
  ): {
    telemetry: Telemetry;
    alert?: Alert;
  } {
    this.assetsService.findById(id);
    return this.telemetryService.create(id, dto);
  }
}