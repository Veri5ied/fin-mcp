import { Context, Next } from "hono";

export const loggerMiddleware = () => {
  return async (c: Context, next: Next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;

    console.log(
      `[${new Date().toISOString()}] ${c.req.method} ${
        c.req.path
      } - ${duration}ms`
    );
  };
};
