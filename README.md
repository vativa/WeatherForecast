# Weather Forecast App

A modern React TypeScript application displaying a 5-day weather forecast using the OpenWeatherMap API.
Built with Redux Toolkit for state management and React Bootstrap for UI components.

## Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- OpenWeatherMap API key (free tier available)

### Installation Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/vativa/WeatherForecast.git
   cd WeatherForecast
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Get an API Key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key
<br/><br/>
4. **API Configuration**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_openweathermap_apikey
   ```
5. **Start the development server**
   ```bash
   npm run dev
   ```
   `npm run dev` already includes these flags in `package.json`, so you can omit them if you want.
   Self-signed certs live in `.certs/`. Regenerate them if your LAN IP changes.
   If the cert files are missing, the dev server falls back to HTTP (useful for CI/builds).
6. **Open your browser**
   Navigate to `https://localhost:5173` (or `https://<your-lan-ip>:5173` on another device)
   You will need to trust the self-signed certificate on any device accessing the app.

## Available Scripts

- `npm run dev` - Start dev server with HTTPS and LAN access
- `npm run test` - Run unit tests with Vitest
- `npm run lint` - Run ESLint across the repo
- `npm run build` - Build for production in `dist/`
- `npm run preview` - Preview production build
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:coverage` - Generate coverage report

## Features

- **Geolocation Support**: Automatically fetch weather data based on your current location
- **City Search**: Search for weather forecasts by city name
- **5-Day Forecast**: View weather predictions for the next 5 days
- **Hourly Details**: Click on any day to see hourly weather details
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Fast & Modern**: Built with Vite for lightning-fast development and builds
- **Tested**: Includes unit tests for critical functionality

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Bootstrap** - UI components
- **Vite** - Build tool
- **Vitest** - Testing framework
- **OpenWeatherMap API** - Weather data provider

## Usage

### Search by City
1. Enter a city name in the search bar
2. Click "Search" or press Enter
3. View the 5-day forecast

### Use Geolocation
1. Click the "📍 My Location" button
2. Allow location access when prompted
3. Weather data for your location will be displayed

### View Hourly Details
1. Click on any day card in the forecast
2. A modal will open showing hourly weather details
3. Click outside the modal or the close button to dismiss

## React Project Structure
```
src/
├── assets/             # Static assets
├── components/         # React UI components + tests
│   ├── DayCard.tsx
│   ├── DayCard.test.tsx
│   ├── ForecastList.tsx
│   ├── ForecastList.test.tsx
│   ├── HourlyDetailsModal.tsx
│   ├── HourlyDetailsModal.test.tsx
│   ├── LoadingSpinner.tsx
│   ├── LoadingSpinner.test.tsx
│   ├── SearchBar.tsx
│   └── SearchBar.test.tsx
├── redux/              # Redux store, slices, and tests
│   ├── hooks.ts
│   ├── store.ts
│   ├── weatherSlice.ts
│   └── weatherSlice.test.ts
├── services/           # API services + tests
│   ├── weatherService.ts
│   └── weatherService.test.ts
├── test/               # Test configuration
│   └── setup.ts
├── types/              # TypeScript type definitions
│   └── weather.ts
├── utils/              # Utility helpers + tests
│   ├── weatherUtils.ts
│   └── weatherUtils.test.ts
├── App.css             # App-level styles
├── App.test.tsx        # App component test
├── App.tsx             # Main app component
├── index.css           # Global styles
└── main.tsx            # App entry point
```

## API Information

This app uses the [OpenWeatherMap 5-day forecast API](http://openweathermap.org/forecast5).

**Features used:**
- Forecast by city name
- Forecast by geographic coordinates
- Metric units (Celsius)
- 3-hour interval forecasts

**Rate Limits (Free Tier):**
- 60 calls/minute
- 1,000,000 calls/month

## Testing
The project includes unit tests for:
- All React components
- Redux state management
- Utility functions
- Testing frameworks: Vitest + Testing Library + JSDOM
- Test files use `.test.ts` or `.test.tsx` adjacent to source (examples in `src/components/` and `src/utils/`)
- Prefer testing public behavior (rendered UI, user events, slice reducers) over internal implementation details
### Running test suite:
   ```bash
   npm run test
   ```
### Running tests in watch mode:
   ```bash
   npm run test:ui
   ```

## Building for Production
The built files will be in the `dist/` directory and can be deployed to any static hosting service:
```bash
npm run build
```

## How are code Agents used?

This project leverages AI code assistants like OpenAI Codex and GitHub Copilot to enhance developer productivity.
These tools help generate boilerplate code, suggest improvements, review pull requests, guarantee safety,
and assist with complex logic implementations, allowing developers to focus on higher-level design and functionality.

### OpenAI Codex
- Works inside this repo with the agent rules in `AGENTS.md` and `.agent-readonly/` (coding style, tests-first for components).
- Uses the repo `config.toml` sandbox settings (read/write scoped to the project) to keep changes safe.
- Checks consistency across UI components, business logic, models, and configs.
- Flags exposure risks for user-facing data and anything committed to the public repository.

### GitHub Copilot
- Used in VSCode & WebStorm for local codebase inspection and inline suggestions while editing.
- Supports pull request reviews on GitHub.com for quick feedback on diffs, suggestions, and tests.

## Contributing
1. Fork the repository (local `main` is read-only, `origin/main` is protected)
2. Create a feature branch (`git checkout -b feature/branch-name`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/branch-name`)
5. Open a Pull Request against `main`

## Acknowledgments
- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons and UI components from [React Bootstrap](https://react-bootstrap.github.io/)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
