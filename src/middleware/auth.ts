import { Context, Next } from "hono";
import { ENABLE_AUTH, API_KEY } from "../config";

export const authMiddleware = () => {
  return async (c: Context, next: Next) => {
    if (!ENABLE_AUTH) return await next();

    const token = c.req.header("Authorization")?.split(" ")[1];
    if (!token || token !== API_KEY) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await next();
  };
};
