# Live Examples — Vercel Deployment

The three demo apps under `apps/examples-{vue,svelte,solid}` each deploy as
their own Vercel project. `apps/web` embeds them as iframes via
`<LiveExample>` in the MDX component map. This doc covers the one-time dashboard
setup.

## Create three Vercel projects

For each framework, create a new project pointing at the same GitHub repo:

| Setting | Vue | Svelte | Solid |
|---|---|---|---|
| Project name | `squircle-examples-vue` | `squircle-examples-svelte` | `squircle-examples-solid` |
| Framework preset | Vite | Vite | Vite |
| Root Directory | `apps/examples-vue` | `apps/examples-svelte` | `apps/examples-solid` |
| Build command | `cd ../.. && pnpm turbo build --filter=@squircle-js/examples-vue` | `cd ../.. && pnpm turbo build --filter=@squircle-js/examples-svelte` | `cd ../.. && pnpm turbo build --filter=@squircle-js/examples-solid` |
| Output Directory | `dist` | `dist` | `dist` |
| Install command | `cd ../.. && pnpm install --frozen-lockfile` | same | same |
| Node version | 20.x (default) | 20.x | 20.x |

The `pnpm turbo build --filter=…` command is important — it ensures the
corresponding framework package (`@squircle-js/vue`, `@squircle-js/svelte`,
`@squircle-js/solid`) is built before the demo app, satisfying the
`workspace:*` dependency.

## Ignored Build Step

To avoid rebuilding all three apps on every PR, set an Ignored Build Step per
project. In project Settings → Git → Ignored Build Step:

```bash
git diff HEAD^ HEAD --quiet ./ ../../packages/{framework} ../../pnpm-lock.yaml
```

Substitute `{framework}` with `vue`, `svelte`, or `solid` for the matching
project. The build runs only if something under the demo app itself, its
framework package, or the workspace lockfile changed.

## Wire the URLs into `apps/web`

Once the three Vercel projects are deployed, the default URLs
(`https://squircle-examples-{framework}.vercel.app`) match the hardcoded
fallbacks in `apps/web/components/mdx/live-example.tsx`, so no env-var
configuration is needed. If a slug was taken and Vercel assigned a different
URL, set the corresponding env var on the `apps/web` project:

```
NEXT_PUBLIC_EXAMPLES_VUE_URL=https://<actual-slug>.vercel.app
NEXT_PUBLIC_EXAMPLES_SVELTE_URL=https://<actual-slug>.vercel.app
NEXT_PUBLIC_EXAMPLES_SOLID_URL=https://<actual-slug>.vercel.app
```

## Verifying after deployment

- Open `https://squircle.js.org/docs/vue-examples` and confirm each iframe
  loads a working live demo (not a 404).
- Repeat for `/docs/svelte-examples` and `/docs/solid-examples`.
- Check the browser network tab — iframes should load lazily as you scroll,
  not all on first paint.
