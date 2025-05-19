/**
 * Decorate the hero-blog block to match the screenshot exactly
 * @param {Element} block The hero-blog block element
 */
export default function decorate(block) {
  // Ensure images load eagerly for better performance
  const images = block.querySelectorAll('img');
  images.forEach((img) => {
    img.setAttribute('loading', 'eager');

    // Add alt text if missing
    if (!img.alt || img.alt === '') {
      img.alt = 'hero-blog image';
    }
  });

  // Find the content div (second div)
  const contentDiv = block.querySelector(':scope > div:nth-child(2)');
  if (contentDiv) {
    const contentInnerDiv = contentDiv.querySelector('div');
    if (contentInnerDiv) {
      // Get the last paragraph for adding the link
      const paragraphs = contentInnerDiv.querySelectorAll('p');
      if (paragraphs.length > 0) {
        const lastParagraph = paragraphs[paragraphs.length - 1];

        // Add a Continue Reading link if not present
        if (!contentInnerDiv.querySelector('a.continue-reading')) {
          const link = document.createElement('a');
          link.href = '#';
          link.textContent = 'Continue Reading';
          link.className = 'continue-reading';
          // Add the link after the last paragraph
          lastParagraph.after(link);
        }
      }
    }
  }
}
