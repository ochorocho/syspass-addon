function isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
}

function message(text, className) {
    let msg = document.createElement('div');
    let msgContainer = document.querySelector("#msg");

    msg.className = className;
    msg.innerText = text;
    msg.addEventListener("transitionend", function () {
        msg.remove();
    })

    msgContainer.innerText = '';
    msgContainer.append(msg);

    setTimeout(function () {
        msg.style.transition = '0.8s';
        msg.style.opacity = 0;
    }, 2000)
}

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

    if (isURL(url) && token !== '' && token !== '') {
        browser.storage.local.set({
            url,
            token,
            password
        });

        message('Preferences saved', 'success');
    } else {
        console.log('ööööööööö');

        message('Oops, could not save preferences', 'error');
    }
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
