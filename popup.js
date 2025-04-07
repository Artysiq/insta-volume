document.addEventListener('DOMContentLoaded', function() {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');

    // Загружаем сохраненное значение громкости
    chrome.storage.sync.get(['volume'], function(result) {
        if (result.volume !== undefined) {
            volumeSlider.value = result.volume;
            volumeValue.textContent = result.volume + '%';
        }
    });

    // Обработчик изменения громкости
    volumeSlider.addEventListener('input', function() {
        const volume = volumeSlider.value;
        volumeValue.textContent = volume + '%';
        
        // Сохраняем значение
        chrome.storage.sync.set({volume: volume});

        // Отправляем сообщение content script'у
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "setVolume",
                volume: volume
            });
        });
    });
}); 