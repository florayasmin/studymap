# Study Map - React Native App

A React Native mobile application built with Expo that helps students find the best study spots on campus using AI-powered recommendations.

## Features

- an interactive map view with study spot markers
- AI-powered personalized recommendations using Google Gemini API
- browse all study spots with filtering options
- campus selection (UW and UMD)
- location-based recommendations using device GPS

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing) OR iOS Simulator on Xcode / Android Emulator

## Getting Started

### Install Dependencies

```bash
npm install
```

### Set Up API Key (Secure Backend Proxy)

**🔒 Important:** This app uses a backend proxy to keep your API key secure. The key is never exposed in the mobile app.

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Create a `.env` file in the root directory:
```
GEMINI_API_KEY=your-gemini-api-key-here
PORT=3001
```

3. Start the backend proxy server (in a separate terminal):
```bash
npm run server
```

4. The mobile app will automatically connect to `http://localhost:3001`

See `SECURITY.md` for detailed security information.

### Run the App

Start the Expo development server:

```bash
npm start
```

Then:
- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with Expo Go app on your phone

#### Finding Your Expo URL

When Expo starts, you'll see a QR code and connection URLs in the terminal. The Expo URL format is:

- **Localhost:** `exp://localhost:8081` (for same machine)
- **Network:** `exp://YOUR_IP:8081` (for devices on same network)

You can also find your IP address by running:
```bash
ipconfig getifaddr en0
```

The Expo URL is displayed in the terminal output where the QR code appears.

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
- `express` - Backend proxy server
- `cors` - CORS middleware for backend
- `dotenv` - Environment variable management

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

## Google Maps Setup (iOS)

**⚠️ Important:** Google Maps requires a native build and won't work in Expo Go.

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps SDK for iOS**
3. Add your API key to `app.json` (replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` in 2 places: `ios.config.googleMapsApiKey` and `plugins[1][1].googleMapsApiKey`)
4. Create a development build:
   ```bash
   npx expo run:ios
   ```

See `GOOGLE_MAPS_IOS_SETUP.md` for detailed iOS setup instructions.

## Notes

- The app requires location permissions to provide personalized recommendations
- **Google Maps requires a native build** - use `eas build` or `expo prebuild` + native build
- **Always run the backend proxy server** (`npm run server`) before using AI recommendations
- API keys are stored securely on the backend - never in the mobile app code
- See `SECURITY.md` for production deployment instructions

## Troubleshooting

If you encounter issues:

1. Clear cache: `expo start -c`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. For maps on iOS, you may need to configure Google Maps API key in `app.json`
