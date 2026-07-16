document.addEventListener('DOMContentLoaded', () => {
  // Page preloader dismissal
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 1100);
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

  // Active link state on page (checks filename)
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-links a');
  
  navItems.forEach(item => {
    item.classList.remove('active');
    const href = item.getAttribute('href');
    if (href === currentPath) {
      item.classList.add('active');
    }
  });

  // Simple form submission animation helper
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';

      setTimeout(() => {
        submitBtn.innerHTML = 'Message Sent Successfully!';
        submitBtn.style.background = 'var(--success)';
        submitBtn.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.3)';
        
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = 'var(--accent-gradient)';
          submitBtn.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.3)';
        }, 3000);
      }, 1500);
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
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed modifier
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  // Multi-page Scroll Navigation
  const pages = ['index.html', 'about.html', 'experience.html', 'skills.html', 'projects.html', 'contact.html'];
  const currentIndex = pages.indexOf(currentPath);
  const transitionKey = 'portfolio_page_transitioning';
  
  // Clear transition lock on page load
  localStorage.setItem(transitionKey, 'false');

  function triggerPageTransition(targetPage) {
    localStorage.setItem(transitionKey, 'true');
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(-10px)';
    document.body.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    
    setTimeout(() => {
      window.location.href = targetPage;
    }, 400);
  }

  // Desktop Scroll Wheel Listener
  window.addEventListener('wheel', (e) => {
    if (localStorage.getItem(transitionKey) === 'true') return;

    const deltaY = e.deltaY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Scroll Down & At Bottom -> Next Page
    if (deltaY > 25 && (scrollTop + clientHeight >= scrollHeight - 3)) {
      if (currentIndex < pages.length - 1) {
        triggerPageTransition(pages[currentIndex + 1]);
      }
    }
    // Scroll Up & At Top -> Prev Page
    else if (deltaY < -25 && scrollTop <= 3) {
      if (currentIndex > 0) {
        triggerPageTransition(pages[currentIndex - 1]);
      }
    }
  });

  // Mobile Swipe Gesture Listeners
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (localStorage.getItem(transitionKey) === 'true') return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY; // Positive: Swiped up (Scrolled down)

    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (deltaY > 60 && (scrollTop + clientHeight >= scrollHeight - 10)) {
      if (currentIndex < pages.length - 1) {
        triggerPageTransition(pages[currentIndex + 1]);
      }
    } else if (deltaY < -60 && scrollTop <= 10) {
      if (currentIndex > 0) {
        triggerPageTransition(pages[currentIndex - 1]);
      }
    }
  }, { passive: true });

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
        ctx.fillStyle = 'rgba(139, 92, 246, 0.4)';
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
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.15})`;
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
});
