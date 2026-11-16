import { ValidacionError } from '../services/errors';

/** Convierte un parametro de ruta en id entero o lanza ValidacionError. */
export function parseId(valor: string | string[] | undefined): number {
  if (typeof valor !== 'string' || !/^\d+$/.test(valor)) {
    throw new ValidacionError('El id debe ser un numero entero');
  }
  return Number(valor);
}