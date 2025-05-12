/**
 * Generates the OU Health website header HTML
 * @returns {string} The complete header HTML structure
 */
function generateOUHealthHeader() {
  return `
    <header class="site-header">
      <!-- Utility Navigation -->
      <div class="utility-nav">
        <div class="utility-nav-container">
          <div class="utility-nav-links">
            <a href="/find-a-location" class="icon-link location-link">Find a Location</a>
            <a href="/find-a-doctor" class="icon-link user-link">Find a Doctor</a>
            <a href="/appointments" class="icon-link calendar-link">Schedule Appointment</a>
          </div>
          <div class="utility-nav-links">
            <a href="/patient-portal" class="icon-link user-link">Patient Portal</a>
            <a href="/contact" class="icon-link phone-link">Contact Us</a>
          </div>
        </div>
      </div>
      
      <!-- Main Navigation -->
      <nav class="main-nav">
        <div class="site-logo">
          <a href="/" title="OU Health">OU Health</a>
        </div>
        
        <ul class="primary-menu">
          <li class="menu-item has-dropdown">
            <a href="/services">Services</a>
            <ul class="dropdown-menu">
              <li><a href="/services/cancer">Cancer Care</a></li>
              <li><a href="/services/heart">Heart Care</a></li>
              <li><a href="/services/neurology">Neurology</a></li>
              <li><a href="/services/womens-health">Women's Health</a></li>
              <li><a href="/services/childrens">Children's Health</a></li>
            </ul>
          </li>
          <li class="menu-item has-dropdown">
            <a href="/locations">Locations</a>
            <ul class="dropdown-menu">
              <li><a href="/locations/ou-medical-center">OU Medical Center</a></li>
              <li><a href="/locations/childrens">The Children's Hospital</a></li>
              <li><a href="/locations/edmond">OU Health Edmond</a></li>
              <li><a href="/locations/stephenson">Stephenson Cancer Center</a></li>
            </ul>
          </li>
          <li class="menu-item has-dropdown">
            <a href="/patients">Patients & Visitors</a>
            <ul class="dropdown-menu">
              <li><a href="/patients/billing">Billing & Insurance</a></li>
              <li><a href="/patients/medical-records">Medical Records</a></li>
              <li><a href="/patients/visiting">Visitor Information</a></li>
              <li><a href="/patients/patient-rights">Patient Rights</a></li>
            </ul>
          </li>
          <li class="menu-item">
            <a href="/health-library">Health Library</a>
          </li>
          <li class="menu-item">
            <a href="/about">About</a>
          </li>
        </ul>
        
        <button class="search-btn" aria-label="Search">Search</button>
        <button class="mobile-menu-toggle" aria-label="Menu">Menu</button>
      </nav>
      
      <!-- Mobile Menu (Hidden by default) -->
      <div class="mobile-menu">
        <div class="mobile-menu-close">
          <button aria-label="Close menu">Close</button>
        </div>
        <ul>
          <li><a href="/services">Services</a></li>
          <li><a href="/locations">Locations</a></li>
          <li><a href="/patients">Patients & Visitors</a></li>
          <li><a href="/health-library">Health Library</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/find-a-doctor">Find a Doctor</a></li>
          <li><a href="/appointments">Schedule Appointment</a></li>
          <li><a href="/patient-portal">Patient Portal</a></li>
          <li><a href="/contact">Contact Us</a></li>
        </ul>
      </div>
      
      <!-- Search Overlay (Hidden by default) -->
      <div class="search-overlay">
        <button class="search-close" aria-label="Close search">Close</button>
        <form class="search-form">
          <input type="text" class="search-input" placeholder="Search..." aria-label="Search">
        </form>
      </div>
    </header>
  `;
}

/**
 * Initializes header functionality 
 */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  // Search functionality
  const searchBtn = header.querySelector('.search-btn');
  const searchOverlay = header.querySelector('.search-overlay');
  const searchClose = header.querySelector('.search-close');
  
  if (searchBtn && searchOverlay && searchClose) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('active');
    });
    
    searchClose.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
    });
  }
  
  // Mobile menu functionality
  const mobileMenuToggle = header.querySelector('.mobile-menu-toggle');
  const mobileMenu = header.querySelector('.mobile-menu');
  const mobileMenuClose = header.querySelector('.mobile-menu-close button');
  
  if (mobileMenuToggle && mobileMenu && mobileMenuClose) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });
    
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  }
}

/**
 * Example usage:
 * 
 * // Insert header into page
 * document.getElementById('header-container').innerHTML = generateOUHealthHeader();
 * 
 * // Initialize header functionality after DOM is fully loaded
 * document.addEventListener('DOMContentLoaded', initHeader);
 */
