function filterVideos(keywords) {
    const videoTitles = document.querySelectorAll('#video-title');
    let videosFound = false;

    videoTitles.forEach(title => {
        const textContent = title.innerText.toLowerCase();
        const hasKeyword = keywords.some(keyword => textContent.includes(keyword.toLowerCase()));
        if (hasKeyword) {
            title.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer').style.display = 'block';
            videosFound = true;
        } else {
            title.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer').style.display = 'none';
        }
    });

    if (!videosFound) {
        displayNoResultsMessage();
    } else {
        removeNoResultsMessage();
    }
}

function displayNoResultsMessage() {
    let message = document.getElementById('no-results-message');
    if (!message) {
        message = document.createElement('div');
        message.id = 'no-results-message';
        message.textContent = 'No videos match your keywords. Try different keywords.';
        message.style.color = 'red';
        message.style.padding = '10px';
        message.style.textAlign = 'center';
        document.body.appendChild(message);
    }
}

function removeNoResultsMessage() {
    const message = document.getElementById('no-results-message');
    if (message) {
        message.remove();
    }
}

chrome.storage.sync.get({keywords: []}, function(data) {
    filterVideos(data.keywords);
});

// Set up a MutationObserver to watch for new videos being loaded
const observer = new MutationObserver(() => {
    chrome.storage.sync.get({keywords: []}, function(data) {
        filterVideos(data.keywords);
    });
});

observer.observe(document.body, {childList: true, subtree: true});
