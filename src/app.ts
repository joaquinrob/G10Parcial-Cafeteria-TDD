import express, { NextFunction, Request, Response } from 'express';
import { ProductoRepository } from './repositories/ProductoRepository';
import { ProductoService } from './services/ProductoService';
import { NoEncontradoError, ValidacionError } from './services/errors';
import { ProductoController } from './controllers/ProductoController';
import { productosRouter } from './routes/productos.routes';

export function createApp() {
  const productoRepo = new ProductoRepository();
  const productoService = new ProductoService(productoRepo);
  const productoController = new ProductoController(productoService);

  const app = express();
  app.use(express.json());

  app.use('/productos', productosRouter(productoController));

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ValidacionError) return res.status(400).json({ error: err.message });
    if (err instanceof NoEncontradoError) return res.status(404).json({ error: err.message });
    return res.status(500).json({ error: 'Error interno del servidor' });
  });

  return app;
}