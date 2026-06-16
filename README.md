```markdown
# ⚡ Relay — AI-Native Mini CRM for Shopper Engagement

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/scarlet-sypher/relay?style=for-the-badge&logo=github&logoColor=white)](https://github.com/scarlet-sypher/relay/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/scarlet-sypher/relay?style=for-the-badge&logo=github&logoColor=white)](https://github.com/scarlet-sypher/relay/network)
[![GitHub repo size](https://img.shields.io/github/repo-size/scarlet-sypher/relay?style=for-the-badge&logo=github&logoColor=white)](https://github.com/scarlet-sypher/relay)
[![GitHub last commit](https://img.shields.io/github/last-commit/scarlet-sypher/relay?style=for-the-badge&logo=github&logoColor=white)](https://github.com/scarlet-sypher/relay/commits)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![CRM Service](https://img.shields.io/badge/🔗_CRM_Service-Live_on_Render-4CAF50?style=for-the-badge)](https://relay-crm-np5w.onrender.com)
[![Channel Service](https://img.shields.io/badge/📡_Channel_Service-Live_on_Render-2196F3?style=for-the-badge)](https://relay-channel.onrender.com)
[![Frontend](https://img.shields.io/badge/🌐_Frontend-Live_on_Vercel-000000?style=for-the-badge&logo=vercel)](https://relay-crm-scarlet.vercel.app)
[![AI Powered](https://img.shields.io/badge/AI_Powered-Google_Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

*An AI-native CRM platform for D2C brands to segment shoppers, launch campaigns, and track delivery in real time* 🚀

</div>

---

## 🔗 Quick Links

- **🌐 Live Application**: [https://relay-crm-scarlet.vercel.app](https://relay-crm-scarlet.vercel.app)
- **📁 GitHub Repository**: [https://github.com/scarlet-sypher/relay](https://github.com/scarlet-sypher/relay)
- **🔗 CRM Service API**: [https://relay-crm-np5w.onrender.com](https://relay-crm-np5w.onrender.com)
- **📡 Channel Service API**: [https://relay-channel.onrender.com](https://relay-channel.onrender.com)

---

## 📋 Project Description

**Relay** is a full-stack, AI-native mini CRM built for small-to-mid-size direct-to-consumer brands. It helps marketing teams go from raw customer data to a live, personalised campaign in minutes — without writing SQL, without a data analyst, and without guessing what message to send.

The platform is structured as a monorepo with three services: a React frontend, a Node.js CRM backend, and a separate Channel Service that simulates message delivery and fires async callbacks back into the CRM — modelling how real messaging providers like Twilio or SendGrid actually work.

### 🎯 The Problem It Solves

Small brand marketing teams have customer data sitting unused in spreadsheets and Shopify exports. They know they should be segmenting and targeting — they just do not know how. Relay inverts the traditional CRM model: instead of the marketer bringing the intelligence to the tool, the AI brings the intelligence to the marketer.

### 🌟 What Makes It Different

- **AI is not a feature — it is the product.** Gemini powers audience building, message generation, customer insights, and campaign performance narration across every workflow.
- **A real async delivery loop.** The Channel Service is a separate process that simulates delivery, fires callbacks with realistic delays and probabilities, and models the full communication lifecycle end to end.
- **Idempotent receipt handling.** The callback endpoint validates state transitions and safely ignores duplicate or out-of-order events — designed for real-world reliability from day one.

---

## ✨ Features

<table>
<tr>
<td>

### 🧠 AI-Powered Workflows
- **AI Audience Builder** — Describe your audience in plain English, get structured filter rules
- **Campaign Copilot** — Generate 3 channel-appropriate message variants with tone reasoning
- **Customer Insight Engine** — Per-customer AI characterization and risk flagging
- **Performance Narrator** — AI-written campaign insight after completion

</td>
<td>

### 👥 Customer Management
- **Customer Database** — Searchable, paginated customer table
- **Customer Detail View** — Full profile with order history and live AI insight
- **Order Ingestion** — Create orders with automatic denormalized field updates
- **Segment Tag Tracking** — Auto-assigned AI tags per customer

</td>
</tr>
<tr>
<td>

### 🎯 Audience Segmentation
- **Natural Language Segment Builder** — AI translates descriptions into filter rules
- **Manual Filter Builder** — Condition-based filtering with AND/OR logic
- **Live Segment Preview** — Real-time customer count before saving
- **Segment Library** — Reusable saved segments with descriptions

</td>
<td>

### 📣 Campaign Management
- **Campaign Creator** — Name, audience, channel, and message in one flow
- **One-Click Launch** — Dispatches to Channel Service with personalization resolved
- **Live Campaign Tracker** — Auto-polling communication log while campaign is sending
- **Campaign State Machine** — DRAFT → SENDING → COMPLETING → COMPLETED lifecycle

</td>
</tr>
<tr>
<td>

### 📡 Channel Service & Delivery Simulation
- **Async Callback Loop** — Separate service fires SENT, DELIVERED, OPENED, READ, CLICKED events
- **Realistic Probabilities** — Delivery and engagement rates based on industry benchmarks per channel
- **Exponential Backoff Retry** — Up to 3 retry attempts if CRM receipt endpoint is unreachable
- **Idempotent Receipt Handling** — State transition validation prevents invalid or duplicate updates

</td>
<td>

### 📊 Analytics
- **Campaign Analytics Table** — Delivery rate, open rate, click rate per campaign
- **Engagement Funnel Chart** — Visual drop-off at each communication stage
- **Cross-Campaign Charts** — Delivery and rate trend comparisons
- **Aggregated KPIs** — Total sent, average delivery rate, total clicks across all campaigns

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge)](https://recharts.org/)

### Backend — CRM Service
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

### Backend — Channel Service
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

### AI & Database
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Neon](https://img.shields.io/badge/Neon_PostgreSQL-00E699?style=for-the-badge)](https://neon.tech/)

</div>

### 📦 Key Dependencies

| Frontend                  | CRM Service        | Channel Service      |
|---------------------------|--------------------|----------------------|
| `react` `react-dom`       | `express` `prisma` | `express` `zod`      |
| `react-router-dom`        | `@prisma/client`   | `tsx` `typescript`   |
| `axios`                   | `@google/genai`    | `cors` `dotenv`      |
| `recharts`                | `zod` `uuid`       | `uuid`               |
| `lucide-react`            | `cors` `dotenv`    | —                    |
| `tailwind-merge` `clsx`   | `typescript` `tsx` | —                    |
| `date-fns`                | —                  | —                    |

---

## 🏗️ Architecture Overview

<!-- TODO: Replace the placeholder image below with your actual architecture flow diagram -->
<div align="center">
  <img src="https://via.placeholder.com/1000x500.png?text=System+Architecture+Flow+Diagram+Placeholder" alt="Relay System Architecture Flow Diagram" width="800" />
</div>

Relay is a monorepo with three independently deployable services.

```
relay/
├── client/          →  React + TypeScript frontend (Vercel)
├── crm-service/     →  Node.js CRM backend with Prisma + PostgreSQL (Render)
└── channel-service/ →  Node.js delivery simulator with async callbacks (Render)
```

### Async Callback Flow

```
Marketer clicks "Launch"
        │
        ▼
