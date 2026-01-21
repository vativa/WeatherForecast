# Weather Forecast App

A modern React TypeScript application that displays a 5-day weather forecast using the OpenWeatherMap API. Built with Redux Toolkit for state management and React Bootstrap for UI components.

## Features

- 🌍 **Geolocation Support**: Automatically fetch weather data based on your current location
- 🔍 **City Search**: Search for weather forecasts by city name
- 📅 **5-Day Forecast**: View weather predictions for the next 5 days
- ⏰ **Hourly Details**: Click on any day to see hourly weather details
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Fast & Modern**: Built with Vite for lightning-fast development and builds
- 🧪 **Tested**: Includes unit tests for critical functionality

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Bootstrap** - UI components
- **Vite** - Build tool
- **Vitest** - Testing framework
- **OpenWeatherMap API** - Weather data provider

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenWeatherMap API key (free tier available)

## Setup

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

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

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

## Project Structure

```
src/
├── components/          # React components
│   ├── DayCard.tsx     # Individual day forecast card
│   ├── ForecastList.tsx # List of daily forecasts
│   ├── HourlyDetailsModal.tsx # Modal for hourly details
│   ├── LoadingSpinner.tsx # Loading indicator
│   └── SearchBar.tsx   # Search and geolocation controls
├── redux/              # Redux store and slices
│   ├── hooks.ts        # Typed Redux hooks
│   ├── store.ts        # Store configuration
│   └── weatherSlice.ts # Weather state slice
├── services/           # API services
│   └── weatherService.ts # OpenWeatherMap API calls
├── types/              # TypeScript type definitions
│   └── weather.ts      # Weather-related types
├── utils/              # Utility functions
│   └── weatherUtils.ts # Weather data processing
├── test/               # Test configuration
│   └── setup.ts        # Test setup file
├── App.tsx             # Main app component
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
- Weather utility functions
- Redux state management
- React components

Run tests with:
```bash
npm run test
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory and can be deployed to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons and UI components from [React Bootstrap](https://react-bootstrap.github.io/)

