import { Tamano, Variedad } from './tipos';

export class Expreso {
  constructor(
    public readonly id: number,
    public readonly tamano: Tamano,
    public readonly variedad: Variedad,
  ) {}

  calcularPrecio(): number {
    return 5020;
  }
}
