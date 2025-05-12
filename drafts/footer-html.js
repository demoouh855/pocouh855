/**
 * Generates the OU Health website footer HTML
 * @returns {string} The complete footer HTML structure
 */
function generateOUHealthFooter() {
  return `
    <footer class="site-footer">
      <!-- Top Footer -->
      <div class="footer-top">
        <!-- Logo and About Section -->
        <div class="footer-column">
          <div class="footer-logo">
            <a href="/" title="OU Health">OU Health</a>
          </div>
          <p class="footer-tagline">Oklahoma's most comprehensive healthcare network.</p>
          <div class="social-links">
            <a href="https://www.facebook.com/OUHealth" class="social-icon facebook" aria-label="Facebook">Facebook</a>
            <a href="https://twitter.com/ou_health" class="social-icon twitter" aria-label="Twitter">Twitter</a>
            <a href="https://www.instagram.com/ouhealth" class="social-icon instagram" aria-label="Instagram">Instagram</a>
            <a href="https://www.linkedin.com/company/ouhealth" class="social-icon linkedin" aria-label="LinkedIn">LinkedIn</a>
            <a href="https://www.youtube.com/ouhealth" class="social-icon youtube" aria-label="YouTube">YouTube</a>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div class="footer-column">
          <h3>Patient Resources</h3>
          <ul class="footer-menu">
            <li><a href="/patients/billing">Billing & Insurance</a></li>
            <li><a href="/patients/medical-records">Medical Records</a></li>
            <li><a href="/patients/visiting">Visitor Information</a></li>
            <li><a href="/patients/patient-rights">Patient Rights</a></li>
            <li><a href="/patients/financial-assistance">Financial Assistance</a></li>
          </ul>
        </div>
        
        <!-- Services Links -->
        <div class="footer-column">
          <h3>Our Services</h3>
          <ul class="footer-menu">
            <li><a href="/services/cancer">Cancer Care</a></li>
            <li><a href="/services/heart">Heart Care</a></li>
            <li><a href="/services/neurology">Neurology</a></li>
            <li><a href="/services/womens-health">Women's Health</a></li>
            <li><a href="/services/childrens">Children's Health</a></li>
          </ul>
        </div>
        
        <!-- Contact Info -->
        <div class="footer-column">
          <h3>Contact Us</h3>
          <div class="contact-info">
            <div class="contact-item">
              <div class="contact-icon address"></div>
              <div class="contact-text">
                800 Stanton L Young Blvd<br>
                Oklahoma City, OK 73104
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon phone"></div>
              <div class="contact-text">
                <a href="tel:4052714700">(405) 271-4700</a>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon email"></div>
              <div class="contact-text">
                <a href="mailto:info@ouhealth.com">info@ouhealth.com</a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Newsletter Signup -->
        <div class="footer-column">
          <h3>Stay Connected</h3>
          <p>Subscribe to our newsletter for health tips and updates.</p>
          <form class="newsletter-form">
            <input type="email" class="newsletter-input" placeholder="Your email address" aria-label="Email for newsletter">
            <button type="submit" class="newsletter-button" aria-label="Subscribe">Subscribe</button>
          </form>
        </div>
      </div>
      
      <!-- Bottom Footer -->
      <div class="footer-bottom">
        <div class="copyright">
          &copy; ${new Date().getFullYear()} OU Health. All Rights Reserved.
        </div>
        <div class="legal-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-use">Terms of Use</a>
          <a href="/notice-of-nondiscrimination">Notice of Nondiscrimination</a>
          <a href="/accessibility">Accessibility</a>
        </div>
      </div>
      
      <!-- Back to Top Button -->
      <a href="#top" class="back-to-top" aria-label="Back to top">Back to top</a>
    </footer>
  `;
}

/**
 * Initializes footer functionality
 */
function initFooter() {
  // Back to top button functionality
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (backToTopBtn) {
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Newsletter form submission
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('.newsletter-input');
      
      if (emailInput && emailInput.value) {
        // Here you would typically send the email to your server
        // For this example, we'll just show an alert
        alert(`Thank you for subscribing with: ${emailInput.value}`);
        emailInput.value = '';
      }
    });
  }
}

/**
 * Example usage:
 * 
 * // Insert footer into page
 * document.getElementById('footer-container').innerHTML = generateOUHealthFooter();
 * 
 * // Initialize footer functionality after DOM is fully loaded
 * document.addEventListener('DOMContentLoaded', initFooter);
 */
