// Simple client-side search implementation
let searchData = [];
let selectedIndex = -1;

// Load search data
fetch('/search.json')
    .then(response => response.json())
    .then(data => {
        searchData = data;
        console.log('Search data loaded:', data.length, 'posts');
    })
    .catch(error => {
        console.error('Failed to load search data:', error);
    });

// Ultra-simple: only title substring matching (case insensitive)
function performSearch(query) {
    if (!query || query.length < 1) {
        return [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    return searchData.filter(post => {
        const title = post.title.toLowerCase();
        return title.includes(searchTerm);
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
            <div class="search-meta">${result.tags}</div>
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