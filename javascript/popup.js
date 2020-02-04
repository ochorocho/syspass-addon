import '../scss/popup.scss'

const gettingStoredSettings = browser.storage.local.get()
const currentTab = browser.tabs.query({ currentWindow: true, active: true })

/**
 * Get addon settings
 */
gettingStoredSettings.then(function (data) {
  const settingsSearch = Object.assign({ method: 'account/search' }, data)

  document.querySelector('#popup-link').addEventListener('click', function () {
    window.open(data.url, '_blank')
  })

  currentTab.then((tabs) => {
    const url = new URL(tabs[0].url)

    chrome.runtime.sendMessage({
      contentScriptQuery: 'accountSearch',
      text: url.hostname,
      settings: settingsSearch
    }, data => createList(data))
  })
})

/**
 * Transform results into a autocompleter readable format
 *
 * @param data
 * @returns {[]}
 */
function createList (data) {
  const popUpList = document.querySelector('#popup-list')
  popUpList.innerHTML = ''

  data.result.result.forEach(function (item) {
    const link = document.createElement('div')
    const login = item.login === '' ? '' : ` ( ${item.login} )`

    link.setAttribute('data-login', item.login)
    link.innerText = item.name + login
    link.className = 'popup-list__item'
    link.addEventListener('click', function (e) {
      currentTab.then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: 'fillOutForm',
          login: item.login,
          id: item.id
        })
      })
    })

    popUpList.appendChild(link)
  })
}
