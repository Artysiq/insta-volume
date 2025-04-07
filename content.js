function setVolume(volume) {
    const volumeLevel = volume / 100;
    
    const mediaElements = document.querySelectorAll('video, audio');
    
    mediaElements.forEach(element => {
        element.volume = volumeLevel;
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "setVolume") {
        setVolume(request.volume);
 
        localStorage.setItem('volumeControllerVolume', request.volume);
    }
});

chrome.storage.sync.get(['volume'], function(result) {
    if (result.volume !== undefined) {
        setVolume(result.volume);
        localStorage.setItem('volumeControllerVolume', result.volume);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const savedVolume = localStorage.getItem('volumeControllerVolume');
    if (savedVolume !== null) {
        setVolume(parseInt(savedVolume));
    }
});

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            const savedVolume = localStorage.getItem('volumeControllerVolume');
            if (savedVolume !== null) {
                setVolume(parseInt(savedVolume));
            } else {
                chrome.storage.sync.get(['volume'], function(result) {
                    if (result.volume !== undefined) {
                        setVolume(result.volume);
                    }
                });
            }
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
}); 