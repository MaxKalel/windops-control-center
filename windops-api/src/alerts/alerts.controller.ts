import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TelemetryService } from '../assets/telemetry.service.js';
import type { Alert } from '../domain/alert.interface.js';

@ApiTags('alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get()
  findAll(): Alert[] {
    return this.telemetryService.findAllAlerts();
  }
}