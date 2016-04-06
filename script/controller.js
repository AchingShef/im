function Controller() {
    "use strict";

    var scope = this;

    function onKeyPress(e, iframe, textarea) {
        if (e.keyCode === 13) {
        // Если не нажат shift, то просто перенос

            if (e.shiftKey === false && textarea.val().length > 0) {
                scope.sendMessage(iframe);
            }
        }
    }

    function setEvents(iframe) {
        // Установка событий элементам фрейма

        var win = iframe.contentWindow,
            doc = $(win.document),
            btn = doc.find("#submit"),
            textarea = doc.find("#message");

        // Получение сообщения фреймом

        win.addEventListener("message", function (e) {
            // Десереализация входного сообщения

            var data = JSON.parse(e.data),

                // Генерация сообщения для вставки в dom

                text = data.alias + ": " + scope.generateMessage(data.msg);

            APP.view.addMessage(iframe.name, text);
        });

        // Клик по кнопке "отправить"

        btn.on("click", function () {
            scope.sendMessage(iframe);
        });

    // Enter на поле сообщения

        textarea.on("keypress", function (e) {
            onKeyPress(e, iframe, textarea);
        });
    }

    APP.view.iframes.each(function (index, value) {
        setEvents.call(scope, value);
    });
}

Controller.prototype.sendMessage = function (sender) {
    "use strict";
    // Отправка сообщения

    var recipient = APP.view.getRecipient(sender.name),
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

        // Добавляем данные в хранилище

        APP.store.setData(data);

        // Отправка сериализованных данных получателю

        win.postMessage(JSON.stringify(data), recipient.src);
    } else {
        alert("Псевдоним не может быть пустым");
    }
};

Controller.prototype.generateMessage = function (msg) {
    "use strict";

    function checkSmile(msg) {
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

    function checkAlias(msg) {
        // Проверка алиаса в сообщении

        var data = APP.store.getData(),
            oldSubStr,
            newSubStr,
            aliases,
            len,
            i;

        data = JSON.parse(data);
        aliases = Object.keys(data);

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

    msg = checkAlias(msg);
    msg = checkSmile(msg);

    return msg;
};