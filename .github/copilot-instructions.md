<!-- Short, actionable guidance for AI coding agents working on this Ionic + Angular project -->
# Copilot instructions (project-specific)

This repository is an Ionic/Angular (v20 / Ionic 8) single-app project scaffolded by the Ionic CLI.
Keep guidance concise and operate on the same conventions used by the existing code.

Quick facts
- Build & run (development): `npm start` (runs `ng serve` — default configuration is `development` in `angular.json`).
- Production build: `npm run build` (runs `ng build`, output configured to `www` per `angular.json`).
- Tests: `npm test` (Karma + Jasmine, `karma.conf.js`).
- Lint: `npm run lint` (Angular ESLint rules). See `package.json` for scripts.

Architecture and important files
- App root: `src/app/app.module.ts` — imports `IonicModule.forRoot()` and `AppRoutingModule`.
- Routing & pages: `src/app/pages/*` contains feature pages (`home`, `login`, `register`). Follow the page-module pattern (each page has its own `*.module.ts`, routing and `*.page.ts` files).
- Shared utilities & DI: `src/app/shared/shared-module.ts` — intended to export commonly used modules (Forms, Router, Ionic) and shared components. The current file is small and may miss declarations; prefer adding exports for re-used directives/components.
- Styling: global styles live in `src/global.scss` and theme variables in `src/theme/variables.scss`.
- Environment config: `src/environments/environment.ts` and `environment.prod.ts` (used by `angular.json` file replacements).

Project-specific conventions and patterns
- Page structure: pages live under `src/app/pages/<page>` and include `*-routing.module.ts`, `*-module.ts`, `*.page.ts`, `*.page.html`, and `*.page.scss`. New pages should follow the same structure.
- Modules: Feature modules are self-contained. When adding shared UI pieces, register them in `src/app/shared/shared-module.ts` and export them for use by page modules.
- Forms: The project includes both `FormsModule` and `ReactiveFormsModule` in the shared module template — prefer `ReactiveForms` for complex forms (see `src/app/pages/register/register.page.ts` for examples).
- Route reuse: App uses `IonicRouteStrategy` (see `src/app/app.module.ts`) — when changing navigation behavior, respect this strategy.

Integration points & external dependencies
- Capacitor: Capacitor plugins are installed (`@capacitor/*`) — platform native behavior is managed outside Angular and wired via `capacitor.config.ts`.
- Ionicons & assets: SVG assets are included via `angular.json` configuration — add icons to `src/assets` or `src/assets/icon` and reference them from templates.

Editing & sanity checks for PRs
- Run `npm ci` or `npm install` and then `npm start` to smoke-test changes.
- Run `npm test` for unit tests; ensure Karma runs in CI mode (`angular.json` has a `ci` configuration).
- Keep changes to `angular.json` minimal; if adding assets, update the `assets` array.

Examples to reference in code
- Register a shared component/module: modify `src/app/shared/shared-module.ts` to add the component to `declarations` and `exports`, and include `CommonModule` and `IonicModule` in `imports`.
- Add a new page: follow `src/app/pages/home/home.module.ts` structure — declare the `Page` component, import `IonicModule`, `CommonModule`, and `SharedModule` where needed, and add a routing file `home-routing.module.ts`.

Edge cases discovered
- `src/app/shared/shared-module.ts` currently has a stray `const Component = [im]` and does not export commonly expected modules — fix carefully to avoid breaking imports.
- The project is an Ionic web build (output `www`) — native Capacitor builds require running `npx cap sync` outside this repo's JS build scripts.

If unsure, follow these priorities
1. Preserve Ionic page-module structure when adding pages or lazy routes.
2. Export reusable UI and form modules from `src/app/shared/shared-module.ts` rather than importing them repeatedly in page modules.
3. Run `npm start` and `npm test` locally to validate behavior before opening a PR.

If something in these instructions looks incorrect or incomplete, leave an inline comment in this file and request clarification (mention the file and line to update the guidance).
