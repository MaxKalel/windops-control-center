import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller.js';
import { AssetsService } from './assets.service.js';
import { TelemetryService } from './telemetry.service.js';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService, TelemetryService],
  exports: [AssetsService, TelemetryService],
})
export class AssetsModule {}