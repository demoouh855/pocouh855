import ffetch from '../../scripts/ffetch.js';

const INDEX_URL = '/query-index.json';

// Card generator: title links to post.url if available
function createCard(post) {
  const title = post.url
    ? `<a href="${post.url}" class="blog-card-link">${post.title}</a>`
    : post.title;

  // Handle missing image
  const image = post.image || '/path/to/placeholder-image.jpg';
  
  // Get category tag (or default to "Blog")
  const tag = post.tag || post.category || 'Blog';
  
  // Format date nicely if available
  const date = post.lastModified 
    ? new Date(post.lastModified).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return `
    <div class="blog-card">
      <div class="blog-card-tag-container">
        <span class="blog-card-tag">${tag}</span>
      </div>
      <img src="${image}" alt="${post.title}" class="blog-card-image">
      <div class="blog-card-content">
        <h3 class="blog-card-title">${title}</h3>
        <p class="blog-card-desc">${post.description || ''}</p>
        ${date ? `<span class="blog-card-date">${date}</span>` : ''}
        <a href="${post.url}" class="continue-reading">→ Continue Reading</a>
      </div>
    </div>
  `;
}

function renderResults(container, results, page, pageSize) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  if (results.length === 0) {
    container.innerHTML = '<div class="no-results">No matching blog posts found. Please try a different search term.</div>';
    return false;
  }
  
  // If it's page 1, replace the content, otherwise append
  if (page === 1) {
    container.innerHTML = results.slice(start, end).map(createCard).join('');
  } else {
    container.innerHTML += results.slice(start, end).map(createCard).join('');
  }
  
  return results.length > end;
}

async function searchBlogs(query, category, archive) {
  let list = await ffetch(INDEX_URL).all();
  
  // Filter by query if provided
  if (query) {
    list = list.filter((post) =>
      (post.title || '').toLowerCase().includes(query.toLowerCase()) ||
      (post.description || '').toLowerCase().includes(query.toLowerCase())
    );
  }
  
  // Filter by category if selected
  if (category && category !== 'Select') {
    list = list.filter(post => 
      (post.category || '').toLowerCase() === category.toLowerCase() ||
      (post.tag || '').toLowerCase() === category.toLowerCase()
    );
  }
  
  // Filter by archive (date) if selected
  if (archive && archive !== 'Select') {
    // Implementation depends on your date format and requirements
    // For example, if archive is a year:
    list = list.filter(post => {
      const postDate = new Date(post.lastModified || '');
      return postDate.getFullYear().toString() === archive;
    });
  }
  
  // Sort by lastModified descending
  list = list.sort((a, b) =>
    (b.lastModified || '').localeCompare(a.lastModified || '')
  );
  
  return list;
}

// Get unique values for filters
async function getFilterOptions() {
  const list = await ffetch(INDEX_URL).all();
  
  // Get categories
  const categories = new Set();
  list.forEach(post => {
    if (post.category) categories.add(post.category);
    if (post.tag) categories.add(post.tag);
  });
  
  // Get years for archive
  const years = new Set();
  list.forEach(post => {
    if (post.lastModified) {
      const year = new Date(post.lastModified).getFullYear();
      years.add(year.toString());
    }
  });
  
  return {
    categories: Array.from(categories).sort(),
    archives: Array.from(years).sort().reverse()
  };
}

