/**
 * @MeasureTime — method decorator
 *
 * Wraps the decorated async method to log its execution time to the console.
 * Usage:
 *   @MeasureTime()
 *   async myMethod() { ... }
 */
export function MeasureTime(): MethodDecorator {
  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as (...args: unknown[]) => Promise<unknown>;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const label = `[MeasureTime] ${String(propertyKey)}`;
      const start = performance.now();

      try {
        const result = await originalMethod.apply(this, args);
        const duration = (performance.now() - start).toFixed(2);
        console.log(`${label} completed in ${duration}ms`);
        return result;
      } catch (err) {
        const duration = (performance.now() - start).toFixed(2);
        console.error(`${label} failed after ${duration}ms`, err);
        throw err;
      }
    };

    return descriptor;
  };
}
