import { PedidoRepository } from '../repositories/PedidoRepository';
import { ProductoRepository } from '../repositories/ProductoRepository';
import { NoEncontradoError } from './errors';
import { PedidoService } from './PedidoService';

export class ReporteService2 {
  constructor(
    private pedidos: PedidoRepository,
    private productos: ProductoRepository,
    private pedidoService: PedidoService,
  ) {}

  facturacionTotal(): number {
    return this.pedidos.listar().reduce(
      (total, pedido) => total + this.pedidoService.calcularTotal(pedido),
      0,
    );
  }

  cantidadVendidaPorProducto(): Record<string, number> {
    const resultado: Record<string, number> = {};

    for (const pedido of this.pedidos.listar()) {
      for (const item of pedido.items) {
        const producto = this.productos.buscarPorId(item.productoId);
        if (!producto) throw new NoEncontradoError(`Producto ${item.productoId} no encontrado`);
        resultado[producto.nombre] = (resultado[producto.nombre] ?? 0) + item.cantidad;
      }
    }

    return resultado;
  }

  productoMasVendido(): { producto: string; cantidad: number } {
    const ventas = Object.entries(this.cantidadVendidaPorProducto());
    if (ventas.length === 0) throw new NoEncontradoError('Todavia no hay ventas registradas');

    const [producto, cantidad] = ventas.reduce((max, actual) =>
      actual[1] > max[1] ? actual : max,
    );
    return { producto, cantidad };
  }
}
