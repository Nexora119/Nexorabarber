/* ===================================================================
   NEXORA BARBER — SCRIPT
   This is a frontend-only demo. Appointments live in a plain JS array
   (in-memory only) — nothing is sent to a server and nothing is
   persisted after the page is closed.
=================================================================== */

/* ---------------------------------------------------------------
   1. DATA
   All content the page renders comes from these arrays, so beginners
   can find and edit everything in one place.
---------------------------------------------------------------- */

const SERVICES = [
  { id: "haircut",   icon: "✂️", name: "Haircut",        price: 150, duration: 45 },
  { id: "beard",     icon: "🪒", name: "Beard Trim",      price: 80,  duration: 20 },
  { id: "kids",      icon: "🧒", name: "Kids Haircut",    price: 100, duration: 30 },
  { id: "wash",      icon: "💧", name: "Hair Wash",       price: 60,  duration: 15 },
  { id: "color",     icon: "🎨", name: "Hair Colouring",  price: 350, duration: 90 },
  { id: "grooming",  icon: "✨", name: "Full Grooming",   price: 450, duration: 120 },
];

const BARBERS = [
  {
    id: "Edward",
    name: "Edward Comon",
    specialty: "Fades & tapers",
    rating: 4.9,
    years: 8,
    photo: "https://i.pravatar.cc/200?img=13",
    available: true,
  },
  {
    id: "Joe",
    name: "Joe Alu",
    specialty: "Beard sculpting",
    rating: 4.8,
    years: 6,
    photo: "https://i.pravatar.cc/200?img=51",
    available: true,
  },
  {
    id: "Jimmy",
    name: "Jimmy Fallon",
    specialty: "Precision cuts",
    rating: 5.0,
    years: 5,
    photo: "https://i.pravatar.cc/200?img=47",
    available: false,
  },
  {
    id: "johan",
    name: "Johan van der Merwe",
    specialty: "Classic gentleman cuts",
    rating: 4.7,
    years: 12,
    photo: "https://i.pravatar.cc/200?img=12",
    available: true,
  },
  {
    id: "Isaac",
    name: "Isaac Newton",
    specialty: "Kids & family",
    rating: 4.9,
    years: 4,
    photo: "https://i.pravatar.cc/200?img=33",
    available: true,
  },
  {
    id: "Philip",
    name: "Philip Seymour",
    specialty: "Colour & style",
    rating: 4.8,
    years: 7,
    photo: "https://i.pravatar.cc/200?img=48",
    available: false,
  },
];

