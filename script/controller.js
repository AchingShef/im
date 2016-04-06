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

            var data = JSON.parse(e.data);

            APP.view.addMessage(iframe.name, data);
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

        APP.view.clearTextArea(textarea);

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