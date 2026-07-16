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
   5. BOOKING FORM LOGIC
---------------------------------------------------------------- */

function initBookingForm() {
  const form = document.getElementById("bookingForm");

  // Prevent picking a date in the past
  const dateInput = document.getElementById("apptDate");
  dateInput.min = new Date().toISOString().split("T")[0];

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const custName = document.getElementById("custName").value.trim();
    const custPhone = document.getElementById("custPhone").value.trim();
    const barberId = document.getElementById("barberSelect").value;
    const serviceId = document.getElementById("serviceSelect").value;
    const date = document.getElementById("apptDate").value;
    const time = document.getElementById("apptTime").value;
    const notes = document.getElementById("notes").value.trim();

    if (!custName || !custPhone || !barberId || !serviceId || !date || !time) {
      showToast("Please fill in all required fields.");
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
      document.getElementById("book").scrollIntoView({ behavior: "smooth" });
    }
    if (barberBtn) {
      document.getElementById("barberSelect").value = barberBtn.dataset.bookBarber;
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
