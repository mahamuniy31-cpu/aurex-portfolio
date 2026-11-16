/**
 * AUREX — Core Application Controller
 * Handles themes, navigation, mobile drawer, scroll tracking, form validation, and toast notifications.
 */

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initThemeSystem();
  initNavbarScroll();
  initMobileMenu();
  initActiveNavTracking();
  initScrollProgressAndBackToTop();
  initContactForm();
  initCopyEmail();
  initSkillsFilter();
});

/**
 * 1. PRELOADER DISMISS
 */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  function dismiss() {
    preloader.classList.add("loaded");
    preloader.style.display = "none";
  }

  if (document.readyState === "complete") {
    dismiss();
  } else {
    window.addEventListener("load", () => {
      setTimeout(dismiss, 120);
    });
  }

  // Safety fallback dismiss after 1.2s
  setTimeout(dismiss, 1200);
}

/**
 * 2. THEME SYSTEM (Dark / Light with LocalStorage Persistence)
 */
function initThemeSystem() {
  const themeToggles = document.querySelectorAll(".theme-toggle");
  const htmlEl = document.documentElement;
  const STORAGE_KEY = "aurex_theme_preference";

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? "dark" : "dark"); // Default to dark as requested

  setTheme(initialTheme);

  themeToggles.forEach(btn => {
    btn.addEventListener("click", () => {
      const currentTheme = htmlEl.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} theme`, "info");
    });
  });

  function setTheme(theme) {
    if (theme === "light") {
      htmlEl.setAttribute("data-theme", "light");
    } else {
      htmlEl.removeAttribute("data-theme");
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }
}

/**
 * 3. NAVBAR STICKY & SCROLL BLUR
 */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  function updateNavbar() {
    if (window.scrollY > 30) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();
}

/**
 * 4. MOBILE HAMBURGER MENU & DRAWER
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (!toggleBtn || !mobileMenu) return;

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    mobileMenu.classList.add("open");
    toggleBtn.classList.add("active");
    toggleBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    toggleBtn.classList.remove("active");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  toggleBtn.addEventListener("click", toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // Close when window resized to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992 && mobileMenu.classList.contains("open")) {
      closeMenu();
    }
  });
}

/**
 * 5. ACTIVE SECTION NAVIGATION TRACKING
 */
function initActiveNavTracking() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    threshold: 0.25,
    rootMargin: "-20% 0px -40% 0px"
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          const href = link.getAttribute("href");
          if (href === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => navObserver.observe(sec));
}

/**
 * 6. TOP SCROLL PROGRESS BAR & BACK TO TOP BUTTON
 */
function initScrollProgressAndBackToTop() {
  const progressBar = document.getElementById("scroll-progress");
  const backToTopBtn = document.getElementById("back-to-top");
  const progressRing = document.querySelector(".progress-ring-circle");

  const totalLength = 145; // 2 * PI * r (approx 2 * 3.14159 * 23)

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // 1. Update top bar
    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    // 2. Update Back to Top visibility
    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }

    // 3. Update circular progress on back-to-top
    if (progressRing) {
      const offset = totalLength - (totalLength * (scrollPercent / 100));
      progressRing.style.strokeDashoffset = offset;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
}

/**
 * 7. CONTACT FORM VALIDATION & MAILTO FALLBACK
 */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const subjectInput = document.getElementById("contact-subject");
  const messageInput = document.getElementById("contact-message");
  const charCounter = document.getElementById("message-char-count");
  const submitBtn = form.querySelector("button[type='submit']");

  // Character counter for message textarea
  if (messageInput && charCounter) {
    messageInput.addEventListener("input", () => {
      const count = messageInput.value.length;
      charCounter.textContent = `${count} / 1000`;
    });
  }

  function validateField(input, condition, errorId) {
    const errorEl = document.getElementById(errorId);
    if (!condition) {
      input.classList.add("invalid");
      if (errorEl) errorEl.classList.add("visible");
      return false;
    } else {
      input.classList.remove("invalid");
      if (errorEl) errorEl.classList.remove("visible");
      return true;
    }
  }

  // Live input validation on blur
  if (nameInput) {
    nameInput.addEventListener("blur", () => {
      validateField(nameInput, nameInput.value.trim().length >= 2, "error-name");
    });
  }

  if (emailInput) {
    emailInput.addEventListener("blur", () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validateField(emailInput, emailPattern.test(emailInput.value.trim()), "error-email");
    });
  }

  if (subjectInput) {
    subjectInput.addEventListener("blur", () => {
      validateField(subjectInput, subjectInput.value.trim().length >= 3, "error-subject");
    });
  }

  if (messageInput) {
    messageInput.addEventListener("blur", () => {
      validateField(messageInput, messageInput.value.trim().length >= 10, "error-message");
    });
  }

  // Form Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2, "error-name");
    const isEmailValid = validateField(emailInput, emailPattern.test(emailInput.value.trim()), "error-email");
    const isSubjectValid = validateField(subjectInput, subjectInput.value.trim().length >= 3, "error-subject");
    const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10, "error-message");

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
      showToast("Please correct the errors in the contact form.", "error");
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    // Disable button and show sending state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="loader-pulse" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
      <span>Preparing Dispatch...</span>
    `;

    setTimeout(() => {
      // Build mailto link with encoded URI components
      const mailtoUrl = `mailto:mahamuniy31@gmail.com?subject=${encodeURIComponent(`[AUREX Portfolio] ${subject}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      
      // Open email client via mailto
      window.location.href = mailtoUrl;

      showToast("Message prepared! Your mail application has been opened.", "success");

      form.reset();
      if (charCounter) charCounter.textContent = "0 / 1000";
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }, 600);
  });
}

/**
 * 8. COPY EMAIL TO CLIPBOARD
 */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll("[data-copy-email]");
  const EMAIL = "mahamuniy31@gmail.com";

  copyBtns.forEach(btn => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(EMAIL);
        showToast("Email address copied to clipboard!", "success");

        const iconContainer = btn.querySelector(".copy-icon-target");
        if (iconContainer) {
          const originalSvg = iconContainer.innerHTML;
          iconContainer.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--emerald-accent);"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          setTimeout(() => {
            iconContainer.innerHTML = originalSvg;
          }, 2000);
        }
      } catch (err) {
        // Fallback for environments blocking clipboard write
        const tempInput = document.createElement("input");
        tempInput.value = EMAIL;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        showToast("Email copied to clipboard!", "success");
      }
    });
  });
}

/**
 * 9. SKILLS CATEGORY FILTERING TABS
 */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll(".skills-filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-skill-filter");

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute("data-category");

        if (category === "all" || cardCategory === category) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 20);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(15px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 200);
        }
      });
    });
  });
}

/**
 * 10. TOAST NOTIFICATION UTILITY
 */
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const iconSvg = type === "success" 
    ? `<svg class="toast-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  setTimeout(() => toast.classList.add("show"), 20);

  // Auto remove after 3.5s
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, 3500);
}
