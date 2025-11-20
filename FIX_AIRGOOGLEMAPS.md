# Fix AirGoogleMaps Error

## The Problem
The error "AirGoogleMaps dir must be added to your xCode project" occurs because the AirGoogleMaps source files aren't properly linked in Xcode.

## Solution: Manually Add AirGoogleMaps to Xcode

1. **Open Xcode:**
   ```bash
   open ios/StudySpotFinder.xcworkspace
   ```

2. **In Xcode:**
   - Right-click on the `StudySpotFinder` folder in the Project Navigator (left sidebar)
   - Select "Add Files to StudySpotFinder..."
   - Navigate to: `node_modules/react-native-maps/ios/AirGoogleMaps`
   - **Important:** Check these options:
     - ✅ "Copy items if needed" (UNCHECKED - don't copy)
     - ✅ "Create groups" (selected)
     - ✅ "Add to targets: StudySpotFinder" (checked)
   - Click "Add"

3. **Verify the files are added:**
   - You should see `AirGoogleMaps` folder in your Xcode project
   - It should contain files like `AIRGMSMarker.m`, `AIRGMSPolyline.m`, etc.

4. **Clean and rebuild:**
   - In Xcode: Product → Clean Build Folder (Shift+Cmd+K)
   - Then: Product → Build (Cmd+B)

5. **Run the app:**
   ```bash
   npx expo run:ios
   ```

## Alternative: Use Apple Maps (No Google Maps Setup Needed)

If you don't need Google Maps specifically, you can use Apple Maps (default):

1. Remove `PROVIDER_GOOGLE` from your code
2. Remove the `react-native-google-maps` pod from Podfile
3. Use default MapView (Apple Maps on iOS)

The issue is **not** the API key - it's the missing AirGoogleMaps directory in Xcode.

