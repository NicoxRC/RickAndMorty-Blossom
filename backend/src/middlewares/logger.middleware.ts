import type { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = performance.now();
  const timestamp = new Date().toISOString();
  const isGraphQL = req.method === 'POST' && req.path === '/graphql';

  res.on('finish', () => {
    const duration = Math.round(performance.now() - start);

    if (isGraphQL) {
      const body = req.body as Record<string, unknown> | undefined;
      const operationName =
        typeof body?.operationName === 'string' ? body.operationName : 'anonymous';
      console.log(`[${timestamp}] ${req.method} ${req.path} (${operationName}) ${duration}ms`);
    } else {
      console.log(`[${timestamp}] ${req.method} ${req.path} ${duration}ms`);
    }
  });

  next();
}
