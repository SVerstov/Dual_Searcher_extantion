// Функция для перенаправления на другой поисковик
function redirectToSearchEngine(url, query, searchEngine, openInSameTab) {
  const searchUrl = searchEngine === 'google'
    ? `https://www.google.com/search?q=${query}`
    : `https://yandex.ru/search/?text=${query}`;

  if (openInSameTab) {
    browser.tabs.update({ url: searchUrl });
  } else {
    browser.tabs.create({ url: searchUrl });
  }
}

// Функция, вызываемая при нажатии на иконку расширения
function handleButtonClick(tab) {
  const url = new URL(tab.url);

  if (url.hostname === 'www.google.com' || url.hostname === 'yandex.ru') {
    const queryParam = url.hostname === 'www.google.com' ? 'q' : 'text';
    const query = url.searchParams.get(queryParam);

    browser.storage.sync.get({ openInSameTab: true }).then((data) => {
      const searchEngine = url.hostname === 'www.google.com' ? 'yandex' : 'google';
      redirectToSearchEngine(url, query, searchEngine, data.openInSameTab);
    });
  }
}

// Функция для изменения иконки расширения
function updateIcon(tabId, changeInfo, tab) {
  const url = new URL(tab.url);
  const iconName = (url.hostname === 'www.google.com' || url.hostname === 'yandex.ru') ? 'icon.png' : 'icon-inactive.png';
  browser.browserAction.setIcon({ path: iconName, tabId: tab.id });
}

// Загрузите текущие настройки и установите значение по умолчанию для openInSameTab
browser.storage.sync.get({ openInSameTab: true }).then((data) => {
  if (data.openInSameTab === undefined) {
    browser.storage.sync.set({ openInSameTab: true });
  }
});

// Добавьте обработчики событий
browser.browserAction.onClicked.addListener(handleButtonClick);
browser.tabs.onUpdated.addListener(updateIcon);
