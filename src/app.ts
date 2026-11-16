import express, { NextFunction, Request, Response } from 'express';
import { ProductoRepository } from './repositories/ProductoRepository';
import { PedidoRepository } from './repositories/PedidoRepository';
import { ProductoService } from './services/ProductoService';
import { PedidoService } from './services/PedidoService';
import { NoEncontradoError, ValidacionError } from './services/errors';
import { ProductoController } from './controllers/ProductoController';
import { PedidoController } from './controllers/PedidoController';
import { productosRouter } from './routes/productos.routes';
import { pedidosRouter } from './routes/pedidos.routes';

export function createApp() {
  const productoRepo = new ProductoRepository();
  const pedidoRepo = new PedidoRepository();

  const productoService = new ProductoService(productoRepo);
  const pedidoService = new PedidoService(pedidoRepo, productoRepo);

  const productoController = new ProductoController(productoService);
  const pedidoController = new PedidoController(pedidoService);

  const app = express();
  app.use(express.json());

  app.use('/productos', productosRouter(productoController));
  app.use('/pedidos', pedidosRouter(pedidoController));

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ValidacionError) return res.status(400).json({ error: err.message });
    if (err instanceof NoEncontradoError) return res.status(404).json({ error: err.message });
    if (err instanceof SyntaxError) return res.status(400).json({ error: 'JSON invalido' });
    return res.status(500).json({ error: 'Error interno del servidor' });
  });

  return app;
}