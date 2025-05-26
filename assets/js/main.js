// Main JavaScript functionality for the blog

document.addEventListener('DOMContentLoaded', function() {
    // Make post tiles clickable
    initClickablePosts();
    
    // Initialize archive sorting if on archive page
    if (document.getElementById('sort-select')) {
        initArchiveSorting();
    }
    
    // Initialize Giscus comment refresh if on post page
    if (document.querySelector('.post-comments')) {
        initGiscusRefresh();
    }
});

function initClickablePosts() {
    document.querySelectorAll('.post-item').forEach(function(item) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function(e) {
            // Don't trigger click if user clicked on a tag
            if (e.target.classList.contains('tag') || e.target.closest('.tag')) {
                return;
            }
            const titleLink = item.querySelector('h2 a');
            if (titleLink) {
                window.location.href = titleLink.href;
            }
        });
    });
}

function initArchiveSorting() {
    const sortSelect = document.getElementById('sort-select');
    const postsList = document.getElementById('posts-list');
    const viewData = window.viewData || {};
    
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
                sortedPosts.sort((a, b) => {
                    const urlA = a.querySelector('h2 a').getAttribute('href');
                    const urlB = b.querySelector('h2 a').getAttribute('href');
                    const viewsA = viewData[urlA] || 0;
                    const viewsB = viewData[urlB] || 0;
                    return viewsB - viewsA;
                });
                break;
            case 'views-low':
                sortedPosts.sort((a, b) => {
                    const urlA = a.querySelector('h2 a').getAttribute('href');
                    const urlB = b.querySelector('h2 a').getAttribute('href');
                    const viewsA = viewData[urlA] || 0;
                    const viewsB = viewData[urlB] || 0;
                    return viewsA - viewsB;
                });
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

function initGiscusRefresh() {
    function refreshGiscus() {
        const iframe = document.querySelector('iframe.giscus-frame');
        if (iframe) {
            iframe.contentWindow.location.reload();
        }
    }

    window.addEventListener('message', function (event) {
        if (event.origin !== 'https://giscus.app') return;
        
        const { data } = event;
        if (data && data.giscus && data.giscus.discussion) {
            // Comment was posted, refresh after a short delay
            setTimeout(refreshGiscus, 2000);
        }
    });
}