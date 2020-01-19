import autocomplete from "autocompleter/autocomplete.js";

const gettingStoredSettings = browser.storage.local.get();
let settings, usernameField = '', passwordField = '';

/**
 * Get addon settings
 */
gettingStoredSettings.then(function (data) {
    let settingsSearch = Object.assign({ "method": 'account/search' }, data);
    settings = data;
    chrome.runtime.sendMessage({contentScriptQuery: "accountSearch", text: window.location.host, settings: settingsSearch}, data => selectLogin(data));
});

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
            spinner();
            let settingsPassword = Object.assign({ "method": 'account/viewPass', id: item.id }, settings);
            chrome.runtime.sendMessage({contentScriptQuery: "getPassword", settings: settingsPassword}, data => {
                passwordField.value = data.result.result.password
                document.getElementById('syspass-spinner').remove();
            });
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
 * Loading indicator
 */
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
