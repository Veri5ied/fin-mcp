import { Hono } from "hono";
import { cors } from "hono/cors";
import { loggerMiddleware } from "./middleware/logger";
import { authMiddleware } from "./middleware/auth";
import { MCP_METADATA } from "./mcp/metadata";
import { handleMCPCall } from "./mcp/action";

const app = new Hono();

app.use("*", loggerMiddleware());
app.use("*", cors());
app.use("/mcp/*", authMiddleware());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/mcp/metadata", (c) => {
  return c.json(MCP_METADATA);
});

app.post("/mcp/call", async (c) => {
  try {
    const { tool, input, idempotency_key } = await c.req.json();
    const result = await handleMCPCall(tool, input, idempotency_key);
    return c.json({ status: "ok", result });
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

export default app;
