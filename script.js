"use strict";
/* Nexora Barber: frontend-only demo. Bookings live in localStorage; nothing is sent anywhere. */

/* ---------- 1. DATA ---------- */
const SERVICES = [
  { id: "haircut",  icon: "✂️", name: "Haircut",        desc: "Classic cut, wash and style.",        price: 150, duration: 45 },
  { id: "beard",    icon: "🪒", name: "Beard Trim",     desc: "Shape-up and line-up with hot towel.", price: 80,  duration: 20 },
  { id: "kids",     icon: "🧒", name: "Kids Haircut",   desc: "Patient, friendly cut for under 12s.", price: 100, duration: 30 },
  { id: "wash",     icon: "💧", name: "Hair Wash",      desc: "Deep cleanse and scalp massage.",      price: 60,  duration: 15 },
  { id: "color",    icon: "🎨", name: "Hair Colouring", desc: "Full colour or highlights.",           price: 350, duration: 90 },
  { id: "grooming", icon: "✨", name: "Full Grooming",  desc: "Cut, beard, wash and finish.",         price: 450, duration: 120 }
];
const BARBERS = [
  { id: "edward", name: "Edward Comon",        specialty: "Fades & tapers",         rating: 4.9, years: 8,  photo: "https://i.pravatar.cc/200?img=13" },
  { id: "joe",    name: "Joe Alu",             specialty: "Beard sculpting",        rating: 4.8, years: 6,  photo: "https://i.pravatar.cc/200?img=51" },
  { id: "kagiso", name: "Kagiso Mokoena",      specialty: "Precision cuts",         rating: 5.0, years: 5,  photo: "https://i.pravatar.cc/200?img=47" },
  { id: "johan",  name: "Johan van der Merwe", specialty: "Classic gentleman cuts", rating: 4.7, years: 12, photo: "https://i.pravatar.cc/200?img=12" },
  { id: "isaac",  name: "Isaac Naidoo",        specialty: "Kids & family",          rating: 4.9, years: 4,  photo: "https://i.pravatar.cc/200?img=33" },
  { id: "philip", name: "Philip Sithole",      specialty: "Colour & style",         rating: 4.8, years: 7,  photo: "https://i.pravatar.cc/200?img=48" }
];
const GALLERY = [
  ["photo-1599351431202-1e0f0137899a", "Skin fade in progress"], ["photo-1622286342621-4bd786c2447c", "Barbershop interior"],
  ["photo-1585747860715-2ba37e788b70", "Beard line-up"],         ["photo-1622296089863-eb7fc530daa8", "Waiting area"],
  ["photo-1567894340315-735d7c361db0", "Fresh taper"],           ["photo-1503951914875-452162b0f3f1", "Client after a haircut"],
  ["photo-1621605815971-fbc98d665033", "Barber tools on the counter"], ["photo-1516975080664-ed2fc6a32937", "Barber chair"]
].map(([p, alt]) => ({ src: `https://images.unsplash.com/${p}?w=500&q=75&auto=format&fit=crop`, alt }));
const TESTIMONIALS = [
  { name: "Lindiwe Khumalo", loc: "Sunnyside", quote: "Booked on my lunch break and was back at the office in 40 minutes. Cleanest fade I've had." },
  { name: "Ruan Botha",      loc: "Menlyn",    quote: "No more standing around. I pick my time, I pick Johan, and I'm in the chair on the dot." },
  { name: "Mike Evans",      loc: "Hatfield",  quote: "Took my son for his first proper haircut. The barber was patient and booking was simple." }
];
// [opens, closes) as 24h "HH:MM", indexed by Date.getDay(); null = closed. Matches the Contact section.
const HOURS = { 0: null, 1: ["08:00", "18:00"], 2: ["08:00", "18:00"], 3: ["08:00", "18:00"], 4: ["08:00", "18:00"], 5: ["08:00", "18:00"], 6: ["08:00", "15:00"] };
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const STORE_KEY = "nexoraBarberAppointments";
const FIELDS = ["custName", "custPhone", "barberSelect", "serviceSelect", "apptDate", "apptTime"];

