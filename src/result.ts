interface Ok<T> extends ResultImpl<T> {
  getValue(): T;
  getError(): undefined;
}

interface Err<T> extends ResultImpl<T> {
  getValue(): undefined;
  getError(): Error;
}

export type Result<T> = Ok<T> | Err<T>;

class ResultImpl<T> {
  private readonly ok: boolean;
  private readonly value?: T | undefined;
  private readonly error?: Error | undefined;

  private constructor(ok: boolean, value?: T, error?: Error) {
    this.ok = ok;
    this.value = value;
    this.error = error;
  }

  static ok<T>(value?: T): Result<T> {
    return new ResultImpl<T>(true, value) as Result<T>;
  }

  static error<T>(error: Error): Result<T> {
    return new ResultImpl<T>(false, undefined, error) as Result<T>;
  }

  isOk(): this is Ok<T> {
    return this.ok;
  }

  isError(): this is Err<T> {
    return !this.ok;
  }

  getValue(): T | undefined {
    return this.value;
  }

  getError(): Error | undefined {
    return this.error;
  }
}

export const Result = ResultImpl;
