// Archive page functionality - sorting and pagination
import { initClickablePosts } from './posts.js';

let currentPage = 1;
let currentSort = 'newest';
let sortedPosts = [];

export function initArchiveSorting() {
    const sortSelect = document.getElementById('sort-select');
    
    if (!sortSelect || !window.archiveData) return;
    
    // Initialize sorted posts array
    sortedPosts = [...window.archiveData.allPosts];
    
    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        applySorting();
        currentPage = 1; // Reset to first page
        renderCurrentPage();
        updatePaginationControls();
    });
}

export function initArchivePagination() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');
    
    if (!prevBtn || !nextBtn || !window.archiveData) return;
    
    // Initialize
    sortedPosts = [...window.archiveData.allPosts];
    applySorting();
    renderCurrentPage(); // Initial render
    updatePaginationControls();
    
    // Previous page
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderCurrentPage();
            updatePaginationControls();
        }
    });
    
    // Next page
    nextBtn.addEventListener('click', () => {
        if (currentPage < window.archiveData.totalPages) {
            currentPage++;
            renderCurrentPage();
            updatePaginationControls();
        }
    });
    
    // Page number clicks
    pageNumbers.addEventListener('click', (e) => {
        if (e.target.classList.contains('page-number')) {
            currentPage = parseInt(e.target.dataset.page);
            renderCurrentPage();
            updatePaginationControls();
        }
    });
}

function applySorting() {
    switch(currentSort) {
        case 'oldest':
            sortedPosts.sort((a, b) => parsePostDate(a) - parsePostDate(b));
            break;
        case 'views-high':
            sortedPosts.sort((a, b) => getPostViews(b.url) - getPostViews(a.url));
            break;
        case 'views-low':
            sortedPosts.sort((a, b) => getPostViews(a.url) - getPostViews(b.url));
            break;
        default: // newest
            sortedPosts.sort((a, b) => parsePostDate(b) - parsePostDate(a));
    }
}

function getPostViews(url) {
    return window.archiveData.viewData[url] || 0;
}

function parsePostDate(post) {
    // Use ISO date if available, fallback to formatted date
    const dateStr = post.iso_date || post.date;
    return new Date(dateStr);
}

function formatTagDisplay(tag) {
    // Replicate the tag-to-display.html logic
    const words = tag.split('-');
    const displayWords = words.map(word => {
        if (word === 'ai') return 'AI';
        if (word === 'ml') return 'ML';
        if (word === 'llm') return 'LLM';
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return displayWords.join(' ');
}

function renderCurrentPage() {
    const postsList = document.getElementById('posts-list');
    if (!postsList) return;
    
    const startIndex = (currentPage - 1) * window.archiveData.postsPerPage;
    const endIndex = startIndex + window.archiveData.postsPerPage;
    const postsToShow = sortedPosts.slice(startIndex, endIndex);
    
    // Generate HTML for posts to match Jekyll template
    const postsHTML = postsToShow.map(post => {
        const views = getPostViews(post.url);
        const viewsDisplay = views > 0 ? `<span class="view-count">${views} view${views !== 1 ? 's' : ''}</span>` : '';
        const tagsDisplay = post.tags ? `<div class="post-tags">${post.tags.split(' ').map(tag => `<a href="/tags/#${tag}" class="tag">${formatTagDisplay(tag)}</a>`).join('')}</div>` : '';
        
        return `
            <li class="post-item" data-url="${post.url}">
                <h2><a href="${post.url}">${post.title}</a></h2>
                <div class="post-meta">
                    <time datetime="${post.date}">${post.date}</time>
                    <span class="reading-time">${post.reading_time}</span>
                    ${viewsDisplay}
                    ${tagsDisplay}
                </div>
                <div class="post-excerpt">${post.excerpt}</div>
            </li>
        `;
    }).join('');
    
    postsList.innerHTML = postsHTML;
    
    // Re-initialize clickable posts
    initClickablePosts();
}

function updatePaginationControls() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');
    const statusEl = document.getElementById('pagination-status');
    
    if (!prevBtn || !nextBtn) return;
    
    // Update button states
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === window.archiveData.totalPages;
    
    // Update page numbers
    if (pageNumbers) {
        const buttons = pageNumbers.querySelectorAll('.page-number');
        buttons.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.page) === currentPage);
        });
    }
    
    // Update status
    if (statusEl) {
        const startPost = (currentPage - 1) * window.archiveData.postsPerPage + 1;
        const endPost = Math.min(currentPage * window.archiveData.postsPerPage, window.archiveData.totalPosts);
        statusEl.textContent = `Showing ${startPost}-${endPost} of ${window.archiveData.totalPosts} posts`;
    }
}

// Legacy export for backward compatibility
export function initArchiveLoadMore() {
    // This function is no longer needed with pagination
    // but kept for backward compatibility
}