/* ---------- 2. HELPERS ---------- */
const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, "0");
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function parseISODate(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3], dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d ? dt : null;
}
function formatDate(iso) {
  const d = parseISODate(iso);
  return d ? d.toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : iso;
}
function formatTime(t) {
  const [h, m] = t.split(":"), hr = +h;
  return `${((hr + 11) % 12) + 1}:${m} ${hr >= 12 ? "PM" : "AM"}`;
}
let toastTimer;
function showToast(msg) {
  const t = $("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
}

/* ---------- 3. PHONE VALIDATION (single source of truth) ---------- */
/* South African MOBILE numbers only. Three accepted entry forms, parsed separately:
     local          0 + 9 digits        e.g. 082 123 4567
     international  +27 + 9 digits      e.g. +27 82 123 4567
     access prefix  0027 + 9 digits     e.g. 0027 82 123 4567
   Only spaces and hyphens may separate digits; "+" is allowed only as the first character.
   The 9-digit national number must start 6, 7 or 8 (06x/07x/08x). Format check only: it cannot
   show that a number is assigned, active or belongs to the visitor.
   Returns { ok:true, e164:"+27821234567", display:"+27 82 123 4567" } or { ok:false, error }. */
function parseSAPhone(raw) {
  const bad = (error) => ({ ok: false, error });
  const v = String(raw == null ? "" : raw).trim();
  if (!v) return bad("Enter your mobile number.");
  if (!/^\+?[0-9][0-9 -]*$/.test(v)) return bad("Use digits only, with optional spaces or hyphens (and + at the start).");
  const digits = v.replace(/[ -]/g, "").replace(/^\+/, "");
  let national, intl = false;
  if (v.startsWith("+")) {
    if (!digits.startsWith("27")) return bad("Only South African numbers (+27) are supported.");
    national = digits.slice(2); intl = true;
  } else if (digits.startsWith("0027")) {
    national = digits.slice(4); intl = true;
  } else if (digits.startsWith("00")) {
    return bad("Only South African numbers (0027) are supported.");
  } else if (digits.startsWith("0")) {
    national = digits.slice(1);
  } else {
    return bad("Start with 0, +27 or 0027, e.g. 082 123 4567.");
  }
  if (intl && national.startsWith("0")) return bad("Leave out the 0 after the country code, e.g. +27 82 123 4567.");
  if (national.length < 9) return bad("That number is too short. Mobile numbers have 9 digits after the 0 or +27.");
  if (national.length > 9) return bad("That number is too long. Mobile numbers have 9 digits after the 0 or +27.");
  if (!/^[6-8][0-9]{8}$/.test(national)) return bad("Enter a South African mobile number starting 06, 07 or 08.");
  return { ok: true, e164: "+27" + national, display: `+27 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5)}` };
}

/* ---------- 4. OTHER VALIDATION ---------- */
function validateBooking(v) {
  const e = {};
  const name = v.custName.trim();
  if (!name) e.custName = "Enter your full name.";
  else if (name.length < 2 || (name.match(/\p{L}/gu) || []).length < 2) e.custName = "Enter at least 2 letters.";
  else if (name.length > 60) e.custName = "Use 60 characters or fewer.";
  else if (!/^\p{L}[\p{L}\p{M}'’ .-]*$/u.test(name)) e.custName = "Use letters, spaces, apostrophes and hyphens only.";

  const ph = parseSAPhone(v.custPhone);
  if (!ph.ok) e.custPhone = ph.error;

  if (!BARBERS.some((b) => b.id === v.barberSelect)) e.barberSelect = "Select a barber.";
  if (!SERVICES.some((s) => s.id === v.serviceSelect)) e.serviceSelect = "Select a service.";

  const day = parseISODate(v.apptDate);
  if (!v.apptDate) e.apptDate = "Choose a date.";
  else if (!day) e.apptDate = "Enter a valid date.";
  else if (v.apptDate < todayISO()) e.apptDate = "That date is in the past. Choose today or later.";
  else if (!HOURS[day.getDay()]) e.apptDate = `We're closed on ${DAYS[day.getDay()]}s. Choose another day.`;

  const t = v.apptTime;
  if (!t) e.apptTime = "Choose a time.";
  else if (!/^([01]\d|2[0-3]):[0-5]\d/.test(t)) e.apptTime = "Enter a valid time.";
  else if (day) {
    const h = HOURS[day.getDay()], hhmm = t.slice(0, 5), now = new Date();
    if (h && (hhmm < h[0] || hhmm >= h[1])) e.apptTime = `We're open ${h[0]}–${h[1]} on ${DAYS[day.getDay()]}s. Choose a time within those hours.`;
    else if (v.apptDate === todayISO() && hhmm <= `${pad(now.getHours())}:${pad(now.getMinutes())}`) e.apptTime = "That time has already passed today. Choose a later time.";
  }
  return { errors: e, phone: ph };
}

/* ---------- 5. FIELD ERROR UI ---------- */
function showFieldError(id, msg) {
  const input = $(id), err = $(id + "-err");
  if (!input || !err) return;
  err.textContent = msg || "";
  err.hidden = !msg;
  if (msg) {
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", (id === "apptTime" ? "timeHint " : "") + err.id);
  } else {
    input.removeAttribute("aria-invalid");
    input.setAttribute("aria-describedby", id === "apptTime" ? "timeHint" : "");
    if (id !== "apptTime") input.removeAttribute("aria-describedby");
  }
}
const formValues = () => ({
  custName: $("custName").value, custPhone: $("custPhone").value, barberSelect: $("barberSelect").value,
  serviceSelect: $("serviceSelect").value, apptDate: $("apptDate").value, apptTime: $("apptTime").value
});
function validateField(id) {
  showFieldError(id, validateBooking(formValues()).errors[id]);
}

/* ---------- 6. PERSISTENCE ---------- */
let appointments = [];
let editingId = null;
function loadAppointments() {
  try {
    const data = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    if (!Array.isArray(data)) return [];
    return data.filter((a) => a && typeof a.id === "number" && typeof a.custName === "string" && parseSAPhone(a.custPhone).ok &&
      BARBERS.some((b) => b.id === a.barberId) && SERVICES.some((s) => s.id === a.serviceId) && parseISODate(a.date) && /^\d{2}:\d{2}/.test(a.time));
  } catch (e) { return []; }
}
function saveAppointments() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(appointments)); return true; }
  catch (e) { showToast("Couldn't save to this browser. Your booking will be lost on refresh."); return false; }
}

