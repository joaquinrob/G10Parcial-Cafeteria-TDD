import { Producto } from './Producto';
import { Tamano, Variedad } from './tipos';

const GRAMOS: Record<Tamano, number> = { Pocillo: 6, Mediano: 15, 'Taza grande': 25 };
const PRECIO_POR_GRAMO: Record<Variedad, number> = { Brasil: 140, Colombia: 180, Etiopia: 240 };

export class Filtrado extends Producto {
  constructor(
    id: number,
    public readonly tamano: Tamano,
    public readonly variedad: Variedad,
  ) {
    super(id, `Filtrado ${tamano} ${variedad}`, 3200);
  }

  calcularPrecio(): number {
    return super.calcularPrecio() + GRAMOS[this.tamano] * PRECIO_POR_GRAMO[this.variedad];
  }
}
