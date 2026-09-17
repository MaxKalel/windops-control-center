import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';
import { AssetsModule } from '../assets/assets.module.js';

@Module({
  imports: [AssetsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}