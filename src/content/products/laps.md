---
title: Laps
description: Scan racers' QR codes to track laps for a race, in real time, from any phone.
status: Demo Available
url: https://laps.victorpass.dev
repo: https://github.com/victor-pass/laps
screenshots:
  - /products/laps-scan-mobile.png
  - /products/laps-summary-mobile.png
updates:
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

Create a race, or join one from its QR code or link: scan it with your phone's camera, sign in with Google, and tap Join. You land on the scanner, already in the race, with nothing to install.

Open the scanner, choose the front or back camera, and scan a racer's QR code to record a lap.

### Works offline

Race courses don't always have reliable signal. Laps queues scans and race changes on each phone, then syncs them when signal returns. Laps that haven't synced yet stay visible, so volunteers can see what's still waiting.

### Prevents duplicate laps

Laps checks for duplicates when a lap is scanned, and again when it combines the laps from every volunteer's device. The same lap never counts twice.

### See who scanned what

The summary lists every racer, their lap count, and lap times. Each lap records which volunteer and which device scanned it. Devices get memorable, automatically generated names, with no setup required.

### Export your results

Export the race's lap data as a CSV when the event is over.
