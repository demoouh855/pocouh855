/**
 * Decorate the article-categories block
 * Uses AEM.live's icon handling and links directly on text
 * @param {Element} block The article-categories block element
 */
export default function decorate(block) {
  // Create the title with dividers
  const title = document.createElement('h2');
  title.className = 'article-categories-title';
  title.textContent = 'Other Article Categories';

  // Create the icons container
  const iconsContainer = document.createElement('div');
  iconsContainer.className = 'article-categories-icons';

  // Get rows from the block
  const rows = [...block.children];

  // Process category rows
  rows.forEach((row) => {
    // Get the cells - should have icon and category name with link
    const cells = [...row.children];

    if (cells.length >= 2) {
      // Get the icon cell and text cell
      const iconCell = cells[0];
      const textCell = cells[1];

      // Find existing link in the text cell if available
      const link = textCell.querySelector('a');

      // Create the category component
      const categoryLink = document.createElement('a');
      categoryLink.className = 'article-category';

      // Set the link URL from the existing link, or default to '#'
      categoryLink.href = link ? link.href : '#';

      // Create icon container
      const iconContainer = document.createElement('div');
      iconContainer.className = 'article-category-icon';

      // AEM.live automatically converts :iconname: syntax to SVG
      const iconSvg = iconCell.querySelector('svg');
      const iconSpan = iconCell.querySelector('span.icon');

      if (iconSvg) {
        // Use the SVG that was already created
        iconContainer.appendChild(iconSvg.cloneNode(true));
      } else if (iconSpan) {
        // Use the icon span that was created
        iconContainer.appendChild(iconSpan.cloneNode(true));
      } else {
        // Fallback - use whatever is in the cell
        iconContainer.innerHTML = iconCell.innerHTML;
      }

      // Create text container
      const textContainer = document.createElement('div');
      textContainer.className = 'article-category-text';

      // Use the link text if available, otherwise use the cell text
      textContainer.textContent = link
        ? link.textContent
        : textCell.textContent.trim();

      // Assemble the category
      categoryLink.appendChild(iconContainer);
      categoryLink.appendChild(textContainer);

      // Add to icons container
      iconsContainer.appendChild(categoryLink);
    }
  });

  // Clear the block's original content
  block.innerHTML = '';

  // Add the new structure
  block.appendChild(title);
  block.appendChild(iconsContainer);
}