CRM Service
  ├── Creates Communication records (QUEUED)
  ├── Updates Campaign → SENDING
  └── POST /api/send → Channel Service
              │
              ▼ 202 Accepted (non-blocking)
        Channel Service
          └── For each communication (async):
                ├── Fires SENT callback → CRM /api/receipt
                ├── Simulates delivery delay (1–3s)
                ├── Fires DELIVERED or FAILED callback
                ├── If delivered → simulates engagement
                │     ├── OPENED (5–15s delay)
                │     ├── READ   (3–10s delay)
                │     └── CLICKED (2–8s delay)
                └── Retries on failure (exponential backoff × 3)
                          │
                          ▼
                    CRM /api/receipt
                      ├── Validates state transition
                      ├── Updates Communication status
                      ├── Re-aggregates CampaignAnalytics
                      └── When all resolved → COMPLETED + AI Insight
```

### Simulation Probabilities

| Event                 | Email | SMS   | WhatsApp |
|-----------------------|-------|-------|----------|
| Delivered             | 85%   | 92%   | 96%      |
| Opened (of delivered) | 28%   | —     | 45%      |
| Read (of opened)      | 80%   | —     | 90%      |
| Clicked (of read)     | 12%   | 18%   | 15%      |

---

## 📁 Project Structure

```text
relay/
├── client/                          # 🌐 React + Vite frontend (Port 5173)
│   ├── public/                      # Static assets
│   └── src/                         # Application source code
│       ├── api/                     # Axios API layer per resource
│       ├── common/                  # Shared components (Spinner, EmptyState, Pagination, etc.)
│       ├── constants/               # Channel labels, status colors, nav items
│       ├── contexts/                # Toast notification context
│       ├── hooks/                   # Data hooks with polling support
│       ├── layouts/                 # AppLayout with sidebar + mobile drawer
│       ├── pages/                   # Dashboard, Customers, Segments, Campaigns, Analytics, AI Studio, Health
│       ├── routes/                  # React Router setup with lazy loading
│       ├── types/                   # Shared TypeScript interfaces
│       └── utils/                   # Currency, date, string formatters
│
├── crm-service/                     # ⚙️ Node.js CRM backend (Port 5000)
│   ├── prisma/
│   │   └── schema.prisma            # Database schema
│   └── src/
│       ├── ai/                      # Gemini AI integration modules
│       │   ├── config/              # Gemini client setup
│       │   ├── prompts/             # Structured prompts per AI feature
│       │   ├── services/            # Copilot, Audience, Insight, Customer AI services
│       │   └── types/               # AI response interfaces
│       ├── config/                  # Environment config
│       ├── constants/               # Enums, state transition map
│       ├── controllers/             # Thin request handlers
│       ├── middleware/              # Logger, error handler, Zod validation
│       ├── repositories/            # Prisma database access layer
│       ├── routes/                  # Express route definitions
│       ├── services/                # Business logic layer
│       ├── utilities/               # Prisma client, response helpers, segment filter
│       └── validators/              # Zod schemas per resource
│
└── channel-service/                 # 📡 Delivery simulation service (Port 5001)
    └── src/
        ├── config/                  # Environment config
        ├── constants/               # Probabilities, delays, retry config
        ├── controllers/             # Send and health controllers
        ├── dispatcher/              # Callback firing with retry logic
        ├── middleware/              # Logger, error handler, validation
        ├── routes/                  # Send route
        ├── services/                # Send orchestration service
        ├── simulator/               # Delivery and engagement simulators
        ├── types/                   # Channel types and payload interfaces
        ├── utilities/               # Response helpers
        └── validators/              # Zod send request schema
