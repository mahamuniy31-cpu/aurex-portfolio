/**
 * AUREX — Project Registry & Showcase Engine
 * Handles project filtering, card rendering, and interactive modal deep dives.
 */

// Project Data Registry
const AUREX_PROJECTS = [
  {
    id: "lumina",
    title: "LUMINA — Editorial Visual Gallery",
    category: ["webapp", "vanillajs"],
    badge: "Code Alpha Project",
    status: "Production Ready",
    image: "assets/images/lumina-preview.svg",
    shortDescription: "A curated photographic sanctuary and editorial image gallery featuring category filters, dynamic real-time search, keyboard navigation, EXIF telemetry, and lossless downloads.",
    fullDescription: "LUMINA was engineered for the Code Alpha Internship Program as an ode to visual storytelling. Built entirely with semantic HTML5, CSS3 design tokens, and pure Vanilla JavaScript ES6+, it delivers instantaneous multi-category filtering, live search with instant highlighted results, an interactive modal lightbox with full EXIF data inspection, and keyboard hotkeys (ESC, Arrow keys) for fluid navigation.",
    tags: ["HTML5", "CSS3", "Vanilla JS", "Curated Photography", "EXIF Telemetry", "Responsive UI"],
    liveUrl: "../lumina-gallery/index.html",
    githubUrl: "https://github.com/mahamuniy31-cpu/Lumina-visual-gallery",
    features: [
      "Dynamic multi-category filtering (Landscape, Architecture, Portrait, Nature)",
      "Real-time instant search across titles, locations, and photographic tags",
      "Interactive lightbox modal with lossless image preview and EXIF metadata panel",
      "Full keyboard navigation: ESC to close, Left/Right arrows to cycle images",
      "100% zero external frontend dependencies for ultra-fast performance"
    ]
  },
  {
    id: "nova-calc",
    title: "NOVA CALC — Advanced Scientific Calculator",
    category: ["webapp", "tools", "vanillajs"],
    badge: "Code Alpha Project",
    status: "Production Ready",
    image: "assets/images/nova-calc-preview.svg",
    shortDescription: "A high-precision scientific calculator featuring trigonometric & logarithmic operations, persistent calculation history, full keyboard event mapping, and dual themes.",
    fullDescription: "NOVA CALC is an advanced computational engine built to bridge engineering utility with modern sleek aesthetics. It includes support for radians/degrees trigonometry, exponential and logarithmic functions, parentheses nesting, memory registers (M+, M-, MR, MC), an interactive audit history drawer with click-to-reuse expressions, and comprehensive physical keyboard support.",
    tags: ["JavaScript ES6+", "CSS Grid", "Scientific Math", "Keyboard Support", "State Persistence"],
    liveUrl: "../nova-calc/index.html",
    githubUrl: "https://github.com/mahamuniy31-cpu/nova-calc",
    features: [
      "Scientific arithmetic: sin, cos, tan, ln, log10, square roots, powers, factorials",
      "Interactive calculation audit history with click-to-recall equations",
      "Full physical keyboard binding for rapid calculation without mouse usage",
      "Precision decimal rounding and parenthesis balancing engine",
      "Light and Dark OLED theme modes with automatic memory persistence"
    ]
  },
  {
    id: "aurex",
    title: "AUREX — Personal Developer Portfolio",
    category: ["webapp", "vanillajs"],
    badge: "Capstone Project",
    status: "Live & Active",
    image: "assets/images/aurex-preview.svg",
    shortDescription: "An Awwwards-inspired personal developer brand website crafted with pure HTML5, CSS3, and Vanilla JavaScript featuring custom animations, dark/light themes, and zero framework overhead.",
    fullDescription: "AUREX serves as the flagship digital footprint developed for the Code Alpha Internship. It encapsulates modern web design philosophies: deep obsidian surfaces, luminous violet accents, responsive editorial typography, fluid micro-interactions, an interactive canvas particle field, accessible keyboard controls, and zero third-party dependencies.",
    tags: ["HTML5", "CSS3 Tokens", "Vanilla JS", "Glassmorphism", "IntersectionObserver", "Accessible UI"],
    liveUrl: "#home",
    githubUrl: "https://github.com/mahamuniy31-cpu/aurex-portfolio",
    features: [
      "Aesthetic dark and light theme switching with seamless CSS token transitions",
      "Interactive 3D-tilt physics on developer profile and project cards",
      "Real-time contact validation with mailto fallback and clipboard copying",
      "Accessible modal deep-dive dialogs with focus trapping and ESC support",
      "100% responsive fluid scaling across mobile, tablet, and widescreen displays"
    ]
  }
];

