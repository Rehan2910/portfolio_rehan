'use strict';

/* =========================================================
   B1 — Project data as an array of objects, rendered via DOM
   ========================================================= */
const projects = [
  {
    id: 'sih-situp',
    title: 'AI Sit-Up Trainer — Sports Talent Assessment',
    blurb: 'Replaced manual rep-counting with real-time pose scoring — cheat-proofed and built to run offline on low-end phones, taking a 6-person team to the SIH 2025 preliminary round.',
    proof: 'Judgment call: rule-based cheat detection over a heavier ML classifier, to keep it fast enough for offline rural devices.',
    detail: 'Built for Smart India Hackathon 2025 (qualified the preliminary round) with a 6-member team. Uses MediaPipe and OpenCV for pose estimation, a Python + Gradio interface, and rule-based cheat detection so scores stay fair even without high-end hardware — aimed at making athlete talent assessment accessible in rural areas.',
    tags: ['Computer Vision', 'MediaPipe', 'OpenCV', 'Python'],
    image: 'images/proj-cv.svg',
    link: 'https://github.com/Rehan2910/ai-situp-trainer-SIH_HACKATHON',
    linkLabel: 'View repository'
  },
  {
    id: 'solar-tracker',
    title: 'Smart Solar Tracking System',
    blurb: 'Recovered the ~30% efficiency fixed solar panels lose, by building a dual-sensor Arduino tracker that follows the sun and logs every move to a live database.',
    proof: 'End-to-end ownership: sensor firmware, Node-RED data pipeline, and the MySQL schema, all built solo within a 4-person team.',
    detail: 'A 4-member hardware project pairing Arduino firmware (LDR sensing + servo control) with a Node-RED pipeline that parses and logs sensor and servo data into MySQL for real-time tracking history — addressing the roughly 30% efficiency loss of fixed solar panels.',
    tags: ['Arduino', 'IoT', 'MySQL', 'Node-RED'],
    image: 'images/proj-solar.svg',
    link: 'https://github.com/Rehan2910/smart-solar-tracker',
    linkLabel: 'View repository'
  },
  {
    id: 'mmcbie',
    title: 'MMCBIE-PRO — Chaos-Based Image Encryption',
    blurb: 'Built pixel-level image encryption strong enough to validate with histogram analysis, using chaos-theory attractors instead of standard AES-style ciphers.',
    proof: 'Went beyond a working demo — added histogram analysis so encryption strength is measurable, not just assumed.',
    detail: 'Applies mathematical attractors for secure pixel-level image encryption, exposes a web-based UI for real-time interaction, includes histogram analysis to validate encryption strength, and supports multiple chaos methods for robust protection of sensitive image data.',
    tags: ['Python', 'Cryptography', 'Image Processing'],
    image: 'images/proj-crypto.svg',
    link: 'https://github.com/Rehan2910/mmcbie-pro',
    linkLabel: 'View repository'
  },
  {
    id: 'serenitybot',
    title: 'SerenityBot — AI Mental Health Chatbot',
    blurb: 'Gave a mental-health chatbot the ability to detect distress in real time and escalate it — not just reply — across an 8-person full-stack build.',
    proof: 'Prioritized safety over polish first: the crisis-alert system shipped before the UI theming did.',
    detail: 'Built with an 8-member team using FastAPI, React (TypeScript) and Gemini/GPT-4, with RoBERTa-based real-time emotion detection, WebSocket support for live conversation, a crisis-alert system, and dual light/dark theme modes for a more accessible, therapeutic experience.',
    tags: ['React', 'FastAPI', 'Machine Learning', 'RoBERTa'],
    image: 'images/proj-chat.svg',
    link: 'https://github.com/Rehan2910/AI-Powered-Mental-Health-Chatbot',
    linkLabel: 'View repository'
  }
];

/* -- Icon markup kept small & inline (no external icon library) -- */
const linkIcon = () => '&#8599;'; // ↗

/**
 * Renders the project cards from the `projects` array into the DOM.
 * @param {Array<Object>} list - the projects to render
 */
