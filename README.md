# @jcbkdev/result

A `Result` type for TypeScript. A function returns a `Result<T>` instead of throwing, so the possibility of failure is part of its signature.

## Installation

```bash
npm install @jcbkdev/result
```

## Usage

```ts
import { Result } from "@jcbkdev/result";

function parseAge(input: string): Result<number> {
  const age = Number(input);

  if (!Number.isInteger(age) || age < 0) {
    return Result.error(new Error(`Invalid age: ${input}`));
  }

  return Result.ok(age);
}

const result = parseAge("42");

if (result.isError()) {
  console.error(result.getError());
} else {
  console.log(result.getValue());
}

// or

if (result.isOk()) {
  console.log(result.getValue());
} else {
  console.error(result.getError());
}
```

## Reference

### Creating a result

| Method                | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `Result.ok()`         | Creates a successful `Result<void>`, with no value.      |
| `Result.ok(value)`    | Creates a successful result, holding a value.            |
| `Result.error(error)` | Creates a failed result holding an `Error`.              |

### Inspecting a result

| Method       | Returns              | Description                                        |
| ------------ | -------------------- | -------------------------------------------------- |
| `isOk()`     | `boolean`            | `true` if the result is a success.                 |
| `isError()`  | `boolean`            | `true` if the result is a failure.                 |
| `getValue()` | `T \| undefined`     | The value of a success. `undefined` for a failure. |
| `getError()` | `Error \| undefined` | The error of a failure. `undefined` for a success. |

## Notes

### Checking the state of a result

A success can legitimately hold `undefined`, `null`, `0`, or `''`, so always use `isOk()` / `isError()` to determine the state, not the value returned by `getValue()`:

```ts
// Correct
if (result.isOk()) { /* ... */ }

// Incorrect: a success holding a falsy value is treated as a failure
if (result.getValue()) { /* ... */ }
```

### Using try/catch

A function that returns a `Result` should not throw. To use code that can throw, such as the `URL` constructor, catch the exception and return it as a failure:

```ts
function parseUrl(input: string): Result<URL> {
  try {
    return Result.ok(new URL(input));
  } catch (error) {
    // Any value can be thrown in JavaScript, so make sure an Error is returned
    return Result.error(error instanceof Error ? error : new Error(String(error)));
  }
}
```

### Results without a value

`Result.ok()` with no argument returns a `Result<void>`. For any other type, pass the value explicitly, even if it is `undefined`:

```ts
function deleteUser(id: string): Result<void> {
  db.remove(id);
  return Result.ok();
}

function findUser(id: string): Result<User | undefined> {
  try {
    return Result.ok(db.get(id)); // undefined if there is no such user
  } catch (error) {
    return Result.error(error instanceof Error ? error : new Error(String(error)));
  }
}
```

## Contributing

1. Fork the repository.
2. Create a branch for your change:

```bash
git switch -c feature/my-change
```

3. Install the dependencies:

```bash
npm install
```

4. Make your changes, then run the following and check for errors:

```bash
npm test
npm run typecheck
npm run build
```

5. Commit your changes:

```bash
git commit -m "Describe your change"
```

6. Push to the branch:

```bash
git push origin feature/my-change
```

7. Open a pull request.

## License

[MIT](./LICENSE)
