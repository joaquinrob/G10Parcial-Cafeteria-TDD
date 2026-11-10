export type EstadoPedido = 'pendiente' | 'en preparación' | 'entregado'; 

export const ESTADOS_VALIDOS: EstadoPedido[] = ['pendiente', 'en preparación', 'entregado']; 

export interface ItemPedido {
  productoId: number;
  cantidad: number;
}

export interface Pedido { // lo q recibe la API para crear un pedido
  id: number;
  items: ItemPedido[];
  estado: EstadoPedido;
}


export interface PedidoConTotal extends Pedido { // lo q devuelve la API de un pedido con el total calculado
  total: number;
}
