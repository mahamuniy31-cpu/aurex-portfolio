/**
 * AUREX — Interactive Animation Engine
 * Handles hero typewriter, 3D card tilt physics, canvas particle mesh, and scroll reveals.
 */

document.addEventListener("DOMContentLoaded", () => {
  initTypewriter();
  initScrollReveals();
  initCardTilt();
  initParticleCanvas();
});

/**
 * 1. HERO ROLE TYPEWRITER
 * Cycles through developer roles with natural typing cadence
 */
function initTypewriter() {
  const typingTarget = document.getElementById("hero-role-text");
  if (!typingTarget) return;

  const roles = [
    "Frontend Developer",
    "Creative Coder",
    "Web Developer",
    "Software Developer"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/**
 * 2. SCROLL REVEALS VIA INTERSECTION OBSERVER
 */
function initScrollReveals() {
  // If user prefers reduced motion, immediately reveal everything
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const elements = document.querySelectorAll(
    ".reveal-fade, .reveal-slide-up, .reveal-slide-right, .reveal-slide-left"
  );

  if (prefersReduced) {
    elements.forEach(el => el.classList.add("revealed"));
    return;
  }

  const observerOptions = {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => revealObserver.observe(el));
}

/**
 * 3. 3D TILT PHYSICS ON DEVELOPER & HIGHLIGHT CARDS
 */
function initCardTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.innerWidth < 992) return; // Disable tilt on touch / mobile

  const cards = document.querySelectorAll("[data-tilt]");

  cards.forEach(card => {
    let bounds;

    function onMouseEnter() {
      bounds = card.getBoundingClientRect();
      card.style.transition = "transform 0.1s ease-out";
    }

    function onMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const xPct = mouseX / bounds.width - 0.5;
      const yPct = mouseY / bounds.height - 0.5;

      const maxTilt = 12; // degrees
      const tiltX = -yPct * maxTilt;
      const tiltY = xPct * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    function onMouseLeave() {
      card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }

    card.addEventListener("mouseenter", onMouseEnter);
    card.addEventListener("mousemove", onMouseMove);
    card.addEventListener("mouseleave", onMouseLeave);
  });
}

/**
 * 4. LIGHTWEIGHT AMBIENT CANVAS PARTICLES IN HERO
 */
function initParticleCanvas() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.getElementById("hero-particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 35;

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.hue = Math.random() > 0.5 ? 265 : 285; // Violet to Purple hues
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${this.hue}, 80%, 60%, 0.8)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  let isRunning = true;

  document.addEventListener("visibilitychange", () => {
    isRunning = !document.hidden;
    if (isRunning) requestAnimationFrame(loop);
  });

  function loop() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect close particles with subtle violet lines
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
