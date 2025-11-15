# Google Maps Not Loading - Troubleshooting Guide

## Quick Checks

### 1. Verify API Key is Set
The API key should be in `ios/StudySpotFinder/Info.plist`:
```xml
<key>GMSApiKey</key>
<string>YOUR_API_KEY_HERE</string>
```

### 2. Check Google Cloud Console

**Enable Maps SDK for iOS:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Library**
4. Search for "Maps SDK for iOS"
5. Click **Enable** if not already enabled

**Verify API Key Restrictions:**
1. Go to **APIs & Services** → **Credentials**
2. Click on your API key
3. Under **Application restrictions**:
   - Should be set to **iOS apps**
   - Bundle ID should be: `com.studymap.app`
4. Under **API restrictions**:
   - Should include **Maps SDK for iOS**

### 3. Rebuild After Changes

After adding/changing the API key, you MUST rebuild:
```bash
# Clean and rebuild
npx expo prebuild --clean --platform ios
npx expo run:ios
```

### 4. Check Console Logs

In Xcode:
1. Open the project: `open ios/StudySpotFinder.xcworkspace`
2. Run the app
3. Check the console for errors like:
   - "Google Maps API key not found"
   - "Maps SDK for iOS not enabled"
   - Bundle ID mismatch errors

### 5. Common Issues

**Issue: Blank/White Map**
- **Cause:** API key not set or incorrect
- **Fix:** Verify key in Info.plist and rebuild

**Issue: "Google Maps API key not found"**
- **Cause:** Key not in Info.plist or wrong location
- **Fix:** Run `npx expo prebuild` again to regenerate Info.plist

**Issue: "This API key is not authorized"**
- **Cause:** Maps SDK for iOS not enabled OR bundle ID restriction
- **Fix:** Enable SDK in Google Cloud Console and verify bundle ID

**Issue: Map loads but shows error tiles**
- **Cause:** API key restrictions too strict or billing not set up
- **Fix:** Check API restrictions and ensure billing is enabled

### 6. Test API Key Directly

You can test if your API key works by checking the Google Cloud Console:
1. Go to **APIs & Services** → **Credentials**
2. Click on your API key
3. Check **API key restrictions** → Should show usage if working

### 7. Verify Bundle ID

Make sure your bundle ID matches exactly:
- In `app.json`: `com.studymap.app`
- In Google Cloud Console API key restrictions: `com.studymap.app`
- In Xcode project settings: `com.studymap.app`

### 8. Check Billing

Google Maps requires billing to be enabled (even with free tier):
1. Go to Google Cloud Console
2. **Billing** → Ensure a billing account is linked
3. Free tier gives $200/month credit

## Still Not Working?

1. **Check Xcode Console:**
   - Look for specific error messages
   - Google Maps errors are usually very descriptive

2. **Try a Test Build:**
   ```bash
   cd ios
   xcodebuild -workspace StudySpotFinder.xcworkspace -scheme StudySpotFinder -sdk iphonesimulator
   ```

3. **Verify Pod Installation:**
   ```bash
   cd ios
   pod install
   ```

4. **Check Network:**
   - Simulator needs internet connection
   - Check if other apps can access internet

5. **Try Different API Key:**
   - Create a new API key with no restrictions (for testing)
   - If it works, the issue is with restrictions
   - Then add restrictions back one by one

## Debug Steps

Add this to your MapView component to see detailed errors:
```jsx
onError={(error) => {
  console.error('Map Error Details:', JSON.stringify(error, null, 2));
  Alert.alert('Map Error', JSON.stringify(error));
}}
```

