import 'reflect-metadata';

/**
 * @MeasureTime — method decorator
 *
 * Wraps the decorated async method to:
 *  - Log class name, method name, parameter types, return type, and execution
 *    time to the console using `reflect-metadata` (`design:paramtypes` and
 *    `design:returntype`).
 *  - Store the last measured duration (ms) as metadata on the instance under
 *    the key `'measureTime:lastDuration'` so callers can read it if needed.
 *
 * Example log output:
 *   [MeasureTime] CharacterRepository.findAll(Object) → Promise completed in 12.34ms
 *
 * Usage:
 *   @MeasureTime()
 *   async myMethod(arg: SomeType): Promise<Result> { ... }
 */
export function MeasureTime(): MethodDecorator {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    // Read reflect-metadata before the original value is replaced.
    const paramTypes: unknown[] = Reflect.getMetadata('design:paramtypes', target, propertyKey) ?? [];
    const returnType: unknown = Reflect.getMetadata('design:returntype', target, propertyKey);

    const originalMethod = descriptor.value as (...args: unknown[]) => Promise<unknown>;

    descriptor.value = async function (this: object, ...args: unknown[]): Promise<unknown> {
      // Derive class name: instance methods store the prototype as `target`,
      // so `target.constructor.name` gives the class name.
      const className: string =
        'constructor' in target && typeof (target as { constructor: { name: string } }).constructor.name === 'string'
          ? (target as { constructor: { name: string } }).constructor.name
          : 'UnknownClass';

      const methodName = String(propertyKey);

      // Build a human-readable list of parameter type names.
      const paramNames = paramTypes
        .map((t) => (t !== null && typeof t === 'function' ? (t as { name: string }).name : 'unknown'))
        .join(', ');

      // Return type name — TypeScript emits the outer constructor only (e.g.
      // `Promise`) because generics are erased at runtime.
      const returnTypeName: string =
        returnType !== null && returnType !== undefined && typeof returnType === 'function'
          ? (returnType as { name: string }).name
          : 'unknown';

      const label = `[MeasureTime] ${className}.${methodName}(${paramNames}) → ${returnTypeName}`;
      const start = performance.now();

      try {
        const result = await originalMethod.apply(this, args);
        const duration = (performance.now() - start).toFixed(2);
        console.log(`${label} completed in ${duration}ms`);

        // Store last duration as metadata on the instance for callers.
        Reflect.defineMetadata('measureTime:lastDuration', parseFloat(duration), this);

        return result;
      } catch (err) {
        const duration = (performance.now() - start).toFixed(2);
        console.error(`${label} failed after ${duration}ms`, err);

        Reflect.defineMetadata('measureTime:lastDuration', parseFloat(duration), this);

        throw err;
      }
    };

    return descriptor;
  };
}
