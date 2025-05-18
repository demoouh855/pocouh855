/**
 * Category Icons Block for OU Health Blog
 * Creates the "Other Article Categories" section with icons
 */

/**
 * Decorates the category-icons block
 * @param {Element} block The category-icons block element
 */
export default function decorate(block) {
  // Get the block contents
  const rows = [...block.children];
  
  // Clear the block's contents
  block.innerHTML = '';
  
  // Create the container for the category icons section
  const container = document.createElement('div');
  container.className = 'article-categories';
  
  // Add section title
  const title = document.createElement('h2');
  title.textContent = 'Other Article Categories';
  container.appendChild(title);
  
  // Create the icons grid
  const iconsGrid = document.createElement('div');
  iconsGrid.className = 'category-icons';
  
  // Process each row as a category
  rows.forEach(row => {
    if (row.children.length > 0) {
      // First column should contain icon or emoji
      const iconCell = row.children[0];
      const icon = iconCell.textContent.trim();
      
      // Second column should contain category name
      const nameCell = row.children.length > 1 ? row.children[1] : null;
      const name = nameCell ? nameCell.textContent.trim() : '';
      
      // Third column may contain a link URL
      const linkCell = row.children.length > 2 ? row.children[2] : null;
      const link = linkCell ? linkCell.querySelector('a')?.href || '#' : '#';
      
      // Create category link
      const categoryLink = document.createElement('a');
      categoryLink.className = 'category-icon';
      categoryLink.href = link;
      
      // Create icon container
      const iconDiv = document.createElement('div');
      iconDiv.className = 'icon';
      iconDiv.textContent = icon;
      
      // Create name text
      const nameSpan = document.createElement('span');
      nameSpan.className = 'text';
      nameSpan.textContent = name;
      
      // Assemble the category
      categoryLink.appendChild(iconDiv);
      categoryLink.appendChild(nameSpan);
      iconsGrid.appendChild(categoryLink);
    }
  });
  
  // Add the icons grid to the container
  container.appendChild(iconsGrid);
  
  // Add the container to the block
  block.appendChild(container);
}
