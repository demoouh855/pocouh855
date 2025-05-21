/**
 * Decorate the hero-blog block to match the screenshot exactly
 * with performance optimizations and accessibility enhancements for 100 PageSpeed score
 * @param {Element} block The hero-blog block element
 */
export default function decorate(block) {
  // Mark the block as the LCP container for monitoring
  block.classList.add('lcp-candidate');

  // Add appropriate ARIA roles for better screen reader compatibility
  block.setAttribute('role', 'article');

  // Ensure images load eagerly and with high priority
  const images = block.querySelectorAll('img');
  images.forEach((img) => {
    // Set critical attributes for LCP optimization
    img.setAttribute('loading', 'eager');
    img.setAttribute('fetchpriority', 'high');

    // Ensure proper decode settings
    img.setAttribute('decoding', 'async');

    // Enhance image accessibility
    if (!img.alt || img.alt === '') {
      // Try to extract better alt text from context
      const closestParagraph = img.closest('div').querySelector('p strong');
      if (closestParagraph) {
        img.alt = `Featured image for: ${closestParagraph.textContent}`;
      } else {
        img.alt = 'Featured blog post image';
      }
    }

    // Ensure image dimensions are explicitly set to prevent layout shift
    if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
      // Set default dimensions or calculate from aspect ratio
      img.setAttribute('width', '800');
      img.setAttribute('height', '450');
    }

    // Optimize responsive image loading if srcset isn't already present
    if (!img.hasAttribute('srcset') && img.src) {
      const imgUrl = new URL(img.src);
      const imgPath = imgUrl.pathname;
      const extension = imgPath.substring(imgPath.lastIndexOf('.'));
      const basePath = imgPath.substring(0, imgPath.lastIndexOf('.'));
      const baseUrl = `${imgUrl.origin}${basePath}`;

      img.setAttribute('srcset', `
        ${baseUrl}-small${extension} 400w,
        ${baseUrl}-medium${extension} 800w,
        ${baseUrl}${extension} 1200w
      `);

      img.setAttribute('sizes', '(max-width: 767px) 100vw, 60vw');
    }
  });

  // Find the content div (second div)
  const contentDiv = block.querySelector(':scope > div:nth-child(2)');
  if (contentDiv) {
    const contentInnerDiv = contentDiv.querySelector('div');
    if (contentInnerDiv) {
      // Enhance heading structure for accessibility
      const titleElement = contentInnerDiv.querySelector('p strong');
      if (titleElement) {
        // Replace p>strong with proper h2 for better document structure
        const headingText = titleElement.textContent;
        const heading = document.createElement('h2');
        heading.textContent = headingText;
        heading.classList.add('hero-blog-title');

        // Apply the same styles from p strong using inline styles
        const computedStyle = window.getComputedStyle(titleElement);
        heading.style.fontSize = computedStyle.fontSize;
        heading.style.fontWeight = computedStyle.fontWeight;
        heading.style.color = computedStyle.color;
        heading.style.lineHeight = computedStyle.lineHeight;
        heading.style.margin = '0 0 0.625rem 0';
        heading.style.fontFamily = computedStyle.fontFamily;

        // Replace the p>strong with the new heading
        const paragraph = titleElement.parentNode;
        paragraph.parentNode.replaceChild(heading, paragraph);
      }

      // Get the last paragraph for adding the link
      const paragraphs = contentInnerDiv.querySelectorAll('p');
      if (paragraphs.length > 0) {
        const lastParagraph = paragraphs[paragraphs.length - 1];

        // Add a Continue Reading link if not present
        if (!contentInnerDiv.querySelector('a.continue-reading')) {
          const link = document.createElement('a');

          // Get the closest heading to determine the full article URL
          const heading = contentInnerDiv.querySelector('h2') || block.querySelector('p strong');
          const headingText = heading ? heading.textContent : '';

          // Create a more meaningful href if possible
          link.href = headingText
            ? `#${headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
            : '#';

          link.textContent = 'Continue Reading';
          link.className = 'continue-reading';

          // Add screen reader text for better context
          const srOnly = document.createElement('span');
          srOnly.className = 'sr-only';
          srOnly.textContent = ` "${headingText}"`;
          srOnly.style.position = 'absolute';
          srOnly.style.width = '1px';
          srOnly.style.height = '1px';
          srOnly.style.padding = '0';
          srOnly.style.margin = '-1px';
          srOnly.style.overflow = 'hidden';
          srOnly.style.clip = 'rect(0, 0, 0, 0)';
          srOnly.style.whiteSpace = 'nowrap';
          srOnly.style.border = '0';

          link.appendChild(srOnly);

          // Add ARIA attributes for better accessibility
          link.setAttribute('aria-label', `Continue reading ${headingText}`);

          // Add the link after the last paragraph
          lastParagraph.after(link);
        }
      }
    }
  }

  // Inform the parent page that this LCP element is ready
  window.dispatchEvent(new CustomEvent('lcp-ready', {
    detail: { element: block },
  }));
}
