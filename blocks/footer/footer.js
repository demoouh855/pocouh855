import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
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
      // Find all a's inside contentWrapper that are not already inside a <ul> or <ol>
      const anchors = Array.from(contentWrapper.querySelectorAll('a:not(ul a):not(ol a)'));
      if (anchors.length) {
        const ul = document.createElement('ul');
        anchors.forEach(a => {
          const text = a.textContent.trim();
          a.setAttribute('aria-label', `${text} link`);

          // Remove anchor from its current location
          a.parentNode.removeChild(a);

          const li = document.createElement('li');
          li.appendChild(a);
          ul.appendChild(li);
        });
        // Appending the list to the contentWrapper, adjust as needed (replace or append)
        contentWrapper.appendChild(ul);
      }
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
