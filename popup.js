document.addEventListener('DOMContentLoaded', function() {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');

    chrome.storage.sync.get(['volume'], function(result) {
        if (result.volume !== undefined) {
            volumeSlider.value = result.volume;
            volumeValue.textContent = result.volume + '%';
        }
    });

    volumeSlider.addEventListener('input', function() {
        const volume = volumeSlider.value;
        volumeValue.textContent = volume + '%';
        
        chrome.storage.sync.set({volume: volume});

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "setVolume",
                volume: volume
            });
        });
    });
}); 