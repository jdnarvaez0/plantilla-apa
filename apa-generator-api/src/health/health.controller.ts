import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';

/**
 * Controlador de health checks
 * Proporciona endpoints para verificar el estado del servicio y sus dependencias
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
  ) {}

  /**
   * Verifica el estado general del servicio
   * Incluye verificación de memoria heap y RSS
   */
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Servicio funcionando correctamente',
    type: Object,
  })
  @ApiResponse({
    status: 503,
    description: 'Servicio no disponible',
  })
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      // Verifica que el heap de memoria no exceda 150MB
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // Verifica que el RSS no exceda 150MB
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }
}
