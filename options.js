// Получите элемент input и установите начальное значение
const openInSameTabInput = document.getElementById('openInSameTab');
chrome.storage.sync.get('openInSameTab', (data) => {
  openInSameTabInput.checked = data.openInSameTab;
});

// Сохраните значение настройки при изменении input
openInSameTabInput.addEventListener('change', () => {
  chrome.storage.sync.set({ openInSameTab: openInSameTabInput.checked });
});
