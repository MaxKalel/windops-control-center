import { Injectable, NotFoundException } from '@nestjs/common';
import { Asset } from '../domain/asset.interface.js';

@Injectable()
export class AssetsService {
  private readonly assets: Asset[] = [
    {
      id: 'WT-001',
      name: 'Aerogerador 01',
      type: 'WIND_TURBINE',
      status: 'ONLINE',
      ratedPowerMw: 3.2,
      location: 'Parque Demo A',
    },
    {
      id: 'WT-002',
      name: 'Aerogerador 02',
      type: 'WIND_TURBINE',
      status: 'MAINTENANCE',
      ratedPowerMw: 2.5,
      location: 'Parque Demo A',
    },
    {
      id: 'PV-001',
      name: 'Painel Solar 01',
      type: 'SOLAR_ARRAY',
      status: 'ONLINE',
      ratedPowerMw: 1.8,
      location: 'Parque Demo B',
    },
  ];

  findAll(): Asset[] {
    return this.assets;
  }

  findById(id: string): Asset {
    const asset = this.assets.find((a) => a.id === id);
    if (!asset) {
      throw new NotFoundException(`Asset ${id} não encontrado`);
    }
    return asset;
  }
}