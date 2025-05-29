// Tags page functionality - show more/less buttons
export function initTagShowMore() {
    document.querySelectorAll('.show-more-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const tag = this.dataset.tag;
            const hiddenPosts = document.getElementById('hidden-' + tag);
            
            if (!hiddenPosts) return;
            
            if (hiddenPosts.classList.contains('show')) {
                hiddenPosts.classList.remove('show');
                this.textContent = this.textContent.replace('Show fewer', 'Show');
            } else {
                hiddenPosts.classList.add('show');
                this.textContent = this.textContent.replace('Show', 'Show fewer');
            }
        });
    });
}