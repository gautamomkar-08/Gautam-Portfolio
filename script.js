
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(width * 0.045), 65);
  let mouse = { x: -1000, y: -1000, radius: 120 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse repulsion/connection
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 1.5;
        this.y -= (dy / dist) * force * 1.5;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

//  Typing Effect in Hero
function initTypingEffect() {
  const target = document.getElementById('typed-role');
  if (!target) return;

  const roles = [
    'Full Stack Developer',
    'Creative Technologist',
    'AI Solutions Architect',
    'UI/UX Craftsman',
    'Open Source Contributor'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseEnd = 2000;

  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      target.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIdx === current.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

// Stats Counter on Scroll
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let counted = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        statNumbers.forEach((el) => {
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1600;
          const stepTime = 25;
          const step = Math.max(1, Math.floor(target / (duration / stepTime)));

          const timer = setInterval(() => {
            count += step;
            if (count >= target) {
              el.textContent = target + suffix;
              clearInterval(timer);
            } else {
              el.textContent = count + suffix;
            }
          }, stepTime);
        });
      }
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);
}

// Custom Cursor (Desktop)
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const dot = document.querySelector('.custom-cursor-dot');
  if (!cursor || !dot) return;

  let mouseX = -100, mouseY = -100;
  let cursorX = -100, cursorY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate(${cursorX - 12}px, ${cursorY - 12}px)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover state on links & buttons
  const interactives = document.querySelectorAll('a, button, .glass-card, .clickable');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '42px';
      cursor.style.height = '42px';
      cursor.style.borderColor = 'var(--accent-purple)';
      cursor.style.backgroundColor = 'rgba(168, 85, 247, 0.15)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.borderColor = 'var(--accent-cyan)';
      cursor.style.backgroundColor = 'transparent';
    });
  });
}

// Navbar Scroll & Active Section Spy
function initNav() {
  const nav = document.querySelector('.navbar');
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    links.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      sound.playPop(550);
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
      });
    });
  }
}

// Skills Tab Filter & Animation
function initSkills() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  // Trigger bar fill animation
  const skillSection = document.getElementById('skills');
  if (skillSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          document.querySelectorAll('.skill-bar-fill').forEach((bar) => {
            const width = bar.getAttribute('data-width') || '85%';
            bar.style.width = width;
          });
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(skillSection);
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      sound.playPop(700);

      const category = btn.getAttribute('data-category');
      skillCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
          setTimeout(() => (card.style.opacity = '1'), 20);
        } else {
          card.style.opacity = '0';
          setTimeout(() => (card.style.display = 'none'), 200);
        }
      });
    });
  });
}

// Projects Filter & Project Detail Modal
const projectData = {
  1: {
    title: 'NexusAI - Autonomous Orchestration Hub',
    category: 'AI & Cloud',
    image: 'assets/project1.jpg',
    description:
      'A high-performance orchestration control dashboard for enterprise autonomous agents. Features real-time neural network topology visualization, automated task dispatching, latency telemetry, and adaptive compute scaling.',
    tags: ['Next.js 15', 'TypeScript', 'Node.js', 'Python', 'Tailwind', 'WebSocket'],
    metrics: ['99.98% System Uptime', '14ms Telemetry Latency', '84 Active Parallel Models'],
    github: 'https://github.com/gautam/nexus-ai-orchestration',
    live: 'https://nexusai.demo.dev'
  },
  2: {
    title: 'Emerald Analytics - Headless E-Commerce Suite',
    category: 'Full Stack',
    image: 'assets/project2.jpg',
    description:
      'Ultra-fast enterprise e-commerce platform with real-time financial tracking, inventory management, dynamic conversion analytics, and seamless payment gateway orchestration.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe API', 'Redis', 'Docker'],
    metrics: ['$124k+ Monthly Volume Processed', '4.1% Conversion Rate Optimization', '0.4s Fast Checkout'],
    github: 'https://github.com/gautam/emerald-analytics',
    live: 'https://emeraldanalytics.demo.dev'
  },
  3: {
    title: 'Carbon Studio - Realtime Collaborative IDE',
    category: 'Dev Tools',
    image: 'assets/project3.jpg',
    description:
      'In-browser collaborative code editor & live preview sandbox. Features multi-cursor synchronisation via WebRTC/CRDTs, custom container execution, AST analysis, and integrated visual canvas.',
    tags: ['WebRTC', 'Monaco Editor', 'WebAssembly', 'Rust', 'Vanilla CSS', 'Express'],
    metrics: ['Sub-10ms Typing Sync', '50+ Concurrent Coders per Session', 'Zero Server Memory Leaks'],
    github: 'https://github.com/gautam/carbon-studio',
    live: 'https://carbonstudio.demo.dev'
  }
};

