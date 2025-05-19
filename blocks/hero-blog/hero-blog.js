/**
 * Decorate the hero-blog block to match the screenshot exactly
 * @param {Element} block The hero-blog block element
 */
export default function decorate(block) {
  // Ensure images load eagerly for better performance
  const images = block.querySelectorAll('img');
  images.forEach((img) => {
    img.setAttribute('loading', 'eager');
  });

  // Optional: Add a Continue Reading link if not present
  const paragraph = block.querySelector('p');
  if (paragraph && !paragraph.querySelector('a')) {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = 'Continue Reading';
    link.className = 'continue-reading';
    paragraph.appendChild(link);
  }

  // Reorganize br tags for proper spacing if needed
  if (paragraph) {
    const html = paragraph.innerHTML;

    // Remove excess br tags and ensure proper spacing
    const cleanedHtml = html
      .replace(/<br>\s*<br>\s*<br>/g, '<br>') // Replace triple br with single
      .replace(/<br>\s*<br>/g, '<br>'); // Replace double br with single

    paragraph.innerHTML = cleanedHtml;
  }
}
