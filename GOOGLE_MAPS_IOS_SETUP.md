# Google Maps API Setup for iOS

## Step 1: Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Maps SDK for iOS**:
   - Go to **APIs & Services** → **Library**
   - Search for "Maps SDK for iOS"
   - Click **Enable**
4. Create an API key:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **API Key**
   - Copy your API key

## Step 2: Restrict Your API Key (Recommended)

1. Click on your API key to edit it
2. Under **Application restrictions**:
   - Select **iOS apps**
   - Click **Add an item**
   - Enter your bundle identifier: `com.studymap.app`
3. Under **API restrictions**:
   - Select **Restrict key**
   - Check only **Maps SDK for iOS**
4. Click **Save**

## Step 3: Add API Key to Your Project

Edit `app.json` and replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key in **two places**:

1. `ios.config.googleMapsApiKey`
2. `plugins[1][1].googleMapsApiKey` (react-native-maps plugin)

Example:
```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "AIzaSy...your-actual-key"
      }
    },
    "plugins": [
      [
        "react-native-maps",
        {
          "googleMapsApiKey": "AIzaSy...your-actual-key"
        }
      ]
    ]
  }
}
```

## Step 4: Create a Development Build for iOS

Google Maps requires native code and won't work in Expo Go. You need a development build:

### Option 1: Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure your project
eas build:configure

# Create a development build for iOS
eas build --profile development --platform ios
```

After the build completes, install it on your device/simulator.

### Option 2: Local Build

```bash
# Generate native iOS project
npx expo prebuild --platform ios

# Open in Xcode
open ios/studymap.xcworkspace

# In Xcode:
# 1. Select your development team
# 2. Build and run (Cmd+R)
```

### Option 3: Using Expo Run (Simplest)

```bash
# This will prebuild and run in simulator
npx expo run:ios
```

## Step 5: Verify It Works

1. Open your app in the iOS Simulator or on a device
2. Navigate to the **Map** tab
3. You should see:
   - Interactive Google Maps
   - Study spot markers (colored pins)
   - Your current location (if permissions granted)

## Troubleshooting

### Maps Not Showing / Blank Screen

1. **Check API key** - Verify it's correct in both places in `app.json`
2. **Verify API is enabled** - Make sure "Maps SDK for iOS" is enabled in Google Cloud Console
3. **Check bundle ID** - Ensure your bundle identifier matches: `com.studymap.app`
4. **Rebuild required** - After changing `app.json`, you must rebuild:
   ```bash
   npx expo prebuild --clean
   npx expo run:ios
   ```

### "Google Maps API key not found" Error

- Make sure the API key is in `ios.config.googleMapsApiKey` in `app.json`
- The key must be set before running `expo prebuild`
- Restart the build process after adding the key

### Maps Work in Development Build but Not Expo Go

- This is expected! Google Maps requires native code
- You must use a development build or production build
- Expo Go doesn't support custom native modules like Google Maps

### Build Errors

If you get build errors:
```bash
# Clean and rebuild
npx expo prebuild --clean
cd ios
pod install
cd ..
npx expo run:ios
```

## Cost Considerations

- **$200 free credit per month** (covers most small apps)
- After that, pay-as-you-go pricing
- Monitor usage in Google Cloud Console → Billing

## Quick Start Checklist

- [ ] Created Google Cloud project
- [ ] Enabled Maps SDK for iOS
- [ ] Created API key
- [ ] Restricted API key to iOS bundle ID
- [ ] Added API key to `app.json` (2 places)
- [ ] Created development build (`npx expo run:ios`)
- [ ] Verified map displays correctly

## Next Steps

Once maps are working:
- Test location permissions
- Verify markers display correctly
- Test map interactions (zoom, pan)
- Test on a physical device (maps work better with real GPS)

