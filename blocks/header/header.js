import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navMain = nav.querySelector('.nav-main');
    const navSectionExpanded = navMain.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navMain);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navMain);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navMain = nav.querySelector('.nav-main');
    const navSectionExpanded = navMain.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navMain, false);
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navMain, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    toggleAllNavSections(focused.closest('.nav-main'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

function toggleAllNavSections(main, expanded = false) {
  console.log('Toggling all nav sections:', { main, expanded });
  main
    .querySelectorAll('.nav-main .default-content-wrapper > ul > li')
    .forEach((section) => {
      console.log(
        'Setting aria-expanded for section:',
        section,
        'to',
        expanded
      );
      section.setAttribute('aria-expanded', expanded);
    });
}

function toggleMenu(nav, navMain, forceExpanded = null) {
  const expanded =
    forceExpanded !== null
      ? !forceExpanded
      : nav.getAttribute('aria-expanded') === 'true';
  console.log('Toggling menu:', { nav, navMain, expanded });
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(
    navMain,
    expanded || isDesktop.matches ? 'false' : 'true'
  );
  button.setAttribute(
    'aria-label',
    expanded ? 'Open navigation' : 'Close navigation'
  );

  const navDrops = navMain.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        console.log('Adding tabindex and focus listener to nav-drop:', drop);
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      console.log('Removing tabindex and focus listener from nav-drop:', drop);
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  // Append children from the fragment to the nav
  while (fragment.firstElementChild) {
    const child = fragment.firstElementChild;
    nav.append(child);
  }

  const classes = ['brand', 'secondary', 'main'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) {
      section.classList.add(`nav-${c}`);
    }
  });

  const navContent = document.createElement('div');
  navContent.classList.add('nav-content');

  const navBrand = nav.querySelector('.nav-brand');
  const navMain = nav.querySelector('.nav-main');
  const navSecondary = nav.querySelector('.nav-secondary');

  // Ensure nav-brand is properly structured
  if (navBrand) {
    // Find <a> that wraps the <img>
    const anchor = navBrand.querySelector('a');
    const image = navBrand.querySelector('img');

    if (anchor && image) {
      // Use the image's alt text for accessibility
      image.alt = image.alt || navBrand.textContent.trim();

      // No change needed, the structure is already <a><img></a>
    } else if (image) {
      // If not already in a link, wrap image in anchor
      const link = document.createElement('a');
      link.href = '/'; // Set as needed or pull from a config/text cell
      image.removeAttribute('width');
      image.removeAttribute('height');
      link.appendChild(image.cloneNode(true)); // Copy image with alt text
      navBrand.innerHTML = '';
      navBrand.appendChild(link);
    }
    navBrand.classList.add('section', 'nav-brand');
    navBrand.classList.remove('nav-content');
    nav.prepend(navBrand);
  }

  // Append nav-secondary and nav-main to nav-content
  [navSecondary, navMain].forEach((navSectionRoot) => {
    if (navSectionRoot) {
      navContent.appendChild(navSectionRoot);
    }
  });

  // Append nav-content to the nav
  nav.appendChild(navContent);

  // Add hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navMain));
  nav.prepend(hamburger);

  // Initialize dropdown menus
  const navDrops = navMain.querySelectorAll('.nav-drop');
  navDrops.forEach((drop) => {
    drop.setAttribute('aria-expanded', 'false'); // Set default state
    drop.addEventListener('click', () => {
      const isExpanded = drop.getAttribute('aria-expanded') === 'true';
      toggleAllNavSections(navMain, false); // Close all other dropdowns
      drop.setAttribute('aria-expanded', isExpanded ? 'false' : 'true'); // Toggle current dropdown
    });
  });

  // Wrap the nav in a nav-wrapper and append to the block
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
