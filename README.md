# AI Chat Assistant

AI Chat Assistant built with [Next.js](https://nextjs.org), [Prisma](https://www.prisma.io/) (PostgreSQL), and [Mistral AI](https://mistral.ai/).

## Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- A running **PostgreSQL** database
- A **Mistral AI** API key get one at [console.mistral.ai](https://console.mistral.ai/)

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-chat-assistant
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example env file and fill in the values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# PostgreSQL connection string
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=XXXXXXXXXXXX"

# Mistral AI API key
MISTRAL_API_KEY="mistral_api_key"
```

### 4. Apply database migrations

```bash
pnpm prisma migrate deploy
pnpm prisma generate
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
