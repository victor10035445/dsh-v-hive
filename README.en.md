# dsh-v-hive · V Hive

[简体中文](README.md) | **English**

A DeepSeek Harness Web plugin: builds a 3D "infinite hive" on the DSH Web page with three.js — visualizing workspaces as hexagonal hive studios, sessions as worker bees, and archived sessions as honey stored beneath the comb, enabling spatial management and operation of sessions.

Purely additive plugin: replaces or disables nothing from the official set; official capabilities are consumed exclusively through injected client services and host-half RPC.

## Features

- **3D infinite hive**: workspace (directory) = a hexagonal open-top studio; the whole hive is drag-movable (hexDist anti-overlap with a forced one-cell breathing gap); session = worker bee: `blank` sessions spawn no bee (a bee appears after the first request); five-state coloring — standby gray-white / busy blue / help amber (waiting for human) / returning-with-honey green / archived honey; hovered/selected bees project an HTML conversation card; clicking a bee → switches the current session (`ctx.sessions.open`, zero intrusion into official UI);
- **Session float window**: the official session page is presented as a fixed centered float window above the hive page — pure CSS reshaping + mask holes (zero intervention in official render order, zero unmount/remount), ✕ / mask click / Esc to collapse, drafts survive collapsing, plugin extensions (composer dock entries etc.) reused as-is; the bee card's "open session" routes to the same float window;
- **Context hotbar**: a fixed m×n card array at the bottom of the page, switching exclusively among three scene selections — hive selected = **hive bar** (summon card: summon a new bee + bee type + preset prompt + auto-send; disabled when summoning is off), floor selected = **floor bar** (create-hive card: via the official directory picker `pickDirectory` → `workspaces.create`, optionally summoning a bee per slot), worker bee selected = **bee bar** (dual channel: auto-send unchecked = append the prompt into the composer and raise the float window for review; checked = direct followup send via the host `POST /api/dsh-hive/send`). Compact rendering: functional cards per slot count (no empty placeholder cards); slots beyond capacity are not rendered (config preserved).
  **Built-in action cards**: **bee bar, always-on** — "Continue" (followup direct send) + "Archive session" (archives the current session bee: becomes stored honey, irreversible; same verb as the bee card / context menu) + "Open session" (collapses the hive page straight to the current session's standard view) are always appended after user slots and never withdrawn by customization (capacity shortage pushes tail-first, user cards first); **floor bar fallback** — "Create hive" (pure creation) appears when there are no user slots and withdraws once there are; the hive bar has no default card (summoning is covered by user slots; an empty hive bar renders nothing); card names and built-in prompts switch instantly with the UI language (zh/en), never persisted and absent from the command editor; built-in cards follow the same three-state gating, float-window pausing, in-flight disabling and capacity truncation as user cards; prompt cards reuse the same action chain; card faces carry a "built-in" badge (hover hint: bee bar = always-on note, floor bar = withdrawal note); action cards (archive/open) additionally carry a honey-gold outline (same source as the archived honey gold in the scene), distinct from the "blue border = ⚡direct send" semantics;
- **Worker bee array panel**: when a hive is selected, the right edge of the canvas overlays an array of that hive's worker-bee cards (state dot + title + todo progress + 🐝 drone badge + bee-type badge), ordered by bee-slot grid order, vertically scrollable beyond capacity (everything reachable); clicking a card = clears hive selection + switches the current session (same semantics as clicking a 3D bee);
- **Command editor**: the ⌘ entry in the page header (next to swarm editing) opens a left-rail three-section modal (hive/bee/floor bars): slot CRUD + reorder up/down + field-linkage validation + draft-save model (409 replay);
- **Tool summon chain**: the host half registers two model-callable native tools via `ctx.tools.register` — `hive_summon` (summon a new bee: create a session in the same hive → bind bee type → select model → post the first message `⟡<bee-type>·summon` + payload + presetPrompt; missing `workspaceId` = the hive of the originating session, subagent sessions resolve up the `parentSession` chain with cwd fallback, wild-bee structured errors; serialized bee types occupy/queue on the lane; a fuse charges spawn counts to the parent-chain root session) and `hive_wait` (event-driven wait for the target session to go quiet: check at entry, amber reports `waiting-interaction` immediately, 30min timeout cap, cancellation propagates). In-session models can autonomously "summon → wait for completion → report back"; bee-type-level `presetPrompt` (B-side behavior definition) is configured in the swarm editing float window; the summon/wait prompt signatures are frozen — translation or rewriting is forbidden;
- **Interaction polish** (7 items): ① **drones are not selectable** — clicking a drone/degraded parked bee does nothing (hover tips and double-click focus remain), subagent sessions open via the official sidebar tree; ② **Z/C keyboard rotation** — hold Z/C to rotate the camera azimuth continuously (Z counter-clockwise / C clockwise, fixed angular speed integrated per frame, frame-rate independent, pitch locked), arbitration guards ignore keys when focus is in text inputs / modals / float windows / active drags, window blur clears keys to prevent idle spinning; ③ **E to session** — with the (current-session) worker bee selected, pressing E collapses the hive page straight to that session's standard session view (no float window); ④ **top session brief bar** — when the current session is a rendered worker bee, a read-only brief appears at the top of the viewport (title + last-turn prompt/response previews, truncated when oversized, `-` placeholder when missing; pure preview, clicking does not navigate); ⑤ **hover tips** — hovering a bee/drone shows six-field transient tips (type / status / owning workspace / in-hive session count / token four-bucket total / average DPS, `-` when no data, no cost field); ⑥ **bee→drone links** — when a (persistent, on selection) worker bee is hovered or selected, semi-transparent honey-gold links connect it to all visible drones (following orbiting positions per frame; hovering a drone shows no links); ⑦ **summon links** — bees summoned via `hive_summon` / capability spawn / manual hatching connect to their summoner in a secondary violet (shown when either the summoner or the summoned bee is hovered/selected; summon edges are recorded in the layout document's optional `summonEdges` field — version stays 1, capped at 512, pruned automatically as sessions archive/disappear; links silently absent under older host halves);
- **In-page settings**: the ⚙ in the page header opens a left-rail nav rail modal — **Scene** (animation level, drone visibility, watermark, shortcuts, camera follow), **Appearance** (walls / palette / trim) and **Layout** (display parameters for the right worker-bee array m×n and the bottom hotbar array m×n, localStorage, effective immediately);
- **Honey layer**: archived sessions become amber honey cups in the honey-storage layer beneath the hive (visible by flipping the camera underground, v1 read-only);
- **Persistence & sync**: layout and hotbar configs are persisted by the host half (`~/.dsh/storages/dsh-hive.json`, revision optimistic lock), synced across tabs via SSE;
- **Entry** (modeled after `dsh-v-token-insight`): a "Hive" seat button at the bottom of the sidebar (same seat as Token Insight / Settings) opens the in-app hive full page (`shell.overlay` full page, left edge flush against the sidebar); plus a back-to-hive button in the session header and a configurable shortcut (default Alt+H); the page supports fullscreen inspection.

