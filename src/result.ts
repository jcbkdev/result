export class Result<T> {
  private readonly ok: boolean;
  private readonly value?: T | undefined;
  private readonly error?: Error | undefined;

  private constructor(ok: boolean, value?: T, error?: Error) {
    this.ok = ok;
    this.value = value;
    this.error = error;
  }

  static ok<T>(value?: T): Result<T> {
    return new Result<T>(true, value);
  }

  static error<T>(error: Error): Result<T> {
    return new Result<T>(false, undefined, error);
  }

  isOk(): boolean {
    return this.ok;
  }

  isError(): boolean {
    return !this.ok;
  }

  getValue(): T | undefined {
    return this.value;
  }

  getError(): Error | undefined {
    return this.error;
  }
}