```

---

## ⚙️ Environment Setup

### CRM Service — `crm-service/.env`

```env
PORT=5000
DATABASE_URL=<YOUR_NEON_DATABASE_URL>
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
CHANNEL_SERVICE_URL=<YOUR_CHANNEL_SERVICE_URL>
CRM_RECEIPT_URL=<YOUR_CRM_SERVICE_BASE_URL>
```

| Variable              | Description                                                                                                    |
|-----------------------|----------------------------------------------------------------------------------------------------------------|
| `DATABASE_URL`        | Neon PostgreSQL connection string. Format: `postgresql://USER:PASS@HOST/DB?sslmode=require`                    |
| `GEMINI_API_KEY`      | Google AI Studio API key for Gemini                                                                            |
| `CHANNEL_SERVICE_URL` | Base URL of the Channel Service. Local: `http://localhost:5001`                                                |
| `CRM_RECEIPT_URL`     | Base URL of the CRM Service itself. The Channel Service appends `/api/receipt` to this. Local: `http://localhost:5000` |

### Channel Service — `channel-service/.env`

```env
PORT=5001
CRM_RECEIPT_URL=<YOUR_CRM_SERVICE_BASE_URL>
```

| Variable          | Description                                                                                       |
|-------------------|---------------------------------------------------------------------------------------------------|
| `CRM_RECEIPT_URL` | Base URL of the CRM Service. Local: `http://localhost:5000`. Production: your deployed CRM URL.   |

