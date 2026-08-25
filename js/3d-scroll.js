/**
 * 3D Scroll Effects for luc weinbrecht portfolio
 * - Parallax depth effect
 * - Scroll-based 3D transformations
 * - Fade-in animations
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  
  const config = {
    // Parallax intensity (higher = more dramatic)
    parallaxIntensity: 0.1,
    
    // Scroll speed multiplier
    scrollSpeed: 1.0,
    
    // Animation thresholds
    animationThreshold: 0.2, // 20% of viewport
    
    // 3D rotation intensity
    rotationIntensity: 0.05,
    
    // Performance optimization
    throttleDelay: 16 // ~60fps
  };

  // ============================================
  // STATE
  // ============================================
  
  let scrollPosition = 0;
  let windowHeight = window.innerHeight;
  let isAnimating = false;
  let lastScrollTime = 0;
  let ticking = false;

  // ============================================
  // DOM ELEMENTS
  // ============================================
  
  const page = document.getElementById('page');
  const content3d = document.querySelector('.content-3d');
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  const scrollSections = document.querySelectorAll('.scroll-section');
  const animatedElements = document.querySelectorAll('.scroll-animated');
  const socialIcons = document.querySelectorAll('.social-icon-3d');
  const avatar3d = document.querySelector('.avatar-3d');

  // ============================================
  // INITIALIZATION
  // ============================================
  
  function init() {
    if (!page) return;
    
    // Set initial window height
    windowHeight = window.innerHeight;
    
    // Initialize parallax layers
    initParallax();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize social icons 3D effect
    initSocialIcons();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initial update
    updateParallax();
    updateScrollAnimations();
  }

  // ============================================
  // PARALLAX EFFECT
  // ============================================
  
  function initParallax() {
    if (!content3d) return;
    
    // Set content height to allow scrolling
    content3d.style.minHeight = `${windowHeight * 2}px`;
  }

  function updateParallax() {
    if (!parallaxLayers.length) return;
    
    const scrollY = window.scrollY || window.pageYOffset;
    
    parallaxLayers.forEach(layer => {
      const depth = parseFloat(layer.getAttribute('data-depth')) || 0;
      const speed = depth * config.parallaxIntensity;
      const yPos = -(scrollY * speed);
      
      layer.style.transform = `translateY(${yPos}px) translateZ(${depth}px) scale(${1 + Math.abs(depth) * 0.001})`;
    });
    
    // Apply 3D rotation to content based on scroll
    if (content3d) {
      const rotationX = scrollY * config.rotationIntensity;
      const rotationY = scrollY * config.rotationIntensity * 0.5;
      content3d.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    }
  }

  // ============================================
  // SCROLL ANIMATIONS
  // ============================================
  
  function initScrollAnimations() {
    if (!animatedElements.length) return;
    
    // Set initial state
    animatedElements.forEach(el => {
      el.classList.remove('visible');
    });
  }

  function updateScrollAnimations() {
    if (!animatedElements.length) return;
    
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const triggerBottom = scrollY + viewportHeight * (1 - config.animationThreshold);
    
    animatedElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top + scrollY;
      
      if (elementTop < triggerBottom) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    });
  }

  // ============================================
  // SOCIAL ICONS 3D EFFECT
  // ============================================
  
  function initSocialIcons() {
    if (!socialIcons.length) return;
    
    // Set up mouse move effects for social icons
    socialIcons.forEach((icon, index) => {
      icon.addEventListener('mousemove', (e) => {
        const rect = icon.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const rotateX = -y * 0.2;
        const rotateY = x * 0.2;
        
        icon.style.transform = `translateZ(${index * -5}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      
      icon.addEventListener('mouseleave', () => {
        icon.style.transform = `translateZ(${index * -5}px) rotateX(0) rotateY(0)`;
      });
    });
  }

  // ============================================
  // SCROLL-BASED 3D TRANSFORMATIONS
  // ============================================
  
  function updateScrollTransforms() {
    if (!scrollSections.length) return;
    
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    
    scrollSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      const sectionHeight = rect.height;
      
      // Calculate scroll progress through this section (0 to 1)
      let progress = (scrollY - sectionTop) / (sectionHeight + viewportHeight);
      progress = Math.max(0, Math.min(1, progress));
      
      // Apply 3D transformations based on scroll progress
      const rotateX = progress * 10 - 5; // -5 to +5 degrees
      const rotateY = progress * 5 - 2.5; // -2.5 to +2.5 degrees
      const scale = 1 + progress * 0.1;
      
      section.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    });
  }

  // ============================================
  // AVATAR 3D EFFECT
  // ============================================
  
  function updateAvatar3D() {
    if (!avatar3d) return;
    
    const scrollY = window.scrollY || window.pageYOffset;
    const rotation = scrollY * 0.05;
    const translateZ = 10 + Math.sin(scrollY * 0.001) * 5;
    
    avatar3d.style.transform = `translateZ(${translateZ}px) rotateY(${rotation}deg)`;
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  
  function setupEventListeners() {
    // Throttled scroll handler
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax();
          updateScrollAnimations();
          updateScrollTransforms();
          updateAvatar3D();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    
    // Resize handler
    window.addEventListener('resize', () => {
      windowHeight = window.innerHeight;
      if (content3d) {
        content3d.style.minHeight = `${windowHeight * 2}px`;
      }
    }, { passive: true });
    
    // Mouse move for subtle 3D effect on the whole page
    document.addEventListener('mousemove', (e) => {
      if (!page) return;
      
      const x = e.clientX / window.innerWidth * 2 - 1;
      const y = e.clientY / window.innerHeight * 2 - 1;
      
      const rotateX = -y * 2;
      const rotateY = x * 2;
      
      page.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  }

  // ============================================
  // PERFORMANCE OPTIMIZATION
  // ============================================
  
  function throttle(func, delay) {
    let lastCall = 0;
    return function() {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, arguments);
      }
    };
  }

  // ============================================
  // INITIALIZE ON DOM READY
  // ============================================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for debugging
  window.__3dScroll = {
    updateParallax,
    updateScrollAnimations,
    updateScrollTransforms,
    updateAvatar3D
  };

})();
