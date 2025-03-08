# Building an Android APK with Expo Preview

This document provides instructions for building an Android APK using the Expo Build system with the preview profile.

## Prerequisites

1. Make sure you have installed the EAS CLI:

   ```bash
   npm install -g eas-cli
   ```

2. Install Android development dependencies:

   - [Android Studio](https://developer.android.com/studio)
   - Android SDK
   - Java Development Kit (JDK)

3. Configure environment variables:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

## Building the APK

### Option 1: Remote Build with Expo (Internal Distribution)

Run the command without the `--local` flag to build on Expo's servers:

```bash
eas build -p android --profile preview
```

This will:

- Build your app on Expo's build servers
- Require you to be logged into an Expo account (`eas login`)
- NOT publish to the Play Store
- Create an APK for internal testing that you can download directly
- Allow you to share the build with your team

### Option 2: Local Build

Run the build script which is configured to create an APK locally:

```bash
npm install -g eas-cli

npx expo install expo-dev-client

eas init

npx expo prebuild
# and
eas build -p android --profile preview
```

### Option 3: Development Client build

If you need a development client build:

```bash
eas build -p android --profile preview3 --local
```

## Understanding Build Types

- **Internal Distribution (preview profile)**: Creates an APK for testing that is NOT uploaded to any store
- **Store Submission**: Would require a different profile with `"buildType": "app-bundle"` and store credentials
- **Development**: Used for testing with Expo Go features

## What happens during the build?

1. EAS CLI prepares your project for building
2. For remote builds:
   - Your code is uploaded to Expo's build servers
   - Build is processed on their infrastructure
   - A download link is provided when complete
3. For local builds:
   - A local Android build is generated using Gradle
   - The APK will be saved in your project directory

## Installation to device

Once the APK is built, you can:

1. Transfer the APK to your Android device
2. Enable "Install from unknown sources" in your device settings
3. Open the APK file on your device to install it

## Troubleshooting

If you encounter build issues:

1. Ensure your Android SDK is up to date
2. Check that you have the necessary build tools installed:
   ```bash
   sdkmanager "build-tools;30.0.3" "platforms;android-30"
   ```
3. Make sure you have enough disk space for the build
4. If build fails with Java memory errors, add `org.gradle.jvmargs=-Xmx4608m` to `android/gradle.properties`

## Additional Resources

- [Expo Build Documentation](https://docs.expo.dev/build/setup/)
- [EAS Build for Android](https://docs.expo.dev/build-reference/android/)
- [Expo Development Builds](https://docs.expo.dev/development/create-development-builds/)
