function storeSettings() {

  function getUrl() {
    const url = document.querySelector("#url");
    return url.value;
  }

  function getToken() {
    const token = document.querySelector("#token");
    return token.value;
  }

  function getPassword() {
    const password = document.querySelector("#password");
    return password.value;
  }

  const url = getUrl();
  const token = getToken();
  const password = getPassword();
  browser.storage.local.set({
    url,
    token,
    password
  });
}

function updateUI(restoredSettings) {
  const url = document.querySelector("#url");
  url.value = restoredSettings.url || '';

  const token = document.querySelector('#token');
  token.value = restoredSettings.token || '';

  const password = document.querySelector('#password');
  password.value = restoredSettings.password || '';
}

function onError(e) {
  console.error(e);
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", storeSettings);
