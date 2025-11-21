# Contents

- `settings/mcp.json` configures Supabase CLI's MCP server
- `steering/prompts/` contains copies of our [example prompts](https://github.com/supabase/supabase/tree/master/examples/prompts), adapted as steering files with "manual" inclusion
  - These may be more useful once Kiro supports keyword-based inclusion, as they're likely too large to "always" include
- `steering/supabase-cli.md` explains how to interact with Supabase CLI
- `steering/supabase-mcp-cli.md` explains unique workflows for Supabase CLI's MCP server
- `steering/supabase-mcp-hosted.md` explains unique workflows for Supabase's hosted MCP server

Here only `supabase-cli.md` and `supabase-mcp-cli.md` use "always" inclusion mode, as this project tests development with Supabase CLI and its included MCP server.