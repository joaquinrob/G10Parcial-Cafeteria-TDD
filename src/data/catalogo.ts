import { Producto } from '../models/Producto';
import { Expreso } from '../models/Expreso';
import { Filtrado } from '../models/Filtrado';
import { Pasteleria } from '../models/Pasteleria';
import { Tamano, Variedad } from '../models/tipos';

const TAMANOS: Tamano[] = ['Pocillo', 'Mediano', 'Taza grande'];
const VARIEDADES: Variedad[] = ['Brasil', 'Colombia', 'Etiopia'];

/** Catalogo: ids 1-9 expresos, 10-18 filtrados, 19 muffin y 20 torta. */
export function crearCatalogo(): Producto[] {
  const productos: Producto[] = [];
  let id = 1;
  for (const tamano of TAMANOS) {
    for (const variedad of VARIEDADES) {
      productos.push(new Expreso(id++, tamano, variedad));
    }
  }
  for (const tamano of TAMANOS) {
    for (const variedad of VARIEDADES) {
      productos.push(new Filtrado(id++, tamano, variedad));
    }
  }
  productos.push(new Pasteleria(id++, 'Muffin de chocolate', 2500));
  productos.push(new Pasteleria(id++, 'Torta selva negra', 4200));
  return productos;
}
