/**
 * Decorates the hero-blog block to work with the existing H1 on the page
 * @param {Element} block The hero-blog block element
 */
export default function decorate(block) {
  // Get the block contents (typically rows of content)
  const rows = [...block.children];
  
  // Clear the block's contents so we can rebuild it with our structure
  block.innerHTML = '';
  
  // Add a container class to the block's parent to control spacing
  if (block.parentElement) {
    block.parentElement.classList.add('hero-blog-container');
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
    
    // Add date if available (row 1)
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
    
    // Add title/heading (row 2)
    if (rows.length > 2) {
      const titleRow = rows[2];
      const titleText = titleRow.textContent.trim();
      
      if (titleText) {
        const titleH2 = document.createElement('h2');
        titleH2.className = 'hero-title';
        titleH2.textContent = titleText;
        contentContainer.appendChild(titleH2);
      }
    }
    
    // Add description (row 3)
    if (rows.length > 3) {
      const descriptionRow = rows[3];
      const descriptionText = descriptionRow.textContent.trim();
      
      if (descriptionText) {
        const descriptionP = document.createElement('p');
        descriptionP.className = 'hero-description';
        descriptionP.textContent = descriptionText;
        contentContainer.appendChild(descriptionP);
      }
    }
    
    // Add CTA/link if it exists (row 4)
    if (rows.length > 4) {
      const ctaRow = rows[4];
      const ctaLink = ctaRow.querySelector('a');
      
      if (ctaLink) {
        // Check if the link text already has the arrow, if not, we'll add it with CSS
        if (!ctaLink.textContent.includes('→')) {
          ctaLink.textContent = ctaLink.textContent.trim();
        }
        
        ctaLink.className = 'hero-cta';
        contentContainer.appendChild(ctaLink);
      }
    }
  }
  
  // Add the containers to the block
  block.appendChild(imageContainer);
  block.appendChild(contentContainer);
  
  // Create and add the Categories section
  createCategoriesSection(block);
}

/**
 * Creates and adds the Categories section after the hero
 * @param {Element} block The hero block to append after
 */
function createCategoriesSection(block) {
  // Create the categories section
  const categoriesSection = document.createElement('div');
  categoriesSection.className = 'article-categories';
  
  // Add section title
  const sectionTitle = document.createElement('h2');
  sectionTitle.textContent = 'Other Article Categories';
  categoriesSection.appendChild(sectionTitle);
  
  // Create category icons container
  const categoryIcons = document.createElement('div');
  categoryIcons.className = 'category-icons';
  
  // Define the categories from the screenshot
  const categories = [
    { name: 'Adult Services', icon: '👤' },
    { name: 'Blog', icon: '📝' },
    { name: 'Diabetes', icon: '❤️' },
    { name: 'News', icon: '📰' },
    { name: 'See All Blogs', icon: '📋' }
  ];
  
  // Create category icons
  categories.forEach(category => {
    const categoryLink = document.createElement('a');
    categoryLink.className = 'category-icon';
    categoryLink.href = '#';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'icon';
    iconDiv.textContent = category.icon;
    
    const textSpan = document.createElement('span');
    textSpan.className = 'text';
    textSpan.textContent = category.name;
    
    categoryLink.appendChild(iconDiv);
    categoryLink.appendChild(textSpan);
    categoryIcons.appendChild(categoryLink);
  });
  
  categoriesSection.appendChild(categoryIcons);
  
  // Insert after the hero block
  if (block.parentNode) {
    block.parentNode.insertBefore(categoriesSection, block.nextSibling);
  }
}
