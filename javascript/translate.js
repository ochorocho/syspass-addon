class Translate {
  constructor () {
    this.i18nList = document.querySelectorAll('[data-i18n]')
    this.replace()
  }

  replace () {
    this.i18nList.forEach(function (v) {
      const localeKey = v.getAttribute('data-i18n')

      if (v.value) {
        v.value = browser.i18n.getMessage(localeKey)
      } else {
        v.textContent = browser.i18n.getMessage(localeKey)
      }
    })
  }
}

export { Translate }
