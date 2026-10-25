# SauceDemo Playwright + Cucumber BDD Framework

A TypeScript automation framework using **Cucumber (Gherkin BDD)** and **Playwright** for SauceDemo UI scenarios and practice REST API scenarios. Existing Page Objects and API clients are reused rather than duplicated inside step definitions.

## Coverage

- **16 UI scenarios**: login, inventory/product details, sorting, cart, and checkout.
- **8 Posts API scenarios**: GET, filtering, POST, PUT, PATCH, DELETE, response validation, and negative cases.
- **5 Authentication API scenarios**: protected access, missing/invalid token, token reuse, and refresh.
- **29 distinct Gherkin scenarios** in total.

The scenario count describes the authored scenarios, not the number of browser executions. This Cucumber setup currently launches Chromium for UI scenarios. The previous Playwright Test suite and `playwright.config.ts` are retained for reference/optional legacy execution via `npm run test:legacy`.

## Architecture

```text
features/
  ui/                         # Login, inventory, cart, checkout .feature files
  api/                        # Posts and authentication .feature files
  support/
    world.ts                  # Per-scenario state (page, request context, API clients)
    hooks.ts                  # Browser/API setup, authenticated setup, cleanup, failure screenshot
  step-definitions/
    ui.steps.ts               # Gherkin steps calling existing Page Objects
    api.steps.ts              # Gherkin steps calling existing API clients
pages/                        # Page Object Model classes
api/                          # PostsApi, AuthApi, AuthenticatedApiClient
.github/workflows/            # GitHub Actions workflow
```

### Execution lifecycle

1. Cucumber loads a `.feature` file and selects a scenario by tags.
2. A `Before` hook creates a browser page or API request context for that scenario.
3. `CustomWorld` holds scenario-specific objects and response data.
4. Step definitions translate Gherkin steps into calls to Page Objects or API clients.
5. Playwright performs browser/HTTP operations; Playwright assertions and Zod validate outcomes.
6. `After` closes resources and attaches a screenshot if a UI scenario fails.

## Setup

Use Node.js 22 or a compatible supported Node.js version.

```bash
npm install
npx playwright install chromium
```

The Cucumber dependencies were added for this migration. Run `npm install` to regenerate `package-lock.json` before using `npm ci` in a clean environment; commit the regenerated lockfile to keep installs reproducible.

## Authentication API credentials

Copy `.env.example` to `.env` and populate the credentials for DummyJSON:

```dotenv
AUTH_API_USERNAME=your_dummyjson_username
AUTH_API_PASSWORD=your_dummyjson_password
```

Do not commit `.env`. GitHub Actions should use repository secrets named `AUTH_API_USERNAME` and `AUTH_API_PASSWORD`. UI SauceDemo test credentials are public sample-app credentials and are used only for the UI scenarios.

## Commands

```bash
npm test                    # Run all Cucumber scenarios
npm run test:ui             # Run UI scenarios
npm run test:posts-api      # Run Posts API scenarios
npm run test:auth-api       # Run authentication API scenarios (credentials required)
npm run test:api            # Run both API feature groups
npm run test:headed          # Run UI scenarios with a visible browser
npm run typecheck            # TypeScript type check
npm run lint                # ESLint
npm run test:legacy          # Run the original Playwright Test specs
```

## Tags

- `@ui`: browser scenarios
- `@authenticated`: logs into SauceDemo before the scenario
- `@posts-api`: JSONPlaceholder API scenarios
- `@auth-api`: DummyJSON authentication API scenarios

Examples:

```bash
npx cucumber-js --tags '@ui'
npx cucumber-js --tags '@posts-api'
npx cucumber-js --tags '@auth-api'
```

## Reporting and troubleshooting

Cucumber writes a JSON report to `cucumber-report.json`. Failed UI scenarios attempt to attach a screenshot. For authentication API scenarios, ensure the environment credentials are valid and available to the process. If browser launch fails locally, install Chromium with `npx playwright install chromium`.

## Notes

- The framework was converted from Playwright Test-style test functions to Gherkin features and Cucumber step definitions. The existing API client classes and Page Objects remain the reusable automation layer.
- The legacy Playwright Test specs are retained for comparison and are not run by the default `npm test` command.
- A successful full run has not been verified in this generated environment because dependency installation was unavailable here. Install dependencies, regenerate `package-lock.json`, and run the commands above before treating the framework or CI as green.
