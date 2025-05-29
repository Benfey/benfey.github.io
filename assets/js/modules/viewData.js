// View data management - handle global view data
export function initViewData(viewData = {}) {
    // Make view data available globally for compatibility
    window.viewData = viewData;
}

export function getViewData() {
    return window.viewData || {};
}