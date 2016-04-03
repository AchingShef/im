function getRecepient(senderName) {
    "use strict";

    return document.querySelector("iframe:not([name=" + senderName + "])");
}

function sendMessage(sender) {
    "use strict";
    // Отправка сообщения

    var recepient = getRecepient(sender.name),
        win = sender.contentWindow,
        doc = win.document,
        text = doc.getElementById("message").value;

    win.postMessage(text, recepient.src);
}

function showMessage(senderName, text) {
    "use strict";
    // Отрисовка сообщения

    var recepient = getRecepient(senderName),
        doc = recepient.contentWindow.document,
        textarea = doc.getElementById("chat");

    textarea.value += text + "\r\n";
}

function setEvents(iframe) {
    "use strict";
    // Установка событий элементам фрейма

    var win = iframe.contentWindow,
        doc = win.document,
        btn = doc.getElementById("submit");

    if (win.addEventListener) {
        win.addEventListener("message", function (e) {
            showMessage(iframe.name, e.data);
        });
    } else {
        win.attachEvent("onmessage", function (e) {
            showMessage(iframe.name, e.data);
        });
    }

    btn.onclick = function (e) {
        sendMessage(iframe);
    };
}

function onLoad() {
    "use strict";
    // Получение фреймов для установки событий

    var iframes = document.getElementsByTagName("iframe"),
        len = iframes.length,
        i;

    for (i = 0; i < len; i += 1) {
        setEvents(iframes[i]);
    }
}

window.onload = function () {
    "use strict";

    onLoad();
};