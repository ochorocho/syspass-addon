import "../scss/popup.scss"

const gettingStoredSettings = browser.storage.local.get();
let settings;
const currentTab = browser.tabs.query({currentWindow: true, active: true})

/**
 * Get addon settings
 */
gettingStoredSettings.then(function (data) {
  let settingsSearch = Object.assign({ "method": 'account/search' }, data);
  settings = data;

  currentTab.then((tabs) => {
        let url = new URL(tabs[0].url);
        chrome.runtime.sendMessage({contentScriptQuery: "accountSearch", text: url.hostname, settings: settingsSearch}, data => createList(data));
      });
});



/**
 * Transform results into a autocompleter readable format
 *
 * @param data
 * @returns {[]}
 */
function createList(data) {
  let popUpList = document.querySelector("#popup-list");
  popUpList.innerHTML = '';

  data.result.result.forEach(function (item) {
    let link = document.createElement('div');
    link.setAttribute('data-login', item.login);
    link.innerText = item.name;
    link.className = "popup-list__item";
    link.addEventListener('click', function (e) {
      currentTab.then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "fillOutForm",
          login: item.login,
          id: item.id,
        });
      });
    })

    popUpList.appendChild(link);
  });
}
