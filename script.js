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
    this.setupResponsiveImages();
    
    // Setup work filters with a small delay to ensure DOM is ready
    setTimeout(() => {
      this.setupWorkFilters();
    }, 100);
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
    const isMobile = window.innerWidth <= 768;
    const isNucleus = window.location.pathname.includes('nucleus.html');
    
    if (filterPills.length === 0 || workCards.length === 0) {
      if (isMobile && isNucleus) {
        console.error('❌ Work filters setup failed:', { 
          filterPills: filterPills.length, 
          workCards: workCards.length,
          windowWidth: window.innerWidth,
          pathname: window.location.pathname
        });
      }
      return;
    }
    
    if (isMobile && isNucleus) {
      console.log('📱 Setting up work filters on mobile nucleus page:', { 
        filterPills: filterPills.length, 
        workCards: workCards.length,
        windowWidth: window.innerWidth
      });
      
      // Check if any cards are initially hidden
      const hiddenCards = document.querySelectorAll('.work-card.hidden');
      if (hiddenCards.length > 0) {
        console.warn('⚠️ Found hidden cards during setup:', hiddenCards.length);
      }
    }
    
    // Force all work cards to be visible and remove any hidden classes
    workCards.forEach((card, index) => {
      card.classList.remove('hidden');
      card.style.display = 'flex';
      card.style.visibility = 'visible';
      card.style.opacity = '1';
      
      // Mobile-specific fixes using CSS classes instead of inline styles
      if (isMobile) {
        card.classList.add('mobile-visible');
        card.classList.remove('mobile-hidden');
        
        // Debug individual card visibility
        const computedStyle = window.getComputedStyle(card);
        if (computedStyle.display === 'none') {
          console.warn(`⚠️ Card ${index} still hidden after setup:`, {
            classList: Array.from(card.classList),
            computedDisplay: computedStyle.display,
            inlineDisplay: card.style.display
          });
        }
      }
    });
    
    // Final verification on mobile
    if (isMobile && isNucleus) {
      setTimeout(() => {
        const visibleCards = document.querySelectorAll('.work-card:not(.hidden)');
        const actuallyVisible = Array.from(visibleCards).filter(card => {
          const style = window.getComputedStyle(card);
          return style.display !== 'none' && style.visibility !== 'hidden';
        });
        
        console.log('✅ Final mobile setup result:', {
          totalCards: workCards.length,
          visibleCards: visibleCards.length,
          actuallyVisible: actuallyVisible.length
        });
        
        if (actuallyVisible.length === 0) {
          console.error('🚨 NO CARDS VISIBLE ON MOBILE - This is the problem!');
        }
      }, 100);
    }
    
    // Force "All Work" filter to be active
    filterPills.forEach(pill => pill.classList.remove('active'));
    const allFilter = document.querySelector('.filter-pill[data-filter="all"]');
    if (allFilter) {
      allFilter.classList.add('active');
    }
    
    // Add event listeners
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
  // MOBILE MENU FUNCTIONALITY
  // ==========================================================================
  setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!mobileToggle || !mobileOverlay) return;
    
    // Toggle menu on button click with improved responsiveness
    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleMobileMenu();
    });
    
    // Remove touchend to prevent double triggering on mobile
    
    // Close menu when clicking overlay
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) {
        this.closeMobileMenu();
      }
    });
    
    // Close menu when clicking nav links and reinitialize filters
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
        
        // If navigating to nucleus page, ensure work filters initialize properly
        if (link.href && link.href.includes('nucleus.html')) {
          setTimeout(() => {
            this.setupWorkFilters();
          }, 100);
          setTimeout(() => {
            this.setupWorkFilters();
          }, 500);
        }
      });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileOverlay.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileOverlay.classList.contains('active')) {
        this.closeMobileMenu();
      }
      
      // Re-initialize work filters on resize to fix visibility issues
      setTimeout(() => {
        this.setupWorkFilters();
      }, 50);
    });
  }
  
  toggleMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    
    const isActive = mobileOverlay.classList.contains('active');
    
    if (isActive) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    
    mobileToggle.classList.add('active');
    mobileOverlay.classList.add('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
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
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to toggle button for accessibility
    if (mobileToggle) mobileToggle.focus();
    
    // Re-initialize work filters after menu closes to ensure content visibility
    setTimeout(() => {
      this.setupWorkFilters();
    }, 300);
  }
  
  // ==========================================================================
  // RESPONSIVE IMAGE OPTIMIZATION
  // ==========================================================================
  setupResponsiveImages() {
    // Simplified image handling - just ensure visibility
    const images = document.querySelectorAll('.work-card-image img, .hero-image');
    
    images.forEach(img => {
      // Ensure images are visible
      img.style.opacity = '1';
      img.style.display = 'block';
      
      // Handle loading errors gracefully
      img.addEventListener('error', () => {
        const container = img.closest('.work-card-image, .hero-media');
        if (container) {
          container.style.background = 'linear-gradient(135deg, rgba(138, 227, 255, 0.1), rgba(155, 140, 255, 0.1))';
        }
      });
    });
    
    // Add responsive image sizing based on device pixel ratio
    if (window.devicePixelRatio > 1) {
      document.body.classList.add('high-dpi');
    }
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
  const website = new WebsiteInteractions();
  
  // Single robust initialization with proper fallbacks
  function initializeWorkFilters() {
    website.setupWorkFilters();
    
    // If on nucleus page and mobile, ensure work cards are visible
    if (window.location.pathname.includes('nucleus.html') && window.innerWidth <= 768) {
      const workCards = document.querySelectorAll('.work-card');
      if (workCards.length === 0) {
        // DOM not ready yet, try again
        setTimeout(initializeWorkFilters, 100);
        return;
      }
      console.log('Mobile nucleus page initialized with', workCards.length, 'work cards');
    }
  }
  
  // Initialize immediately and with one fallback
  initializeWorkFilters();
  setTimeout(initializeWorkFilters, 500);
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause any heavy animations when tab is not visible
    document.body.classList.add('page-hidden');
  } else {
    document.body.classList.remove('page-hidden');
    
    // Only re-initialize if on nucleus page and mobile
    if (window.location.pathname.includes('nucleus.html') && window.innerWidth <= 768) {
      const website = new WebsiteInteractions();
      setTimeout(() => {
        website.setupWorkFilters();
      }, 100);
    }
  }
});