import { expect, test, describe, expectTypeOf, vi } from 'vitest';
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

    test('without a value is allowed for Result<void>', () => {
      const result: Result<void> = Result.ok();
      expect(result.isOk()).toBe(true);
      expect(result.getValue()).toBeUndefined();
    });

    test('without a value is NOT assignable to Result<number>', () => {
      // @ts-expect-error: a missing value must not satisfy Result<number>
      const result: Result<number> = Result.ok();
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

  describe('match', () => {
    const createResult = (valid: boolean): Result<number> =>
      valid ? Result.ok(10) : Result.error(new Error('message'));

    describe('on an ok result', () => {
      test('calls only the ok handler, with the value', () => {
        const ok = vi.fn((v: number) => v * 2);
        const error = vi.fn((e: Error) => e.message);

        createResult(true).match({ ok, error });

        expect(ok).toHaveBeenCalledTimes(1);
        expect(ok).toHaveBeenCalledWith(10);
        expect(error).not.toHaveBeenCalled();
      });

      test('returns the ok handler return value', () => {
        const output = createResult(true).match({
          ok: (v) => v * 2,
          error: () => -1,
        });

        expect(output).toBe(20);
      });
    });

    describe('on an error result', () => {
      test('calls only the error handler, with the error', () => {
        const err = new Error('boom');
        const ok = vi.fn((v: number) => v);
        const error = vi.fn((e: Error) => e.message);
        const result: Result<number> = Result.error(err);

        result.match({ ok, error });

        expect(error).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(err);
        expect(ok).not.toHaveBeenCalled();
      });

      test('returns the error handler return value', () => {
        const output = createResult(false).match({
          ok: () => 'ok',
          error: (e) => `failed: ${e.message}`,
        });

        expect(output).toBe('failed: message');
      });
    });

    describe('edge cases', () => {
      test.each([0, '', false, undefined, null])(
        'routes falsy ok value %j to the ok handler',
        (value) => {
          const output = Result.ok(value).match({
            ok: () => 'ok',
            error: () => 'error',
          });

          expect(output).toBe('ok');
        },
      );

      test('passes undefined to ok for Result<void>', () => {
        const ok = vi.fn();
        const result: Result<void> = Result.ok();

        result.match({ ok, error: () => {} });

        expect(ok).toHaveBeenCalledWith(undefined);
      });

      test('does not swallow errors thrown by a handler', () => {
        expect(() =>
          createResult(true).match({
            ok: () => {
              throw new Error('handler failed');
            },
            error: () => 0,
          }),
        ).toThrow('handler failed');
      });
    });

    describe('types', () => {
      test('infers handler parameter types', () => {
        createResult(true).match({
          ok: (v) => {
            expectTypeOf(v).toEqualTypeOf<number>();
          },
          error: (e) => {
            expectTypeOf(e).toEqualTypeOf<Error>();
          },
        });
      });

      test('returns a union when handlers return different types', () => {
        const output = createResult(true).match({
          ok: (v) => v,
          error: (e) => e.message,
        });

        expectTypeOf(output).toEqualTypeOf<number | string>();
      });

      test('returns a single type when handlers agree', () => {
        const output = createResult(true).match({
          ok: () => 'a',
          error: () => 'b',
        });

        expectTypeOf(output).toEqualTypeOf<string>();
      });

      test('rejects handlers missing a branch', () => {
        // @ts-expect-error: error handler is required
        createResult(true).match({ ok: (v) => v });
      });
    });
  });
});