/* ---------- 7. RENDERING ---------- */
function renderServices() {
  const grid = $("servicesGrid");
  SERVICES.forEach((s) => {
    const c = el("div", "card");
    const b = el("button", "btn btn-s", "Book"); b.type = "button"; b.dataset.service = s.id;
    b.setAttribute("aria-label", `Book ${s.name}`);
    const meta = el("div", "meta"); meta.append(el("span", "price", `R${s.price}`), el("span", "hint", `${s.duration} min`));
    c.append(el("div", "svc-ic", s.icon), el("h3", "", s.name), el("p", "", s.desc), meta, b);
    grid.append(c);
  });
}
function renderBarbers() {
  const grid = $("barbersGrid");
  BARBERS.forEach((b) => {
    const c = el("div", "card bcard"), ph = el("div", "photo"), img = el("img");
    img.src = b.photo; img.alt = `Portrait of ${b.name} (demo image)`; img.loading = "lazy"; ph.append(img);
    const btn = el("button", "btn btn-s", "Book this barber"); btn.type = "button"; btn.dataset.barber = b.id;
    btn.setAttribute("aria-label", `Book ${b.name}`);
    const meta = el("p", "hint", `★ ${b.rating} · ${b.years} yrs experience`); meta.style.margin = "10px 0 14px";
    c.append(ph, el("h3", "", b.name), el("p", "spec", b.specialty), meta, btn);
    grid.append(c);
  });
}
function renderGallery() {
  const grid = $("galleryGrid");
  GALLERY.forEach((g) => {
    const f = el("figure", "gi"), img = el("img"); img.src = g.src; img.alt = g.alt; img.loading = "lazy";
    f.append(img, el("span", "", g.alt)); grid.append(f);
  });
}
function renderTestimonials() {
  const grid = $("testimonialsGrid");
  TESTIMONIALS.forEach((t) => {
    const c = el("figure", "card"), who = el("figcaption", "who", t.name);
    who.append(el("small", "", `${t.loc}, Pretoria · sample`));
    c.append(el("p", "quote", `“${t.quote}”`), who); grid.append(c);
  });
}
function populateSelects() {
  BARBERS.forEach((b) => { const o = el("option", "", `${b.name} — ${b.specialty}`); o.value = b.id; $("barberSelect").append(o); });
  SERVICES.forEach((s) => { const o = el("option", "", `${s.name} — R${s.price} (${s.duration} min)`); o.value = s.id; $("serviceSelect").append(o); });
}
function renderAppointments() {
  const list = $("appointmentsList");
  list.replaceChildren();
  if (!appointments.length) { list.append(el("p", "empty", "No appointments yet. Book one using the form.")); return; }
  appointments.forEach((a) => {
    const barber = BARBERS.find((b) => b.id === a.barberId), svc = SERVICES.find((s) => s.id === a.serviceId);
    const c = el("div", "appt"), top = el("div", "appt-top");
    top.append(el("span", "", a.custName), el("span", "mono", `R${svc.price}`));
    c.append(top, el("p", "hint", `${barber.name} · ${svc.name}`), el("p", "hint", `${formatDate(a.date)} at ${formatTime(a.time)}`),
      el("p", "hint", `Phone: ${parseSAPhone(a.custPhone).display}`));
    if (a.notes) c.append(el("p", "hint", `Notes: ${a.notes}`));
    const act = el("div", "appt-act");
    const edit = el("button", "btn btn-s", "Edit"), cancel = el("button", "btn btn-s", "Cancel");
    edit.type = cancel.type = "button"; edit.dataset.edit = cancel.dataset.cancel = a.id;
    edit.setAttribute("aria-label", `Edit appointment for ${a.custName}`); cancel.setAttribute("aria-label", `Cancel appointment for ${a.custName}`);
    act.append(edit, cancel); c.append(act); list.append(c);
  });
}

