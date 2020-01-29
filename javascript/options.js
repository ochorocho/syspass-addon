import '../scss/options.scss'

function isURL (str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
  return pattern.test(str)
}

function message (text, className) {
  const msg = document.createElement('div')
  const msgContainer = document.querySelector('#msg')

  msg.className = className
  msg.innerText = text
  msg.addEventListener('transitionend', function () {
    msg.remove()
  })

  msgContainer.innerText = ''
  msgContainer.append(msg)

  setTimeout(function () {
    msg.style.transition = '0.8s'
    msg.style.opacity = 0
  }, 2000)
}

function storeSettings () {
  function getUrl () {
    const url = document.querySelector('#url')
    return url.value
  }

  function getToken () {
    const token = document.querySelector('#token')
    return token.value
  }

  function getPassword () {
    const password = document.querySelector('#password')
    return password.value
  }

  function getDropdown () {
    const dropdown = document.querySelector('#dropdown')
    return dropdown.checked
  }

  const url = getUrl()
  const token = getToken()
  const password = getPassword()
  const dropdown = getDropdown()

  if (isURL(url) && token !== '' && token !== '') {
    checkApi(url, token, password, dropdown)
  } else {
    message('Oops, could not save preferences', 'error')
  }
}

function updateUI (restoredSettings) {
  const url = document.querySelector('#url')
  url.value = restoredSettings.url || ''

  const token = document.querySelector('#token')
  token.value = restoredSettings.token || ''

  const password = document.querySelector('#password')
  password.value = restoredSettings.password || ''

  const dropdown = document.querySelector('#dropdown')
  dropdown.checked = restoredSettings.dropdown === true ? true : ''
}

function onError (e) {
  console.error(e)
}

function checkApi (url, token, password, dropdown) {
  return fetch(url + '/api.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'account/search',
      params: {
        authToken: token,
        text: ''
      },
      id: 1
    })
  }).then((resp) => resp.json())
    .then(function (data) {
      browser.storage.local.set({
        url,
        token,
        password,
        dropdown
      })

      message('Preferences saved.\n SysPass connection established', 'success')
    })
    .catch(function (e) {
      message('Could not connect to sysPass', 'error')
    })
}

const gettingStoredSettings = browser.storage.local.get()
gettingStoredSettings.then(updateUI, onError)

const saveButton = document.querySelector('#save-button')
saveButton.addEventListener('click', storeSettings)
