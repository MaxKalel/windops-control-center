import { describe, expect, it } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { AssetsService } from './assets.service.js';

describe('AssetsService', () => {
  describe('findAll', () => {
    it('retorna os 3 assets iniciais', () => {
      const service = new AssetsService();
      expect(service.findAll()).toHaveLength(3);
    });
  });

  describe('findById', () => {
    it('retorna o asset WT-001', () => {
      const service = new AssetsService();
      expect(service.findById('WT-001').name).toBe('Aerogerador 01');
    });

    it('lança NotFoundException para asset inexistente', () => {
      const service = new AssetsService();
      expect(() => service.findById('XYZ')).toThrow(NotFoundException);
    });
  });
});