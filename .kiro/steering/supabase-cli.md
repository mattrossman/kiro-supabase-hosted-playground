---
inclusion: always
---

Assume Supabase CLI is already installed.

Depending on the user's installation, you'll invoke Supabase CLI:
- Globally with `supabase`
- From `node_module` using a package manager such as `npx supabase`, `pnpm supabase`, etc.

Other documents may reference bare `supabase` commmands, but prefix with package manager as-needed.

If `supabase` CLI isn't installed, offer to help install it, preferably as a devDependency with project's package manager (check for lockfiles).
```bash
pnpm install -D supabase
npm install -D supabase
# etc
```
Otherwise you can download and execute it on-the-fly with `npx`:
```bash
npx supabase@latest <rest-of-command>
```

For first-time setup, run `supabase init --yes` to initialize the `supabase/` with a `config.toml`.

# Documentation

Refer to https://supabase.com/docs/reference/cli for guidance on which commands to use for given request.

# Troubleshooting

- `supabase start` failing due to port conflict: Stop the offending instance with `supabase stop --project-id <id>` then retry