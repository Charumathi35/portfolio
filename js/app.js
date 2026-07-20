document.addEventListener('DOMContentLoaded', () => {
  // Theme Switching Logic
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');

  // Get active theme from localStorage or system prefers
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  // Initial theme application
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  // Toggle button click handlers
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });

  // KellyDev-style Intro and Loading Screen Flow
  const introOverlay = document.getElementById('intro-overlay');
  const loadingProgress = document.querySelector('.loading-progress');
  const loadingPercentage = document.querySelector('.loading-percentage');
  const introLoading = document.querySelector('.intro-loading');
  const introWelcome = document.querySelector('.intro-welcome');
  const exploreBtn = document.querySelector('.intro-explore-btn');

  if (introOverlay) {
    // If the page is loaded/refreshed and already scrolled down, bypass loading overlay to avoid scroll lock
    if (window.scrollY > 50) {
      introOverlay.style.display = 'none';
      document.body.classList.remove('intro-active');
      const heroText = document.querySelector('.hero-text');
      const heroVisual = document.querySelector('.hero-visual');
      if (heroText) heroText.classList.add('active');
      if (heroVisual) heroVisual.classList.add('active');
    } else {
      let progress = 0;
      const intervalTime = 15; // ms
      const increment = 1.5;

      const loadingInterval = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
          progress = 100;
          clearInterval(loadingInterval);

          // Transition to quote stage
          setTimeout(() => {
            if (introLoading) introLoading.style.opacity = '0';
            setTimeout(() => {
              if (introLoading) introLoading.style.display = 'none';
              if (introWelcome) {
                introWelcome.style.display = 'flex';
                // Force reflow
                introWelcome.offsetHeight;
                introWelcome.classList.add('visible');
              }
            }, 500);
          }, 400);
        }

        // Update UI
        if (loadingProgress) loadingProgress.style.width = `${progress}%`;
        if (loadingPercentage) loadingPercentage.textContent = `${Math.floor(progress)}%`;
      }, intervalTime);

      // Explore Button click handlers to enter the portfolio
      if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
          introOverlay.classList.add('fade-out');
          document.body.classList.remove('intro-active');

          // Trigger page fade-in and element reveals
          const heroText = document.querySelector('.hero-text');
          const heroVisual = document.querySelector('.hero-visual');
          if (heroText) heroText.classList.add('active');
          if (heroVisual) heroVisual.classList.add('active');
        });
      }
    }
  }

  // Sticky Navbar background & scroll state
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = menuToggle.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // Smooth scroll for hash links
  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  smoothLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Active link state observer on scroll
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = 'hero';
    const headerOffset = 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerOffset;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // =========================================================================
  // EMAILJS — Contact Form Integration
  // =========================================================================
  // STEP 1: Sign up at https://www.emailjs.com (free tier: 200 emails/month)
  // STEP 2: Create an Email Service (Gmail, Outlook, etc.) → copy the Service ID
  // STEP 3: Create an Email Template — use these variables in the template body:
  //           {{from_name}}  — sender's name
  //           {{reply_to}}   — sender's email  (also set as Reply-To in template)
  //           {{message}}    — the message body
  // STEP 4: Copy your Public Key from Account → API Keys
  // STEP 5: Replace the three placeholder strings below with your real values.
  // =========================================================================

  // Retrieve keys from CONFIG object or fallback
  const EMAILJS_PUBLIC_KEY  = typeof CONFIG !== 'undefined' ? CONFIG.EMAILJS_PUBLIC_KEY  : 'YOUR_PUBLIC_KEY';
  const EMAILJS_SERVICE_ID  = typeof CONFIG !== 'undefined' ? CONFIG.EMAILJS_SERVICE_ID  : 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = typeof CONFIG !== 'undefined' ? CONFIG.EMAILJS_TEMPLATE_ID : 'YOUR_TEMPLATE_ID';

  // Initialise EmailJS with your public key
  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  } else {
    console.warn('EmailJS SDK failed to load or keys are missing.');
  }

  // ── DOM references ──────────────────────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');
  const btnLabel = submitBtn ? submitBtn.querySelector('.btn-label') : null;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  // ── Helper: show / hide a field-level error ─────────────────────────────
  function setFieldError(inputEl, errorEl, msg) {
    if (msg) {
      inputEl.classList.add('input-invalid');
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
    } else {
      inputEl.classList.remove('input-invalid');
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  // ── Helper: show the form-level status banner ────────────────────────────
  function showFormStatus(type, message) {
    formStatus.textContent = message;
    formStatus.className = `form-status visible status-${type}`;
  }

  function hideFormStatus() {
    formStatus.className = 'form-status';
    formStatus.textContent = '';
  }

  // ── Helper: email format check ───────────────────────────────────────────
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  // ── Validate all fields; returns true if all pass ───────────────────────
  function validateForm() {
    let valid = true;

    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const messageVal = messageInput.value.trim();

    // Name
    if (!nameVal) {
      setFieldError(nameInput, nameError, 'Please enter your name.');
      valid = false;
    } else if (nameVal.length < 2) {
      setFieldError(nameInput, nameError, 'Name must be at least 2 characters.');
      valid = false;
    } else {
      setFieldError(nameInput, nameError, '');
    }

    // Email
    if (!emailVal) {
      setFieldError(emailInput, emailError, 'Please enter your email address.');
      valid = false;
    } else if (!isValidEmail(emailVal)) {
      setFieldError(emailInput, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      setFieldError(emailInput, emailError, '');
    }

    // Message
    if (!messageVal) {
      setFieldError(messageInput, messageError, 'Please write a message.');
      valid = false;
    } else if (messageVal.length < 10) {
      setFieldError(messageInput, messageError, 'Message must be at least 10 characters.');
      valid = false;
    } else {
      setFieldError(messageInput, messageError, '');
    }

    return valid;
  }

  // ── Clear field errors when the user starts typing again ────────────────
  if (nameInput) nameInput.addEventListener('input', () => setFieldError(nameInput, nameError, ''));
  if (emailInput) emailInput.addEventListener('input', () => setFieldError(emailInput, emailError, ''));
  if (messageInput) messageInput.addEventListener('input', () => setFieldError(messageInput, messageError, ''));

  // ── Main submit handler ──────────────────────────────────────────────────
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideFormStatus();

      // 1. Client-side validation
      if (!validateForm()) {
        showFormStatus('error', '⚠️ Please fix the errors above before sending.');
        return;
      }

      // 2. Guard: ensure EmailJS loaded
      if (typeof emailjs === 'undefined') {
        showFormStatus('error', '❌ Mail service unavailable. Please email me directly at charumathisaravanakumar@gmail.com');
        return;
      }

      // 3. Set sending state
      submitBtn.disabled = true;
      submitBtn.classList.add('sending');
      if (btnLabel) btnLabel.textContent = 'Sending…';

      try {
        // 4. Send via EmailJS — passes the entire form element so field `name` attrs
        //    map directly to template variables (from_name, reply_to, message).
        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm);

        // 5. Success
        showFormStatus('success', '✅ Message sent! I\'ll get back to you soon.');
        contactForm.reset();
        // Clear any lingering invalid states after reset
        [nameInput, emailInput, messageInput].forEach(el => el && el.classList.remove('input-invalid'));
        [nameError, emailError, messageError].forEach(el => el && el.classList.remove('visible'));

        // Auto-dismiss success banner after 6 seconds
        setTimeout(hideFormStatus, 6000);

      } catch (error) {
        // 6. Error — log for debugging, show friendly message to visitor
        console.error('EmailJS send error:', error);
        const errMsg = error && error.text
          ? `❌ Failed to send (${error.text}). Please try again or email me directly.`
          : '❌ Something went wrong. Please email me at charumathisaravanakumar@gmail.com';
        showFormStatus('error', errMsg);

      } finally {
        // 7. Always restore button state
        submitBtn.disabled = false;
        submitBtn.classList.remove('sending');
        if (btnLabel) btnLabel.textContent = 'Send Message';
      }
    });
  }

  // Scroll Reveal Animation Observer
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Project Scroll-Drag Interaction
  const slider = document.querySelector('.horizontal-scroll-container');
  if (slider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('active-drag');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active-drag');
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active-drag');
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed modifier
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  // --- Canvas Particle Animation ---
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        if (mouse.x != null && mouse.y != null) {
          let dx = this.x - mouse.x;
          let dy = this.y - mouse.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            let force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 2;
            this.y += (dy / dist) * force * 2;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const accentRgb = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '217, 119, 54';
        ctx.fillStyle = `rgba(${accentRgb}, 0.3)`;
        ctx.fill();
      }
    }

    function init() {
      particlesArray = [];
      const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
      for (let i = 0; i < count; i++) {
        particlesArray.push(new Particle());
      }
    }
    init();
    window.addEventListener('resize', init);

    function connect() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            let opacity = 1 - (dist / 120);
            const accentRgb = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '217, 119, 54';
            ctx.strokeStyle = `rgba(${accentRgb}, ${opacity * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connect();
      requestAnimationFrame(animate);
    }
    animate();
  }

  // --- Technical Expertise Slider logic ---
  const skillsContainer = document.querySelector('.skills-slides-container');
  const skillsSlides = document.querySelectorAll('.skills-slide');
  const skillsLeftArrow = document.querySelector('.skills-slider-arrow.arrow-left');
  const skillsRightArrow = document.querySelector('.skills-slider-arrow.arrow-right');
  const skillsDots = document.querySelectorAll('.skills-dot');

  if (skillsContainer && skillsSlides.length > 0) {
    let currentSlide = 0;
    const totalSlides = skillsSlides.length;
    let autoplayTimer = null;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentSlide = index;

      skillsContainer.style.transform = `translateX(-${currentSlide * 20}%)`;

      skillsDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });

      // Reset autoplay timer when manually navigated
      if (autoplayTimer) {
        startAutoplay();
      }
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 5000);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    if (skillsLeftArrow) {
      skillsLeftArrow.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
      });
    }

    if (skillsRightArrow) {
      skillsRightArrow.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
      });
    }

    skillsDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
      });
    });

    // Start Autoplay initial trigger
    startAutoplay();

    // Pause autoplay on mouse enter, resume on mouse leave
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      skillsSection.addEventListener('mouseenter', stopAutoplay);
      skillsSection.addEventListener('mouseleave', startAutoplay);
    }

    // Touch & Drag Gestures for Skills Container
    let dragStartX = 0;
    let dragIsDown = false;

    skillsContainer.addEventListener('mousedown', (e) => {
      dragIsDown = true;
      skillsContainer.classList.add('active-drag');
      dragStartX = e.clientX;
    });

    skillsContainer.addEventListener('mouseleave', () => {
      dragIsDown = false;
      skillsContainer.classList.remove('active-drag');
    });

    skillsContainer.addEventListener('mouseup', (e) => {
      if (!dragIsDown) return;
      dragIsDown = false;
      skillsContainer.classList.remove('active-drag');
      const diffX = e.clientX - dragStartX;
      if (diffX > 60) {
        goToSlide(currentSlide - 1);
      } else if (diffX < -60) {
        goToSlide(currentSlide + 1);
      }
    });

    skillsContainer.addEventListener('touchstart', (e) => {
      dragStartX = e.touches[0].clientX;
    }, { passive: true });

    skillsContainer.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].clientX - dragStartX;
      if (diffX > 50) {
        goToSlide(currentSlide - 1);
      } else if (diffX < -50) {
        goToSlide(currentSlide + 1);
      }
    }, { passive: true });
  }

  // --- Skill Details Popover Logic ---
  const skillDetails = {
    'laravel (php)': {
      level: 'Advanced Expertise',
      percent: 92,
      projects: 'Incident Reporting dashboard, Gate Entry System backend, and HR Cat Expense reporting application.'
    },
    'react.js': {
      level: 'Advanced Expertise',
      percent: 88,
      projects: 'PQR Vendor ticketing portal and interactive component integrations.'
    },
    'wordpress': {
      level: 'Intermediate',
      percent: 75,
      projects: 'Theme customization, content structuring, and widgets for Pricol Logistics Platform.'
    },
    'php': {
      level: 'Advanced Expertise',
      percent: 90,
      projects: 'Laravel backend codebases, enterprise gate entry integrations, and internal utility scripts.'
    },
    'javascript': {
      level: 'Advanced Expertise',
      percent: 88,
      projects: 'Highly interactive client interfaces, 3D perspective animations, custom cursors, and state validation.'
    },
    'java': {
      level: 'Intermediate',
      percent: 70,
      projects: 'Constructed responsive CRUD portals, secure login logic, and console management tooling.'
    },
    'sql': {
      level: 'Advanced Expertise',
      percent: 85,
      projects: 'Relational schema designs, transaction logic, and optimized joins for incident tracking and vendor reports.'
    },
    'html5': {
      level: 'Advanced Expertise',
      percent: 95,
      projects: 'Constructing robust semantic layout structure, accessibility, and high performance web apps.'
    },
    'css3': {
      level: 'Advanced Expertise',
      percent: 92,
      projects: 'Custom theme configuration, responsive grids, stacked timeline components, and custom canvas cursor overlays.'
    },
    'mysql': {
      level: 'Advanced Expertise',
      percent: 88,
      projects: 'Centralized Blood Bank database design, and Gate Entry local database management.'
    },
    'sql server (sqlsrv)': {
      level: 'Advanced Expertise',
      percent: 85,
      projects: 'Pricol Corporate internal databases, transaction procedures, and enterprise auditing logs.'
    },
    'git': {
      level: 'Advanced Expertise',
      percent: 85,
      projects: 'Branch management, merge resolution, and collaborative dev workflows.'
    },
    'github': {
      level: 'Advanced Expertise',
      percent: 85,
      projects: 'Repository hosting, code review tracking, pull requests, and project version management.'
    },
    'gitlab': {
      level: 'Advanced Expertise',
      percent: 85,
      projects: 'Branch management, code review tracking, merge resolution, and collaborative dev workflows at Pricol.'
    },
    'vs code': {
      level: 'Expert',
      percent: 95,
      projects: 'Daily workspace tool, customized extensions for PHP/JS, build processes, and integrated terminals.'
    },
    'postman': {
      level: 'Advanced Expertise',
      percent: 85,
      projects: 'Mocking requests, validating payload schemas, testing endpoints, and automated collections.'
    },
    'xampp': {
      level: 'Advanced Expertise',
      percent: 90,
      projects: 'Configuring Apache hosts, managing local servers, database hosting, and sandbox testing.'
    }
  };

  // Create Modal overlay element in DOM
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'skill-modal-overlay';
  document.body.appendChild(modalOverlay);

  // Create Modal card element directly under body for absolute positioning relative to page
  const modalCard = document.createElement('div');
  modalCard.className = 'skill-modal-card';
  modalCard.innerHTML = `
    <button class="skill-modal-close" aria-label="Close details">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
    <h3 class="skill-modal-title">Skill Name</h3>
    <div class="skill-modal-level">Proficiency Level</div>
    <div class="skill-progress-container">
      <div class="skill-progress-label">
        <span>Proficiency</span>
        <span class="skill-percent-val">0%</span>
      </div>
      <div class="skill-progress-bg">
        <div class="skill-progress-bar"></div>
      </div>
    </div>
    <h4 class="skill-modal-projects-title">Key Implementations & Experience</h4>
    <p class="skill-modal-projects">Project details go here...</p>
  `;
  document.body.appendChild(modalCard);

  const modalTitle = modalCard.querySelector('.skill-modal-title');
  const modalLevel = modalCard.querySelector('.skill-modal-level');
  const modalPercentVal = modalCard.querySelector('.skill-percent-val');
  const modalProgressBar = modalCard.querySelector('.skill-progress-bar');
  const modalProjects = modalCard.querySelector('.skill-modal-projects');
  const modalClose = modalCard.querySelector('.skill-modal-close');

  function openSkillDetails(skillName, tagElement) {
    const key = skillName.toLowerCase().trim();
    const data = skillDetails[key] || {
      level: 'Competent',
      percent: 80,
      projects: `Experienced in implementing ${skillName} inside full stack applications.`
    };

    modalTitle.textContent = skillName;
    modalLevel.textContent = data.level;
    modalPercentVal.textContent = `${data.percent}%`;
    modalProjects.textContent = data.projects;
    modalProgressBar.style.width = '0%';

    // Position popover relative to clicked tag using page scroll offsets
    const rect = tagElement.getBoundingClientRect();
    const cardWidth = 320; // Fixed width of card
    const cardHeight = 240; // Approximate height of popup card

    let top = rect.top + window.pageYOffset - cardHeight - 12; // Display above the tag relative to document
    let left = rect.left + window.pageXOffset + (rect.width / 2) - (cardWidth / 2); // Center horizontally relative to document

    // Bounds checking relative to document view width
    if (rect.top < cardHeight + 20) {
      top = rect.bottom + window.pageYOffset + 12; // Fallback: Display below the tag if not enough space at top
    }
    if (left < 10) {
      left = 10;
    } else if (left + cardWidth > window.innerWidth - 10) {
      left = window.innerWidth - cardWidth - 10;
    }

    modalCard.style.top = `${top}px`;
    modalCard.style.left = `${left}px`;

    modalOverlay.classList.add('active');
    modalCard.classList.add('active');

    // Smooth animation trigger for the progress bar
    setTimeout(() => {
      modalProgressBar.style.width = `${data.percent}%`;
    }, 100);
  }

  function closeSkillDetails() {
    modalOverlay.classList.remove('active');
    modalCard.classList.remove('active');
  }

  modalClose.addEventListener('click', closeSkillDetails);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeSkillDetails();
  });

  // Bind click handlers to skill tags
  const skillTags = document.querySelectorAll('.skill-tag');
  skillTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.stopPropagation();
      openSkillDetails(tag.textContent.trim(), tag);
    });
  });

  // --- Interactive 3D Perspective Card Tilts ---
  const tiltElements = document.querySelectorAll('.project-scroll-card, .stacked-card, .skills-category-card, .visual-box');

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const width = rect.width;
      const height = rect.height;

      const percentX = (x / width) - 0.5;
      const percentY = (y / height) - 0.5;

      const maxRotateX = 12;
      const maxRotateY = -12;

      const rotateX = percentY * maxRotateX;
      const rotateY = percentX * maxRotateY;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // --- Scroll Parallax & Rotation for Hero Avatar Visual ---
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < 800) {
        const translateY = scrollY * 0.15;
        const rotate = scrollY * 0.04;
        heroVisual.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
      }
    });
  }

  // --- Scroll-Driven Character Companion ---
  const scrollChar = document.getElementById('scroll-character');
  const charBubbleText = document.getElementById('char-bubble-text');
  const charBubble = document.getElementById('char-bubble');

  if (scrollChar && charBubbleText) {
    const allStates = ['char-state-idle', 'char-state-wave', 'char-state-work', 'char-state-point', 'char-state-look', 'char-state-bye'];

    // Map each section id → { state, message }
    const sectionStates = [
      { id: 'hero', state: 'char-state-idle', msg: "Hi there! 👋" },
      { id: 'about', state: 'char-state-wave', msg: "Nice to meet you! 😊" },
      { id: 'experience', state: 'char-state-work', msg: "Hard at work! 💼" },
      { id: 'skills', state: 'char-state-point', msg: "Check these out! 🎯" },
      { id: 'projects', state: 'char-state-look', msg: "Ooh, cool projects! 🔍" },
      { id: 'contact', state: 'char-state-bye', msg: "Let's connect! ✉️" },
    ];

    let currentState = '';
    let hasShownCharacter = false;

    function setBubbleText(text) {
      charBubble.classList.remove('char-bubble-pop');
      // Force reflow to restart animation
      void charBubble.offsetWidth;
      charBubbleText.textContent = text;
      charBubble.classList.add('char-bubble-pop');
    }

    // Click on bubble to jump to contact section
    charBubble.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    // Click on CTA button to jump to contact section
    const ctaBtn = document.getElementById('cta-connect');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    function setCharState(state, msg) {
      if (state === currentState) return;
      currentState = state;

      // Remove all state classes
      allStates.forEach(s => scrollChar.classList.remove(s));
      scrollChar.classList.add(state);
      setBubbleText(msg);
    }

    function getActiveSection() {
      // Find which section is most visible in the viewport midpoint
      const mid = window.innerHeight * 0.5;
      let best = null;
      let bestDist = Infinity;

      sectionStates.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = (rect.top + rect.bottom) / 2;
        const dist = Math.abs(center - mid);
        if (rect.top < window.innerHeight && rect.bottom > 0 && dist < bestDist) {
          bestDist = dist;
          best = id;
        }
      });
      return best;
    }

    function onScroll() {
      const scrollY = window.scrollY;

      // Show character after scrolling 80px
      if (!hasShownCharacter && scrollY > 80) {
        hasShownCharacter = true;
        scrollChar.classList.add('char-visible');
      }

      const activeId = getActiveSection();
      if (!activeId) return;

      const found = sectionStates.find(s => s.id === activeId);
      if (found) setCharState(found.state, found.msg);
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Run once on load in case already scrolled
    onScroll();
  }
});
