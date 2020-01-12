function storeSettings() {

  function getUrl() {
    const url = document.querySelector("#url");
    return url.value;
  }

  function getTokenSearch() {
    const tokenSearch = document.querySelector("#token-search");
    return tokenSearch.value;
  }

  function getTokenReveal() {
    const tokenReveal = document.querySelector("#token-reveal");
    return tokenReveal.value;
  }

  const url = getUrl();
  const tokenSearch = getTokenSearch();
  const tokenReveal = getTokenReveal();
  browser.storage.local.set({
    url,
    tokenSearch,
    tokenReveal
  });
}

function updateUI(restoredSettings) {
  const url = document.querySelector("#url");
  url.value = restoredSettings.url || '';

  const tokenSearch = document.querySelector('#token-search');
  tokenSearch.value = restoredSettings.tokenSearch || '';

  const tokenReveal = document.querySelector('#token-reveal');
  tokenReveal.value = restoredSettings.tokenReveal || '';
}

function onError(e) {
  console.error(e);
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", storeSettings);
