// Instant search with pre-built lunr index
let searchIndex = null;
let searchData = [];
let selectedIndex = -1;

// Load pre-built search index
fetch('/_data/search/search-lunr-index.json')
    .then(response => response.json())
    .then(data => {
        searchData = data.posts;
        
        // Load pre-built lunr index - instant!
        searchIndex = lunr.Index.load(JSON.parse(data.index));
        
        console.log('Pre-built search index loaded for', searchData.length, 'posts');
        console.log('Generated:', data.generated);
    })
    .catch(error => {
        console.error('Failed to load pre-built search index, falling back to runtime build:', error);
        // Fallback to old method if pre-built index fails
        fallbackToRuntimeIndex();
    });

// Fallback to building index at runtime if pre-built fails
function fallbackToRuntimeIndex() {
    fetch('/_data/search/search-index.json')
        .then(response => response.json())
        .then(data => {
            searchData = data.posts;
            
            searchIndex = lunr(function () {
                this.ref('id');
                this.field('title', { boost: 10 });
                this.field('tags', { boost: 5 });
                
                searchData.forEach(function (post) {
                    this.add(post);
                }, this);
            });
            
            console.log('Fallback: Search index built at runtime for', searchData.length, 'posts');
        })
        .catch(error => {
            console.error('Failed to load search data:', error);
        });
}

// Perform search using lunr index
function performSearch(query) {
    if (!query || query.length < 2 || !searchIndex) {
        return [];
    }
    
    try {
        // Use lunr's search with wildcards for partial matching
        const searchQuery = query.trim().split(' ').map(term => `${term}*`).join(' ');
        const results = searchIndex.search(searchQuery);
        
        // Map lunr results back to post data
        return results.slice(0, 8).map(result => {
            const post = searchData[result.ref];
            return {
                ...post,
                score: result.score
            };
        });
    } catch (error) {
        // Fallback to simple search if lunr query fails
        return simpleSearch(query);
    }
}

// Fallback simple search
function simpleSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    return searchData.filter(post => {
        const title = post.title.toLowerCase();
        const tags = post.tags.toLowerCase();
        return title.includes(searchTerm) || tags.includes(searchTerm);
    }).slice(0, 8);
}

// Display search results
function displayResults(results, query) {
    const resultsContainer = document.getElementById('search-results');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
        return;
    }
    
    const resultsHTML = results.map(result => `
        <div class="search-result" data-url="${result.url}">
            <div class="search-title">${result.title}</div>
            <div class="search-meta">${result.date}${result.tags ? ' • ' + result.tags : ''}</div>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = resultsHTML;
}

// Initialize search when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    
    if (!searchInput || !resultsContainer) {
        console.error('Search elements not found');
        return;
    }
    
    // Handle search input
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        selectedIndex = -1;
        
        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }
        
        const results = performSearch(query);
        displayResults(results, query);
    });
    
    // Handle keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        const results = resultsContainer.querySelectorAll('.search-result');
        
        switch(e.key) {
            case 'Escape':
                this.value = '';
                resultsContainer.innerHTML = '';
                selectedIndex = -1;
                this.blur();
                break;
            
            case 'ArrowDown':
                e.preventDefault();
                if (results.length > 0) {
                    selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
                    updateSelection(results);
                }
                break;
            
            case 'ArrowUp':
                e.preventDefault();
                if (results.length > 0) {
                    selectedIndex = Math.max(selectedIndex - 1, -1);
                    updateSelection(results);
                }
                break;
            
            case 'Enter':
                if (selectedIndex >= 0 && results[selectedIndex]) {
                    e.preventDefault();
                    const url = results[selectedIndex].dataset.url;
                    if (url) {
                        window.location.href = url;
                    }
                }
                break;
        }
    });
    
    // Handle result clicks - make entire box clickable
    resultsContainer.addEventListener('click', function(e) {
        const searchResult = e.target.closest('.search-result');
        if (searchResult) {
            const url = searchResult.dataset.url;
            if (url) {
                searchInput.value = '';
                resultsContainer.innerHTML = '';
                selectedIndex = -1;
                window.location.href = url;
            }
        }
    });
    
    // Clear results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.innerHTML = '';
            selectedIndex = -1;
        }
    });
});

// Update visual selection for keyboard navigation
function updateSelection(results) {
    results.forEach((result, index) => {
        if (index === selectedIndex) {
            result.classList.add('search-result-selected');
        } else {
            result.classList.remove('search-result-selected');
        }
    });
}