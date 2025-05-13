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
  main.querySelectorAll('.nav-main .default-content-wrapper > ul > li').forEach((section) => {
    console.log('Setting aria-expanded for section:', section, 'to', expanded);
    section.setAttribute('aria-expanded', expanded);
  });
}

function toggleMenu(nav, navMain, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  console.log('Toggling menu:', { nav, navMain, expanded });
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navMain, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

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
  console.log('Decorating header block:', block);

  const navMeta = getMetadata('nav');
  console.log('Nav metadata:', navMeta);
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  console.log('Nav path:', navPath);
  const fragment = await loadFragment(navPath);
  console.log('Loaded fragment:', fragment);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) {
    const child = fragment.firstElementChild;
    console.log('Appending child to nav:', child);
    nav.append(child);
  }

  const classes = ['brand', 'secondary', 'main', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) {
      console.log(`Adding class "nav-${c}" to section:`, section);
      section.classList.add(`nav-${c}`);
    }
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand && navBrand.querySelector('.button');
  if (brandLink) {
    console.log('Cleaning up brand link:', brandLink);
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  // update this to .nav-main
  const navMain = nav.querySelector('.nav-main');
const navSecondary = nav.querySelector('.nav-secondary');

[navMain, navSecondary].forEach((navSectionRoot) => {
  if (navSectionRoot) {
    navSectionRoot.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) {
        console.log('Adding "nav-drop" class to nav section:', navSection);
        navSection.classList.add('nav-drop');
      }
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          console.log('Toggling nav section on click:', { navSection, expanded });
          toggleAllNavSections(navSectionRoot);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }
});

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  console.log('Adding hamburger menu:', hamburger);
  hamburger.addEventListener('click', () => toggleMenu(nav, navMain));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  toggleMenu(nav, navMain, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navMain, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  console.log('Wrapping nav in nav-wrapper:', navWrapper);
  navWrapper.append(nav);
  block.append(navWrapper);
}
