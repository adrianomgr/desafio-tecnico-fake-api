import { formatCurrency } from './currency.util';

describe('Currency Utils', () => {
  describe('formatCurrency', () => {
    it('deve formatar moeda em BRL por padrão', () => {
      const result = formatCurrency(1234.56);
      expect(result).toBe('R$\u00A01.234,56');
    });

    it('deve lidar com valor zero', () => {
      const result = formatCurrency(0);
      expect(result).toBe('R$\u00A00,00');
    });

    it('deve lidar com valores negativos', () => {
      const result = formatCurrency(-100.5);
      expect(result).toBe('-R$\u00A0100,50');
    });

    it('deve lidar com valores decimais', () => {
      const result = formatCurrency(99.99);
      expect(result).toBe('R$\u00A099,99');
    });
  });
});
