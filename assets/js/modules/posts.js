// Post functionality - clickable posts and view data
export function initClickablePosts() {
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

export function getPostViews(postElement) {
    const url = postElement.querySelector('h2 a').getAttribute('href');
    return window.viewData[url] || 0;
}