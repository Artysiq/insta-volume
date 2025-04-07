// Функция для установки громкости всех медиа элементов
function setVolume(volume) {
    const volumeLevel = volume / 100;
    
    // Находим все видео и аудио элементы
    const mediaElements = document.querySelectorAll('video, audio');
    
    mediaElements.forEach(element => {
        element.volume = volumeLevel;
    });
}

// Слушаем сообщения от popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "setVolume") {
        setVolume(request.volume);
        // Сохраняем значение в localStorage страницы
        localStorage.setItem('volumeControllerVolume', request.volume);
    }
});

// Загружаем сохраненное значение громкости при загрузке страницы
chrome.storage.sync.get(['volume'], function(result) {
    if (result.volume !== undefined) {
        setVolume(result.volume);
        // Сохраняем в localStorage страницы
        localStorage.setItem('volumeControllerVolume', result.volume);
    }
});

// Проверяем localStorage при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const savedVolume = localStorage.getItem('volumeControllerVolume');
    if (savedVolume !== null) {
        setVolume(parseInt(savedVolume));
    }
});

// Наблюдаем за добавлением новых медиа элементов
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

// Начинаем наблюдение за изменениями в DOM
observer.observe(document.body, {
    childList: true,
    subtree: true
}); 