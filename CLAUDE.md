# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

Convert n8n Cloud workflows into full web apps, and create/update n8n workflows from scratch. Each app is a Next.js frontend that communicates with n8n via webhooks.

## Stack

- **Frontend**: Next.js (App Router) + React + Tailwind CSS + shadcn/ui
- **Auth**: Supabase Auth
- **Automation**: n8n Cloud (webhooks as the API layer)
- **Monorepo**: pnpm workspaces + Turborepo
- **Deploy**: Vercel (auto-deploy on push to `main`)
- **GitHub**: github.com/richartclick

## Monorepo Structure

```
/
├── apps/


│   └── <app-name>/        # one Next.js app per n8n workflow
│       ├── app/
│       ├── components/
│       └── lib/
├── packages/
│   └── ui/                # shared shadcn/ui components
├── turbo.json
└── pnpm-workspace.yaml
```

## Workflow: n8n → App

**Step 1 — Analyze the n8n workflow**
- Use the n8n MCP to inspect the workflow
- Confirm the webhook trigger has the correct HTTP method and path
- Verify the expected request body (fields the frontend must send)
- Verify the response body (fields the frontend will display)
- Optimize the workflow if needed before building the frontend

**Step 2 — Build the frontend locally**
- Create a new app under `apps/<app-name>/`
- Use shadcn/ui components and Tailwind for UI
- Call the n8n webhook from a Next.js Server Action or Route Handler (never from the client — keeps the webhook URL hidden)
- Protect routes with Supabase Auth middleware

**Step 3 — Test locally**
```bash
pnpm dev --filter=<app-name>
```

**Step 4 — Push & deploy**
```bash
git add .
git commit -m "feat: <app-name> app"
git push origin main
# Vercel auto-deploys from main
```

## Common Commands

```bash
# Install all dependencies
pnpm install

# Run a specific app in dev mode
pnpm dev --filter=<app-name>

# Build all apps
pnpm build

# Add a shadcn/ui component to an app
pnpm dlx shadcn@latest add <component> --cwd apps/<app-name>

# Create a new app
pnpm create next-app apps/<app-name> --typescript --tailwind --app
```

## n8n Integration Rules

- Webhooks must always be called **server-side** (Server Action or Route Handler) — never expose the webhook URL to the browser
- Store webhook URLs in `.env.local` as `N8N_WEBHOOK_<APP_NAME>`
- n8n must end with a `Respond to Webhook` node so the app gets a clean JSON response
- Always validate the response shape before rendering

## Auth (Supabase)

- Use `@supabase/ssr` with Next.js App Router
- Protect routes via `middleware.ts` using `supabase.auth.getUser()`
- Session is stored in cookies; middleware refreshes it on every request
- User identity (`user.id`, `user.email`) can be forwarded to n8n via the webhook payload if needed

## Environment Variables

Each app needs a `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
N8N_WEBHOOK_<APP_NAME>=
```

## Tools Available

- **n8n MCP** — view, create, and modify n8n Cloud workflows and nodes
- **GitHub MCP** — commit and push changes to github.com/richartclick
- **n8n skill** — n8n-specific patterns and guidance
- **Frontend designer skill** — UI/UX decisions and component design