/* ---------- 8. MODAL ---------- */
let lastFocus = null;
function openModal(a) {
  const barber = BARBERS.find((b) => b.id === a.barberId), svc = SERVICES.find((s) => s.id === a.serviceId), d = $("modalDetails");
  d.replaceChildren();
  [["Name", a.custName], ["Phone", parseSAPhone(a.custPhone).display], ["Barber", barber.name], ["Service", svc.name],
   ["Price", `R${svc.price}`], ["Date", formatDate(a.date)], ["Time", formatTime(a.time)]].forEach(([k, v]) => {
    const p = el("p"); p.append(el("span", "", k), el("span", "", v)); d.append(p);
  });
  lastFocus = document.activeElement;
  $("modalOverlay").hidden = false;
  $("modalCloseBtn").focus();
}
function closeModal() {
  $("modalOverlay").hidden = true;
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

/* ---------- 9. BOOKING SUBMIT / EDIT / CANCEL ---------- */
function setEditing(a) {
  editingId = a ? a.id : null;
  $("formTitle").textContent = a ? "Edit appointment" : "Your details";
  $("submitBtn").textContent = a ? "Save changes" : "Book Appointment";
  $("cancelEditBtn").hidden = !a;
}
function resetForm() {
  $("bookingForm").reset();
  FIELDS.forEach((id) => showFieldError(id, ""));
  setEditing(null);
}
function handleSubmit(e) {
  e.preventDefault();
  if (!$("modalOverlay").hidden) return;
  const vals = formValues();
  const { errors, phone } = validateBooking(vals);
  FIELDS.forEach((id) => showFieldError(id, errors[id]));
  const first = FIELDS.find((id) => errors[id]);
  if (first) { showToast("Please fix the highlighted fields."); $(first).focus(); return; }
  const rec = {
    id: editingId != null ? editingId : (appointments.reduce((m, a) => Math.max(m, a.id), 0) + 1),
    custName: vals.custName.trim(), custPhone: phone.e164, barberId: vals.barberSelect, serviceId: vals.serviceSelect,
    date: vals.apptDate, time: vals.apptTime.slice(0, 5), notes: $("notes").value.trim()
  };
  const wasEdit = editingId != null;
  appointments = wasEdit ? appointments.map((a) => (a.id === rec.id ? rec : a)) : appointments.concat(rec);
  saveAppointments();
  renderAppointments();
  resetForm();
  if (wasEdit) showToast("Appointment updated."); else openModal(rec);
}
function startEdit(id) {
  const a = appointments.find((x) => x.id === id);
  if (!a) return;
  $("custName").value = a.custName; $("custPhone").value = parseSAPhone(a.custPhone).display;
  $("barberSelect").value = a.barberId; $("serviceSelect").value = a.serviceId;
  $("apptDate").value = a.date; $("apptTime").value = a.time; $("notes").value = a.notes || "";
  FIELDS.forEach((f) => showFieldError(f, ""));
  setEditing(a);
  $("book").scrollIntoView();
  $("custName").focus({ preventScroll: true });
}
function initBookingForm() {
  const form = $("bookingForm");
  $("apptDate").min = todayISO();
  form.addEventListener("submit", handleSubmit);
  FIELDS.forEach((id) => {
    const input = $(id);
    input.addEventListener("blur", () => { if (input.value.trim() !== "" || input.getAttribute("aria-invalid") === "true") validateField(id); });
    const live = () => {
      if (input.getAttribute("aria-invalid") === "true") validateField(id);
      if (id === "apptDate" && ($("apptTime").value || $("apptTime").getAttribute("aria-invalid") === "true")) validateField("apptTime");
    };
    input.addEventListener("input", live); input.addEventListener("change", live);
  });
  $("cancelEditBtn").addEventListener("click", () => { resetForm(); showToast("Edit cancelled."); });
  $("modalCloseBtn").addEventListener("click", closeModal);
  $("modalOverlay").addEventListener("click", (e) => { if (e.target === $("modalOverlay")) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if ($("modalOverlay").hidden) return;
    if (e.key === "Escape") closeModal();
    else if (e.key === "Tab") { e.preventDefault(); $("modalCloseBtn").focus(); }
  });
  document.addEventListener("click", (e) => {
    const svc = e.target.closest("[data-service]"), bar = e.target.closest("[data-barber]");
    const ed = e.target.closest("[data-edit]"), cn = e.target.closest("[data-cancel]");
    if (svc) { $("serviceSelect").value = svc.dataset.service; showFieldError("serviceSelect", ""); $("book").scrollIntoView(); }
    if (bar) { $("barberSelect").value = bar.dataset.barber; showFieldError("barberSelect", ""); $("book").scrollIntoView(); }
    if (ed) startEdit(Number(ed.dataset.edit));
    if (cn) {
      const id = Number(cn.dataset.cancel);
      appointments = appointments.filter((a) => a.id !== id);
      if (editingId === id) resetForm();
      saveAppointments(); renderAppointments(); showToast("Appointment cancelled.");
    }
  });
}

/* ---------- 10. NAVIGATION ---------- */
function initNav() {
  const burger = $("hamburger"), menu = $("mobileMenu");
  if (!burger || !menu) return;
  const setOpen = (open) => { burger.classList.toggle("open", open); menu.classList.toggle("open", open); burger.setAttribute("aria-expanded", String(open)); };
  burger.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("open")) { setOpen(false); burger.focus(); } });
}

/* ---------- 11. INIT ---------- */
document.addEventListener("error", (e) => { if (e.target && e.target.tagName === "IMG") e.target.classList.add("broken"); }, true);
document.addEventListener("DOMContentLoaded", () => {
  $("year").textContent = new Date().getFullYear();
  renderServices(); renderBarbers(); renderGallery(); renderTestimonials(); populateSelects();
  appointments = loadAppointments();
  renderAppointments();
  initBookingForm();
  initNav();
});
