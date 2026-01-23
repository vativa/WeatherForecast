## Codex Agent Instructions LONG term (agent-readonly)
./.agent-readonly/*

## Codex Agent Instructions SHORT term (agent-writable)
- After new PR is created, check README.md, propose updates if necessary, and afterwards return to the main branch
- Look for code consistency accross different categories of code: UI components, business logic, models, configs
- Optimize safety: what is exposed to user, and what is exposed to the public repository

## Codex Agent Instructions for agent SELF improvements (non human usage, keep under 10 lines)
Track recurring mistakes and add a one-line guardrail for each (e.g., always check .agent-docs/* first).
