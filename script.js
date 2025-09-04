// ==========================================================================
// MAIN SCRIPT - INTERACTIONS & ANIMATIONS
// Kinetic underlines, scroll reveals, filter system, and utilities
// ==========================================================================

class WebsiteInteractions {
  constructor() {
    this.filtersInitialized = false; // Guard against duplicate initialization
    this.lastWidth = window.innerWidth; // Track window width for resize handling
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
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
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
    
    // Also set active state for mobile navigation links
    mobileNavLinks.forEach(link => {
      if (this.isCurrentPage(link.href)) {
        link.classList.add('active');
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
    // Prevent duplicate initialization
    if (this.filtersInitialized) {
      console.log('🔄 Filters already initialized, skipping duplicate setup');
      return;
    }

    // Better URL detection that works in production
    const isNucleus = window.location.pathname.includes('nucleus') || 
                     window.location.href.includes('nucleus') ||
                     document.title.includes('Nucleus Research');
    
    // Only run on nucleus pages
    if (!isNucleus) {
      return;
    }

    const filterPills = document.querySelectorAll('.filter-pill');
    const workCards = document.querySelectorAll('.work-card');
    const isMobile = window.innerWidth <= 768;
    
    // Production debugging - always log in production
    console.log('🔧 PRODUCTION DEBUG - Filter setup:', {
      filtersFound: filterPills.length,
      cardsFound: workCards.length,
      isMobile: isMobile,
      pathname: window.location.pathname,
      href: window.location.href,
      title: document.title,
      isNucleus: isNucleus
    });
    
    // Enhanced error handling
    if (filterPills.length === 0) {
      console.error('❌ FILTER SETUP FAILED: No filter pills found');
      console.log('Looking for elements with class .filter-pill');
      return;
    }
    
    if (workCards.length === 0) {
      console.error('❌ FILTER SETUP FAILED: No work cards found');
      console.log('Looking for elements with class .work-card');
      return;
    }
    
    // Remove any existing event listeners by cloning elements
    filterPills.forEach(pill => {
      if (pill.hasAttribute('data-listeners-added')) {
        return; // Skip if already has listeners
      }
      pill.setAttribute('data-listeners-added', 'true');
    });
    
    // Ensure all cards are visible initially
    workCards.forEach((card, index) => {
      card.classList.remove('hidden');
      card.style.display = '';
      card.style.visibility = '';
      card.style.opacity = '';
      
      console.log(`Card ${index} data-category:`, card.getAttribute('data-category'));
    });
    
    // Set "All Work" as active
    filterPills.forEach(pill => pill.classList.remove('active'));
    const allFilter = document.querySelector('.filter-pill[data-filter="all"]');
    if (allFilter) {
      allFilter.classList.add('active');
      console.log('✅ Set "All Work" as active filter');
    } else {
      console.error('❌ Could not find "All Work" filter button');
    }
    
    // Add click event listeners with robust error handling
    filterPills.forEach((pill, index) => {
      const filterValue = pill.getAttribute('data-filter');
      console.log(`Adding listener to filter ${index}: ${filterValue}`);
      
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = e.target.getAttribute('data-filter');
        console.log('🎯 Filter clicked:', filter);
        this.filterWork(filter, filterPills, workCards);
      });
    });
    
    // Mark as initialized
    this.filtersInitialized = true;
    console.log('✅ Work filters initialized successfully');
  }
  
  filterWork(filter, pills, cards) {
    console.log('🎯 Filtering work with filter:', filter);
    
    // Update active pill with better selection
    pills.forEach(pill => {
      const pillFilter = pill.getAttribute('data-filter');
      if (pillFilter === filter) {
        pill.classList.add('active');
        console.log('✅ Activated filter pill:', pillFilter);
      } else {
        pill.classList.remove('active');
      }
    });
    
    // Filter cards with enhanced logging
    let hiddenCount = 0;
    let shownCount = 0;
    
    cards.forEach((card, index) => {
      const categoryAttr = card.getAttribute('data-category');
      const categories = categoryAttr ? categoryAttr.split(' ') : ['all'];
      const shouldShow = filter === 'all' || categories.includes(filter);
      
      console.log(`Card ${index}: categories=[${categories.join(',')}], shouldShow=${shouldShow}`);
      
      if (shouldShow) {
        // Multiple ways to ensure card is visible
        card.classList.remove('hidden');
        card.style.display = '';
        card.style.visibility = '';
        card.style.opacity = '';
        shownCount++;
      } else {
        card.classList.add('hidden');
        hiddenCount++;
      }
    });
    
    console.log(`✅ Filter applied: ${shownCount} shown, ${hiddenCount} hidden`);
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
        
        // Navigation to nucleus page - filters will auto-initialize via guard
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
      
      // Reset filter initialization flag on significant resize
      if (Math.abs(window.innerWidth - this.lastWidth) > 100) {
        this.filtersInitialized = false;
        this.lastWidth = window.innerWidth;
        this.setupWorkFilters();
      }
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
    
    // No need to re-initialize - filters are guarded against duplicates
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
  // Constructor handles all initialization with proper guards
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause any heavy animations when tab is not visible
    document.body.classList.add('page-hidden');
  } else {
    document.body.classList.remove('page-hidden');
    
    // Page visibility handling - no need to re-initialize due to guards
  }
});