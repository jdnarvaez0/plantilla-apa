import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DocumentsModule } from './modules/documents/documents.module';
import { HealthModule } from './health/health.module';
import { validate } from './config/env.validation';

/**
 * Módulo raíz de la aplicación
 * Configura los módulos globales, rate limiting y variables de entorno
 */
@Module({
  imports: [
    // Configuración de variables de entorno con validación
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      cache: true,
    }),
    // Rate limiting - protección contra ataques de fuerza bruta
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10), // 1 minuto
        limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10), // 10 requests
      },
    ]),
    // Módulos de la aplicación
    HealthModule,
    DocumentsModule,
  ],
  providers: [
    // Aplica rate limiting globalmente a todas las rutas
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
