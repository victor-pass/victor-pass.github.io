# Archive

Old tasks and notes, moved here when Claude passes a ball back. Use Move to… to bring one back.

## Chat from screenshot-tools
> 🤖 Proposed plan:
> 🤖 **Chrome extension (MV3)**: one-click capture via Chrome DevTools Protocol. Device presets (phone/tablet/desktop) by overriding the viewport, full-page or viewport, 2x/3x scale, hidden scrollbars, store-size presets (Play/App Store). Exports PNG.
> 🤖 **Android A (my pick)**: script runs your real installed PWA over adb. Turns on demo mode (clean 9:41 clock, full battery, no notifications), grabs `screencap`, optional crop of status/nav bars. Hotkey or `shot` command = one screenshot.
> 🤖 **Android B**: small Kotlin app wrapping your PWA URL in a fullscreen WebView/TWA with a floating capture button. Works without a computer, but it's not *exactly* the installed PWA and needs Android Studio to build.
> 🤖 Answer above and I'll start with the extension.
> 💬 Should this be a seperate app. Before you build let me know and we can create a plan.md and start a new repo
> 🤖 Yes, separate repo. Nothing built yet. Draft plan: `remoter/screenshot-tools-plan.md` (B + frames/gradients included).
> 🤖 On your camera/QR problem: B handles it well. Plan has 2 modes: **overlay** (floating button screenshots your real installed PWA, live camera and all) and **wrapper** (WebView with a fake camera feed from a staged photo + a hook to fire scan popups on demand). So adb isn't needed.
> 🤖 Q for you: can the lap tracker take a demo hook like `window.__demoScan("LAP-042")`, or should fake scans only come from QR images in the fake feed?