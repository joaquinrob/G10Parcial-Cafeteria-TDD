import { ESTADOS_VALIDOS, EstadoPedido, ItemPedido, Pedido, PedidoConTotal } from '../models/Pedido';
import { PedidoRepository } from '../repositories/PedidoRepository';
import { ProductoRepository } from '../repositories/ProductoRepository';
import { NoEncontradoError, ValidacionError } from './errors';

function esRegistro(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function esEstadoPedido(value: unknown): value is EstadoPedido {
  return ESTADOS_VALIDOS.some((estado) => estado === value);
}

export class PedidoService {
  constructor(
    private pedidos: PedidoRepository,
    private productos: ProductoRepository,
  ) {}

  calcularTotal(pedido: Pedido): number {
    return pedido.items.reduce((total, item) => {
      const producto = this.productos.buscarPorId(item.productoId);
      if (!producto) throw new NoEncontradoError(`Producto ${item.productoId} no encontrado`);
      return total + producto.calcularPrecio() * item.cantidad;
    }, 0);
  }

  crear(body: unknown): PedidoConTotal {
    if (!esRegistro(body) || !Array.isArray(body.items) || body.items.length === 0) {
      throw new ValidacionError('El pedido debe tener al menos un item');
    }

    const items: ItemPedido[] = [];
    for (const value of body.items as unknown[]) {
      if (!esRegistro(value) || !Number.isInteger(value.productoId)) {
        throw new ValidacionError('productoId debe ser un número entero');
      }
      if (!Number.isInteger(value.cantidad) || typeof value.cantidad !== 'number' || value.cantidad <= 0) {
        throw new ValidacionError('cantidad debe ser un entero mayor a 0');
      }
      if (typeof value.productoId !== 'number' || !this.productos.buscarPorId(value.productoId)) {
        throw new NoEncontradoError(`Producto ${String(value.productoId)} no encontrado`);
      }
      items.push({ productoId: value.productoId, cantidad: value.cantidad });
    }

    const estado = body.estado === undefined ? 'pendiente' : body.estado;
    if (!esEstadoPedido(estado)) {
      throw new ValidacionError(`estado invalido. Valores posibles: ${ESTADOS_VALIDOS.join(', ')}`);
    }

    const pedido = this.pedidos.crear({ items, estado });
    return { ...pedido, total: this.calcularTotal(pedido) };
  }

  listar(): PedidoConTotal[] {
    return this.pedidos.listar().map((pedido) => ({
      ...pedido,
      total: this.calcularTotal(pedido),
    }));
  }

  obtener(id: number): PedidoConTotal {
    const pedido = this.pedidos.buscarPorId(id);
    if (!pedido) throw new NoEncontradoError(`Pedido ${id} no encontrado`);
    return { ...pedido, total: this.calcularTotal(pedido) };
  }
}
