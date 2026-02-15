import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interceptor de transformación de respuestas
 * Envuelve todas las respuestas exitosas en un formato estándar
 * EXCEPTO las respuestas de archivos binarios (StreamableFile)
 */
export interface Response<T> {
  data: T;
  meta?: {
    timestamp: string;
    path: string;
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T> | T>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T> | T> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => {
        // No transformar respuestas de archivos binarios (StreamableFile)
        // Estas respuestas deben enviarse tal cual para no corromper el archivo
        if (data && typeof data === 'object' && 'getStream' in data) {
          return data;
        }

        return {
          data,
          meta: {
            timestamp: new Date().toISOString(),
            path: request.url,
          },
        };
      }),
    );
  }
}
