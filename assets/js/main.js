// Main JavaScript - imports and initializes all modules
import { initClickablePosts } from './modules/posts.js';
import { initArchiveSorting, initArchiveLoadMore } from './modules/archive.js';
import { initGiscusRefresh } from './modules/comments.js';
import { initTagShowMore } from './modules/tags.js';
import { initViewData } from './modules/viewData.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize view data if available
    if (typeof window.viewData !== 'undefined') {
        initViewData(window.viewData);
    }
    
    // Make post tiles clickable
    initClickablePosts();
    
    // Initialize archive sorting if on archive page
    if (document.getElementById('sort-select')) {
        initArchiveSorting();
    }
    
    // Initialize archive load more if available
    if (document.getElementById('load-more-btn')) {
        initArchiveLoadMore();
    }
    
    // Initialize Giscus comment refresh if on post page
    if (document.querySelector('.post-comments')) {
        initGiscusRefresh();
    }
    
    // Initialize tag page show more functionality
    if (document.querySelector('.show-more-btn')) {
        initTagShowMore();
    }
});

// Export functions for backward compatibility
window.initClickablePosts = initClickablePosts;