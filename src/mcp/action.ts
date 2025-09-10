import { providers } from "../providers/registry";
import { idempotentCall } from "../utils/idempotency";
import { logAudit } from "../utils/audit";

export async function handleMCPCall(
  tool: string,
  input: any,
  idempotency_key?: string
) {
  const adapter = providers[input.provider];
  if (!adapter) throw new Error("Unsupported provider");

  const callTool = async () => {
    switch (tool) {
      case "initialize_payment":
        return adapter.initializePayment(input);
      case "verify_payment":
        return adapter.verifyPayment(input.reference);
      case "refund_payment":
        return adapter.refundPayment(input);
      case "create_customer":
        return adapter.createCustomer(input);
      case "create_invoice":
        if (!adapter.createInvoice) throw new Error("Invoice not supported");
        return adapter.createInvoice(input);
      default:
        throw new Error("Tool not found");
    }
  };

  const result = idempotency_key
    ? await idempotentCall(idempotency_key, callTool)
    : await callTool();

  await logAudit({ tool, input, result, timestamp: new Date() });
  return result;
}
