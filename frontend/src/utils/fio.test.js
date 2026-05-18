import { cleanFIOInput, normalizeFIO, validateFIO } from './fio';

describe('FIO helpers', () => {
  test('keeps a single trailing space while typing the next name part', () => {
    expect(cleanFIOInput('Иванов ')).toBe('Иванов ');
    expect(cleanFIOInput('Иванов  ')).toBe('Иванов ');
  });

  test('normalizes extra spaces before submit', () => {
    expect(normalizeFIO('  Иванов   Иван   Иванович  ')).toBe('Иванов Иван Иванович');
  });

  test('validates multi-word names with spaces', () => {
    expect(validateFIO('Иванов Иван Иванович')).toBe(true);
  });
});
