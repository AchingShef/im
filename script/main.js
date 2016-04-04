function getRecepient(senderName) {
    "use strict";
    // Получение фрейма-получателя сообщения

    return document.querySelector("iframe:not([name=" + senderName + "])");
}

function sendMessage(sender) {
    "use strict";
    // Отправка сообщения

    var recepient = getRecepient(sender.name),
        win = sender.contentWindow,
        doc = win.document,
        alias = doc.getElementById("alias").value,
        textarea,
        data,
        msg;

    // Если псевдоним не пустой

    if (alias) {
        textarea = doc.getElementById("message");
        msg = textarea.value;
        textarea.value = "";
        data = {
            alias: alias,
            msg: msg
        };

        // Отправка сериализованных данных получателю

        win.postMessage(JSON.stringify(data), recepient.src);
    } else {
        alert("Псевдоним не может быть пустым");
    }
}

function showMessage(senderName, data) {
    "use strict";
    // Отрисовка сообщения

    var recepient = getRecepient(senderName),
        doc = recepient.contentWindow.document,
        textarea = doc.getElementById("chat"),
        text;

    // Десереализация сообщения

    data = JSON.parse(data);

    // Установка значения

    text = data.alias + ": " + data.msg + "\r\n";

    textarea.value += text;
}

function setEvents(iframe) {
    "use strict";
    // Установка событий элементам фрейма

    var win = iframe.contentWindow,
        doc = win.document,
        btn = doc.getElementById("submit"),
        textarea = doc.getElementById("message");

    // Получение сообщения фреймом

    if (win.addEventListener) {
        win.addEventListener("message", function (e) {
            showMessage(iframe.name, e.data);
        });
    } else {
        win.attachEvent("onmessage", function (e) {
            showMessage(iframe.name, e.data);
        });
    }

    // Клик по кнопке "отправить"

    btn.onclick = function (e) {
        sendMessage(iframe);
    };

    // Enter на поле сообщения

    textarea.onkeydown = function (e) {
        var evt = e || window.event,
            key = evt.charCode || evt.keyCode;

        if (key === 13) {
            // Если не нажат shift, то просто перенос

            if (evt.shiftKey === false) {
                sendMessage(iframe);
            }
        }
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