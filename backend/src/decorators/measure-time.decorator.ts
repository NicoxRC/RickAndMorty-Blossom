import 'reflect-metadata';

export function MeasureTime(): MethodDecorator {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const paramTypes: unknown[] =
      Reflect.getMetadata('design:paramtypes', target, propertyKey) ?? [];
    const returnType: unknown = Reflect.getMetadata(
      'design:returntype',
      target,
      propertyKey,
    );

    const originalMethod = descriptor.value as (
      ...args: unknown[]
    ) => Promise<unknown>;

    descriptor.value = async function (
      this: object,
      ...args: unknown[]
    ): Promise<unknown> {
      const className: string =
        'constructor' in target &&
        typeof (target as { constructor: { name: string } }).constructor
          .name === 'string'
          ? (target as { constructor: { name: string } }).constructor.name
          : 'UnknownClass';

      const methodName = String(propertyKey);

      const paramNames = paramTypes
        .map((t) =>
          t !== null && typeof t === 'function'
            ? (t as { name: string }).name
            : 'unknown',
        )
        .join(', ');

      const returnTypeName: string =
        returnType !== null &&
        returnType !== undefined &&
        typeof returnType === 'function'
          ? (returnType as { name: string }).name
          : 'unknown';

      const label = `[MeasureTime] ${className}.${methodName}(${paramNames}) → ${returnTypeName}`;
      const start = performance.now();

      try {
        const result = await originalMethod.apply(this, args);
        const duration = (performance.now() - start).toFixed(2);
        console.log(`${label} completed in ${duration}ms`);

        Reflect.defineMetadata(
          'measureTime:lastDuration',
          parseFloat(duration),
          this,
        );

        return result;
      } catch (err) {
        const duration = (performance.now() - start).toFixed(2);
        console.error(`${label} failed after ${duration}ms`, err);

        Reflect.defineMetadata(
          'measureTime:lastDuration',
          parseFloat(duration),
          this,
        );

        throw err;
      }
    };

    return descriptor;
  };
}
