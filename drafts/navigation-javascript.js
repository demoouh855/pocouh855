// JavaScript for responsive navigation menu
document.addEventListener('DOMContentLoaded', function() {
  // Get references to key elements
  const navHamburger = document.querySelector('.nav-hamburger button');
  const nav = document.getElementById('nav');
  
  // Toggle mobile menu when hamburger is clicked
  if (navHamburger) {
    navHamburger.addEventListener('click', function() {
      const expanded = nav.getAttribute('aria-expanded') === 'true' || false;
      nav.setAttribute('aria-expanded', !expanded);
    });
  }
  
  // For mobile: Add click handlers to parent items with dropdowns
  const mobileMediaQuery = window.matchMedia('(max-width: 768px)');
  const parentMenuItems = document.querySelectorAll('.section.nav-main .default-content-wrapper > ul > li');
  
  function setupMobileMenuHandlers(isMobile) {
    parentMenuItems.forEach(item => {
      const link = item.querySelector('a');
      const subMenu = item.querySelector('ul');
      
      // Only apply to items that have submenus
      if (subMenu) {
        if (isMobile) {
          // For mobile: prevent default and toggle submenu on touch
          link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
              e.preventDefault();
              if (subMenu.style.display === 'block') {
                subMenu.style.display = 'none';
              } else {
                subMenu.style.display = 'block';
              }
            }
          });
        } else {
          // For desktop: ensure submenu visibility is controlled by CSS hover
          subMenu.style.display = '';
        }
      }
    });
  }
  
  // Initial setup based on screen size
  setupMobileMenuHandlers(mobileMediaQuery.matches);
  
  // Listen for screen size changes
  mobileMediaQuery.addEventListener('change', (e) => {
    setupMobileMenuHandlers(e.matches);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (window.innerWidth <= 768) {
      let isClickInsideNav = nav.contains(event.target);
      let isClickOnHamburger = navHamburger.contains(event.target);
      
      if (!isClickInsideNav && !isClickOnHamburger && nav.getAttribute('aria-expanded') === 'true') {
        nav.setAttribute('aria-expanded', 'false');
      }
    }
  });
});