/**
 * Decorates the hero block to match OU Health design
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  // Get the block contents (typically rows of content)
  const rows = [...block.children];
  
  // Clear the block's contents so we can rebuild it with our structure
  block.innerHTML = '';
  
  // Determine if this is a featured hero (first on page or with special class)
  const isFeatured = block.classList.contains('featured') || 
                     (document.querySelector('.hero') === block);
  
  // Determine if this is a card-style hero (for grid layouts)
  const isCard = block.classList.contains('card');
  
  if (isFeatured) {
    block.classList.add('featured');
  }
  
  if (isCard) {
    block.classList.add('card');
  }
  
  // Create the image container and content container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'hero-image-container';
  
  const contentContainer = document.createElement('div');
  contentContainer.className = 'hero-content';
  
  // Process the rows
  if (rows.length > 0) {
    // First row should contain an image
    const imageRow = rows[0];
    const image = imageRow.querySelector('img');
    
    if (image) {
      // Make sure image fills the container
      image.setAttribute('loading', 'lazy');
      // Move the image to our container
      imageContainer.appendChild(image);
    }
    
    // Create tags div (extract category or tags from metadata - row 1, col 2)
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'hero-tags';
    
    if (rows[0].children.length > 1) {
      const tagText = rows[0].children[1].textContent.trim();
      if (tagText) {
        // Split by commas if multiple tags
        const tags = tagText.split(',').map(tag => tag.trim());
        
        tags.forEach(tag => {
          if (tag) {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'hero-tag';
            tagSpan.textContent = tag;
            tagsDiv.appendChild(tagSpan);
          }
        });
      }
    }
    
    contentContainer.appendChild(tagsDiv);
    
    // Add date if available (row 2)
    if (rows.length > 1) {
      const dateText = rows[1].textContent.trim();
      // Check if it looks like a date format
      if (dateText && (dateText.match(/\d{1,2}\/\d{1,2}\/\d{4}/) || 
                       dateText.match(/\w+ \d{1,2},? \d{4}/) || 
                       dateText.match(/\d{1,2} \w+ \d{4}/))) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'hero-date';
        dateDiv.textContent = dateText;
        contentContainer.appendChild(dateDiv);
      }
    }
    
    // Add title/heading (row 2 or 3 depending on if date exists)
    let titleRowIndex = 1;
    if (rows.length > 2 && (rows[1].textContent.trim().match(/\d{1,2}\/\d{1,2}\/\d{4}/) || 
                           rows[1].textContent.trim().match(/\w+ \d{1,2},? \d{4}/) || 
                           rows[1].textContent.trim().match(/\d{1,2} \w+ \d{4}/))) {
      titleRowIndex = 2;
    }
    
    if (rows.length > titleRowIndex) {
      const titleRow = rows[titleRowIndex];
      const titleText = titleRow.textContent.trim();
      
      if (titleText) {
        const titleH2 = document.createElement('h2');
        titleH2.className = 'hero-title';
        titleH2.textContent = titleText;
        contentContainer.appendChild(titleH2);
      }
    }
    
    // Add description (subsequent row after title)
    const descriptionRowIndex = titleRowIndex + 1;
    if (rows.length > descriptionRowIndex) {
      const descriptionRow = rows[descriptionRowIndex];
      const descriptionText = descriptionRow.textContent.trim();
      
      if (descriptionText) {
        const descriptionP = document.createElement('p');
        descriptionP.className = 'hero-description';
        descriptionP.textContent = descriptionText;
        contentContainer.appendChild(descriptionP);
      }
    }
    
    // Add CTA/link if it exists (typically in the last row)
    const lastRow = rows[rows.length - 1];
    const ctaLink = lastRow.querySelector('a');
    
    if (ctaLink) {
      // Check if the link text already has the arrow, if not, we'll add it with CSS
      if (!ctaLink.textContent.includes('→')) {
        ctaLink.textContent = ctaLink.textContent.trim();
      }
      
      ctaLink.className = 'hero-cta';
      contentContainer.appendChild(ctaLink);
    }
  }
  
  // Add the containers to the block/**
 * Decorates the hero block
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  // Get the block contents (typically rows of content)
  const rows = [...block.children];
  
  // Clear the block's contents so we can rebuild it with our structure
  block.innerHTML = '';
  
  // Determine if this is a featured hero (first on page or with special class)
  const isFeatured = block.classList.contains('featured') || 
                     (document.querySelector('.hero') === block);
  
  if (isFeatured) {
    block.classList.add('featured');
  }
  
  // Create the image container and content container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'hero-image-container';
  
  const contentContainer = document.createElement('div');
  contentContainer.className = 'hero-content';
  
  // Process the rows
  if (rows.length > 0) {
    // First row should contain an image
    const imageRow = rows[0];
    const image = imageRow.querySelector('img');
    
    if (image) {
      // Move the image to our container
      imageContainer.appendChild(image);
    }
    
    // Create tags div (optional - may not be in every hero)
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'hero-tags';
    
    // Extract category or tags from metadata if available (row 1, col 2)
    if (rows[0].children.length > 1) {
      const tagText = rows[0].children[1].textContent.trim();
      if (tagText) {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'hero-tag';
        tagSpan.textContent = tagText;
        tagsDiv.appendChild(tagSpan);
      }
    }
    
    contentContainer.appendChild(tagsDiv);
    
    // Add date if available (row 2)
    if (rows.length > 1) {
      const dateText = rows[1].textContent.trim();
      if (dateText && dateText.match(/\d{1,2}\/\d{1,2}\/\d{4}|\w+ \d{1,2}, \d{4}|\d{1,2} \w+ \d{4}/)) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'hero-date';
        dateDiv.textContent = dateText;
        contentContainer.appendChild(dateDiv);
      }
    }
    
    // Add title/heading (row 2 or 3 depending on if date exists)
    let titleRowIndex = 1;
    if (rows.length > 2 && rows[1].textContent.trim().match(/\d{1,2}\/\d{1,2}\/\d{4}|\w+ \d{1,2}, \d{4}|\d{1,2} \w+ \d{4}/)) {
      titleRowIndex = 2;
    }
    
    if (rows.length > titleRowIndex) {
      const titleText = rows[titleRowIndex].textContent.trim();
      if (titleText) {
        const titleH2 = document.createElement('h2');
        titleH2.className = 'hero-title';
        titleH2.textContent = titleText;
        contentContainer.appendChild(titleH2);
      }
    }
    
    // Add description (subsequent row after title)
    const descriptionRowIndex = titleRowIndex + 1;
    if (rows.length > descriptionRowIndex) {
      const descriptionText = rows[descriptionRowIndex].textContent.trim();
      if (descriptionText) {
        const descriptionP = document.createElement('p');
        descriptionP.className = 'hero-description';
        descriptionP.textContent = descriptionText;
        contentContainer.appendChild(descriptionP);
      }
    }
    
    // Add CTA/link if it exists (typically in the last row)
    const lastRow = rows[rows.length - 1];
    const ctaLink = lastRow.querySelector('a');
    if (ctaLink) {
      ctaLink.className = 'hero-cta';
      contentContainer.appendChild(ctaLink);
    }
  }
  
  // Add the containers to the block
  block.appendChild(imageContainer);
  block.appendChild(contentContainer);
}
