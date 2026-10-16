import { expect, test, describe, expectTypeOf } from 'vitest';
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

  describe('Type narrowing', () => {
    const createResult = (valid: boolean): Result<number> => {
      return valid ? Result.ok(10) : Result.error(new Error('message'));
    };

    test('isOk() narrows both branches', () => {
      for (const valid of [true, false]) {
        const result = createResult(valid);

        if (result.isOk()) {
          expectTypeOf(result.getValue()).toEqualTypeOf<number>();
          expect(result.getValue()).toBe(10);
        } else {
          expectTypeOf(result.getError()).toEqualTypeOf<Error>();
          expect(result.getError()).toBeInstanceOf(Error);
        }
      }
    });

    test('isError() narrows both branches', () => {
      for (const valid of [true, false]) {
        const result = createResult(valid);

        if (result.isError()) {
          expectTypeOf(result.getError()).toEqualTypeOf<Error>();
          expect(result.getError()).toBeInstanceOf(Error);
        } else {
          expectTypeOf(result.getValue()).toEqualTypeOf<number>();
          expect(result.getValue()).toBe(10);
        }
      }
    });
  });
});
