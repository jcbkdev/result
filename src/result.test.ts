import { expect, test, describe, beforeEach } from 'vitest';
import { Result } from './result';

describe('Result', () => {
  describe('Result.ok', () => {
    const value = 10;
    const result = Result.ok(value);

    test('isOk', () => {
      expect(result.isOk()).toBe(true);
    });

    test('isError', () => {
      expect(result.isError()).toBe(false);
    });

    test('getValue', () => {
      expect(result.getValue()).toBe(value);
    });

    test('getError', () => {
      expect(result.getError()).toBeUndefined();
    });
  });

  describe('Result.error', () => {
    const error = new Error('message');
    const result = Result.error(error);

    test('isOk', () => {
      expect(result.isOk()).toBe(false);
    });

    test('isError', () => {
      expect(result.isError()).toBe(true);
    });

    test('getValue', () => {
      expect(result.getValue()).toBeUndefined();
    });

    test('getError', () => {
      expect(result.getError()).toBe(error);
    });
  });
});
