function getRecepient(senderName) {
    "use strict";
    // Получение фрейма-получателя сообщения

    return $("iframe:not([name=" + senderName + "])")[0];
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
        doc = $(win.document),
        alias = doc.find("#alias").val(),
        textarea,
        data,
        msg;

    // Если псевдоним не пустой

    if (alias) {
        textarea = doc.find("#message");
        msg = textarea.val();

        textarea.val("");

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

function checkAlias(msg) {
    "use strict";
    // Проверка алиасов в сообщении

    var store = sessionStorage.getItem("msg"),
        oldSubStr,
        newSubStr,
        aliases,
        len,
        i;

    store = JSON.parse(store);
    aliases = Object.keys(store);

    for (i = 0, len = aliases.length; i < len; i += 1) {
        oldSubStr = aliases[i];

        // Если в тексте есть алиас

        if (msg.indexOf(oldSubStr) > -1) {
            // Генерация новый подстроки

            newSubStr = '<span class="alias">' + oldSubStr + "</span>";

            // Экранируем спец символы

            oldSubStr = oldSubStr.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

            //  Создаем регулярное выражение, чтобы заменить все значения в строке

            oldSubStr = new RegExp(oldSubStr, "g");
            msg = msg.replace(oldSubStr, newSubStr);
        }
    }

    return msg;
}

function checkSmile(msg) {
    "use strict";
    // Проверка смайлов в сообщении

    // Основные смайлы

    var smiles = {
        sad: [/:-\(/g, /:\(/g, /=\(/g],
        cry: [/:_\(/g, /:'\(/g],
        smile: [/:-\)/g, /:\)/g, /=]/g],
        wink: [/;-\)/g, /;\)/g],
        happy: [/=\)/g, /<3/g]
    },
    newSubStr,
    smile,
    key,
    len,
    i;

    for (key in smiles) {
        smile = smiles[key];

        for (i = 0, len = smile.length; i < len; i += 1) {
            // Если в тексте есть смайл, то генерим картинку

            newSubStr = '<img src="../image/smile/' + key + '.ico" width="16" height="16" alt="' + key + '">';
            msg = msg.replace(smile[i], newSubStr);
        }
    }

    return msg;
}

function generateMessage(msg) {
    "use strict";
    // Генерация сообщения для вставки в dom

    // Проверки на наличие алиасов и смайлов

    msg = checkAlias(msg);
    msg = checkSmile(msg);

    return msg;
}

function showMessage(senderName, data) {
    "use strict";
    // Отрисовка сообщения

    var recepient = getRecepient(senderName),
        doc = $(recepient.contentWindow.document),
        div = doc.find("#chat"),
        text;

    // Десереализация входного сообщения

    data = JSON.parse(data);

    // Генерация сообщения для вставки в dom

    text = data.alias + ": " + generateMessage(data.msg);

    // добавляем абзац

    div.append("<p>" + text + "</p>");
}

function onKeyPress(e, iframe, textarea) {
    if (e.keyCode === 13) {
        // Если не нажат shift, то просто перенос

        if (e.shiftKey === false && textarea.val().length > 0) {
            sendMessage(iframe);
        }
    }
}

function setEvents(iframe) {
    "use strict";
    // Установка событий элементам фрейма

    var win = iframe.contentWindow,
        doc = $(win.document),
        btn = doc.find("#submit"),
        textarea = doc.find("#message");

    // Получение сообщения фреймом

    win.addEventListener("message", function (e) {
        showMessage(iframe.name, e.data);
    });

    // Клик по кнопке "отправить"

    btn.on("click", function () {
        sendMessage(iframe);
    });

    // Enter на поле сообщения

    textarea.on("keypress", function (e) {
        onKeyPress(e, iframe, textarea);
    });
}

function onLoad() {
    "use strict";
    // Получение фреймов для установки событий в каждом

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