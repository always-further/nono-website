# Content Strategy — nono.sh

This file guides content creation for SEO. For technical SEO requirements (metadata, structured data, frontmatter), see CLAUDE.md.

## Keyword Ownership

Each page owns a keyword cluster. Never create content that competes with another page's primary keywords.

| Page | Primary Keywords | Long-Tail |
|---|---|---|
| `/python-sandbox` | python sandbox, python sandbox untrusted code | run untrusted python, secure python execution |
| `/node-sandbox` | node sandbox, node sandbox linux | secure node execution, run untrusted javascript |
| `/linux-sandbox` | linux sandbox, isolate process linux | run untrusted code linux, kernel sandbox linux |
| `/python-sdk` | nono python sdk, nono-py | (product term, not SEO target) |
| `/typescript-sdk` | nono typescript sdk, nono-ts | (product term, not SEO target) |
| `/undo` | undo agent changes, rollback filesystem | atomic rollback, reversible execution |
| `/audit-trail` | audit trail ai agents, agent audit log | cryptographic audit log, tamper-evident logging |
| `/runtime-supervisor` | runtime supervisor, dynamic permissions | agent permission expansion, supervisor pattern |
| `/provenance` | code provenance, sigstore signing | supply chain security, instruction signing |

SDK pages are product pages. Sandbox pages are SEO landing pages. They serve different intents — do not merge them.

## Core Page Content Structure

Every core SEO page (`/python-sandbox`, `/node-sandbox`, `/linux-sandbox`) must include these sections in order:

1. **Problem framing** — Why running untrusted code is dangerous. Speak to the developer's pain.
2. **Code example** — Show nono solving the problem in <10 lines. This appears above the fold.
3. **Sandboxing explanation** — What isolation is applied and how.
4. **Undo / rollback** — Atomic snapshots, restoring pre-session state.
5. **Audit trail** — What gets logged, how it's tamper-evident.
6. **Permission control** — Supervisor pattern, dynamic expansion.
7. **Kernel enforcement** — Brief: seccomp, Landlock/Seatbelt, namespaces. Keep short.
8. **Comparison with Docker** — Why nono is different. Not a teardown — a positioning section.

Target depth: 800–1500 words. Thin pages will not rank.

## Progressive Depth Model

Layer content so developers can stop reading at any point and still get value.

**Layer 1 — Developer-friendly explanation.** Plain language. What does nono do for me? This is the first 30% of the page.

**Layer 2 — Execution model.** Sandbox + undo + audit as a system. How they work together. This is the middle 40%.

**Layer 3 — Kernel-level detail.** Seccomp, Landlock, Seatbelt, namespaces. This is the final 30%.

Do NOT lead with kernel terminology. A developer searching "python sandbox" does not want to read about seccomp in the first paragraph.

## Guide Content

Guides live at `/guides/[slug]` and capture long-tail search queries. They are teaching content, not feature pages.

Required guides (create if missing):
- `/guides/run-untrusted-python` — "run untrusted python" query
- `/guides/node-sandbox` — "node sandbox" query
- `/guides/docker-vs-safe-execution` — comparison query, high conversion
- `/guides/isolate-ai-agents` — "isolate ai agents" query

Each guide should:
- Open with the problem the reader searched for
- Show a working solution with nono in the first section
- Link to the relevant core page (e.g., guide about python links to `/python-sandbox`)
- Link to at least one other guide
- Target 600–1000 words

## Pattern Page

`/patterns/reversible-agent-execution` is the narrative anchor. All major pages should reference this pattern using consistent terminology:

- "Reversible execution" — the ability to undo any agent action
- "Sandbox + undo + audit" — the three pillars, always in this order
- "Runtime safety" — the category nono defines

The pattern page explains the execution model abstractly. Core pages and guides apply it concretely.

## Internal Linking Rules

### Required links

- Core pages (`/python-sandbox`, `/node-sandbox`, `/linux-sandbox`) link to each other
- Guides link to the relevant core page
- All major pages link to `/patterns/reversible-agent-execution`
- Pattern page links back to all core pages
- Docs pages (hosted at [nono.sh/docs](https://nono.sh/docs)) should be linked from guides for CLI reference

### Avoid

- Orphan pages (every page must be reachable from at least 2 other pages)
- Two pages targeting the same primary keyword
- Docs content that duplicates a core page's keyword ownership

## Writing Rules

- Fewer, deeper pages beat many thin pages
- Use real code examples, not pseudocode
- Introduce complexity progressively — never front-load jargon
- No keyword stuffing. Use the primary keyword 2-3 times naturally; rely on semantic relevance
- When comparing to Docker, be factual and specific. No FUD.
- Use "nono" lowercase, never "Nono" or "NONO"
