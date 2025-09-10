# Fin-MCP

**Fin-MCP** is a self-hosted, modular MCP that allows AI agents or enterprise systems to interact with multiple payment providers (e.g., Stripe, Paystack) via a single unified API.
It abstracts the provider logic so agents can call payment operations seamlessly.

---

## Features

- **MCP for Payments**: AI agents can perform payment actions without knowing provider details.
- **Dynamic MCP tools**: Initialize payment, verify payment, refund, create customers, and invoices.
- **Optional authentication**: Protect MCP access with API keys.
- **Metadata endpoint**: Agents can discover available tools and supported providers.
- **Self-hosted MCP**: Full control over deployments and provider credentials.
- **Extensible**: Add new tools or providers with minimal changes.
- **Protocol-driven tool execution**: Agents can call any tool via `/mcp/call`.
- **Provider abstraction**: MCP selects or routes to the appropriate payment provider automatically (e.g., based on provider like stripe, based on currency (soon)).

---

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the MCP](#running-the-mcp)
- [API Endpoints](#api-endpoints)
- [Adding New Providers](#adding-new-providers)
- [Development Notes](#development-notes)
- [License](#license)

---

## Installation

```bash
git clone https://github.com/Veri5ied/fin-mcp.git
cd fin-mcp
```

### Install dependencies

```bash
bun install
```

---

## Configuration

Create a `.env` file in the root:

```env
# Enable or disable API key authentication
ENABLE_AUTH=false

# API key for auth (only used if ENABLE_AUTH=true)
FIN_MCP_KEY=supersecret-fin-key

# Stripe secret key (required for Stripe provider)
STRIPE_SECRET=sk_test_1234567890
```

- `ENABLE_AUTH`: Set to `true` for secure access; `false` for testing or private networks.
- `FIN_MCP_KEY`: Your self-generated secret key.
- `STRIPE_SECRET`: Stripe API secret for payment operations.

---

## Running the MCP

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

### 1. Get Metadata

```
GET /mcp/metadata
```

Agents discover available payment tools and providers

```json
{
  "tools": [
    {
      "name": "initialize_payment",
      "description": "Start a payment",
      "providers": ["stripe", "paystack"]
    }
  ]
}
```

---

### 2. Call a Tool

```
POST /mcp/call
```

Agents execute payment operations through the MCP protocol.

**Headers** (if auth enabled):

```
Authorization: Bearer <FIN_MCP_KEY>
Content-Type: application/json
```

**Body Example (Stripe Initialize Payment):**

```json
{
  "tool": "initialize_payment",
  "input": {
    "provider": "stripe",
    "amount": 5000,
    "currency": "USD",
    "email": "customer@example.com"
  },
  "idempotency_key": "unique-key-123"
}
```

**Response:**

```json
{
  "status": "ok",
  "result": {
    "id": "cs_test_1234",
    "object": "checkout.session"
  }
}
```

---

## Adding New Providers

1. Create a new adapter in `src/providers/`.
2. Implement the required interfaces (`PaymentProvider`, or extend specific tool interfaces).
3. Add the adapter to the provider registry (`src/providers/registry.ts`).
4. Update `metadata.ts` to include the new provider for relevant tools.

> The MCP will automatically route calls based on the `provider` field in the request payload.

---

## Development Notes

- **Idempotency**: Use `idempotency_key` in `/mcp/call` to prevent duplicate operations.
- **Audit Logging**: MCP logs every call via `logAudit()` for traceability.
- **Extensibility**: You can define new tools without modifying the core callHandler — just add the tool interface and adapter implementation.
- **Optional Authentication**: Set `ENABLE_AUTH=false` for testing or private self-hosted environments.

---

## License

MIT License — free to use and modify for your self-hosted deployments.

---

## 💡 Optional Add-ons

- Integrate AI agents to call `/mcp/call` dynamically.
- Add support for webhooks from payment providers.
- Add fully typed output interfaces for each provider to eliminate `any` responses.
