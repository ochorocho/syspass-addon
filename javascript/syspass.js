import '../scss/syspass.scss'
import autocomplete from 'autocompleter/autocomplete.js'

const gettingStoredSettings = browser.storage.local.get()
let settings
let usernameField = ''
let passwordField = ''

/**
 * Get addon settings
 */
gettingStoredSettings.then(function (data) {
  const settingsSearch = Object.assign({ method: 'account/search' }, data)
  const port = window.location.port !== '' ? ':' + window.location.port : ''
  const text = window.location.host + port + window.location.pathname
  settings = data

  chrome.runtime.sendMessage({
    contentScriptQuery: 'accountSearch',
    text: text,
    settings: settingsSearch
  }, data => selectLogin(data))
})

browser.runtime.onMessage.addListener(request => {
  if (request.command === 'fillOutForm') {
    if (typeof (usernameField) !== 'undefined' && usernameField != null) {
      usernameField.setAttribute('value', `${request.login}`)
      usernameField.dispatchEvent(new Event('change', { bubbles: true }))
      usernameField.dispatchEvent(new Event('blur', { bubbles: true }))
    }

    if (typeof (passwordField) !== 'undefined' && passwordField != null) {
      spinner()
      const settingsPassword = Object.assign({ method: 'account/viewPass', id: request.id }, settings)
      chrome.runtime.sendMessage({ contentScriptQuery: 'getPassword', settings: settingsPassword }, data => {
        passwordField.setAttribute('value', data.result.result.password)
        passwordField.dispatchEvent(new Event('change', { bubbles: true }))
        passwordField.dispatchEvent(new Event('blur', { bubbles: true }))
        document.getElementById('syspass-spinner').remove()
      })
    }
  }
})

/**
 * Apply autocomplete
 * @param field
 * @param data
 * @returns {*|AutocompleteResult}
 */
function autocompleteField (field, data) {
  autocomplete({
    input: field,
    showOnFocus: true,
    className: 'syspass-autocomplete',
    disableAutoSelect: true,
    fetch: function (text, update) {
      const suggestions = data.filter(n => n.label.toLowerCase().startsWith(text.toLowerCase()))
      update(suggestions)
    },
    onSelect: function (item) {
      if (typeof (usernameField) !== 'undefined' && usernameField != null) {
        usernameField.setAttribute('value', item.value)
        usernameField.dispatchEvent(new Event('change', { bubbles: true }))
        usernameField.dispatchEvent(new Event('blur', { bubbles: true }))
      }

      if (typeof (passwordField) !== 'undefined' && passwordField != null) {
        spinner()
        const settingsPassword = Object.assign({ method: 'account/viewPass', id: item.id }, settings)
        chrome.runtime.sendMessage({ contentScriptQuery: 'getPassword', settings: settingsPassword }, data => {
          passwordField.setAttribute('value', data.result.result.password)
          passwordField.dispatchEvent(new Event('change', { bubbles: true }))
          passwordField.dispatchEvent(new Event('blur', { bubbles: true }))
          document.getElementById('syspass-spinner').remove()
        })
      }
    }
  })

  return autocomplete
}

/**
 * Select login fields: username, password
 *
 * @param data
 */
function selectLogin (data) {
  setTimeout(function () {
    const list = processList(data)

    passwordField = document.querySelector('input[type=password]')
    usernameField = (typeof (passwordField) !== 'undefined' && passwordField !== null) ? passwordField.closest('form').querySelectorAll('input[type="text"], input[type="email"]')[0] : null

    if (typeof (usernameField) === 'undefined' && usernameField === null) {
      usernameField = document.querySelector('input[type=email]')
    }

    if (settings.dropdown !== true) {
      if (typeof (usernameField) !== 'undefined' && usernameField != null) {
        usernameField.setAttribute('autocomplete', 'off')
        autocompleteField(usernameField, list)
      }

      if (typeof (passwordField) !== 'undefined' && passwordField != null) {
        passwordField.setAttribute('autocomplete', 'off')
        autocompleteField(passwordField, list)
      }
    }
  }, 100)
}

/**
 * Transform results into a autocompleter readable format
 *
 * @param data
 * @returns {[]}
 */
function processList (data) {
  const list = []
  data.result.result.forEach(function (item) {
    const login = item.login ? ` ( ${item.login} )` : ''
    list.push({ label: item.name + login, value: item.login, id: item.id })
  })

  return list
}

/**
 * Loading indicator
 */
function spinner () {
  const spinnerHtml = document.createElement('div')
  const pw = passwordField.getBoundingClientRect()
  const top = pw.height - (pw.height * 0.9)

  spinnerHtml.innerHTML = '<div id="syspass-spinner" class="syspass-spinner"></div>'
  spinnerHtml.style.cssText = 'position: absolute; z-index: 1000'
  spinnerHtml.style.top = (pw.top + top / 2) + 'px'
  spinnerHtml.style.left = (pw.left - pw.height + pw.width) + 'px'
  spinnerHtml.style.height = (pw.height * 0.9) + 'px'
  spinnerHtml.style.width = (pw.height * 0.9) + 'px'

  document.body.appendChild(spinnerHtml)
}
