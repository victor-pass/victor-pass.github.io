# screenshot-tools — plan (draft)

Goal: realistic, store-ready screenshots of PWAs, especially the lap tracker
(camera view + popups for recently scanned QR codes).

## 1. Android capture app (priority)

Kotlin app that captures the *real installed PWA*:
- Floating capture button over any app (overlay permission).
- Screen capture via MediaProjection; button hides itself before the grab.
- Saves PNG to `Pictures/Screenshots/screenshot-tools/`.
- Captures the live camera preview as-is.
- No faked content; any staging is done later in a photo editor.

Fallback if needed: adb demo-mode script from the Mac.

## 2. Framing (v1)

- Device frames (Pixel / iPhone / tablet) + gradient backgrounds.
- Optional caption text above the device.
- Export at Play Store / App Store sizes.
- Lives in the Chrome extension (or a small web page) so shots from
  phone or desktop go through the same step.

## 3. Chrome extension (MV3)

- One-click capture via Chrome DevTools Protocol.
- Device presets by viewport override; viewport or full-page; 2x/3x.
- Hidden scrollbars; store-size presets; PNG export.

## Open questions

- Is a custom Android app needed? Existing tools likely cover it:
  Screenshot Tile (F-Droid) or Accessibility Menu for capture,
  built-in System UI Demo Mode (+ QuickDemo) for a clean status bar,
  BrandBird / imageonline.io for frames + gradients.
- Repo name/location: `../screenshot-tools` OK?
- Build order: Android app first, then framing, then extension?
