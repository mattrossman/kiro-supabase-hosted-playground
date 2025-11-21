# Setup

Install dependencies

```bash
pnpm install
```

Start local Supabase stack:

```bash
pnpm supabase start
```

The Supabase MCP server in `.kiro/settings/mcp.json` is configured to connect to the local Supabase stack. Check the "MCP Servers" view in Kiro to ensure it's connected.

Copy `.env.example` to `.env` and populate `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` with the publishable key shown in the output of `pnpm supabase status` (or ask the MCP server to list the anon key for you).

# Develop

Start the Next.js app

```bash
pnpm dev
```

Serve functions

```bash
pnpm supabase functions serve
```