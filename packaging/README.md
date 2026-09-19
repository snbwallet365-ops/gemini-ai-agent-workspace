# VisaMOTion AI app packaging

The published web app is installable as a real standalone app on Android, iOS, Windows, and macOS through the browser's Install or Add to Home Screen action.

## Android APK

For a signed APK, wrap the same web app with Capacitor after setting the production API URL:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "VisaMOTion AI" "ai.visamotion.app" --web-dir dist
npx cap add android
npm run build
npx cap copy android
npx cap open android
```

Build and sign the release APK from Android Studio. Do not put provider secrets in the APK; use the server-side environment variables.

## Windows app

The PWA install path is the supported Windows app experience and works without a separate installer. If a signed desktop installer is required, package the same `dist` output with WebView2 or Tauri and keep `VITE_API_BASE_URL` pointed at the production server.
