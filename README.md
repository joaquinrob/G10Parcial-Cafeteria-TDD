# Cafeteria Origen - API (desarrollada con TDD)

## Instalar y correr
```bash
npm install
npm test            # tests
npm run coverage    # cobertura
npm run dev         # servidor en http://localhost:3000
```

## Flujo de trabajo
Cada comportamiento se desarrollo con el ciclo TDD y los commits lo marcan:
- `test(red):` un test que falla.
- `feat(green):` el codigo minimo para que pase.
- `refactor:` mejora del codigo con los tests en verde.

Ver `CONTRATO.md` para la estructura de modulos.
