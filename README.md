# Cafetería Origen - API (desarrollada con TDD)

API REST en TypeScript con Express para tomar pedidos de la cafetería Origen, consultar el menú y obtener reportes de ventas. Se desarrolló con TDD y en capas: modelos, repositorios, servicios, controladores, rutas y app.

Materia: Programación IV - 2026

Grupo Nº10

Integrantes:

-Bamberger Carrasco Owen Braggi

-Garcia Amado Juan Manuel

-Robles Joaquín


## Requisitos
- Node 22 o superior (`node -v`).

## Instalar y correr
```bash
npm install
npm test            # corre todos los tests una vez
npm run coverage    # tests con reporte de cobertura (carpeta coverage/)
npm run typecheck   # verifica tipos sin generar archivos
npm run dev         # servidor en http://localhost:3000 (se reinicia al guardar)
npm run build       # compila a dist/
npm start           # corre la version compilada
```
El puerto por defecto es 3000. Se puede cambiar con la variable de entorno `PORT`.

## Estructura
```
src/
  models/         Producto (abstracta), Cafe, Expreso, Filtrado, Pasteleria, Pedido, tipos
  config/         precios y gramos
  data/           armado del catalogo de 20 productos
  repositories/   ProductoRepository, PedidoRepository (en memoria)
  services/       ProductoService, PedidoService, ReporteService, errors
  controllers/    ProductoController, PedidoController, ReporteController
  routes/         productos.routes, pedidos.routes, reportes.routes
  utils/          parseId
  app.ts          createApp(): arma repositorios, servicios, controladores y rutas
  server.ts       levanta la app en el puerto 3000
tests/
  models/  repositories/  services/  api/
```
Ver `CONTRATO.md` para los nombres exactos de cada módulo.

## Endpoints

| Método | Ruta | Descripción | Respuesta |
|---|---|---|---|
| GET | `/productos` | Lista los 20 productos con su precio | 200 |
| GET | `/productos/:id` | Devuelve un producto | 200, 404, 400 |
| POST | `/pedidos` | Crea un pedido | 201, 400, 404 |
| GET | `/pedidos` | Lista los pedidos con su total | 200 |
| GET | `/pedidos/:id` | Devuelve un pedido con su total | 200, 404, 400 |
| GET | `/reportes/facturacion` | Facturación total | 200 |
| GET | `/reportes/mas-vendido` | Producto más vendido | 200, 404 |

### Ejemplos con curl
Los ejemplos usan comillas simples, pensados para Git Bash, Linux o macOS. En PowerShell hay que usar `curl.exe` y escapar las comillas dobles del JSON.

**Listar productos**
```bash
curl http://localhost:3000/productos
```
```json
[{"id":1,"nombre":"Expreso Pocillo Brasil","precioBase":2500,"precio":5020}, ...]
```

**Obtener un producto**
```bash
curl http://localhost:3000/productos/20
```
```json
{"id":20,"nombre":"Torta selva negra","precioBase":4200,"precio":4200}
```

**Crear un pedido** (el estado por defecto es `pendiente`)
```bash
curl -X POST http://localhost:3000/pedidos \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productoId":1,"cantidad":2},{"productoId":19,"cantidad":1}]}'
```
```json
{"id":1,"items":[{"productoId":1,"cantidad":2},{"productoId":19,"cantidad":1}],"estado":"pendiente","total":12540}
```
El campo `estado` es opcional y acepta `pendiente`, `en preparacion` o `entregado`.

**Listar pedidos y obtener uno por id**
```bash
curl http://localhost:3000/pedidos
curl http://localhost:3000/pedidos/1
```

**Reportes** (con el pedido de arriba cargado)
```bash
curl http://localhost:3000/reportes/facturacion
curl http://localhost:3000/reportes/mas-vendido
```
```json
{"facturacionTotal":12540}
{"producto":"Expreso Pocillo Brasil","cantidad":2}
```
`/reportes/mas-vendido` responde 404 mientras no haya ventas.

### Errores
Todos los errores responden con un JSON `{ "error": "mensaje" }`.

| Código | Cuándo |
|---|---|
| 400 | Body inválido (ítems vacíos, cantidad que no es un entero mayor a 0, estado desconocido), id no numérico (`/productos/abc`) o JSON malformado |
| 404 | Producto o pedido inexistente, o reporte de más vendido sin ventas |
| 500 | Error inesperado del servidor |

## Cómo se calcula el precio
- Producto de pastelería: precio fijo.
- Café: `precio = precioBase + gramos x precio por gramo de la variedad`.
- Precio por gramo: Brasil 140, Colombia 180, Etiopía 240.
- Expreso: precio base 2500 y 18, 27 o 36 gramos (Pocillo, Mediano, Taza grande).
- Filtrado: precio base 3200 y 6, 15 o 25 gramos.
- Total de un pedido: suma de `precio x cantidad` de cada ítem.

El catálogo tiene 20 productos: ids 1 a 9 expresos, 10 a 18 filtrados, 19 muffin de chocolate y 20 torta selva negra.