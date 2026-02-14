import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS - permitir cualquier origen en desarrollo/Docker
  app.enableCors({
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:3001'] : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('APA Template Generator API')
    .setDescription('API para generar documentos académicos con formato APA 7ª edición')
    .setVersion('1.0')
    .addTag('Health', 'Estado del servicio')
    .addTag('Documents', 'Generación de documentos')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Prefijo global de API
  app.setGlobalPrefix('api/v1');

  // Obtener puerto del entorno o usar 3000 por defecto
  const port = process.env.PORT || 3000;
  
  // Escuchar en todas las interfaces (necesario para Docker)
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Servidor corriendo en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs`);
  console.log(`💚 Health Check: http://localhost:${port}/api/v1/health`);
}

bootstrap();
