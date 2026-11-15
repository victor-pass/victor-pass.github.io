---
title: Laps
description: Set up a race, scan racers' QR codes as they pass, and export results your way, from any phone.
status: Demo Available
url: https://laps.victorpass.dev
repo: https://github.com/victor-pass/laps
screenshots:
  - /products/laps-scan-mobile.png
videos:
  - src: /products/laps-demo-setup.webm
    small: /products/laps-demo-setup-small.webm
    title: Set up
    caption: Set up a race and share access with your team.
  - src: /products/laps-demo-scan.webm
    small: /products/laps-demo-scan-small.webm
    title: Scan
    caption: Scan racers' QR codes as they go by.
  - src: /products/laps-demo-data.webm
    small: /products/laps-demo-data-small.webm
    title: Data
    caption: Import your racers, print their race IDs, and export results broken down however you choose.
updates:
  - date: 2026-11-13
    notes:
      - New Race page for race settings, racer details and reports.
      - Set a race's lap length in m, km or mi to show distance as well as laps.
      - Add details to racers (for example grade or team), or import them from a CSV or a list pasted from a spreadsheet. Racers are matched by id or name, and a template CSV is provided.
      - Reports export laps, racers, or totals grouped by any racer detail, for a chosen time range.
      - New Sync page shows which devices have reported and when each was last seen, and what this device has captured.
      - A recent-scans feed, newest first, marks repeat scans.
  - date: 2026-10-26
    notes:
      - New Racers page to add and name racers for each race, and print their QR codes as lanyard badges (9 per A4) or one per page.
      - Racer names show in the summary, the CSV and the scan popup, including offline.
      - Printed QR codes hold only the racer's id, never their name.
      - The scanner recovers by itself from a stuck or closed camera.
      - Joining a race no longer hangs the scanner on a slow connection.
  - date: 2026-10-12
    notes:
      - Race links open straight in the installed app.
      - Better portrait layout, especially when sharing a QR code.
      - The navigation bar takes less space.
  - date: 2026-10-09
    notes:
      - Race QR codes are now links, so a new volunteer can join with their phone's own camera, with no install needed.
      - The app works fully offline, and laps that haven't synced yet are shown.
      - Each lap records which user and which device scanned it.
      - No more duplicate-lap messages.
      - Sign-in now lasts a week, and if it expires mid-race you're asked to sign in again.
      - Fixed changing the selected race refreshing the whole interface.
      - Fixed the CSV export button sitting under the navigation.
  - date: 2026-10-07
    notes:
      - Works offline first. Scans and race joins or creates queue on the phone and sync when signal returns, and duplicate laps are removed at scan time and again when every device's laps are tallied for a race.
      - Scan with the front or back camera, from a new scanning menu.
      - Camera reliability fixes.
      - The summary page shows racer names and which volunteer's device recorded each lap.
      - Export a race's laps as CSV.
      - Pages are rendered on the server, so the first load is faster.
      - Notifications now stack.
      - Refreshed icon.
---

## Lap tracking for volunteer-run races

Laps is built for school fun runs, running clubs, charity lap-a-thons, and other events where volunteers count laps.

Instead of tallying laps by hand or by memory, volunteers scan each racer's QR code. Laps keeps the counts and lap times in sync across the team, even when phones lose signal.

## How it works

### Set up a race

Create a race and share it with your team. Volunteers join from the race's QR code or link: scan it with the phone's camera, sign in with Google, and tap Join. They land on the scanner, already in the race, with nothing to install.

### Scan racers as they pass

Open the scanner, choose the front or back camera, and scan each racer's QR code as they go by to record a lap.

### Import, print and export

Import your racer list, then print each racer's QR code to wear on race day. When the race is over, export the results broken down by whatever detail you choose.

### Works offline

Race courses don't always have reliable signal. Laps queues scans and race changes on each phone, then syncs them when signal returns. Laps that haven't synced yet stay visible, so volunteers can see what's still waiting.

### Prevents duplicate laps

Laps checks for duplicates when a lap is scanned, and again when it combines the laps from every volunteer's device. The same lap never counts twice.

### See who scanned what

The summary lists every racer, their lap count, and lap times. Each lap records which volunteer and which device scanned it. Devices get memorable, automatically generated names, with no setup required.