/**
 * Initialize Project Interactions & Filtering
 */
document.addEventListener("DOMContentLoaded", () => {
  initProjectFiltering();
  initProjectModals();
});

/**
 * Project Filtering Tabs
 */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll(".project-filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Update active button state
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach(card => {
        const categories = (card.getAttribute("data-category") || "").split(" ");
        
        if (filterValue === "all" || categories.includes(filterValue)) {
          card.style.display = "grid";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 20);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 250);
        }
      });
    });
  });
}

/**
 * Project Modal System
 */
function initProjectModals() {
  const modalBackdrop = document.getElementById("project-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalBody = document.getElementById("modal-content-area");

  if (!modalBackdrop || !modalCloseBtn || !modalBody) return;

  // Open modal on clicking "View Details"
  document.querySelectorAll("[data-open-project]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute("data-open-project");
      const project = AUREX_PROJECTS.find(p => p.id === projectId);

      if (!project) return;

      renderModalContent(project, modalBody);
      openModal(modalBackdrop);
    });
  });

  // Close modal events
  modalCloseBtn.addEventListener("click", () => closeModal(modalBackdrop));
  
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      closeModal(modalBackdrop);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalBackdrop.classList.contains("open")) {
      closeModal(modalBackdrop);
    }
  });
}

function openModal(modal) {
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  const closeBtn = modal.querySelector(".modal-close-btn");
  if (closeBtn) closeBtn.focus();
}

function closeModal(modal) {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

function renderModalContent(project, container) {
  container.innerHTML = `
    <div class="modal-project-header">
      <div class="modal-badge-row">
        <span class="project-featured-badge">${project.badge}</span>
        <span class="hero-chip" style="font-size:0.75rem;">${project.status}</span>
      </div>
      <h2 class="modal-project-title" style="font-size: 1.85rem; margin-top: 8px; margin-bottom: 12px; color: var(--text-primary); font-family: var(--font-display);">${project.title}</h2>
    </div>

    <div class="modal-project-media" style="margin: 16px 0 24px; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-medium);">
      <img src="${project.image}" alt="${project.title}" style="width: 100%; height: auto; display: block;" />
    </div>

    <div class="modal-project-body" style="display: flex; flex-direction: column; gap: 20px;">
      <div>
        <h4 style="font-size: 1.05rem; margin-bottom: 8px; color: var(--text-primary);">Project Overview</h4>
        <p style="font-size: 0.95rem; line-height: 1.65; color: var(--text-secondary);">${project.fullDescription}</p>
      </div>

      <div>
        <h4 style="font-size: 1.05rem; margin-bottom: 10px; color: var(--text-primary);">Key Architectural Features</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          ${project.features.map(f => `
            <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; color: var(--text-secondary);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-light); flex-shrink: 0; margin-top: 2px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${f}</span>
            </li>
          `).join("")}
        </ul>
      </div>

      <div>
        <h4 style="font-size: 1.05rem; margin-bottom: 10px; color: var(--text-primary);">Technologies Employed</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${project.tags.map(t => `<span class="tech-tag" style="background: var(--bg-tertiary); border: 1px solid var(--border-subtle);">${t}</span>`).join("")}
        </div>
      </div>

      <div class="modal-actions" style="display: flex; gap: 14px; margin-top: 10px; flex-wrap: wrap;">
        <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <span>Launch Project</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
          <span>Inspect Source Code</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </a>
      </div>
    </div>
  `;
}
