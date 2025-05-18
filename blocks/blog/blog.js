import ffetch from '../../scripts/ffetch.js';

const INDEX_URL = '/query-index.json';

// Card generator: title links to post.url if available
function createCard(post) {
  const title = post.url
    ? `<a href="${post.url}" class="blog-card-link" target="_blank">${post.title}</a>`
    : post.title;
  return `
    <div class="blog-card">
      <img src="${post.image}" alt="${post.title}" class="blog-card-image">
      <div class="blog-card-content">
        <span class="blog-card-tag">${post.tag || ''}</span>
        <h2 class="blog-card-title">${title}</h2>
        <p class="blog-card-desc">${post.description}</p>
        <span class="blog-card-date">${(post.lastModified || '').slice(0,10)}</span>
      </div>
    </div>
  `;
}

function renderResults(container, results, page, pageSize) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  container.innerHTML = results.slice(0, end).map(createCard).join('');
  return results.length > end;
}

async function searchBlogs(query) {
  let list = await ffetch(INDEX_URL).all();
  if (query) {
    list = list.filter((post) =>
      (post.title || '').toLowerCase().includes(query.toLowerCase()) ||
      (post.description || '').toLowerCase().includes(query.toLowerCase())
    );
  }
  // Sort by lastModified descending
  list = list.sort((a, b) =>
    (b.lastModified || '').localeCompare(a.lastModified || '')
  );
  return list;
}

export default async function decorate(block) {
  block.innerHTML = '';

  // Heading
  const heading = document.createElement('h1');
  heading.textContent = 'Blog';

  // Search form
  const form = document.createElement('form');
  form.className = 'blog-search-form';

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'search';
  input.placeholder = 'Search';
  input.setAttribute('aria-label', 'Search blog posts');

  form.appendChild(input);

  // Results container
  const resultsDiv = document.createElement('div');
  resultsDiv.className = 'blog-search-results';

  // "Show More" button
  const showMoreBtn = document.createElement('button');
  showMoreBtn.type = 'button';
  showMoreBtn.textContent = 'Show More';
  showMoreBtn.className = 'show-more-btn';
  showMoreBtn.style.display = 'none'; // Hidden until needed

  block.appendChild(heading);
  block.appendChild(form);
  block.appendChild(resultsDiv);
  block.appendChild(showMoreBtn);

  // State variables
  let allResults = [];
  let currentQuery = '';
  let currentPage = 1;
  const pageSize = 12;

  // Render function
  const showPage = () => {
    const hasMore = renderResults(resultsDiv, allResults, currentPage, pageSize);
    showMoreBtn.style.display = hasMore ? '' : 'none';
  };

  // Initial results
  allResults = await searchBlogs('');
  showPage();

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    currentQuery = input.value.trim();
    allResults = await searchBlogs(currentQuery);
    currentPage = 1;
    showPage();
  });

  // Debounced search
  let timeout;
  input.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      currentQuery = input.value.trim();
      allResults = await searchBlogs(currentQuery);
      currentPage = 1;
      showPage();
    }, 250);
  });

  // Show more button
  showMoreBtn.addEventListener('click', () => {
    currentPage += 1;
    showPage();
  });
}