const GALLERY = [
  { img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80&auto=format&fit=crop", caption: "Skin fade in progress" },
  { img: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80&auto=format&fit=crop", caption: "Nexora Pretoria Central" },
  { img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80&auto=format&fit=crop", caption: "Beard line-up" },
  { img: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=600&q=80&auto=format&fit=crop", caption: "Waiting area" },
  { img: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=600&q=80&auto=format&fit=crop", caption: "Fresh taper" },
  { img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80&auto=format&fit=crop", caption: "Sunday touch-up" },
  { img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80&auto=format&fit=crop", caption: "Tools of the trade" },
  { img: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80&auto=format&fit=crop", caption: "Chair 3, Hatfield branch" },
];

const TESTIMONIALS = [
  {
    name: "Louis Vuitton",
    location: "Sunnyside, Pretoria",
    quote: "Booked a slot on my lunch break and Thabo had me back at the office in 40 minutes. Cleanest fade I've had.",
    photo: "https://i.pravatar.cc/150?img=45",
  },
  {
    name: "Ruan Botha",
    location: "Menlyn, Pretoria",
    quote: "No more standing around waiting. I pick my time, I pick Johan, and I'm in the chair on the dot.",
    photo: "https://i.pravatar.cc/150?img=14",
  },
  {
    name: "Mike Evans",
    location: "Hatfield, Pretoria",
    quote: "Took my son for his first proper haircut. Kagiso was patient with him and the booking was dead simple.",
    photo: "https://i.pravatar.cc/150?img=59",
  },
];

/* ---------------------------------------------------------------
   2. IN-MEMORY "DATABASE" FOR THE DEMO
   A simple array holds whatever the visitor books during this
   session. Refreshing the page clears it — that's expected.
---------------------------------------------------------------- */
let appointments = [];
let nextApptId = 1;

/* ---------------------------------------------------------------
   3. RENDER FUNCTIONS
---------------------------------------------------------------- */

function renderServices() {
  const grid = document.getElementById("servicesGrid");
  grid.innerHTML = SERVICES.map(s => `
    <div class="service-card fade-in">
      <div class="service-icon">${s.icon}</div>
      <h3 class="service-name">${s.name}</h3>
      <div class="service-meta">
        <span class="service-price">R${s.price}</span>
        <span class="service-duration">${s.duration} min</span>
      </div>
      <button class="btn btn-sm" data-book-service="${s.id}">Book</button>
    </div>
  `).join("");
}

function renderBarbers() {
  const grid = document.getElementById("barbersGrid");
  grid.innerHTML = BARBERS.map(b => `
    <div class="barber-card fade-in">
      <img src="${b.photo}" alt="Portrait of ${b.name}" class="barber-photo">
      <h3 class="barber-name">${b.name}</h3>
      <p class="barber-specialty">${b.specialty}</p>
      <div class="barber-meta">
        <span>⭐ <strong>${b.rating}</strong></span>
        <span><strong>${b.years}</strong> yrs exp.</span>
      </div>
      <button class="btn btn-sm" data-book-barber="${b.id}">Book</button>
    </div>
  `).join("");
}

function renderAvailability() {
  const list = document.getElementById("availabilityList");
  list.innerHTML = BARBERS.map(b => `
    <div class="avail-chip">
      <img src="${b.photo}" alt="${b.name}">
      <span>${b.name.split(" ")[0]}</span>
      <span class="avail-status ${b.available ? "free" : "busy"}"></span>
    </div>
  `).join("");
}

function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = GALLERY.map(g => `
    <div class="gallery-item fade-in">
      <img src="${g.img}" alt="${g.caption}" loading="lazy">
      <div class="gallery-caption">${g.caption}</div>
    </div>
  `).join("");
}

function renderTestimonials() {
  const grid = document.getElementById("testimonialsGrid");
  grid.innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial-card fade-in">
      <div class="stars">★★★★★</div>
      <p class="testimonial-quote">"${t.quote}"</p>
      <div class="testimonial-person">
        <img src="${t.photo}" alt="${t.name}">
        <div>
          <p class="testimonial-name">${t.name}</p>
          <p class="testimonial-loc">${t.location}</p>
        </div>
      </div>
    </div>
  `).join("");
}

function populateFormSelects() {
  const barberSelect = document.getElementById("barberSelect");
  BARBERS.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b.id;
    opt.textContent = `${b.name} — ${b.specialty}`;
    barberSelect.appendChild(opt);
  });

  const serviceSelect = document.getElementById("serviceSelect");
  SERVICES.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = `${s.name} — R${s.price} (${s.duration} min)`;
    serviceSelect.appendChild(opt);
  });
}

function renderAppointments() {
  const container = document.getElementById("appointmentsList");

  if (appointments.length === 0) {
    container.innerHTML = `<p class="empty-state">No appointments booked yet.</p>`;
    return;
  }

  container.innerHTML = appointments.map(a => `
    <div class="appointment-item" data-appt-id="${a.id}">
      <div class="appt-top">
        <span class="appt-name">${a.custName}</span>
        <span class="appt-badge">Confirmed</span>
      </div>
      <p class="appt-detail">💈 ${a.barberName} · ${a.serviceName}</p>
      <p class="appt-detail">📅 ${formatDate(a.date)} at ${formatTime(a.time)}</p>
      <div class="appt-actions">
        <button class="btn-ghost-sm" data-cancel-appt="${a.id}">Cancel</button>
      </div>
    </div>
  `).join("");
}

/* ---------------------------------------------------------------
   4. HELPERS
---------------------------------------------------------------- */

function formatDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = ((hour + 11) % 12) + 1;
  return `${hour12}:${m} ${suffix}`;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openModal(appt) {
  const details = document.getElementById("modalDetails");
  details.innerHTML = `
    <p><span class="k">Name</span><span class="v">${appt.custName}</span></p>
    <p><span class="k">Barber</span><span class="v">${appt.barberName}</span></p>
    <p><span class="k">Service</span><span class="v">${appt.serviceName}</span></p>
    <p><span class="k">Date</span><span class="v">${formatDate(appt.date)}</span></p>
    <p><span class="k">Time</span><span class="v">${formatTime(appt.time)}</span></p>
  `;
  document.getElementById("modalOverlay").classList.add("open");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
}

/* ---------------------------------------------------------------
   4b. VALIDATION HELPERS
   Each validate*() function returns an error message, or "" when the
   value is fine. Client-side only: this improves usability but is not
   a security boundary.
---------------------------------------------------------------- */

// Mirrors the business hours shown in the Contact section.
// [opens, closes] as 24h "HH:MM"; null = closed. Index = Date.getDay().
const BUSINESS_HOURS = {
  0: null,                  // Sunday
  1: ["08:00", "18:00"],
  2: ["08:00", "18:00"],
  3: ["08:00", "18:00"],
  4: ["08:00", "18:00"],
  5: ["08:00", "18:00"],
  6: ["08:00", "15:00"],    // Saturday
};
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function pad2(n) {
  return String(n).padStart(2, "0");
}

// Today's date in the visitor's LOCAL time as YYYY-MM-DD.
// (toISOString() is UTC, which is the wrong day for part of every day in South Africa.)
function todayLocalISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// Parses "YYYY-MM-DD" into a local Date, or null if it isn't a real calendar date.
function parseISODate(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
  if (!m) return null;
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return dt;
}

function validateName(raw) {
  const v = raw.trim();
  if (!v) return "Please enter your full name.";
  if (v.length < 2) return "Your name must be at least 2 characters long.";
  if (v.length > 60) return "Your name must be 60 characters or fewer.";
  if (!/^[\p{L}\p{M}][\p{L}\p{M}'’.\- ]*$/u.test(v)) {
    return "Names can only contain letters, spaces, hyphens, apostrophes and full stops.";
  }
  return "";
}

// South African numbers. Accepts local (082 123 4567, 012 345 6789) and international
// (+27 82 123 4567, 0027 82 123 4567, 27821234567, +27 (0) 82 123 4567) forms, with
// spaces, hyphens, dots and brackets. The value itself is never modified here.
function validatePhone(raw) {
  const v = raw.trim();
  if (!v) return "Please enter your phone number.";
  if (!/^\+?[\d\s().\-]+$/.test(v)) {
    return "Phone numbers can only contain digits, spaces, hyphens, brackets and a leading +.";
  }
  const hint = "Enter a valid South African number, e.g. 082 123 4567 or +27 82 123 4567.";
  if ((v.match(/\(/g) || []).length !== (v.match(/\)/g) || []).length) return hint;

  const digits = v.replace(/\D/g, "");
  let national;
  if (v.startsWith("+")) {
    if (!digits.startsWith("27")) return hint;
    national = digits.slice(2);
    if (national.startsWith("0")) national = national.slice(1);   // "+27 (0) 82..."
  } else if (digits.startsWith("0027")) {
    national = digits.slice(4);
    if (national.startsWith("0")) national = national.slice(1);
  } else if (digits.startsWith("27") && digits.length === 11) {
    national = digits.slice(2);
  } else if (digits.startsWith("0")) {
    national = digits.slice(1);
  } else {
    return hint;
  }

  if (national.length < 9) return "That phone number is too short. " + hint;
  if (national.length > 9) return "That phone number is too long. " + hint;
  // 9 digits after the trunk/country code; first digit 1–8 (landline areas 01x–05x, mobile 06x–08x).
  if (!/^[1-8]\d{8}$/.test(national)) return hint;
  return "";
}

function validateBarber(id) {
  if (!id) return "Please select a barber.";
  if (!BARBERS.some(b => b.id === id)) return "Please choose a barber from the list.";
  return "";
}

function validateService(id) {
  if (!id) return "Please select a service.";
  if (!SERVICES.some(s => s.id === id)) return "Please choose a service from the list.";
  return "";
}

function validateDate(v) {
  if (!v) return "Please choose a date.";
  const dt = parseISODate(v);
  if (!dt) return "Please enter a valid date.";
  if (v < todayLocalISO()) return "That date is in the past. Please choose today or a later date.";
  if (!BUSINESS_HOURS[dt.getDay()]) {
    return `We're closed on ${DAY_NAMES[dt.getDay()]}s. Please choose another day.`;
  }
  return "";
}

// Time depends on the chosen date (opening hours differ by weekday, and "today" can't be in the past).
// Problems with the date itself are reported on the date field, not here.
function validateTime(v, dateValue) {
  if (!v) return "Please choose a time.";
  if (!/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(v)) return "Please enter a valid time.";
  const hhmm = v.slice(0, 5);

  const dt = parseISODate(dateValue);
  if (!dt) return "";

  const hours = BUSINESS_HOURS[dt.getDay()];
  if (hours && (hhmm < hours[0] || hhmm >= hours[1])) {
    return `We're open ${hours[0]}–${hours[1]} on ${DAY_NAMES[dt.getDay()]}s. Please choose a start time within those hours.`;
  }

  if (dateValue === todayLocalISO()) {
    const now = new Date();
    if (hhmm <= `${pad2(now.getHours())}:${pad2(now.getMinutes())}`) {
      return "That time has already passed today. Please choose a later time.";
    }
  }
  return "";
}

/* ---------------------------------------------------------------
   5. BOOKING FORM LOGIC
---------------------------------------------------------------- */

function initBookingForm() {
  const form = document.getElementById("bookingForm");

  // Prevent picking a date in the past (local date, not UTC)
  const dateInput = document.getElementById("apptDate");
  dateInput.min = todayLocalISO();

  // --- Inline validation wiring (rules live in "4b. VALIDATION HELPERS") ---
  const val = (id) => document.getElementById(id).value;
  const validators = {
    custName:      () => validateName(val("custName")),
    custPhone:     () => validatePhone(val("custPhone")),
    barberSelect:  () => validateBarber(val("barberSelect")),
    serviceSelect: () => validateService(val("serviceSelect")),
    apptDate:      () => validateDate(val("apptDate")),
    apptTime:      () => validateTime(val("apptTime"), val("apptDate")),
  };
  const fieldIds = Object.keys(validators);
  const dirty = {};

  // One (initially empty) message element per validated field.
  fieldIds.forEach(id => {
    const err = document.createElement("p");
    err.className = "field-error";
    err.id = id + "Error";
    err.setAttribute("aria-live", "polite");
    document.getElementById(id).closest(".form-group").appendChild(err);
  });

  function validateField(id) {
    const input = document.getElementById(id);
    const err = document.getElementById(id + "Error");
    const message = validators[id]();
    err.textContent = message;
    input.classList.toggle("is-invalid", !!message);
    if (message) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", err.id);
    } else {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
    return !message;
  }

  // Re-check a field only if it is currently showing an error (used to clear stale errors).
  function refreshField(id) {
    if (document.getElementById(id).classList.contains("is-invalid")) validateField(id);
  }

  fieldIds.forEach(id => {
    const input = document.getElementById(id);
    const onEdit = () => {
      dirty[id] = true;
      refreshField(id);
      // Time validity depends on the date, so keep it in step.
      if (id === "apptDate" && (val("apptTime") || document.getElementById("apptTime").classList.contains("is-invalid"))) {
        validateField("apptTime");
      }
    };
    input.addEventListener("input", onEdit);
    input.addEventListener("change", onEdit);
    input.addEventListener("blur", () => { if (dirty[id]) validateField(id); });
  });

  form.addEventListener("reset", () => {
    fieldIds.forEach(id => {
      dirty[id] = false;
      const input = document.getElementById(id);
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
      document.getElementById(id + "Error").textContent = "";
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Ignore repeat submits while the confirmation is showing (avoids duplicate/empty re-submits).
    if (document.getElementById("modalOverlay").classList.contains("open")) return;

    const custName = document.getElementById("custName").value.trim();
    const custPhone = document.getElementById("custPhone").value.trim();
    const barberId = document.getElementById("barberSelect").value;
    const serviceId = document.getElementById("serviceSelect").value;
    const date = document.getElementById("apptDate").value;
    const time = document.getElementById("apptTime").value;
    const notes = document.getElementById("notes").value.trim();

    // Validate every field (shows all inline errors at once), then focus the first problem.
    const invalidIds = fieldIds.filter(id => !validateField(id));
    if (invalidIds.length) {
      showToast("Please correct the highlighted fields.");
      document.getElementById(invalidIds[0]).focus();
      return;
    }

    const barber = BARBERS.find(b => b.id === barberId);
    const service = SERVICES.find(s => s.id === serviceId);

    const appt = {
      id: nextApptId++,
      custName,
      custPhone,
      barberId,
      barberName: barber.name,
      serviceId,
      serviceName: service.name,
      date,
      time,
      notes,
    };

    appointments.push(appt);
    renderAppointments();
    openModal(appt);
    form.reset();
  });

  // "Book" buttons on service/barber cards jump to the form and
  // pre-select the relevant option.
  document.addEventListener("click", (e) => {
    const serviceBtn = e.target.closest("[data-book-service]");
    const barberBtn = e.target.closest("[data-book-barber]");

    if (serviceBtn) {
      document.getElementById("serviceSelect").value = serviceBtn.dataset.bookService;
      refreshField("serviceSelect");
      document.getElementById("book").scrollIntoView({ behavior: "smooth" });
    }
    if (barberBtn) {
      document.getElementById("barberSelect").value = barberBtn.dataset.bookBarber;
      refreshField("barberSelect");
      document.getElementById("book").scrollIntoView({ behavior: "smooth" });
    }

    const cancelBtn = e.target.closest("[data-cancel-appt]");
    if (cancelBtn) {
      const id = Number(cancelBtn.dataset.cancelAppt);
      appointments = appointments.filter(a => a.id !== id);
      renderAppointments();
      showToast("Appointment cancelled.");
    }
  });

  document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeModal();
  });
}

/* ---------------------------------------------------------------
   6. NAVIGATION (sticky shadow + mobile hamburger)
---------------------------------------------------------------- */

function initNav() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });

  mobileMenu.querySelectorAll(".mobile-link").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
    });
  });
}

/* ---------------------------------------------------------------
   7. SCROLL-TRIGGERED FADE-IN
---------------------------------------------------------------- */

function initFadeIns() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
}

/* ---------------------------------------------------------------
   8. INIT
---------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  renderServices();
  renderBarbers();
  renderAvailability();
  renderGallery();
  renderTestimonials();
  populateFormSelects();
  renderAppointments();

  initBookingForm();
  initNav();
  initFadeIns(); // re-run after dynamic content is in the DOM
});
