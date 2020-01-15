import autocomplete from "autocompleter/autocomplete.js";

const gettingStoredSettings = browser.storage.local.get();
let url = '', token = '', password = '', usernameField = '', passwordField = '';

/**
 * Get addon settings
 */
gettingStoredSettings.then(function (data) {
    url = data.url;
    token = data.token;
    password = data.password;

    searchAccounts().then(function (data) {
        selectLogin(data);
    });
});

/**
 * Search accounts according to given URL
 *
 * @returns {Promise<any>}
 */
function searchAccounts() {
    return apiRequest('POST', 'account/search', { "text": window.location.host })
        .then(function (data) {
            return data
        });
}

/**
 * Search for accounts based on given URL
 *
 * @param id
 * @returns {Promise<any>}
 */
function getAccount(id) {
    spinner();

    return apiRequest('POST', 'account/viewPass', { "tokenPass": password, "id": id})
        .then(function (data) {
            passwordField.value = data.result.result.password;
            document.getElementById('syspass-spinner').remove();

            return data
        });
}

/**
 * Apply autocomplete
 *
 * @param field
 * @param data
 */
function autocompleteField(field, data) {
    autocomplete({
        input: field,
        showOnFocus: true,
        fetch: function (text, update) {
            update(data);
        },
        onSelect: function (item) {
            usernameField.value = item.value;
            getAccount(item.id)
        }
    });
}

/**
 * Select login fields: username, password
 *
 * @param data
 */
function selectLogin(data) {
    setTimeout(function () {
        let list = processList(data);

        passwordField = document.querySelector('input[type=password]');
        usernameField = passwordField.closest('form').querySelectorAll('input[type="text"]')[0];

        if (usernameField !== undefined) {
            usernameField.setAttribute('autocomplete', 'off');
            autocompleteField(usernameField, list);
        }

        if (passwordField !== undefined) {
            passwordField.setAttribute('autocomplete', 'off');
            autocompleteField(passwordField, list);
        }
    }, 100);
}

/**
 * Transform results into a autocompleter readable format
 *
 * @param data
 * @returns {[]}
 */
function processList(data) {
    let list = [];
    data.result.result.forEach(function (item) {
        let login = item.login ? ` ( ${item.login} )` : '';
        list.push({label: item.name + login, value: item.login, id: item.id});
    });

    return list;
}

/**
 * Generic API Request
 *
 * @param method
 * @param apiMethod
 * @param params
 * @returns {Promise<any>}
 */
function apiRequest(method, apiMethod, params) {
    let requestParams = Object.assign({ "authToken": token }, params);

    return fetch(url + '/api.php', {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "method": apiMethod,
            "params": requestParams,
            "id": 1
        })
    }).then((resp) => resp.json()).catch(function (e) {
        console.log(e);
    });
}

function spinner() {
    let spinnerHtml = document.createElement('div');
    let pw = passwordField.getBoundingClientRect();
    let top = pw.height - ( pw.height * 0.9 );

    spinnerHtml.innerHTML = '<div id="syspass-spinner" class="syspass-spinner"></div>';
    spinnerHtml.style.cssText = "position: absolute; z-index: 1000";
    spinnerHtml.style.top = ( pw.top + top / 2 ) + "px";
    spinnerHtml.style.left = ( pw.left - pw.height + pw.width ) + "px";
    spinnerHtml.style.height = ( pw.height * 0.9 ) + "px";
    spinnerHtml.style.width = ( pw.height * 0.9 ) + "px";

    document.body.appendChild(spinnerHtml);
}
