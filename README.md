# Drive Colorado

A React Native mobile application built with Expo for exploring scenic driving routes in Colorado.

## Getting Started

### Prerequisites

- Node.js (v20.19.4 or higher recommended)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

```bash
npm install
```

### Running the App

Start the development server:

```bash
npm start
```

Run on specific platforms:

```bash
# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## Project Structure

```
drive-colorado/
├── App.js                 # Main app entry point
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
├── assets/               # Images, fonts, and other assets
└── src/                  # Source code
    ├── components/       # Reusable UI components
    ├── screens/          # Screen components
    ├── navigation/       # Navigation configuration
    ├── services/         # API and business logic
    ├── utils/            # Utility functions
    ├── constants/        # App constants (colors, config, etc.)
    ├── hooks/            # Custom React hooks
    └── context/          # React Context providers
```

See [src/README.md](./src/README.md) for detailed information about the source code structure.

## Tech Stack

- React Native 0.81.5
- Expo ~54.0.32
- React 19.1.0

## Development

The app follows a standard React Native architecture with:
- Component-based UI
- Centralized constants for theming
- Organized folder structure for scalability

## License

Private
