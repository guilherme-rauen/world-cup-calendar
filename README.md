# FIFA World Cup 2026 Calendar

A subscribe-able `.ics` calendar with all 104 matches. Times are stored in UTC and show in your local timezone.

## GitHub Pages setup

In the repo on GitHub: **Settings → Pages**

- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/docs`

Site URL: `https://<your-username>.github.io/world-cup-calendar/`

## Subscribe on your phone

Open the site on your phone and tap **Subscribe on iPhone / Apple Calendar**.

Direct calendar URL:

```
https://<your-username>.github.io/world-cup-calendar/fifa-world-cup-2026.ics
```

## Daily result updates (manual)

1. Edit match results in `generate.js` (or edit `docs/fifa-world-cup-2026.ics` directly).
2. If you changed `generate.js`, regenerate: `node generate.js`
3. Commit and push — at minimum `docs/fifa-world-cup-2026.ics`:

```bash
git add docs/fifa-world-cup-2026.ics
git commit -m "Update results for match day X"
git push
```

Your phone will pick up changes on its next refresh (typically within 12–24 hours).

## Regenerate the calendar

```bash
node generate.js
```

Output: `docs/fifa-world-cup-2026.ics`