## Install

**Method 1 · Install from GitHub (recommended)** — lib/ is committed with the repo, so git installs need no build toolchain:

```sh
dsh plugin --profile web add "github:victor10035445/dsh-v-hive"
```

To pin a version (later pushes won't silently change the running code):

```sh
dsh plugin --profile web add "github:victor10035445/dsh-v-hive#<commit-sha>"
```

**Method 2 · Local clone + link** (restart `dsh web` after changes; good for development):

```sh
git clone https://github.com/victor10035445/dsh-v-hive.git
dsh plugin --profile web add "link:<clone path>"
```

**Method 3 · tgz package install**:

```sh
npm pack   # produces dsh-v-hive-<version>.tgz
dsh plugin --profile web add "<absolute path to the tgz>"
```

After installing, **restart `dsh web`** and refresh the page. `add` registers `dsh-v-hive` into the profile's bundle list; to re-install/enable an existing setup you can also go through the profile patch layer directly: add `- insert: [{id: dsh-v-hive, name: dsh-v-hive}]` to `~/.dsh/profiles/web/cordis.patch.yml` (web template `patchReload: live` — saving hot-reloads, no restart needed).

> **Minimum DSH version: 0.1.2-rc.1**. The client store depends on the shell static seed module `@deepseek-ai/dsh-client-store`; earlier harness versions lack that seed word and are not supported.

Once running, the "Hive" seat button at the bottom of the sidebar (next to Token Insight / Settings) opens the in-app hive full page; plus a back-to-hive button in the session header and a configurable shortcut (default Alt+H).

## Build from source

lib/ is committed with the repo, so installing requires no build; rebuild after changing sources:

```sh
pnpm install
pnpm build   # node build.mjs: src/client.jsx → lib/client.js; src/index.mjs → lib/index.js
pnpm check   # node --check on all lib entries
pnpm test    # 35 smoke tests (lattice/yield/layout/bee model/host document/hotbar logic/hotbar host/factory environment/bridge/UI/bee types/bee-type preset prompts/capabilities/lane/engine/rendering/camera gestures/keyboard arbitration/tips/links/brief bar/summon tool/wait tool/performance etc.)
```

After changing client sources, `pnpm build` rewrites the bundle and DSH client-hmr's stat-poll broadcasts a `rebuilt` frame — the browser hot-reloads the whole package without a refresh; host-half changes (`src/index.mjs`) require restarting dsh.

## Architecture

Dual-half plugin (modeled after the mature `dsh-v-explorer` shape):

| Half | Content |
|---|---|
| Host `lib/index.js` | cordis plugin: `/api/dsh-hive/state` (GET/PUT, zod validation + revision optimistic lock + atomic write), `/api/dsh-hive/events` (SSE layout broadcast), `/api/dsh-hive/summon` (slot summon: create → bind bee type → selectModel → optional first-message injection, bypassing the serialized lane) and `/api/dsh-hive/send` (bee-bar direct send: `{ sessionId, prompt }` → `agent.followup`, blank prompt 400 / no live agent 404); also registers the model-callable tools `hive_summon` / `hive_wait` via `ctx.tools.register` (lane-honoring, no bypass — semantically partitioned from the explicit bypass of the `/summon` endpoint) |
| Client `lib/client.js` | esbuild-bundled lazy CJS factory (wrapped in `window.__ModuleLoader__.load`); `react`/`react-dom`/`@deepseek-ai/*` external, `three` bundled in |
| `cordis.patch.yml` | the bundle's own loader `- insert` registration |
| `package.json` | `dsh.bundle.patch` / `dsh.client.platform:"web"` declarations (all dependencies are static seed words; no inject/external declared) |

### Hotbar slot storage example

Hotbar configs persist into the optional `hotbars` field of the layout document `~/.dsh/storages/dsh-hive.json`
(version stays 1; legacy documents read as three empty bars — the bee bar always carries its always-on built-in cards (appended after user cards), an empty floor bar shows "Create hive", the hive bar has no default card; built-in cards themselves are never stored;
array order = user-slot display order, 32 entries per bar cap;
the legacy `commands` field has been removed — leftovers are stripped naturally on the next write):

```jsonc
{
  "version": 1,
  "revision": 12,
  "positions": { "ws-1": { "q": 2, "r": -1 } },
  "camera": null,
  "hotbars": {
    "hive": [ { "id": "0d31548e-…", "name": "Summon design bee", "summon": true, "beeTypeId": "bt-design", "prompt": "Start the design task", "autoSend": false } ],
    "bee":  [ { "id": "7c2ab9f0-…", "name": "Run tests", "prompt": "Run the full test suite and summarize failures", "autoSend": true } ],
    "floor": [ { "id": "3f8c21aa-…", "name": "New hive with bee", "createBee": true, "autoSend": false } ]
  }
}
```

- `id`: client-generated UUID (React key / sort stability, renames don't break keys); `name`: trim non-empty and unique within its bar; `summon` (hive bar) / `createBee` (floor bar) / `beeTypeId` / `prompt` / `autoSend` apply per bar (field linkage: the prompt is rejected when hive-bar summoning or floor-bar bee creation is off).
- Bee bar `autoSend: false` → clicking a card appends the prompt into the composer and raises the float window; `true` → clicking sends a followup directly via `POST /api/dsh-hive/send`. Hive/floor-bar summon routes go through `POST /api/dsh-hive/summon`.
- Cross-tab edits converge via the existing SSE broadcast; on 409 conflict replay, hotbars are replaced as a whole object (last writer wins).

## License

MIT