### Frontend — `client/.env`

```env
VITE_CRM_API_URL=http://localhost:5000/api
VITE_APP_NAME=Relay
VITE_POLL_INTERVAL_MS=3000
```

| Variable                | Description                                                              |
|-------------------------|--------------------------------------------------------------------------|
| `VITE_CRM_API_URL`      | CRM Service API base URL                                                 |
| `VITE_APP_NAME`         | Application display name                                                 |
| `VITE_POLL_INTERVAL_MS` | How often the campaign detail page polls for live updates (milliseconds) |

---

## 🚀 Installation & Running

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- A **Neon PostgreSQL** account (or any PostgreSQL instance)
- A **Google AI Studio** account for the Gemini API key

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/scarlet-sypher/relay.git
cd relay
```

### 2️⃣ CRM Service Setup

```bash
cd crm-service

# Install dependencies
npm install

# Create and configure your .env file
# (see Environment Setup section above)

# Generate Prisma client and push schema to database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

CRM Service runs at `http://localhost:5000` 🚀

### 3️⃣ Channel Service Setup

```bash
# Open a new terminal
cd channel-service

# Install dependencies
npm install

# Create and configure your .env file

# Start development server
npm run dev
```

Channel Service runs at `http://localhost:5001` 📡

### 4️⃣ Frontend Setup

```bash
# Open a new terminal
cd client

# Install dependencies
npm install

# Create and configure your .env file

# Start development server
npm run dev
```

Frontend runs at `http://localhost:5173` 🎨

### 5️⃣ Access the Application