export default async function decorate(block) {
  block.innerHTML = '';

  // Heading
  const heading = document.createElement('h1');
  heading.textContent = 'Blogs';

  // Search form
  const form = document.createElement('form');
  form.className = 'blog-search-form';

  const searchField = document.createElement('div');
  searchField.className = 'search-field';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'search';
  input.placeholder = 'Search Term';
  input.setAttribute('aria-label', 'Search blog posts');
  
  const searchButton = document.createElement('button');
  searchButton.type = 'submit';
  searchButton.textContent = 'Search';
  
  searchField.appendChild(input);
  form.appendChild(searchField);
  form.appendChild(searchButton);

  // Get filter options
  const filterOptions = await getFilterOptions();
  
  // Create filter area
  const filterArea = document.createElement('div');
  filterArea.className = 'blog-filters';
  
  // Category filter
  const categoryGroup = document.createElement('div');
  categoryGroup.className = 'filter-group';
  
  const categoryLabel = document.createElement('label');
  categoryLabel.textContent = 'Category';
  categoryLabel.setAttribute('for', 'category-select');
  
  const categorySelect = document.createElement('select');
  categorySelect.id = 'category-select';
  categorySelect.innerHTML = '<option>Select</option>';
  filterOptions.categories.forEach(category => {
    categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
  });
  
  categoryGroup.appendChild(categoryLabel);
  categoryGroup.appendChild(categorySelect);
  
  // Archive filter
  const archiveGroup = document.createElement('div');
  archiveGroup.className = 'filter-group';
  
  const archiveLabel = document.createElement('label');
  archiveLabel.textContent = 'Archives';
  archiveLabel.setAttribute('for', 'archive-select');
  
  const archiveSelect = document.createElement('select');
  archiveSelect.id = 'archive-select';
  archiveSelect.innerHTML = '<option>Select</option>';
  filterOptions.archives.forEach(year => {
    archiveSelect.innerHTML += `<option value="${year}">${year}</option>`;
  });
  
  archiveGroup.appendChild(archiveLabel);
  archiveGroup.appendChild(archiveSelect);
  
  filterArea.appendChild(categoryGroup);
  filterArea.appendChild(archiveGroup);
  
  // Clear filters button
  const clearFiltersDiv = document.createElement('div');
  clearFiltersDiv.className = 'clear-filters';
  
  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.textContent = '→ Clear Filters';
  clearButton.addEventListener('click', () => {
    input.value = '';
    categorySelect.value = 'Select';
    archiveSelect.value = 'Select';
    performSearch();
  });
  
  clearFiltersDiv.appendChild(clearButton);

  // Results container
  const resultsDiv = document.createElement('div');
  resultsDiv.className = 'blog-search-results';

  // "Show More" button
  const showMoreBtn = document.createElement('button');
  showMoreBtn.type = 'button';
  showMoreBtn.textContent = 'Show More';
  showMoreBtn.className = 'show-more-btn';
  showMoreBtn.style.display = 'none'; // Hidden until needed

  // Assemble the layout
  block.appendChild(heading);
  block.appendChild(form);
  block.appendChild(filterArea);
  block.appendChild(clearFiltersDiv);
  block.appendChild(resultsDiv);
  block.appendChild(showMoreBtn);

  // State variables
  let allResults = [];
  let currentQuery = '';
  let currentCategory = 'Select';
  let currentArchive = 'Select';
  let currentPage = 1;
  const pageSize = 9; // 3x3 grid for desktop

  // Perform search and update UI
  const performSearch = async () => {
    currentQuery = input.value.trim();
    currentCategory = categorySelect.value;
    currentArchive = archiveSelect.value;
    currentPage = 1;
    
    allResults = await searchBlogs(currentQuery, currentCategory, currentArchive);
    const hasMore = renderResults(resultsDiv, allResults, currentPage, pageSize);
    showMoreBtn.style.display = hasMore ? '' : 'none';
  };

  // Event handlers
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    performSearch();
  });
  
  // Add change listeners to select dropdowns
  categorySelect.addEventListener('change', performSearch);
  archiveSelect.addEventListener('change', performSearch);

  // Show more button
  showMoreBtn.addEventListener('click', () => {
    currentPage += 1;
    const hasMore = renderResults(resultsDiv, allResults, currentPage, pageSize);
    showMoreBtn.style.display = hasMore ? '' : 'none';
  });

  // Initial load
  performSearch();
}
