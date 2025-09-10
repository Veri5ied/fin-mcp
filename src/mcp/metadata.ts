export const MCP_METADATA = {
  name: "fin-mcp",
  description: "Finance MCP: Payments, refunds, invoices, customers",
  tools: [
    {
      name: "initialize_payment",
      description: "Start a payment using a chosen provider",
      providers: ["stripe"],
    },
    {
      name: "verify_payment",
      description: "Verify a transaction reference",
      providers: ["stripe"],
    },
    {
      name: "refund_payment",
      description: "Refund a payment",
      providers: ["stripe"],
    },
    {
      name: "create_customer",
      description: "Create a customer",
      providers: ["stripe"],
    },
    {
      name: "create_invoice",
      description: "Create an invoice (if supported)",
      providers: ["stripe"],
    },
  ],
};
