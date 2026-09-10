/**
 * SOUMADEEP NAYAK — PORTFOLIO INTERACTIONS & CONTROLS
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------ 0. Interactive Background Particle Canvas Engine ------------------
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let particles = [];
    let animationFrameId;

    const mouse = {
      x: null,
      y: null,
      radius: 140
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particleCount = Math.min(Math.floor((width * height) / 22000), 55);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 0.8;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      draw(accentRgb) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb}, ${this.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${accentRgb}, 0.6)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      update() {
        // Floating motion
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse interaction: subtle gravity push
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = dx / distance;
            const directionY = dy / distance;
            this.x -= directionX * force * 1.5;
            this.y -= directionY * force * 1.5;
          }
        }
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function getAccentRgb() {
      const theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'cyan') return '6, 182, 212';
      if (theme === 'purple') return '168, 85, 247';
      if (theme === 'emerald') return '16, 185, 129';
      if (theme === 'amber') return '245, 158, 11';
      return '96, 165, 250'; // Default Electric Azure
    }

    function connectParticles(accentRgb) {
      const maxDistance = 115;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.18;
            ctx.strokeStyle = `rgba(${accentRgb}, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }

        // Mouse connection line
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - particles[a].x;
          const dy = mouse.y - particles[a].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const opacity = (1 - distance / mouse.radius) * 0.28;
            ctx.strokeStyle = `rgba(${accentRgb}, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      if (isReducedMotion || document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      const accentRgb = getAccentRgb();

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(accentRgb);
      }
      connectParticles(accentRgb);

      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    initParticles();
    animate();
  }

  // ------------------ 1. Scroll Progress Indicator ------------------
  const scrollProgressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress}%`;
    }
  });

  // ------------------ 2. Navbar Scroll State & Active Link Observer ------------------
  const navbarWrapper = document.querySelector('.header-wrapper');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbarWrapper?.classList.add('scrolled');
    } else {
      navbarWrapper?.classList.remove('scrolled');
    }
  });

  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // ------------------ 3. Dynamic Typewriter Effect ------------------
  const typewriterElement = document.getElementById('typewriter');
  const roles = [
    'Full-Stack Software Engineer',
    'Next.js 16 & TypeScript Developer',
    'Real-Time Systems Architect',
    'NLP & Machine Learning Engineer'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    if (!typewriterElement) return;

    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1600; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 300;
    }

    setTimeout(typeEffect, typingSpeed);
  }
  typeEffect();

  // ------------------ 4. Dynamic Theme Accent Switcher ------------------
  const themeDots = document.querySelectorAll('.theme-dot');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('soumadeep_theme') || 'default';
  setTheme(savedTheme);

  themeDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const color = dot.getAttribute('data-color');
      if (color) {
        setTheme(color);
        localStorage.setItem('soumadeep_theme', color);
      }
    });
  });

  function setTheme(themeName) {
    if (themeName === 'default' || themeName === 'blue') {
      htmlRoot.removeAttribute('data-theme');
    } else {
      htmlRoot.setAttribute('data-theme', themeName);
    }
    themeDots.forEach((d) => {
      d.classList.toggle('active', d.getAttribute('data-color') === themeName || (themeName === 'blue' && d.getAttribute('data-color') === 'default'));
    });
  }

  // ------------------ 5. Project Category Filtering ------------------
  const filterBtns = document.querySelectorAll('.filter-btn, .works-tab-btn');
  const projectCards = document.querySelectorAll('.project-card, .project-case-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ------------------ 6. Toast Notification Helper ------------------
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout;

  function showToast(message = 'Copied to clipboard!') {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // ------------------ 7. Copy to Clipboard Functionality ------------------
  function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (err) {
      showToast('Failed to copy');
    }
    document.body.removeChild(textarea);
  }

  // Email copy triggers
  const heroCopyBtn = document.getElementById('copy-email-hero-btn');
  if (heroCopyBtn) {
    heroCopyBtn.addEventListener('click', () => {
      copyTextToClipboard('soumadeepnayak@gmail.com', 'Email copied to clipboard!');
    });
  }

  const contactCopyBtn = document.getElementById('copy-email-contact-btn');
  if (contactCopyBtn) {
    contactCopyBtn.addEventListener('click', () => {
      copyTextToClipboard('soumadeepnayak@gmail.com', 'Email copied to clipboard!');
    });
  }

  // ------------------ 8. Resume Modal & Download Handler ------------------
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtns = document.querySelectorAll('.open-resume-trigger, #open-resume-btn, #download-resume-hero-btn');
  const closeResumeBtn = document.getElementById('close-resume-btn');
  const printResumeBtns = document.querySelectorAll('#print-resume-btn, #download-resume-pdf-btn');

  openResumeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModal) {
        resumeModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeResumeBtn && resumeModal) {
    closeResumeBtn.addEventListener('click', () => {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  printResumeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });

  // ------------------ 9. Project Detail Architecture Modal ------------------
  const projectDetails = {
    ercs: {
      title: 'ERCS Architecture & System Design',
      html: `
        <div class="modal-spec-header">
          <div class="spec-tag">Flagship Real-Time System</div>
          <h4>Emergency Response Coordination System</h4>
          <p>Distributed incident-handling platform built for sub-second emergency dispatching and volunteer coordination.</p>
        </div>
        <div class="modal-spec-box">
          <h5><i class="fa-solid fa-layer-group"></i> Architecture Layers:</h5>
          <ul>
            <li><strong>Frontend:</strong> Next.js App Router with Leaflet.js geospatial mapping and optimistic dispatch state.</li>
            <li><strong>Live Streaming:</strong> Bi-directional WebSockets broadcasting real-time responder coordinates and incident alerts.</li>
            <li><strong>Security & Auth:</strong> Dual-tier RBAC for Coordinators vs. Field Volunteers with TOTP verification and encrypted sessions.</li>
            <li><strong>Persistence:</strong> Firebase Firestore with live query subscriptions and geospatial indexing.</li>
          </ul>
        </div>
        <div class="modal-spec-actions">
          <a href="https://github.com/soumade1319n/ERCS/tree/main/emergency-response" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <i class="fa-brands fa-github"></i> View GitHub Repository ↗
          </a>
        </div>
      `
    },
    medimind: {
      title: 'MediMind Architecture & Clinical Data Flow',
      html: `
        <div class="modal-spec-header">
          <div class="spec-tag">Clinical Health Portal</div>
          <h4>MediMind — Healthcare & Prescription Management</h4>
          <p>Secure medical dashboard designed for dosage schedules, medication adherence tracking, and laboratory report archiving.</p>
        </div>
        <div class="modal-spec-box">
          <h5><i class="fa-solid fa-shield-halved"></i> Technical Architecture:</h5>
          <ul>
            <li><strong>Server Actions:</strong> Atomic server-side mutations for dosage schedules ensuring zero client-side credential exposure.</li>
            <li><strong>Session Security:</strong> Firebase Admin SDK token verification issuing HttpOnly, SameSite=Strict secure cookies.</li>
            <li><strong>Storage Pipeline:</strong> Asynchronous lab report indexing with structured metadata tagging and role-based access.</li>
          </ul>
        </div>
        <div class="modal-spec-actions">
          <a href="https://github.com/soumade1319n/MediMind" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <i class="fa-brands fa-github"></i> View GitHub Repository ↗
          </a>
        </div>
      `
    },
    medsense: {
      title: 'MedSense Architecture & NLP Inference Pipeline',
      html: `
        <div class="modal-spec-header">
          <div class="spec-tag">NLP Intelligence & Analytics</div>
          <h4>MedSense — Symptom-to-Condition Triage Platform</h4>
          <p>End-to-end ML & Full-Stack architecture featuring a fine-tuned DistilBERT transformer, FastAPI microservice, and MERN analytics dashboard.</p>
        </div>
        <div class="modal-spec-box">
          <h5><i class="fa-solid fa-microchip"></i> System Architecture:</h5>
          <ul>
            <li><strong>ML Inference Service:</strong> Fine-tuned DistilBERT (PyTorch & HuggingFace) served via high-throughput asynchronous FastAPI (/predict).</li>
            <li><strong>API Middleware:</strong> Node.js / Express proxy layer with MongoDB query logging, analytics aggregation, and rate limiting.</li>
            <li><strong>Client Application:</strong> React (Vite + Tailwind CSS + Recharts) featuring interactive triage assessment and real-time clinical analytics.</li>
          </ul>
        </div>
        <div class="modal-spec-actions">
          <a href="https://github.com/soumade1319n/MedSense-" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <i class="fa-brands fa-github"></i> View GitHub Repository ↗
          </a>
        </div>
      `
    }
  };

  const detailModal = document.getElementById('project-detail-modal');
  const detailTitle = document.getElementById('detail-modal-title');
  const detailBody = document.getElementById('detail-modal-body');
  const closeDetailBtn = document.getElementById('close-detail-btn');
  const previewBtns = document.querySelectorAll('.preview-btn');

  previewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      if (projKey && projectDetails[projKey] && detailModal && detailTitle && detailBody) {
        detailTitle.textContent = projectDetails[projKey].title;
        detailBody.innerHTML = projectDetails[projKey].html;
        detailModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeDetailBtn && detailModal) {
    closeDetailBtn.addEventListener('click', () => {
      detailModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === detailModal) {
      detailModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ------------------ 10. Direct Contact Form & Gmail Web Dispatch ------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const sendBtn = document.getElementById('send-btn');
  const directGmailBtn = document.getElementById('direct-gmail-btn');

  function openGmailWithDetails(name, email, subject, message) {
    const subjectEncoded = encodeURIComponent(`[Portfolio Contact] ${subject || 'Project / Role Inquiry'} from ${name || 'Visitor'}`);
    const bodyEncoded = encodeURIComponent(`Hello Soumadeep,\n\n${message || ''}\n\n---\nSender Name: ${name || 'N/A'}\nSender Email: ${email || 'N/A'}`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=soumadeepnayak@gmail.com&su=${subjectEncoded}&body=${bodyEncoded}`;
    window.open(gmailUrl, '_blank');
  }

  // Direct Gmail Web Button
  if (directGmailBtn) {
    directGmailBtn.addEventListener('click', () => {
      const name = document.getElementById('name')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const subject = document.getElementById('subject')?.value.trim() || '';
      const message = document.getElementById('message')?.value.trim() || '';

      openGmailWithDetails(name, email, subject, message);
      if (formStatus) {
        formStatus.innerHTML = '<span style="color: var(--status-green);"><i class="fa-solid fa-circle-check"></i> Opened Gmail with your pre-filled message!</span>';
      }
    });
  }

  // Form Submit Handler
  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        formStatus.innerHTML = '<span style="color: #ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Please fill in all required fields.</span>';
        return;
      }

      const isLocalFile = window.location.protocol === 'file:';

      // If browsing directly as a local HTML file, bypass FormSubmit restriction by opening Gmail directly
      if (isLocalFile) {
        openGmailWithDetails(name, email, subject, message);
        formStatus.innerHTML = '<span style="color: var(--status-green);"><i class="fa-solid fa-circle-check"></i> Local file mode: Opened pre-filled message in Gmail!</span>';
        contactForm.reset();
        showToast('Opened in Gmail for direct send!');
        return;
      }

      // If running on a live web server (HTTP / HTTPS / GitHub Pages / Vercel)
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Message...</span>';
      }
      formStatus.innerHTML = '<span style="color: var(--accent-light);"><i class="fa-solid fa-paper-plane"></i> Transmitting your message...</span>';

      try {
        const response = await fetch('https://formsubmit.co/ajax/soumadeepnayak@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: `[Portfolio Inquiry] ${subject || 'New Contact Message'} from ${name}`,
            message: message,
            _template: 'table',
            _captcha: 'false'
          })
        });

        const data = await response.json();

        if (response.ok || data.success === 'true' || data.success === true) {
          formStatus.innerHTML = '<span style="color: var(--status-green);"><i class="fa-solid fa-circle-check"></i> Message sent successfully to soumadeepnayak@gmail.com!</span>';
          contactForm.reset();
          showToast('Message sent to soumadeepnayak@gmail.com!');
        } else {
          openGmailWithDetails(name, email, subject, message);
          formStatus.innerHTML = '<span style="color: var(--status-green);"><i class="fa-solid fa-circle-check"></i> Opened pre-filled message in Gmail!</span>';
        }
      } catch (err) {
        openGmailWithDetails(name, email, subject, message);
        formStatus.innerHTML = '<span style="color: var(--status-green);"><i class="fa-solid fa-circle-check"></i> Opened pre-filled message in Gmail!</span>';
      } finally {
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
        }
      }
    });
  }
});
