import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

const { instantsearch } = window;

// 1. Typesense adapter setup
const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'xyz', // Local test only. Production-e search-only API key use korba.
    nodes: [
      {
        host: 'localhost',
        port: 8108,
        protocol: 'http',
      },
    ],
  },

  // 2. Typesense search parameters
  additionalSearchParameters: {
    query_by: 'title,authors',
  },
});

// 3. InstantSearch-er jonno search client create
const searchClient = typesenseInstantsearchAdapter.searchClient;

// 4. InstantSearch initialize
const search = instantsearch({
  searchClient,
  indexName: 'books', // Typesense collection name
});

// 5. Search UI widgets add
search.addWidgets([
  // Search input box
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    placeholder: 'Search books...',
    showReset: true,
    showSubmit: true,
    showLoadingIndicator: true,
  }),

  // Search result list
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item(hit) {
        const authors = Array.isArray(hit.authors)
          ? hit.authors.join(', ')
          : 'Unknown Author';

        const title = hit._highlightResult?.title?.value || hit.title;

        return `
          <div class="hit">
            ${
              hit.image_url
                ? `<img src="${hit.image_url}" alt="${hit.title}" style="width: 80px; height: auto; margin-right: 12px;" />`
                : ''
            }

            <div class="hit-content">
              <h3>${title}</h3>
              <p><strong>Authors:</strong> ${authors}</p>
              <p><strong>Publication Year:</strong> ${hit.publication_year || 'N/A'}</p>
              <p><strong>Average Rating:</strong> ${hit.average_rating || 'N/A'}</p>
              <p><strong>Ratings Count:</strong> ${hit.ratings_count || 0}</p>
            </div>
          </div>
        `;
      },
    },
  }),

  // Result count / stats
  instantsearch.widgets.stats({
    container: '#stats',
    templates: {
      text(data) {
        return `${data.nbHits} results found in ${data.processingTimeMS}ms`;
      },
    },
  }),

  // Pagination
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),

  // Basic configuration
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
]);

// 6. Start search UI
search.start();