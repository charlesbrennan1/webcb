// ==========================================================================
// MAIN SCRIPT - INTERACTIONS & ANIMATIONS
// Kinetic underlines, scroll reveals, filter system, and utilities
// ==========================================================================

class WebsiteInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollReveal();
    this.setupKineticUnderlines();
    this.setupCopyButtons();
    this.setupAccessibility();
    this.setupMobileMenu();
    this.setupImageFallbacks();
    this.setupWorkFilters();
  }

  // ==========================================================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================================================
  setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -100px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ==========================================================================
  // KINETIC UNDERLINES FOR NAVIGATION
  // ==========================================================================
  setupKineticUnderlines() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('mouseenter', (e) => this.animateUnderline(e.target, true));
      link.addEventListener('mouseleave', (e) => this.animateUnderline(e.target, false));

      if (this.isCurrentPage(link.href)) {
        link.classList.add('active');
        this.animateUnderline(link, true);
      }
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      if (this.isCurrentPage(link.href)) {
        link.classList.add('active');
      }
    });
  }

  animateUnderline(element, show) {
    if (show) {
      element.style.setProperty('--underline-width', '100%');
    } else if (!element.classList.contains('active')) {
      element.style.setProperty('--underline-width', '0%');
    }
  }

  isCurrentPage(href) {
    const currentPath = window.location.pathname;
    const linkPath = new URL(href, window.location.origin).pathname;

    if (currentPath === '/' || currentPath === '/index.html') {
      return linkPath === '/' || linkPath === '/index.html';
    }
    return currentPath === linkPath;
  }

  // ==========================================================================
  // WORK FILTER SYSTEM (for nucleus.html)
  // ==========================================================================
  setupWorkFilters() {
    const filterPills = document.querySelectorAll('.filter-pill');
    const workCards = document.querySelectorAll('.work-card');
    if (filterPills.length === 0 || workCards.length === 0) return;

    filterPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        this.filterWork(pill.getAttribute('data-filter'), filterPills, workCards);
      });
    });
  }

  filterWork(filter, pills, cards) {
    pills.forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-filter') === filter);
    });

    cards.forEach(card => {
      const categories = (card.getAttribute('data-category') || 'all').split(' ');
      card.classList.toggle('hidden', filter !== 'all' && !categories.includes(filter));
    });
  }

  // ==========================================================================
  // COPY TO CLIPBOARD FUNCTIONALITY
  // ==========================================================================
  setupCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.copyToClipboard(e.target));
    });
  }

  async copyToClipboard(button) {
    const email = 'charlesamerigobrennan@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      this.showCopyFeedback(button, 'Copied!');
    } catch (err) {
      this.showCopyFeedback(button, 'Failed');
    }
  }

  showCopyFeedback(button, message) {
    const originalText = button.textContent;
    button.textContent = message;
    button.classList.add('copied');

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  }

  // ==========================================================================
  // MOBILE MENU FUNCTIONALITY
  // ==========================================================================
  setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');

    if (!mobileToggle || !mobileOverlay) return;

    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleMobileMenu();
    });

    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) this.closeMobileMenu();
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileOverlay.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileOverlay.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    if (mobileOverlay.classList.contains('active')) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    document.querySelector('.mobile-menu-toggle').classList.add('active');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    const firstLink = mobileOverlay.querySelector('.mobile-nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 300);
    }
  }

  closeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');

    if (mobileToggle) mobileToggle.classList.remove('active');
    if (mobileOverlay) {
      mobileOverlay.classList.remove('active');
      // Force hide overlay to prevent black box issues
      mobileOverlay.style.display = 'none';
      setTimeout(() => {
        mobileOverlay.style.display = '';
      }, 300);
    }

    document.body.style.overflow = '';
    if (mobileToggle) mobileToggle.focus();
  }

  // ==========================================================================
  // IMAGE ERROR FALLBACKS
  // ==========================================================================
  setupImageFallbacks() {
    document.querySelectorAll('.work-card-image img, .hero-image').forEach(img => {
      img.addEventListener('error', () => {
        const container = img.closest('.work-card-image, .hero-media');
        if (container) {
          container.style.background = 'linear-gradient(135deg, rgba(138, 227, 255, 0.1), rgba(155, 140, 255, 0.1))';
        }
      });
    });
  }

  // ==========================================================================
  // ACCESSIBILITY IMPROVEMENTS
  // ==========================================================================
  setupAccessibility() {
    // Keyboard navigation for filter pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.setAttribute('role', 'button');
      pill.setAttribute('tabindex', '0');

      pill.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pill.click();
        }
      });
    });

    // Decorative canvas backgrounds should be ignored by screen readers
    document.querySelectorAll('canvas').forEach(canvas => {
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', 'Decorative background animation');
    });

    // Skip link for keyboard users (styled in styles.css)
    const mainContent = document.querySelector('main, section');
    if (mainContent) {
      if (!mainContent.id) mainContent.id = 'main-content';
      const skipLink = document.createElement('a');
      skipLink.href = `#${mainContent.id}`;
      skipLink.textContent = 'Skip to main content';
      skipLink.className = 'skip-link';
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
  }
}

// ==========================================================================
// GLOBAL UTILITY FUNCTIONS
// ==========================================================================

// Copy email function (global for onclick handlers)
function copyEmail() {
  const email = 'charlesamerigobrennan@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      copyBtn.style.color = 'var(--accent-3)';

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.color = '';
      }, 2000);
    }
  });
}

// Smooth scroll utility
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  new WebsiteInteractions();
});
