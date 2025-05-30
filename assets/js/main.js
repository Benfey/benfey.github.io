// Main JavaScript - imports and initializes all modules
import { initClickablePosts } from './modules/posts.js';
import { initArchiveSorting, initArchivePagination } from './modules/archive.js';
import { initGiscusRefresh } from './modules/comments.js';
import { initTagShowMore } from './modules/tags.js';
import { initViewData } from './modules/viewData.js';
import { initCodeBlocks } from './modules/codeBlocks.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize view data if available
    if (typeof window.viewData !== 'undefined') {
        initViewData(window.viewData);
    }
    
    // Make post tiles clickable
    initClickablePosts();
    
    // Initialize archive functionality if on archive page
    if (document.getElementById('sort-select')) {
        initArchiveSorting();
    }
    
    // Initialize archive pagination if available
    if (document.getElementById('prev-page')) {
        initArchivePagination();
    }
    
    // Initialize Giscus comment refresh if on post page
    if (document.querySelector('.post-comments')) {
        initGiscusRefresh();
    }
    
    // Initialize tag page show more functionality
    if (document.querySelector('.show-more-btn')) {
        initTagShowMore();
    }
    
    // Initialize code block copy functionality
    initCodeBlocks();
});

// Export functions for backward compatibility
window.initClickablePosts = initClickablePosts;