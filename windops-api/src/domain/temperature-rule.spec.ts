import { describe, expect, it } from 'vitest';
import { classifyTemperature } from './temperature-rule.js';

describe('classifyTemperature', () => {
  it.each([
    [69, 'NORMAL'],
    [70, 'NORMAL'],
    [74, 'NORMAL'],
    [75, 'WARNING'],
    [80, 'WARNING'],
    [84, 'WARNING'],
    [85, 'CRITICAL'],
    [90, 'CRITICAL'],
  ])('classifica %i como %s', (temperatureC, expected) => {
    expect(classifyTemperature(temperatureC)).toBe(expected);
  });
});