| Service | Local URL |
|---------|-----------|
| Frontend | [http://localhost:5173](http://localhost:5173) |
| CRM API | [http://localhost:5000/api](http://localhost:5000/api) |
| Channel Service | [http://localhost:5001](http://localhost:5001) |

---

## 📚 API Reference

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Service health check |

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/customers` | Create a new customer |
| `GET` | `/api/customers?page=1&limit=20` | List customers (paginated) |
| `GET` | `/api/customers/:id` | Customer detail + live AI insight |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/orders` | Create an order (updates customer denormalized fields) |
| `GET` | `/api/orders/customer/:customerId` | Get orders for a customer |

### Segments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/segments` | Create a segment from filter rules |
| `GET` | `/api/segments` | List all segments |
| `GET` | `/api/segments/:id` | Segment detail |
| `POST` | `/api/segments/preview` | Preview customer count for filter rules without saving |
| `POST` | `/api/segments/build-nl` | Translate natural language query into filter rules via AI |

### Campaigns

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/campaigns` | Create a campaign (status: DRAFT) |
| `GET` | `/api/campaigns` | List all campaigns with analytics |
| `GET` | `/api/campaigns/:id` | Campaign detail with communications and analytics |
| `POST` | `/api/campaigns/:id/launch` | Launch a DRAFT campaign |

### Receipt (Channel Service Callbacks)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/receipt` | Receive delivery/engagement callbacks from Channel Service |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics` | All campaign analytics with campaign metadata |
| `GET` | `/api/analytics/:campaignId` | Analytics for a specific campaign |

### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/generate-message` | Generate 3 campaign message variants via Gemini |
| `POST` | `/api/ai/build-audience` | Translate natural language audience description into filter rules |

### Channel Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Channel Service health check |
| `POST` | `/api/send` | Accept send batch from CRM and begin async simulation |

---

## 🗄️ Data Model

### Core Entities

| Entity | Purpose |
|--------|---------|
| `Customer` | Shopper profile with denormalized spend and order fields for fast segment queries |
| `Order` | Purchase history linked to customer |
| `Segment` | Saved filter rule set (stored as JSON, re-evaluated on each campaign launch) |
| `Campaign` | Campaign configuration with state machine lifecycle |
| `Communication` | One record per customer per campaign, tracks full event lifecycle |
| `CampaignAnalytics` | Denormalized aggregated stats, updated on every callback received |

### Campaign Lifecycle

```
DRAFT → SCHEDULED → SENDING → COMPLETING → COMPLETED
                                          → FAILED
```

### Communication Lifecycle

```
QUEUED → SENT → DELIVERED → OPENED → READ → CLICKED
              → FAILED
```

State transitions are strictly forward-only. The receipt endpoint validates each incoming callback against the current state and rejects any invalid or backward transition.

---

## 🔗 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [https://relay-crm-scarlet.vercel.app](https://relay-crm-scarlet.vercel.app) |
| CRM Service | Render | [https://relay-crm-np5w.onrender.com](https://relay-crm-np5w.onrender.com) |
| Channel Service | Render | [https://relay-channel.onrender.com](https://relay-channel.onrender.com) |
| Database | Neon PostgreSQL | Managed cloud PostgreSQL |

---

## 🎯 Design Decisions & Tradeoffs

| Decision | What I did | Why | What I'd change at scale |
|----------|-----------|-----|--------------------------|
| Channel Service separation | Separate process on a different port | Models real-world messaging provider architecture; forces honest async design | Containerise independently, add message queue between CRM and Channel Service |
| Idempotent receipt endpoint | State transition validation map | Prevents duplicate callbacks from corrupting communication state | Add idempotency key header for distributed deduplication |
| Denormalized customer fields | `totalSpend`, `totalOrders`, `lastOrderAt` on Customer table | Segment queries run these filters constantly — joining orders on every preview is too slow | At 100k+ customers, pre-compute segment membership in a background job |
| Frontend polling | Poll campaign endpoint every 3 seconds while SENDING | Simpler than WebSockets for this scope | Replace with WebSocket connection for true real-time updates |
| Synchronous AI calls | Gemini calls are inline in the request cycle | Simpler code, acceptable latency for demo | Move to async job queue with streaming results back to client |
| SQLite → PostgreSQL | Neon PostgreSQL from day one | Production-ready, supports Prisma fully, free managed tier | Same — no change needed |

---

## 🤝 Contributing

Contributions are welcome.

1. **Fork the repository**
   ```bash
   git clone https://github.com/scarlet-sypher/relay.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing TypeScript patterns and folder structure
   - Keep controllers thin — business logic belongs in services
   - Validate all inputs with Zod schemas
   - Test the full campaign flow after any changes to campaign or receipt logic

4. **Commit your changes**
   ```bash
   git commit -m "feat: your feature description"
   ```

5. **Push and open a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- 🤖 **Google Gemini** for powering the AI audience builder, campaign copilot, customer insights, and performance narrator
- 🗄️ **Neon** for serverless PostgreSQL that works perfectly with Prisma and Render deployments
- 🎨 **Tailwind CSS** for the design system
- 📊 **Recharts** for the analytics charts
- 🔧 **Prisma** for type-safe database access and schema management

---

## 🔗 Links

- 🌐 **Live App**: [https://relay-crm-scarlet.vercel.app](https://relay-crm-scarlet.vercel.app)
- 🔗 **CRM Service**: [https://relay-crm-np5w.onrender.com](https://relay-crm-np5w.onrender.com)
- 📡 **Channel Service**: [https://relay-channel.onrender.com](https://relay-channel.onrender.com)
- 📁 **Repository**: [https://github.com/scarlet-sypher/relay](https://github.com/scarlet-sypher/relay)
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/scarlet-sypher/relay/issues)

---

<div align="center">

### Built for the Xeno Engineering Assignment

*An AI-native CRM where the AI does cognitive work — not just text generation*

[![Live App](https://img.shields.io/badge/🌐_Try_Relay_Now-Open_App-4CAF50?style=for-the-badge)](https://relay-crm-scarlet.vercel.app)
[![Repository](https://img.shields.io/badge/📁_View_Code-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/scarlet-sypher/relay)

⭐ **Star the repository if you found it useful** ⭐

</div>
```