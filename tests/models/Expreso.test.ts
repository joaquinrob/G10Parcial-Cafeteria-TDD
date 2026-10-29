import { describe, it, expect } from 'vitest';
import { Expreso } from '../../src/models/Expreso';

describe('Expreso', () => {
  it('pocillo Brasil cuesta 5020', () => {
    expect(new Expreso(1, 'Pocillo', 'Brasil').calcularPrecio()).toBe(5020);
  });
});
