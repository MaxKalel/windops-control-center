import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTelemetryDto {
  @ApiProperty({
    description: 'Potência gerada em MW no momento da leitura.',
    example: 2.7,
  })
  @IsNumber()
  @IsNotEmpty()
  powerMw!: number;

  @ApiPropertyOptional({
    description: 'Velocidade do vento em m/s.',
    example: 11.4,
  })
  @IsNumber()
  @IsOptional()
  windSpeedMs?: number;

  @ApiProperty({
    description: 'Temperatura em graus Celsius no momento da leitura.',
    example: 71,
  })
  @IsNumber()
  @IsNotEmpty()
  temperatureC!: number;

  @ApiProperty({
    description: 'Instante da medição, em formato ISO 8601.',
    example: '2026-09-13T12:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  timestamp!: string;
}