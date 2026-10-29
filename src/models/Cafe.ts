import { Producto } from './Producto';
import { Tamano, Variedad } from './tipos';

/** Precio por gramo de cafe segun la variedad ($). */
export const PRECIO_POR_GRAMO: Record<Variedad, number> = {
  Brasil: 140,
  Colombia: 180,
  Etiopia: 240,
};

export abstract class Cafe extends Producto {
  constructor(
    id: number,
    nombre: string,
    precioBase: number,
    public readonly tamano: Tamano,
    public readonly variedad: Variedad,
    public readonly gramos: number,
  ) {
    super(id, nombre, precioBase);
  }

  /** Costo del cafe = gramos x precio por gramo de la variedad. */
  calcularCostoCafe(): number {
    return this.gramos * PRECIO_POR_GRAMO[this.variedad];
  }

  /** Precio final = precio base (super) + costo del cafe. */
  calcularPrecio(): number {
    return super.calcularPrecio() + this.calcularCostoCafe();
  }
}
