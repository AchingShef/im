function getRecepient(senderName) {
    "use strict";
    // Получение фрейма-получателя сообщения

    return document.querySelector("iframe:not([name=" + senderName + "])");
}

function addMsgToStorage(data) {
    "use strict";
    // Добавляем данные в sessionStorage

    var msg = sessionStorage.getItem("msg");

    msg = JSON.parse(msg);

    // Проверяем, что сообщения этого псевдонима есть в хранилище

    if (!msg.hasOwnProperty(data.alias)) {
        msg[data.alias] = [];
    }

    msg[data.alias].push(data.msg);

    // Сериализация json

    msg = JSON.stringify(msg);

    // Добавляем сообщение в sessionStorage

    sessionStorage.setItem("msg", msg);
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

        // Добавляем данные в sessionStorage

        addMsgToStorage(data);

        // Отправка сериализованных данных получателю

        win.postMessage(JSON.stringify(data), recepient.src);
    } else {
        alert("Псевдоним не может быть пустым");
    }
}

function generateMessage(msg) {
    "use strict";
    // Генерация сообщения для вставки в dom

    var store = sessionStorage.getItem("msg"),
        oldSubStr,
        newSubStr,
        aliases,
        len,
        i;

    store = JSON.parse(store);
    aliases = Object.keys(store);

    // Проверяем наличие псевдонимов в сообщении

    for (i = 0, len = aliases.length; i < len; i += 1) {
        oldSubStr = aliases[i];

        if (msg.indexOf(oldSubStr) > -1) {
            newSubStr = '<span class="alias">' + oldSubStr + "</span>";

            msg = msg.replace(oldSubStr, newSubStr);
        }
    }

    return msg;
}

function showMessage(senderName, data) {
    "use strict";
    // Отрисовка сообщения

    var recepient = getRecepient(senderName),
        doc = recepient.contentWindow.document,
        div = doc.getElementById("chat"),
        p = doc.createElement("p"),
        text;

    // Десереализация входного сообщения

    data = JSON.parse(data);

    // Генерация сообщения для вставки в dom

    text = data.alias + ": " + generateMessage(data.msg);

    // Установка значения

    p.innerHTML = text;

    // Добавление абзаца

    div.appendChild(p);
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

    sessionStorage.setItem("msg", "{}");
    onLoad();
};