function renderProjects(list) {
  const grid = document.getElementById('projectGrid');
  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML = `<p class="empty-msg">No projects match that filter yet.</p>`;
    return;
  }

  list.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${project.title}`);
    card.dataset.id = project.id;

    // Template literal keeps markup readable; tags rendered via map()
    card.innerHTML = `
      <div class="project-thumb"><img src="${project.image}" alt="${project.title} thumbnail" loading="lazy"></div>
      <div class="project-body">
        <h3>${project.title}</h3>
        <p>${project.blurb}</p>
        <p class="project-proof">↳ ${project.proof}</p>
        <div class="project-tags">${project.tags.map(t => `<span>${t}</span>`).join('')}</div>
        <div class="project-links">
          <a href="${project.link}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${project.linkLabel} ${linkIcon()}</a>
        </div>
      </div>
    `;

    // B2 — event handling: open modal on click / Enter / Space
    card.addEventListener('click', () => openModal(project.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(project.id);
      }
    });

    grid.appendChild(card);
  });
}

/* =========================================================
   B2 — Project filter by technology (event handling #1)
   ========================================================= */
function buildFilterBar() {
  const allTags = new Set();
  projects.forEach(p => p.tags.forEach(t => allTags.add(t)));

  const bar = document.getElementById('filterBar');
  const tagsArr = ['All', ...Array.from(allTags)];

  tagsArr.forEach((tag, i) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (i === 0 ? ' active' : '');
    btn.type = 'button';
    btn.textContent = tag;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filtered = tag === 'All'
        ? projects
        : projects.filter(p => p.tags.includes(tag));
      renderProjects(filtered);
    });
    bar.appendChild(btn);
  });
}

/* =========================================================
   B2 — Modal / lightbox (event handling #2)
   ========================================================= */
function openModal(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');

  content.innerHTML = `
    <div class="modal-thumb"><img src="${project.image}" alt="${project.title} thumbnail"></div>
    <div class="modal-content">
      <h3>${project.title}</h3>
      <p>${project.detail}</p>
      <div class="project-tags">${project.tags.map(t => `<span>${t}</span>`).join('')}</div>
      <div class="project-links" style="margin-top:16px;">
        <a href="${project.link}" target="_blank" rel="noopener noreferrer">${project.linkLabel} ${linkIcon()}</a>
      </div>
    </div>
  `;

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.getElementById('modalClose').focus();
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
}

/* =========================================================
   B2 — Mobile nav toggle (event handling #3) + active link highlight
   ========================================================= */
function initNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    links.classList.toggle('mobile-open');
  });

  // Close mobile menu after choosing a link
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('mobile-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Highlight the nav link for the section currently in view
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = links.querySelectorAll('a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* =========================================================
   B4 — Theme toggle persisted with localStorage
   ========================================================= */
function initTheme() {
  const STORAGE_KEY = 'portfolio-theme';
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem(STORAGE_KEY);

  const apply = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  };

  // Respect saved preference, else system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  apply(saved || (prefersDark ? 'dark' : 'light'));

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    apply(next);
    localStorage.setItem(STORAGE_KEY, next);
  });
}

/* =========================================================
   B3 — Contact form validation with regex, no page reload
   ========================================================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: { el: document.getElementById('name'), group: document.getElementById('nameGroup'), regex: /^[A-Za-z][A-Za-z\s.'-]{1,49}$/ },
    email: { el: document.getElementById('email'), group: document.getElementById('emailGroup'), regex: /^[\w.+-]+@[\w-]+\.[A-Za-z]{2,}$/ },
    message: { el: document.getElementById('message'), group: document.getElementById('messageGroup'), regex: /^.{10,600}$/s }
  };

  const status = document.getElementById('formStatus');

  const validateField = (key) => {
    const { el, group, regex } = fields[key];
    const valid = regex.test(el.value.trim());
    group.classList.toggle('invalid', !valid);
    return valid;
  };

  // Validate as the user types (after first interaction) — arrow fns + destructuring
  Object.keys(fields).forEach((key) => {
    const { el } = fields[key];
    el.addEventListener('input', () => {
      if (el.dataset.touched === 'true') validateField(key);
    });
    el.addEventListener('blur', () => {
      el.dataset.touched = 'true';
      validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // no page reload

    const results = Object.keys(fields).map((key) => {
      fields[key].el.dataset.touched = 'true';
      return validateField(key);
    });
    const allValid = results.every(Boolean);

    status.classList.remove('show', 'success', 'error');

    if (!allValid) {
      status.textContent = 'Please fix the highlighted fields before sending.';
      status.classList.add('show', 'error');
      return;
    }

    // Persist last submitted message locally (demo of localStorage use, B4)
    const payload = {
      name: fields.name.el.value.trim(),
      email: fields.email.el.value.trim(),
      message: fields.message.el.value.trim(),
      sentAt: new Date().toISOString()
    };
    localStorage.setItem('portfolio-last-contact', JSON.stringify(payload));

    status.textContent = `Thanks, ${payload.name.split(' ')[0]} — your message is saved locally for this demo. Please reach out directly via email for a real reply.`;
    status.classList.add('show', 'success');
    form.reset();
    Object.values(fields).forEach(f => { f.el.dataset.touched = 'false'; f.group.classList.remove('invalid'); });
  });
}

/* =========================================================
   Scroll-to-top button + scroll reveal (IntersectionObserver)
   ========================================================= */
function initScrollEnhancements() {
  const topBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    topBtn.classList.toggle('show', window.scrollY > 500);
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Only opt into the hidden-until-scrolled state once JS is confirmed running,
  // so the page never depends on JS to become visible (progressive enhancement).
  document.documentElement.classList.add('js-ready');

  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));
}

/* =========================================================
   Footer year + init
   ========================================================= */
function initFooter() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  renderProjects(projects);
  buildFilterBar();
  initNav();
  initTheme();
  initContactForm();
  initScrollEnhancements();
  initFooter();

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
