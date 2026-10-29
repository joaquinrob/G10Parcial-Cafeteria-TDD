import { Producto } from './Producto';
import { Tamano, Variedad } from './tipos';

const GRAMOS: Record<Tamano, number> = { Pocillo: 18, Mediano: 27, 'Taza grande': 36 };
const PRECIO_POR_GRAMO: Record<Variedad, number> = { Brasil: 140, Colombia: 180, Etiopia: 240 };

export class Expreso extends Producto {
  constructor(
    id: number,
    public readonly tamano: Tamano,
    public readonly variedad: Variedad,
  ) {
    super(id, `Expreso ${tamano} ${variedad}`, 2500);
  }

  calcularPrecio(): number {
    return super.calcularPrecio() + GRAMOS[this.tamano] * PRECIO_POR_GRAMO[this.variedad];
  }
}