function initProjects() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close-btn');

  // Filter tabs
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      sound.playPop(620);

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (filter === 'all' || cardCat === filter) {
          card.style.display = 'flex';
          setTimeout(() => (card.style.opacity = '1'), 30);
        } else {
          card.style.opacity = '0';
          setTimeout(() => (card.style.display = 'none'), 220);
        }
      });
    });
  });

  // Modal triggers
  document.querySelectorAll('.open-modal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const data = projectData[id];
      if (!data) return;

      document.getElementById('modal-img').src = data.image;
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-desc').textContent = data.description;

      const tagsContainer = document.getElementById('modal-tags');
      tagsContainer.innerHTML = '';
      data.tags.forEach((t) => {
        const span = document.createElement('span');
        span.className = 'project-tag';
        span.textContent = t;
        tagsContainer.appendChild(span);
      });

      const metricsContainer = document.getElementById('modal-metrics');
      metricsContainer.innerHTML = '';
      data.metrics.forEach((m) => {
        const li = document.createElement('li');
        li.textContent = m;
        metricsContainer.appendChild(li);
      });

      document.getElementById('modal-github-link').href = data.github;
      document.getElementById('modal-live-link').href = data.live;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      sound.playPop(850);
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      sound.playPop(420);
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Theme Switcher & Sound Toggle
function initThemes() {
  const themeToggle = document.getElementById('theme-toggle');
  const soundToggle = document.getElementById('sound-toggle');

  // Load saved theme
  const savedTheme = localStorage.getItem('shalu-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      let nextTheme = 'dark';
      if (current === 'dark') nextTheme = 'cyber';
      else if (current === 'cyber') nextTheme = 'light';
      else nextTheme = 'dark';

      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('shalu-theme', nextTheme);
      sound.playPop(900);
      showToast(`Switched to ${nextTheme.toUpperCase()} theme!`);
    });
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      sound.enabled = !sound.enabled;
      soundToggle.classList.toggle('active', sound.enabled);
      if (sound.enabled) {
        sound.init();
        sound.playPop(800);
        showToast('Sound effects enabled 🎵');
      } else {
        showToast('Sound effects muted 🔇');
      }
    });
  }
}

// Command Palette (Ctrl+K / Cmd+K)
function initCommandPalette() {
  const cmdOverlay = document.getElementById('cmd-palette-overlay');
  const cmdInput = document.getElementById('cmd-palette-input');
  const cmdTrigger = document.getElementById('cmd-trigger-btn');
  const cmdItems = document.querySelectorAll('.cmd-item');

  function openCmd() {
    if (!cmdOverlay) return;
    cmdOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
    }
    sound.playPop(750);
  }

  function closeCmd() {
    if (!cmdOverlay) return;
    cmdOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cmdTrigger) cmdTrigger.addEventListener('click', openCmd);

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdOverlay && cmdOverlay.classList.contains('active')) {
        closeCmd();
      } else {
        openCmd();
      }
    }
    if (e.key === 'Escape' && cmdOverlay && cmdOverlay.classList.contains('active')) {
      closeCmd();
    }
  });

  if (cmdOverlay) {
    cmdOverlay.addEventListener('click', (e) => {
      if (e.target === cmdOverlay) closeCmd();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', () => {
      const q = cmdInput.value.toLowerCase().trim();
      cmdItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (text.includes(q)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  cmdItems.forEach((item) => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      closeCmd();

      if (action.startsWith('#')) {
        const target = document.querySelector(action);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'toggle-theme') {
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) themeBtn.click();
      } else if (action === 'copy-email') {
        copyEmailToClipboard();
      } else if (action === 'download-resume') {
        triggerResumeDownload();
      }
    });
  });
}

// Contact Form & Clipboard Feature
function showToast(message, isSuccess = true) {
  let toast = document.getElementById('status-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'status-toast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span style="font-size: 1.25rem;">${isSuccess ? '✨' : '⚠️'}</span>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function copyEmailToClipboard() {
  const email = '.codes@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    sound.playPop(1000);
    showToast(`Copied ${email} to clipboard!`);
  }).catch(() => {
    showToast('Failed to copy to clipboard', false);
  });
}

// DOM Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initTypingEffect();
  initCounters();
  initCustomCursor();
  initNav();
  initSkills();
  initProjects();
  initThemes();
  initCommandPalette();
  initContactForm();
});

// ========================
// Select all tab buttons and tab contents
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// Tab Switching
tabButtons.forEach((button) => {

    button.addEventListener("click", () => {

        // Remove active class from all buttons
        tabButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        // Remove active class from all contents
        tabContents.forEach((content) => {
            content.classList.remove("active");
        });

        // Activate clicked button
        button.classList.add("active");

        // Show selected content
        const selectedTab = button.dataset.tab;

        document.getElementById(selectedTab).classList.add("active");

    });

});


// Scroll Reveal Animation
const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.15
});

// Observe all reveal elements
revealElements.forEach((element) => {
    observer.observe(element);
});