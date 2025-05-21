/**
 * Decorate the hero block
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  // Mark this hero block as already processed
  block.dataset.heroProcessed = 'true';

  // Check if the block has any variant classes
  const variant = Array.from(block.classList)
    .find((className) => className !== 'hero' && className !== 'block');

  // Create containers for better structure
  const imageContainer = document.createElement('div');
  imageContainer.className = 'hero-image-container';

  const contentContainer = document.createElement('div');
  contentContainer.className = 'hero-content';

  // If this is a news variant, add the news-style class
  if (variant === 'news') {
    contentContainer.classList.add('news-style');
  }

  // Process rows and maintain content
  const rows = [...block.children];
  let foundMainImage = false;

  if (rows.length > 0) {
    // Process the first row which typically contains image and text
    const firstRow = rows[0];
    const cells = [...firstRow.children];

    // Process all cells to extract images and text content
    cells.forEach((cell) => {
      // Check for images
      const pictures = cell.querySelectorAll('picture');
      const imgs = cell.querySelectorAll('img');

      // If we find a picture or img and haven't found the main image yet
      if ((pictures.length > 0 || imgs.length > 0) && !foundMainImage) {
        // Handle picture element
        if (pictures.length > 0) {
          const picture = pictures[0];
          imageContainer.appendChild(picture.cloneNode(true));

          // Mark any img inside with high priority and eager loading for LCP optimization
          const imgInPicture = imageContainer.querySelector('img');
          if (imgInPicture) {
            imgInPicture.loading = 'eager';
            imgInPicture.fetchPriority = 'high';
            imgInPicture.decoding = 'async';
          }

          // Remove this picture from the cell to avoid duplication
          picture.remove();
          foundMainImage = true;
        } else if (imgs.length > 0) {
          const img = imgs[0];
          const imgClone = img.cloneNode(true);

          // Set high priority loading for LCP optimization
          imgClone.loading = 'eager';
          imgClone.fetchPriority = 'high';
          imgClone.decoding = 'async';

          imageContainer.appendChild(imgClone);

          // Remove this img from the cell to avoid duplication
          img.remove();
          foundMainImage = true;
        }
      }

      // Append remaining content to the content container
      while (cell.firstChild) {
        contentContainer.appendChild(cell.firstChild);
      }
    });
  }

  // Remove any remaining pictures/images from the content container
  // This is to ensure we don't have duplicate images
  if (variant === 'news') {
    const duplicatePictures = contentContainer.querySelectorAll('p > picture:only-child');
    duplicatePictures.forEach((picture) => {
      const parent = picture.parentElement;
      if (parent && parent.tagName === 'P') {
        parent.remove();
      }
    });
  }

  // Clear original content
  block.innerHTML = '';

  // Add the new structure
  block.appendChild(imageContainer);
  block.appendChild(contentContainer);

  // Fix for the hero wrapper to prevent other blocks being added
  const heroWrapper = block.closest('.hero-wrapper');
  if (heroWrapper) {
    // Add an attribute that other scripts can check to prevent adding content
    heroWrapper.dataset.heroComplete = 'true';

    // Replace the current wrapper's append method to prevent adding article-categories
    const originalAppend = heroWrapper.appendChild.bind(heroWrapper);

    heroWrapper.appendChild = function filteredAppendChild(child) {
      // Only append if it's not article-categories
      if (!child.classList || !child.classList.contains('article-categories')) {
        return originalAppend(child);
      }
      return child; // Return without appending
    };
  }
}
