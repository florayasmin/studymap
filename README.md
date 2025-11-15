# Study Map - React Native App

A React Native mobile application built with Expo that helps students find the best study spots on campus using AI-powered recommendations.

## Features

- an interactive map view with study spot markers
- AI-powered personalized recommendations using Anthropic Claude API
- browse all study spots with filtering options
- campus selection (UW and UMD)
- location-based recommendations using device GPS

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing) OR iOS Simulator / Android Emulator

## Getting Started

### Install Dependencies

```bash
npm install
```

### Set Up API Key

Create a `.env` file in the root directory and add your Anthropic API key:

```
EXPO_PUBLIC_ANTHROPIC_API_KEY=your-api-key-here
```

Or update the `ANTHROPIC_API_KEY` constant in `src/App.jsx`.

### Run the App

Start the Expo development server:

```bash
npm start
```

Then:
- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with Expo Go app on your phone

### Platform-Specific Commands

```bash
# iOS
npm run ios

# Android
npm run android

# Web (limited functionality)
npm run web
```

## Required Packages

The app uses the following key packages:

- `expo` - Expo framework
- `expo-location` - For GPS location services
- `react-native-maps` - For map display
- `@react-navigation/native` & `@react-navigation/bottom-tabs` - Navigation
- `@react-native-async-storage/async-storage` - Local storage

## Project Structure

```
studymap/
├── src/
│   ├── App.jsx       # Main app component
│   └── main.jsx      # Entry point
├── app.json          # Expo configuration
├── babel.config.js   # Babel configuration
└── package.json      # Dependencies and scripts
```

## Notes

- The app requires location permissions to provide personalized recommendations
- Google Maps requires an API key for production use (configure in `app.json`)
- Make sure to set your Anthropic API key before using AI recommendations

## Troubleshooting

If you encounter issues:

1. Clear cache: `expo start -c`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. For maps on iOS, you may need to configure Google Maps API key in `app.json`
