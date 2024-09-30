document.getElementById('addKeyword').addEventListener('click', function() {
    const keyword = document.getElementById('keyword').value.trim();
    const message = document.getElementById('message');
    
    if (keyword) {
        chrome.storage.sync.get({keywords: []}, function(data) {
            const updatedKeywords = [...data.keywords, keyword];
            chrome.storage.sync.set({keywords: updatedKeywords}, function() {
                updateKeywordList(updatedKeywords);
                message.textContent = `"${keyword}" added.`;
                setTimeout(() => message.textContent = '', 2000); // Clear message after 2 seconds
            });
        });
        document.getElementById('keyword').value = '';
    }
});

function updateKeywordList(keywords) {
    const keywordList = document.getElementById('keywordList');
    keywordList.innerHTML = '';
    keywords.forEach((keyword, index) => {
        const li = document.createElement('li');
        li.className = 'keyword-item';
        li.textContent = keyword;

        const removeButton = document.createElement('span');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-btn';
        removeButton.addEventListener('click', function() {
            removeKeyword(index);
        });

        li.appendChild(removeButton);
        keywordList.appendChild(li);
    });
}

function removeKeyword(index) {
    chrome.storage.sync.get({keywords: []}, function(data) {
        const removedKeyword = data.keywords[index];
        const updatedKeywords = data.keywords.filter((_, i) => i !== index);
        chrome.storage.sync.set({keywords: updatedKeywords}, function() {
            updateKeywordList(updatedKeywords);
            const message = document.getElementById('message');
            message.textContent = `"${removedKeyword}" removed.`;
            setTimeout(() => message.textContent = '', 2000); // Clear message after 2 seconds
        });
    });
}

chrome.storage.sync.get({keywords: []}, function(data) {
    updateKeywordList(data.keywords);
});
