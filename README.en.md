# dsh-v-hive · V Hive

[简体中文](README.md) | **English**

A DeepSeek Harness Web plugin: builds a 3D "infinite hive" with three.js — workspaces are hexagonal studios, sessions are worker bees, archives are stored honey, making session management spatial.

Purely additive plugin: replaces or disables nothing from the official set.

## Features

### 3D hive scene

- Workspace = hexagonal open-top studio; drag the whole hive to move it; hexDist anti-overlap
- Session = worker bee, five-state coloring: standby gray-white / busy blue / help amber / returning-with-honey green / archived honey
- Click a bee to switch the current session (zero intrusion into official UI); hover/selection projects an HTML conversation card
- Archived sessions become amber honey cups in the honey layer beneath the hive (visible underground)

### Session float window

- The official session page appears as a centered float window above the hive page (pure CSS reshaping, zero intervention in official render order)
- ✕ / mask click / Esc to collapse; drafts survive collapsing; official and plugin extensions reused as-is

### Context hotbar

- A bottom m×n card array switching by selection:
  **hive bar** (summon a new bee: bee type + preset prompt + auto-send), **floor bar** (create a hive, optionally with a bee), **bee bar** (append prompt to composer / followup direct send)
- Built-in action cards: Continue / Archive session / Open session (always on the bee bar); Create hive (floor-bar fallback)
- ⌘ command editor: slot CRUD, reordering, field validation, 409 conflict replay

### Worker bee array panel

- With a hive selected, the canvas right edge shows that hive's worker-bee cards (state dot + title + todo progress + bee-type badge); click a card to switch sessions

### Model tools (summon chain)

- `hive_summon`: summon a new bee — create session → bind bee type → select model → post the first message
- `hive_wait`: event-driven wait for the target session to go quiet (30min cap, cancellation propagates)
- In-session models can autonomously "summon → wait for completion → report back"

### Interaction details

- Z/C keyboard camera rotation (arbitration guards against mistyping); E to jump to the current session; top session brief bar
- Hover shows six-field tips (status / workspace / in-hive session count / tokens / DPS etc.)
- Bee→drone honey-gold links, summon violet links; drones are not selectable

### Settings & entry

- ⚙ In-page settings: Scene (animation / drones / watermark / shortcuts / camera follow), Appearance (walls / palette / trim), Layout (array parameters)
- Entry: "Hive" seat button at the sidebar bottom + back-to-hive button in the session header + shortcut (default Alt+H)
- Layout and hotbar configs are persisted by the host (`~/.dsh/storages/dsh-hive.json`, revision optimistic lock), synced across tabs via SSE

## Install

**Method 1 · Install from GitHub (recommended)** — lib/ is committed with the repo, no build needed:

```sh
dsh plugin --profile web add "github:victor10035445/dsh-v-hive"
```

Pin a version: `dsh plugin --profile web add "github:victor10035445/dsh-v-hive#<commit-sha>"`

**Method 2 · Local clone + link** (good for development):

```sh
git clone https://github.com/victor10035445/dsh-v-hive.git
dsh plugin --profile web add "link:<clone path>"
```

**Method 3 · tgz package install**:

```sh
npm pack
dsh plugin --profile web add "<absolute path to the tgz>"
```

**Restart `dsh web`** after installing. Alternatively add `- insert: [{id: dsh-v-hive, name: dsh-v-hive}]` to `~/.dsh/profiles/web/cordis.patch.yml` manually (with `patchReload: live`, saving hot-reloads).

> **Minimum DSH version: 0.1.2-rc.1** (the client store depends on the seed module `@deepseek-ai/dsh-client-store`).

## Build from source

```sh
pnpm install
pnpm build   # src/client.jsx → lib/client.js; src/index.mjs → lib/index.js
pnpm check   # syntax check
pnpm test    # 35 smoke tests
```

After changing client sources, `pnpm build` triggers client-hmr hot reload without refresh; host-half changes (`src/index.mjs`) require restarting dsh.

## Architecture

Dual-half plugin (modeled after the mature `dsh-v-explorer` shape):

| Half | Content |
|---|---|
| Host `lib/index.js` | cordis plugin: `/api/dsh-hive/state` (zod + optimistic lock + atomic write), `/events` (SSE broadcast), `/summon` (slot summon), `/send` (bee-bar direct send); registers model tools `hive_summon` / `hive_wait` |
| Client `lib/client.js` | esbuild lazy CJS factory; react / @deepseek-ai/* external, three bundled in |
| `cordis.patch.yml` | loader `- insert` registration |
| `package.json` | `dsh.bundle.patch` / `dsh.client.platform:"web"` declarations |

Hotbar configs persist in the layout document's optional `hotbars` field (three bars: hive / bee / floor, 32 entries per bar, built-in cards never stored):

```jsonc
{
  "hotbars": {
    "hive":  [ { "id": "…", "name": "Summon design bee", "summon": true, "beeTypeId": "bt-design", "prompt": "…", "autoSend": false } ],
    "bee":   [ { "id": "…", "name": "Run tests", "prompt": "…", "autoSend": true } ],
    "floor": [ { "id": "…", "name": "New hive with bee", "createBee": true, "autoSend": false } ]
  }
}
```

## License

MIT
