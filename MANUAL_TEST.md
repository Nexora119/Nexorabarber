# Manual test checklist (Android phone, after publishing)

Open the GitHub Pages URL in Chrome. Tick each item.

## Load and layout
- [ ] Page loads, headings use Space Grotesk, hero image and barber photos appear
- [ ] No sideways scrolling on any section (portrait and landscape)
- [ ] Map loads in Contact; footer social icons are placeholders (they go nowhere yet)

## Navigation
- [ ] Hamburger opens/closes the menu; each link scrolls to its section and closes the menu

## Cards
- [ ] Tap Book on a service: Service is preselected and you land on the form
- [ ] Tap Book this barber: Barber is preselected and you land on the form

## Phone validation (fill other fields correctly; date = a weekday, time 10:00)
Should be ACCEPTED: `0821234567`, `082 123 4567`, `082-123-4567`, `+27 82 123 4567`, `0027 82 123 4567`
Should be REJECTED with a message under the field: empty, `082 123 456`, `082 123 45678`, `abc`, `+1 202 555 0123`, `+27 082 123 4567`, `0111234567`
- [ ] Leaving the phone field after typing shows the error; correcting it removes the error
- [ ] Pressing Go/Enter on the keyboard with a bad number does not book

## Other fields
- [ ] Empty form: every field shows a message, nothing booked
- [ ] Name of only spaces, or `<b>x</b>`, is rejected; `Siya O'Brien-Dlamini` is accepted
- [ ] Past date, a Sunday, a time outside opening hours, and an earlier time today are rejected

## Appointments
- [ ] Valid booking opens the confirmation (Done button, Back button/Esc closes) and appears in "Your appointments" with price and +27 number
- [ ] Refresh: appointment is still there
- [ ] Edit: form loads it; a bad phone blocks saving; fixing it saves
- [ ] Cancel removes it and it stays gone after refresh
- [ ] Private/incognito tab still lets you book (it just won't persist)
