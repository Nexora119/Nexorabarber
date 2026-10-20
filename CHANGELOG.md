# Changelog: Nexora Barber rebuild

Static site: `index.html`, `style.css`, `script.js` (HTML/CSS/vanilla JS only, no backend, works on GitHub Pages root).

## Features
- Dark redesign of the original layout: nav + mobile menu, hero, services, barbers, booking form, appointment summary, gallery, testimonials, contact, footer, confirmation modal, toasts.
- Bookings saved to `localStorage` (guarded: corrupt, blocked or full storage never breaks the page). Edit and cancel supported. All records are demo data, labelled as such.
- User text is always inserted with `textContent`, never `innerHTML`.

## Decisions
- **One phone validator** (`parseSAPhone`) used by submit, blur and edit. South African **mobile** numbers only: `0` + 9 digits, `+27` + 9 digits, or `0027` + 9 digits; the 9 digits must start 6, 7 or 8. Only spaces/hyphens allowed as separators; other country codes (`+1`, `0044`) are rejected, never converted. Stored and shown as E.164 / `+27 82 123 4567`. Landline numbers are rejected by design (spec asked for mobile). Format check only.
- Opening hours (Mon-Fri 08-18, Sat 08-15, Sun closed) are enforced and shown under the Time field.
- Demo barber/testimonial names that matched real public figures were replaced with neutral names.
- The original site was light-themed; this build follows the brief's dark direction, keeping the blue/sky accents.
- Social links are `#` placeholders; stats and testimonials are labelled as samples.
