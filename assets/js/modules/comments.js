// Giscus comments functionality
export function initGiscusRefresh() {
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