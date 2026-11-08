# Quasar Limit Testing

Vue 3 + TypeScript demo for exploring Quasar employee tables and alternative dashboard layouts. Uses Quasar 2, Chart.js, Vue Router and a local JSON Server data source; this repository is a UI experiment, not a production banking backend.

## Run locally

Use Node.js compatible with Vite 7 (Node 22.12+ recommended).

```sh
npm ci
npx json-server db.json --port 3000
```

In a second terminal run `npm run dev` and open Vite's printed URL. The employee service expects `http://localhost:3000/employees`; it is not a hosted API. `npm run build` runs TypeScript/Vue checks and builds `dist/`; `npm run preview` serves that build.

## Screens and source map

- `/`: home; `/grid`: employee table; `/dashboard`, `/dashboard2`, `/dashboard3`: dashboard variants. Routes are defined in `src/router/index.ts`.
- `src/components/EmployeeGrid.vue`: employee columns, pagination, sorting, filters and CSV export.
- `src/components/ColumnFilterMenu.vue`: column filter UI.
- `src/services/employeeService.ts` and `src/utils/filterUtils.ts`: query construction and JSON Server requests.
- `db.json`: local demo dataset; `src/types/`: shared types.

## Limitations and next work

Filtering/pagination depend on the installed JSON Server version and its response/query semantics; verify them before interpreting UI results. Dashboard variants are experiments, not benchmark measurements. The API URL is hardcoded for local development, so a static deployment alone does not provide working employee data. No dedicated automated test script is present. This review did not execute a build or end-to-end test.

Resume by starting both processes, exercising `/grid`, then comparing the three dashboard routes. Document selected layout decisions, measured limits and unresolved bugs as they are verified; the repository name is not evidence of measured performance limits.
