import { plainToClass, Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  validateSync,
  Min,
  Max,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/**
 * Clase de validación de variables de entorno
 * Define el esquema y las reglas de validación para cada variable
 */
class EnvironmentVariables {
  @IsEnum(Environment, {
    message: 'NODE_ENV debe ser: development, production o test',
  })
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @Type(() => Number)
  @IsNumber({}, { message: 'PORT debe ser un número' })
  @Min(1, { message: 'PORT debe ser mayor a 0' })
  @Max(65535, { message: 'PORT debe ser menor a 65536' })
  @IsOptional()
  PORT = 3000;

  @IsString({ message: 'FRONTEND_URL debe ser un string' })
  @IsOptional()
  FRONTEND_URL?: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'THROTTLE_TTL debe ser un número' })
  @IsOptional()
  THROTTLE_TTL = 60000;

  @Type(() => Number)
  @IsNumber({}, { message: 'THROTTLE_LIMIT debe ser un número' })
  @IsOptional()
  THROTTLE_LIMIT = 10;
}

/**
 * Valida las variables de entorno
 * @param config - Objeto de configuración a validar
 * @returns Configuración validada
 * @throws Error si la validación falla
 */
export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const messages = errors.map(
      (error) =>
        `${error.property}: ${Object.values(error.constraints || {}).join(
          ', ',
        )}`,
    );
    throw new Error(`Configuración inválida:\n${messages.join('\n')}`);
  }

  return validatedConfig;
}
