/**
 * Fetch data from sysPass API
 *
 * @param request
 * @param body
 * @param sendResponse
 */
function fetchData (request, body, sendResponse) {
  fetch(request.settings.url + '/api.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(response => response.text())
    .then(text => JSON.parse(text))
    .then(data => sendResponse(data))
    .catch(error => function (e) {
      console.log(error)
    })
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    const body = {
      jsonrpc: '2.0',
      method: request.settings.method,
      params: {
        authToken: request.settings.token
      },
      id: 1
    }

    if (request.contentScriptQuery === 'accountSearch') {
      body.params.text = request.text

      fetchData(request, body, sendResponse)

      return true
    }
    if (request.contentScriptQuery === 'getPassword') {
      body.params.tokenPass = request.settings.password
      body.params.id = request.settings.id

      fetchData(request, body, sendResponse)

      return true
    }
  })
