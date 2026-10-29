import { Cafe } from './Cafe';
import { Tamano, Variedad } from './tipos';

const GRAMOS: Record<Tamano, number> = { Pocillo: 18, Mediano: 27, 'Taza grande': 36 };

export class Expreso extends Cafe {
  static readonly PRECIO_BASE = 2500;

  constructor(id: number, tamano: Tamano, variedad: Variedad) {
    super(id, `Expreso ${tamano} ${variedad}`, Expreso.PRECIO_BASE, tamano, variedad, GRAMOS[tamano]);
  }
}
