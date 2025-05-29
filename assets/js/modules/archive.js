// Archive page functionality - sorting and load more
import { getPostViews, initClickablePosts } from './posts.js';

export function initArchiveSorting() {
    const sortSelect = document.getElementById('sort-select');
    const postsList = document.getElementById('posts-list');
    
    if (!sortSelect || !postsList) return;
    
    // Store original posts for sorting
    const posts = Array.from(postsList.children);
    
    sortSelect.addEventListener('change', function() {
        const sortType = this.value;
        let sortedPosts = [...posts];
        
        switch(sortType) {
            case 'oldest':
                sortedPosts.reverse();
                break;
            case 'views-high':
                sortedPosts.sort((a, b) => getPostViews(b) - getPostViews(a));
                break;
            case 'views-low':
                sortedPosts.sort((a, b) => getPostViews(a) - getPostViews(b));
                break;
            default: // newest
                // Already in newest order
        }
        
        // Clear and repopulate list
        postsList.innerHTML = '';
        sortedPosts.forEach(post => postsList.appendChild(post));
        
        // Re-initialize clickable posts for the newly sorted items
        initClickablePosts();
    });
}

export function initArchiveLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const hiddenPosts = document.getElementById('hidden-posts');
    
    if (!loadMoreBtn || !hiddenPosts) return;
    
    loadMoreBtn.addEventListener('click', function() {
        hiddenPosts.style.display = 'block';
        loadMoreBtn.style.display = 'none';
        
        // Re-initialize clickable posts for newly shown items
        initClickablePosts();
    });
}