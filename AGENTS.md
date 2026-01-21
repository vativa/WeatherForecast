# Codex Agent Instructions

## Scope
- Allowed to modify:
- Do not modify:

## Workflow
- Analyze and propose a plan before editing
- Ask questions if requirements are unclear
- Run `dotnet build` and `dotnet test` after changes

## Coding standards
- React hooks and functional components
- No new dependencies without approval

## Git
- Create new branch per task/feature
- Open a pull request with a clear summary

## Project Structure & Module Organization
- `src/` contains all application code.
- `src/components/` holds React UI components (e.g., `DayCard.tsx`, `SearchBar.tsx`).
- `src/redux/` contains the Redux store, hooks, and slices.
- `src/services/` wraps OpenWeatherMap API calls.
- `src/utils/` holds pure helpers such as `weatherUtils.ts`.
- `src/types/` stores TypeScript types.
- `src/test/` includes Vitest setup; test files live alongside source (e.g., `src/utils/weatherUtils.test.ts`).
- `public/` is for static assets; Vite entry is `index.html`.

## Build, Test, and Development Commands
- `npm run dev`: start the Vite dev server at `http://localhost:5173`.
- `npm run build`: type-check with `tsc -b` and create a production build in `dist/`.
- `npm run preview`: serve the production build locally.
- `npm run lint`: run ESLint across the repo.
- `npm run test`: run unit tests with Vitest.
- `npm run test:ui`: open Vitest UI.
- `npm run test:coverage`: generate coverage report.

## Coding Style & Naming Conventions
- TypeScript + React with functional components.
- Indentation: 2 spaces; keep JSX props vertically aligned when multi-line.
- Filenames: PascalCase for components (`ForecastList.tsx`), camelCase for non-components (`weatherUtils.ts`).
- Linting: ESLint via `eslint.config.js`; fix lint before committing.

## Testing Guidelines
- Frameworks: Vitest + Testing Library + JSDOM.
- Test files use `.test.ts` or `.test.tsx` adjacent to source (examples in `src/components/` and `src/utils/`).
- Prefer testing public behavior (rendered UI, user events, slice reducers) over internal implementation details.

## Commit & Pull Request Guidelines
- Commit messages in history are short, imperative, and capitalized (e.g., “Update .gitignore”).
- PRs should include a clear summary, testing steps (`npm run test`/`npm run lint`), and screenshots for UI changes.
- Link related issues when applicable.

## Configuration & Secrets
- Copy `.env.example` to `.env` and set `VITE_OPENWEATHER_API_KEY`.
- Do not commit real API keys or local `.env` changes.
