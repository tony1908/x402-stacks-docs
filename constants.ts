import { DocPage, NavItem } from './types';

export const DOC_NAME = "x402 stacks";

export const MOCK_DOCS: DocPage[] = [
  {
    id: 'intro',
    title: 'Welcome to x402-stacks',
    slug: 'introduction',
    content: `# Welcome to x402-stacks

x402-stacks is the open payment standard that enables services to charge for access to their APIs and content directly over HTTP using the **Stacks blockchain** with **STX** or **sBTC** cryptocurrency.

It is built around the HTTP \`402 Payment Required\` status code and allows clients to programmatically pay for resources without accounts, sessions, or credential management.

With x402-stacks, any web service can require payment before serving a response, using crypto-native payments for speed, privacy, and efficiency.

## Why Use x402-stacks?

x402-stacks addresses key limitations of existing payment systems:

- **High fees and friction** with traditional credit cards and fiat payment processors
- **Incompatibility with machine-to-machine payments**, such as AI agents
- **Lack of support for micropayments**, making it difficult to monetize usage-based services
- **Native STX and sBTC support** for the Stacks ecosystem

## Who is x402-stacks for?

- **Sellers:** Service providers who want to monetize their APIs or content using STX or sBTC. x402-stacks enables direct, programmatic payments from clients with minimal setup.
- **Buyers:** Human developers and AI agents seeking to access paid services without accounts or manual payment flows.

Both sellers and buyers interact directly through HTTP requests, with payment handled transparently through the protocol.

## What Can You Build?

x402-stacks enables a range of use cases, including:

- API services paid per request in STX or sBTC
- AI agents that autonomously pay for API access
- Paywalls for digital content
- Microservices and tooling monetized via microtransactions
- Proxy services that aggregate and resell API capabilities

## How Does It Work?

At a high level, the flow is simple:

1. A buyer requests a resource from a server.
2. If payment is required, the server responds with \`402 Payment Required\`, including payment instructions.
3. The buyer prepares and submits a payment payload signed with their STX wallet.
4. The server verifies and settles the payment using the x402-stacks facilitator.
5. If payment is valid, the server provides the requested resource.

## Resources

- [npm package: x402-stacks](https://www.npmjs.com/package/x402-stacks)
- [Example Repository](https://github.com/tony1908/x402-stacks-example)
- [Main Repository](https://github.com/tony1908/x402Stacks)

## Get Started

Ready to build? Start here:

- Quickstart for Sellers
- Quickstart for Buyers
- Explore Core Concepts`
  },
  {
    id: 'quickstart-buyers',
    title: 'Quickstart for Buyers',
    slug: 'getting-started/quickstart-buyers',
    content: `# Quickstart for Buyers

This guide walks you through how to use **x402-stacks** to interact with services that require payment. By the end of this guide, you will be able to programmatically discover payment requirements, complete a payment, and access a paid resource.

## Prerequisites

Before you begin, ensure you have:

- A Stacks wallet with STX (or generate one using the SDK)
- Node.js and npm installed
- A service that requires payment via x402-stacks

## 1. Install Dependencies

\`\`\`bash
npm install x402-stacks axios dotenv
\`\`\`

## 2. Create or Load a Wallet

x402-stacks provides utilities to either load an existing wallet or generate a new one:

\`\`\`typescript
import {
  privateKeyToAccount,
  generateKeypair,
} from 'x402-stacks';

const NETWORK = 'testnet'; // or 'mainnet'

// Option 1: Load existing wallet from private key
const account = privateKeyToAccount(process.env.CLIENT_PRIVATE_KEY!, NETWORK);
console.log('Using wallet:', account.address);

// Option 2: Generate a new wallet
const keypair = generateKeypair(NETWORK);
console.log('New wallet generated:', keypair.address);
console.log('Private key:', keypair.privateKey);
console.log('Fund this wallet with STX before making payments');

// Use the generated keypair
const newAccount = privateKeyToAccount(keypair.privateKey, NETWORK);
\`\`\`

> **Important:** Store your private key securely! Add it to your \`.env\` file as \`CLIENT_PRIVATE_KEY\` and never commit it to version control.

## 3. Make Paid Requests Automatically

x402-stacks provides an Axios interceptor that automatically handles 402 Payment Required responses:

\`\`\`typescript
import 'dotenv/config';
import axios from 'axios';
import {
  withPaymentInterceptor,
  privateKeyToAccount,
  decodeXPaymentResponse,
  generateKeypair,
  getExplorerURL,
} from 'x402-stacks';

const NETWORK = (process.env.NETWORK as 'mainnet' | 'testnet') || 'testnet';
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3003';

// Load or generate account
let account;

if (process.env.CLIENT_PRIVATE_KEY) {
  account = privateKeyToAccount(process.env.CLIENT_PRIVATE_KEY, NETWORK);
  console.log('Using wallet:', account.address);
} else {
  const keypair = generateKeypair(NETWORK);
  console.log('New wallet generated:', keypair.address);
  console.log('Private key:', keypair.privateKey);
  console.log('Add to .env: CLIENT_PRIVATE_KEY and fund with STX');
  account = privateKeyToAccount(keypair.privateKey, NETWORK);
}

// Create axios with automatic payment handling
const api = withPaymentInterceptor(
  axios.create({
    baseURL: SERVER_URL,
    timeout: 60000,
  }),
  account
);

async function main() {
  // Check server health
  try {
    await axios.get(\`\${SERVER_URL}/health\`);
    console.log('Server is running');
  } catch {
    console.error('Server not running. Start with: npm run dev:server');
    return;
  }

  // Make paid request - payment is handled automatically!
  try {
    console.log('Requesting premium data...');
    const response = await api.get('/api/premium-data');

    console.log('Success! Data:', response.data);

    // Decode payment response from headers
    const paymentResponse = decodeXPaymentResponse(
      response.headers['x-payment-response']
    );
    if (paymentResponse) {
      console.log('Payment txId:', paymentResponse.txId);
      console.log('Explorer:', getExplorerURL(paymentResponse.txId, NETWORK));
    }
  } catch (error: any) {
    console.error('Error:', error.response?.data?.error || error.message);
  }
}

main().catch(console.error);
\`\`\`

## 4. Environment Variables

Create a \`.env\` file:

\`\`\`bash
NETWORK=testnet
SERVER_URL=http://localhost:3003
CLIENT_PRIVATE_KEY=your_private_key_here
\`\`\`

## 5. Error Handling

Clients will throw errors if:

- The wallet has insufficient STX balance
- The payment signature is invalid
- The server's payment requirements cannot be met
- Network connectivity issues occur

## Summary

- Install the \`x402-stacks\` package
- Create or load a Stacks wallet using \`privateKeyToAccount\` or \`generateKeypair\`
- Use \`withPaymentInterceptor\` to wrap your Axios instance
- Payment flows are handled automatically for you
- Use \`decodeXPaymentResponse\` to get transaction details

## References

- [x402-stacks npm package](https://www.npmjs.com/package/x402-stacks)
- [Example Repository](https://github.com/tony1908/x402-stacks-example)
- [Stacks Explorer - Testnet](https://explorer.stacks.co/?chain=testnet)
- [Stacks Explorer - Mainnet](https://explorer.stacks.co/)`
  },
  {
    id: 'quickstart-sellers',
    title: 'Quickstart for Sellers',
    slug: 'getting-started/quickstart-sellers',
    content: `# Quickstart for Sellers

This guide walks you through integrating with **x402-stacks** to enable payments for your API or service. By the end, your API will be able to charge buyers and AI agents for access using STX.

## Prerequisites

Before you begin, ensure you have:

- A Stacks wallet address to receive STX payments
- Node.js and npm installed
- An existing Express API or server

## 1. Install Dependencies

\`\`\`bash
npm install x402-stacks express dotenv
npm install -D @types/express typescript ts-node
\`\`\`

## 2. Add Payment Middleware

Integrate the payment middleware into your Express application. You will need to provide:

- Your receiving wallet address
- The payment amount in microSTX
- The network (mainnet or testnet)
- The facilitator URL

\`\`\`typescript
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { x402PaymentRequired, getPayment, STXtoMicroSTX } from 'x402-stacks';

const NETWORK = (process.env.NETWORK as 'mainnet' | 'testnet') || 'testnet';
const SERVER_ADDRESS = process.env.SERVER_ADDRESS!;
const PORT = process.env.PORT || 3003;
const FACILITATOR_URL = process.env.FACILITATOR_URL || 'https://facilitator.x402stacks.xyz';

const app = express();
app.use(express.json());

// Protected endpoint - requires STX payment
app.get(
  '/api/premium-data',
  x402PaymentRequired({
    amount: STXtoMicroSTX(0.00001), // 0.00001 STX = 10 microSTX
    address: SERVER_ADDRESS,
    network: NETWORK,
    facilitatorUrl: FACILITATOR_URL,
  }),
  (req: Request, res: Response) => {
    // Get payment details from the verified request
    const payment = getPayment(req);

    res.json({
      success: true,
      message: 'Premium data access granted!',
      data: {
        secretValue: 42,
        timestamp: new Date().toISOString()
      },
      payment: {
        txId: payment.txId,
        amount: payment.amount.toString(),
        sender: payment.sender,
      },
    });
  }
);

// Health check endpoint (no payment required)
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', network: NETWORK });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
  console.log(\`Network: \${NETWORK}\`);
  console.log(\`Facilitator: \${FACILITATOR_URL}\`);
});
\`\`\`

## 3. Environment Variables

Create a \`.env\` file:

\`\`\`bash
NETWORK=testnet
SERVER_ADDRESS=SP2... # Your Stacks wallet address
PORT=3003
FACILITATOR_URL=https://facilitator.x402stacks.xyz
\`\`\`

## 4. Understanding the Middleware

### x402PaymentRequired Options

| Option | Type | Description |
|--------|------|-------------|
| \`amount\` | number | Payment amount in microSTX |
| \`address\` | string | Your Stacks wallet address to receive payments |
| \`network\` | 'mainnet' \\| 'testnet' | Stacks network to use |
| \`facilitatorUrl\` | string | URL of the payment facilitator service |

### Helper Functions

- **\`STXtoMicroSTX(stx)\`**: Converts STX to microSTX (1 STX = 1,000,000 microSTX)
- **\`getPayment(req)\`**: Extracts verified payment details from the request

## 5. Test Your Integration

1. Start your server:
\`\`\`bash
npx ts-node server.ts
\`\`\`

2. Make a request without payment:
\`\`\`bash
curl http://localhost:3003/api/premium-data
\`\`\`

The server responds with \`402 Payment Required\` and payment instructions.

3. Use a compatible client (see Quickstart for Buyers) to complete the payment flow.

## 6. Payment Flow

When a request is made to a protected endpoint:

1. Middleware checks for \`X-PAYMENT\` header
2. If missing, returns \`402 Payment Required\` with payment details
3. If present, verifies payment via the facilitator
4. If valid, attaches payment info to request and calls your handler
5. Response includes \`X-PAYMENT-RESPONSE\` header with transaction details

## Summary

- Install \`x402-stacks\` and Express dependencies
- Use \`x402PaymentRequired\` middleware on protected routes
- Configure your wallet address and facilitator URL
- Use \`getPayment(req)\` to access verified payment details

Your API is now ready to accept STX payments through x402-stacks!

## References

- [x402-stacks npm package](https://www.npmjs.com/package/x402-stacks)
- [Example Repository](https://github.com/tony1908/x402-stacks-example)
- [Main Repository](https://github.com/tony1908/x402Stacks)`
  },
  {
    id: 'http-402',
    title: 'HTTP 402',
    slug: 'core-concepts/http-402',
    content: `# HTTP 402

For decades, HTTP 402 Payment Required has been reserved for future use. x402-stacks unlocks it for the Stacks ecosystem.

## What is HTTP 402?

HTTP 402 is a standard, but rarely used, HTTP response status code indicating that payment is required to access a resource.

In x402-stacks, this status code is activated to:

- Inform clients (buyers or agents) that payment is required
- Communicate the details of the payment, such as amount in STX and destination address
- Provide the information necessary to complete the payment programmatically

## 402 Response Structure

When a server requires payment, it responds with:

\`\`\`json
{
  "error": "Payment Required",
  "paymentDetails": {
    "amount": 10,
    "address": "SP2...",
    "network": "testnet",
    "facilitatorUrl": "https://facilitator.x402stacks.xyz"
  }
}
\`\`\`

| Field | Description |
|-------|-------------|
| \`amount\` | Payment amount in microSTX |
| \`address\` | Seller's Stacks wallet address |
| \`network\` | "mainnet" or "testnet" |
| \`facilitatorUrl\` | URL for payment verification/settlement |

## Why x402-stacks Uses HTTP 402

The primary purpose of HTTP 402 is to enable frictionless, API-native payments for accessing web resources, especially for:

- **Machine-to-machine (M2M) payments** (e.g., AI agents)
- **Pay-per-use models** such as API calls or paywalled content
- **Micropayments** without account creation or traditional payment rails
- **STX-native payments** for the Stacks ecosystem

Using the 402 status code keeps the protocol natively web-compatible and easy to integrate into any HTTP-based service.

## Payment Headers

### Request Header

Clients include payment proof in the \`X-PAYMENT\` header:

\`\`\`
X-PAYMENT: <base64-encoded-payment-payload>
\`\`\`

### Response Header

Servers include transaction details in the \`X-PAYMENT-RESPONSE\` header:

\`\`\`
X-PAYMENT-RESPONSE: <base64-encoded-payment-response>
\`\`\`

Decode using \`decodeXPaymentResponse()\` to get:
- \`txId\`: Transaction ID on the Stacks blockchain
- \`amount\`: Amount paid in microSTX
- \`sender\`: Sender's Stacks address

## Summary

HTTP 402 is the foundation of the x402-stacks protocol, enabling services to declare payment requirements directly within HTTP responses. It:

- Signals payment is required
- Communicates necessary payment details in STX
- Integrates seamlessly with standard HTTP workflows
- Works natively with the Stacks blockchain`
  },
  {
    id: 'client-server',
    title: 'Client / Server',
    slug: 'core-concepts/client-server',
    content: `# Client / Server

This page explains the roles and responsibilities of the **client** and **server** in the x402-stacks protocol.

Understanding these roles is essential to designing, building, or integrating services that use x402-stacks for programmatic payments on Stacks.

> **Note:** Client refers to the technical component making an HTTP request (the *buyer*). Server refers to the technical component responding to the request (the *seller*).

## Client Role

The client is the entity that initiates a request to access a paid resource.

Clients can include:

- Human-operated applications
- Autonomous AI agents
- Programmatic services acting on behalf of users or systems

### Client Responsibilities

- **Initiate requests:** Send an HTTP request to the resource server
- **Handle payment requirements:** Read the \`402 Payment Required\` response and extract payment details
- **Prepare payment payload:** Sign a transaction with their Stacks wallet
- **Resubmit request with payment:** Retry the request with the \`X-PAYMENT\` header containing the signed payment payload

### Client Code Example

\`\`\`typescript
import {
  withPaymentInterceptor,
  privateKeyToAccount
} from 'x402-stacks';
import axios from 'axios';

const account = privateKeyToAccount(privateKey, 'testnet');

// Wrap axios to handle payments automatically
const api = withPaymentInterceptor(
  axios.create({ baseURL: 'http://api.example.com' }),
  account
);

// Make request - payment handled automatically
const response = await api.get('/api/premium-data');
\`\`\`

Clients do not need to manage accounts, credentials, or session tokens beyond their Stacks wallet. All interactions are stateless and occur over standard HTTP requests.

## Server Role

The server is the resource provider enforcing payment for access to its services.

Servers can include:

- API services
- Content providers
- Any HTTP-accessible resource requiring monetization

### Server Responsibilities

- **Define payment requirements:** Respond to unauthenticated requests with HTTP \`402 Payment Required\`, including payment details
- **Verify payment payloads:** Validate incoming payment payloads using the facilitator service
- **Settle transactions:** Upon successful verification, payment is settled on the Stacks blockchain
- **Provide the resource:** Once payment is confirmed, return the requested resource to the client

### Server Code Example

\`\`\`typescript
import express from 'express';
import { x402PaymentRequired, getPayment, STXtoMicroSTX } from 'x402-stacks';

const app = express();

app.get('/api/premium-data',
  x402PaymentRequired({
    amount: STXtoMicroSTX(0.001), // 0.001 STX
    address: 'SP2...',
    network: 'testnet',
    facilitatorUrl: 'https://facilitator.x402stacks.xyz',
  }),
  (req, res) => {
    const payment = getPayment(req);
    res.json({ data: 'Premium content', txId: payment.txId });
  }
);
\`\`\`

Servers do not need to manage client identities or maintain session state. Verification and settlement are handled per request.

## Communication Flow

\`\`\`
┌──────────────────────────────────────────────────────────────┐
│                    x402-stacks FLOW                          │
└──────────────────────────────────────────────────────────────┘

  CLIENT                                              SERVER
    │                                                    │
    │  1. GET /api/premium-data                          │
    │───────────────────────────────────────────────────>│
    │                                                    │
    │  2. 402 Payment Required                           │
    │     { amount, address, network, facilitatorUrl }   │
    │<───────────────────────────────────────────────────│
    │                                                    │
    │  3. Sign payment with Stacks wallet                │
    │                                                    │
    │  4. GET /api/premium-data                          │
    │     X-PAYMENT: <signed-payload>                    │
    │───────────────────────────────────────────────────>│
    │                                                    │
    │                    ┌─────────────┐                 │
    │                    │ FACILITATOR │                 │
    │                    │ - Verify    │                 │
    │                    │ - Settle    │                 │
    │                    └─────────────┘                 │
    │                                                    │
    │  5. 200 OK + Resource                              │
    │     X-PAYMENT-RESPONSE: { txId, amount, sender }   │
    │<───────────────────────────────────────────────────│
\`\`\`

## Summary

In the x402-stacks protocol:

- The **client** requests resources and supplies the signed payment payload using their Stacks wallet
- The **server** enforces payment requirements, verifies transactions via the facilitator, and provides the resource upon successful payment

This interaction is stateless, HTTP-native, and compatible with both human applications and automated agents.`
  },
  {
    id: 'facilitator',
    title: 'Facilitator',
    slug: 'core-concepts/facilitator',
    content: `# Facilitator

This page explains the role of the **facilitator** in the x402-stacks protocol.

The facilitator is a service that simplifies the process of verifying and settling payments between clients (buyers) and servers (sellers) on the Stacks blockchain.

## What is a Facilitator?

The facilitator is a service that:

- **Verifies** payment payloads submitted by clients
- **Settles** payments on the Stacks blockchain on behalf of servers

By using a facilitator, servers do not need to maintain direct blockchain connectivity or implement payment verification logic themselves. This reduces operational complexity and ensures accurate, real-time validation of transactions.

## x402-stacks Facilitator

The official x402-stacks facilitator is hosted at:

\`\`\`
https://facilitator.x402stacks.xyz
\`\`\`

This facilitator:
- Works on both **mainnet** and **testnet**
- Handles STX payment verification
- Submits transactions to the Stacks blockchain
- Returns transaction IDs for tracking

## Facilitator Responsibilities

### 1. Verify Payments

Confirm that the client's payment payload:
- Is properly signed by the client's Stacks wallet
- Meets the server's declared payment requirements (amount, recipient)
- Has not been previously used (replay protection)

### 2. Settle Payments

- Submit validated payments to the Stacks blockchain
- Monitor for transaction confirmation
- Return transaction details to the server

### 3. Provide Responses

Return verification and settlement results to the server, allowing the server to decide whether to fulfill the client's request.

> **Note:** The facilitator does not hold funds or act as a custodian. It performs verification and execution of on-chain transactions based on signed payloads provided by clients.

## Why Use a Facilitator?

Using a facilitator provides:

| Benefit | Description |
|---------|-------------|
| **Reduced complexity** | Servers don't need to interact directly with Stacks nodes |
| **Protocol consistency** | Standardized verification and settlement flows |
| **Faster integration** | Start accepting payments with minimal blockchain-specific development |
| **Security** | Centralized verification prevents common attack vectors |

## Interaction Flow

\`\`\`
1. CLIENT makes HTTP request to RESOURCE SERVER

2. RESOURCE SERVER responds with 402 Payment Required
   {
     "amount": 10,
     "address": "SP2...",
     "network": "testnet",
     "facilitatorUrl": "https://facilitator.x402stacks.xyz"
   }

3. CLIENT signs payment with Stacks wallet

4. CLIENT retries request with X-PAYMENT header

5. RESOURCE SERVER sends payment to FACILITATOR /verify

6. FACILITATOR verifies signature and payment details

7. If valid, FACILITATOR submits to Stacks blockchain

8. FACILITATOR returns transaction ID to RESOURCE SERVER

9. RESOURCE SERVER includes X-PAYMENT-RESPONSE header
   and returns the requested resource to CLIENT
\`\`\`

## Configuration

When setting up a server, configure the facilitator URL:

\`\`\`typescript
import { x402PaymentRequired } from 'x402-stacks';

app.get('/api/data',
  x402PaymentRequired({
    amount: 1000, // microSTX
    address: 'SP2...',
    network: 'testnet',
    facilitatorUrl: 'https://facilitator.x402stacks.xyz',
  }),
  handler
);
\`\`\`

## Environment Variable

Set in your \`.env\` file:

\`\`\`bash
FACILITATOR_URL=https://facilitator.x402stacks.xyz
\`\`\`

## Endpoints

The facilitator exposes these endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| \`/verify\` | POST | Verify a payment payload |
| \`/settle\` | POST | Settle a verified payment on-chain |
| \`/health\` | GET | Health check |

## Summary

The facilitator acts as an independent verification and settlement layer within the x402-stacks protocol. It helps servers:

- Confirm payments without blockchain infrastructure
- Submit transactions on-chain reliably
- Focus on their core API functionality

The official facilitator at \`https://facilitator.x402stacks.xyz\` is ready for both testnet and mainnet use.`
  }
];

export const NAV_STRUCTURE: NavItem[] = [
  {
    id: 'group-1',
    title: 'Getting Started',
    children: [
      { id: 'intro', title: 'Welcome', slug: 'introduction' },
      { id: 'quickstart-buyers', title: 'Quickstart for Buyers', slug: 'getting-started/quickstart-buyers' },
      { id: 'quickstart-sellers', title: 'Quickstart for Sellers', slug: 'getting-started/quickstart-sellers' },
    ]
  },
  {
    id: 'group-2',
    title: 'Core Concepts',
    children: [
      { id: 'http-402', title: 'HTTP 402', slug: 'core-concepts/http-402' },
      { id: 'client-server', title: 'Client / Server', slug: 'core-concepts/client-server' },
      { id: 'facilitator', title: 'Facilitator', slug: 'core-concepts/facilitator' },
    ]
  },
];
