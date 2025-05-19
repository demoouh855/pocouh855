import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';
  const fragment = await loadFragment(footerPath);

  // Process sections
  const sectionBrand = fragment.children[0];
  if (sectionBrand) {
    const brandDiv = document.createElement('div');
    brandDiv.className = sectionBrand.className + ' footer-brand social-info';
    brandDiv.innerHTML = sectionBrand.innerHTML;

    // Select only anchor tags that are direct children of the wrapper you want, and not already in a list
    // Adjust the selector if your links are inside a specific wrapper
    const contentWrapper = brandDiv.querySelector('.default-content-wrapper');
    if (contentWrapper) {
      const anchors = contentWrapper.querySelectorAll('a');
      anchors.forEach((a) => {
        const text = a.textContent.trim();
        a.setAttribute('aria-label', text);
        const safeClass = text.replace(/\s+/g, '-').replace(/[^a-z\-]/g, '') + '-icon';
        a.classList.add(safeClass);
      });
    }
    fragment.replaceChild(brandDiv, sectionBrand);
  }

  // Process main section
  const sectionMain = fragment.children[1];
  if (sectionMain) {
    const nav = document.createElement('nav');
    nav.className = sectionMain.className + ' footer-main';
    // Move all first-level children into the nav
    while (sectionMain.firstChild) {
      nav.appendChild(sectionMain.firstChild);
    }
    fragment.replaceChild(nav, sectionMain);
  }

  // Decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  block.append(footer);
}
