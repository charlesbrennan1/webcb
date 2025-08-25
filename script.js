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
    this.setupWorkFilters();
    this.setupCopyButtons();
    this.setupAccessibility();
  }
  
  // ==========================================================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================================================
  setupScrollReveal() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe all elements with reveal class
    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  }
  
  // ==========================================================================
  // KINETIC UNDERLINES FOR NAVIGATION
  // ==========================================================================
  setupKineticUnderlines() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', (e) => {
        this.animateUnderline(e.target, true);
      });
      
      link.addEventListener('mouseleave', (e) => {
        this.animateUnderline(e.target, false);
      });
      
      // Set active state for current page
      if (this.isCurrentPage(link.href)) {
        link.classList.add('active');
        this.animateUnderline(link, true);
      }
    });
  }
  
  animateUnderline(element, show) {
    const underline = element.querySelector('::after') || element;
    
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
    
    if (filterPills.length === 0) return;
    
    filterPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const filter = e.target.dataset.filter;
        this.filterWork(filter, filterPills, workCards);
      });
    });
  }
  
  filterWork(filter, pills, cards) {
    // Update active pill
    pills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.filter === filter);
    });
    
    // Filter cards instantly
    cards.forEach(card => {
      const categories = card.dataset.category ? card.dataset.category.split(' ') : ['all'];
      const shouldShow = filter === 'all' || categories.includes(filter);
      
      // Instant show/hide without delays
      if (shouldShow) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }
  
  // ==========================================================================
  // COPY TO CLIPBOARD FUNCTIONALITY
  // ==========================================================================
  setupCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    
    copyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.copyToClipboard(e.target);
      });
    });
  }
  
  async copyToClipboard(button) {
    const email = 'charlesamerigobrennan@gmail.com';
    
    try {
      await navigator.clipboard.writeText(email);
      this.showCopyFeedback(button, 'Copied!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        this.showCopyFeedback(button, 'Copied!');
      } catch (fallbackErr) {
        this.showCopyFeedback(button, 'Failed');
      }
      
      document.body.removeChild(textArea);
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
  // ACCESSIBILITY IMPROVEMENTS
  // ==========================================================================
  setupAccessibility() {
    // Add keyboard navigation for filter pills
    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
      pill.setAttribute('role', 'button');
      pill.setAttribute('tabindex', '0');
      
      pill.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pill.click();
        }
      });
    });
    
    // Add focus styles for better keyboard navigation
    this.addFocusStyles();
    
    // Improve screen reader experience
    this.improveScreenReaderExperience();
  }
  
  addFocusStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .nav-link:focus-visible,
      .btn:focus-visible,
      .filter-pill:focus-visible {
        outline: 2px solid var(--accent-1);
        outline-offset: 2px;
        border-radius: var(--border-radius);
      }
      
      .work-card:focus-within {
        transform: translateY(-4px);
        box-shadow: var(--shadow-strong);
        border-color: var(--accent-1);
      }
    `;
    document.head.appendChild(style);
  }
  
  improveScreenReaderExperience() {
    // Add aria-labels to canvas elements
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', 'Decorative background animation');
    });
    
    // Add skip links for better navigation
    this.addSkipLinks();
  }
  
  addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    
    const skipStyle = document.createElement('style');
    skipStyle.textContent = `
      .skip-link {
        position: absolute;
        top: -40px;
        left: 8px;
        background: var(--accent-1);
        color: var(--bg-0);
        padding: 8px 16px;
        text-decoration: none;
        border-radius: var(--border-radius);
        font-weight: 600;
        z-index: 2000;
        transition: top var(--duration-normal) var(--easing);
      }
      
      .skip-link:focus {
        top: 8px;
      }
    `;
    
    document.head.appendChild(skipStyle);
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
}

// ==========================================================================
// GLOBAL UTILITY FUNCTIONS
// ==========================================================================

// Copy email function (global for onclick handlers)
function copyEmail() {
  const email = 'charlesamerigobrennan@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    // Find the copy button and show feedback
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
  }).catch(() => {
    console.log('Copy failed');
  });
}

// Smooth scroll utility
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// ==========================================================================
// REDUCED MOTION SUPPORT
// ==========================================================================

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Add reduced motion class to body
  document.body.classList.add('reduce-motion');
  
  // Override animation durations
  const style = document.createElement('style');
  style.textContent = `
    .reduce-motion * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    
    .reduce-motion .reveal {
      opacity: 1 !important;
      transform: none !important;
    }
  `;
  document.head.appendChild(style);
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new WebsiteInteractions();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause any heavy animations when tab is not visible
    document.body.classList.add('page-hidden');
  } else {
    document.body.classList.remove('page-hidden');
  }
});