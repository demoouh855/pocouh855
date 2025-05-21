import ffetch from '../../scripts/ffetch.js';

const INDEX_URL = '/query-index.json';

// Card generator: title links to post.url if available
function createCard(post) {
  const url = post.url || post.path || '#';

  const title = url !== '#'
    ? `<a href='${url}' class='blog-card-link'>${post.title}</a>`
    : post.title;

  // Handle missing image
  const image = post.image || '/path/to/placeholder-image.jpg';

  // Format date nicely if available
  const date = post.lastModified
    ? new Date(post.lastModified).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : '';

  return `
    <div class='blog-card'>
      <img src='${image}' alt='${post.title}' class='blog-card-image'>
      <div class='blog-card-content'>
        <h3 class='blog-card-title'>${title}</h3>
        <p class='blog-card-desc'>${post.description || ''}</p>
        ${date ? `<span class='blog-card-date'>${date}</span>` : ''}
        <a href='${url}' class='continue-reading'>Continue Reading</a>
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

async function searchBlogs(query, category, archive, service) {
  let list = await ffetch(INDEX_URL).all();

  // Filter by query if provided
  if (query) {
    list = list.filter(
      (post) => (post.title || '').toLowerCase().includes(query.toLowerCase())
        || (post.description || '').toLowerCase().includes(query.toLowerCase())
        || (post.content || '').toLowerCase().includes(query.toLowerCase()), // Add content search
    );
  }

  // Filter by category if selected
  if (category && category !== 'Select' && category !== 'All Categories') {
    list = list.filter((post) => {
      // Handle comma-delimited tags
      if (post.tags && post.tags.includes(',')) {
        const tagList = post.tags.split(',').map((tag) => tag.trim().toLowerCase());
        return tagList.includes(category.toLowerCase());
      }
      return (post.tags || '').toLowerCase() === category.toLowerCase();
    });
  }

  // Filter by archive (date) if selected
  if (archive && archive !== 'Select' && archive !== 'All Years') {
    list = list.filter((post) => {
      const postDate = new Date(post.lastModified || '');
      return postDate.getFullYear().toString() === archive;
    });
  }

  // Filter by service if selected
  if (service && service !== 'Select' && service !== 'All Services' && service !== '') {
    list = list.filter((post) => {
      const serviceField = post.service || post.services;
      // Handle comma-delimited services
      if (serviceField && serviceField.includes(',')) {
        const serviceList = serviceField.split(',').map((svc) => svc.trim().toLowerCase());
        return serviceList.includes(service.toLowerCase());
      }
      return (serviceField || '').toLowerCase() === service.toLowerCase();
    });
  }

  // Sort by lastModified descending
  list = list.sort((a, b) => (b.lastModified || '').localeCompare(a.lastModified || ''));
  return list;
}

// Get unique values for filters
async function getFilterOptions() {
  const list = await ffetch(INDEX_URL).all();

  // Get unique tags for categories
  const categories = new Set();
  list.forEach((post) => {
    if (post.tags) {
      // Handle comma-delimited tags
      if (post.tags.includes(',')) {
        post.tags.split(',').forEach((tag) => {
          categories.add(tag.trim());
        });
      } else {
        categories.add(post.tags.trim());
      }
    }
  });

  // Get years for archive
  const years = new Set();
  list.forEach((post) => {
    if (post.lastModified) {
      const year = new Date(post.lastModified).getFullYear();
      years.add(year.toString());
    }
  });

  // Get unique services
  const services = new Set();
  list.forEach((post) => {
    if (post.service || post.services) {
      const serviceField = post.service || post.services;
      // Handle comma-delimited services
      if (serviceField && serviceField.includes(',')) {
        serviceField.split(',').forEach((svc) => {
          services.add(svc.trim());
        });
      } else if (serviceField) {
        services.add(serviceField.trim());
      }
    }
  });

  return {
    categories: Array.from(categories).sort(),
    archives: Array.from(years).sort().reverse(),
    services: Array.from(services).sort(),
  };
}

// Function to check URL parameters and hide hero container if needed
function checkUrlParamsAndHideHero() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('category') || urlParams.has('service')) {
    const heroContainer = document.querySelector('.hero-blog-container');
    if (heroContainer) {
      heroContainer.style.display = 'none';
    }
  }
}

export default async function decorate(block) {
  // Check URL params and hide hero if needed
  checkUrlParamsAndHideHero();

  block.innerHTML = '';

  // Heading
  const heading = document.createElement('h1');
  heading.textContent = 'Blogs';
  block.appendChild(heading);

  // Create search container (3-column grid)
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';

  // Search Articles section
  const searchSection = document.createElement('div');
  searchSection.className = 'search-section';

  const searchLabel = document.createElement('div');
  searchLabel.className = 'section-label';
  searchLabel.textContent = 'Search Articles';
  searchSection.appendChild(searchLabel);

  const searchFieldContainer = document.createElement('div');
  searchFieldContainer.className = 'search-field-container';

  const searchBox = document.createElement('div');
  searchBox.className = 'search-box';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search Term';
  searchInput.setAttribute('aria-label', 'Search blog posts');

  const searchButton = document.createElement('button');
  searchButton.className = 'search-button';
  searchButton.type = 'button';
  searchButton.setAttribute('aria-label', 'Search');

  searchBox.appendChild(searchInput);
  searchBox.appendChild(searchButton);
  searchFieldContainer.appendChild(searchBox);
  searchSection.appendChild(searchFieldContainer);
  searchContainer.appendChild(searchSection);

  // Get filter options
  const filterOptions = await getFilterOptions();

  // Category Filter section
  const categorySection = document.createElement('div');
  categorySection.className = 'search-section';

  const categoryLabel = document.createElement('div');
  categoryLabel.className = 'section-label';
  categoryLabel.textContent = 'Category';
  categorySection.appendChild(categoryLabel);

  const categoryGroup = document.createElement('div');
  categoryGroup.className = 'filter-group';

  const categorySelect = document.createElement('select');
  categorySelect.id = 'category-select';
  categorySelect.innerHTML = '<option value="All Categories" selected>All Categories</option>';
  categorySelect.innerHTML += '<option value=""></option>';
  filterOptions.categories.forEach((category) => {
    categorySelect.innerHTML += `<option value='${category}'>${category}</option>`;
  });

  categoryGroup.appendChild(categorySelect);
  categorySection.appendChild(categoryGroup);
  searchContainer.appendChild(categorySection);

  // Archives Filter section
  const archiveSection = document.createElement('div');
  archiveSection.className = 'search-section';

  const archiveLabel = document.createElement('div');
  archiveLabel.className = 'section-label';
  archiveLabel.textContent = 'Archives';
  archiveSection.appendChild(archiveLabel);

  const archiveGroup = document.createElement('div');
  archiveGroup.className = 'filter-group';

  const archiveSelect = document.createElement('select');
  archiveSelect.id = 'archive-select';
  archiveSelect.innerHTML = '<option value="All Years" selected>All Years</option>';
  archiveSelect.innerHTML += '<option value=""></option>';
  filterOptions.archives.forEach((year) => {
    archiveSelect.innerHTML += `<option value='${year}'>${year}</option>`;
  });

  archiveGroup.appendChild(archiveSelect);
  archiveSection.appendChild(archiveGroup);
  searchContainer.appendChild(archiveSection);

  block.appendChild(searchContainer);

  // Services Search section
  const servicesSection = document.createElement('div');
  servicesSection.className = 'services-search';

  const servicesLabel = document.createElement('div');
  servicesLabel.className = 'section-label';
  servicesLabel.textContent = 'Search Services';
  servicesSection.appendChild(servicesLabel);

  const servicesGroup = document.createElement('div');
  servicesGroup.className = 'filter-group';

  const servicesSelect = document.createElement('select');
  servicesSelect.id = 'services-select';
  servicesSelect.innerHTML = '<option value="All Services" selected>All Services</option>';
  servicesSelect.innerHTML += '<option value=""></option>';

  if (filterOptions.services && filterOptions.services.length > 0) {
    filterOptions.services.forEach((service) => {
      servicesSelect.innerHTML += `<option value='${service}'>${service}</option>`;
    });
  }

  servicesGroup.appendChild(servicesSelect);
  servicesSection.appendChild(servicesGroup);
  block.appendChild(servicesSection);

  // Results container
  const resultsDiv = document.createElement('div');
  resultsDiv.className = 'blog-search-results';
  block.appendChild(resultsDiv);

  // 'Show More' button
  const showMoreBtn = document.createElement('button');
  showMoreBtn.type = 'button';
  showMoreBtn.textContent = 'Show More';
  showMoreBtn.className = 'show-more-btn';
  showMoreBtn.style.display = 'none'; // Hidden until needed
  block.appendChild(showMoreBtn);

  // State variables
  let allResults = [];
  let currentQuery = '';
  let currentCategory = 'All Categories';
  let currentArchive = 'All Years';
  let currentService = 'All Services';
  let currentPage = 1;
  const pageSize = 9; // 3x3 grid for desktop

  // Perform search and update UI - defined before it's used in the event listeners
  const performSearch = async () => {
    currentQuery = searchInput.value.trim();
    currentCategory = categorySelect.value;
    currentArchive = archiveSelect.value;
    currentService = servicesSelect.value;
    currentPage = 1;

    allResults = await searchBlogs(
      currentQuery,
      currentCategory,
      currentArchive,
      currentService,
    );

    const hasMore = renderResults(
      resultsDiv,
      allResults,
      currentPage,
      pageSize,
    );
    showMoreBtn.style.display = hasMore ? '' : 'none';
  };

  // Event handlers
  searchButton.addEventListener('click', performSearch);

  // Add enter key event for search input
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  // Add change listeners to select dropdowns
  categorySelect.addEventListener('change', performSearch);
  archiveSelect.addEventListener('change', performSearch);
  servicesSelect.addEventListener('change', performSearch);

  // Show more button
  showMoreBtn.addEventListener('click', () => {
    currentPage += 1;
    const hasMore = renderResults(
      resultsDiv,
      allResults,
      currentPage,
      pageSize,
    );
    showMoreBtn.style.display = hasMore ? '' : 'none';
  });

  // Clear filters button - Now defined after performSearch function to avoid the ESLint error
  const clearFiltersDiv = document.createElement('div');
  clearFiltersDiv.className = 'clear-filters';

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.textContent = 'Clear Filters';
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    categorySelect.value = 'All Categories';
    archiveSelect.value = 'All Years';
    servicesSelect.value = 'All Services';
    performSearch();
  });

  clearFiltersDiv.appendChild(clearButton);
  block.appendChild(clearFiltersDiv);

  // Check URL parameters for pre-filling search values
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('search')) {
    searchInput.value = urlParams.get('search');
  }
  if (urlParams.has('category')) {
    const categoryValue = urlParams.get('category');
    if (categoryValue && categorySelect.querySelector(`option[value="${categoryValue}"]`)) {
      categorySelect.value = categoryValue;
    }
  }
  if (urlParams.has('archive')) {
    const archiveValue = urlParams.get('archive');
    if (archiveValue && archiveSelect.querySelector(`option[value="${archiveValue}"]`)) {
      archiveSelect.value = archiveValue;
    }
  }
  if (urlParams.has('service')) {
    const serviceValue = urlParams.get('service');
    if (serviceValue && servicesSelect.querySelector(`option[value="${serviceValue}"]`)) {
      servicesSelect.value = serviceValue;
    }
  }

  // Initial load
  performSearch();
}
