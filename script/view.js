function View() {
    "use strict";

    var scope = this;

    function onKeyPress(e, iframe, textarea) {
        if (e.keyCode === 13) {
        // Если не нажат shift, то просто перенос

            if (e.shiftKey === false && textarea.val().length > 0) {
                APP.controller.sendMessage(iframe);
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
            scope.addMessage(iframe.name, e.data);
        });

        // Клик по кнопке "отправить"

        btn.on("click", function () {
            APP.controller.sendMessage(iframe);
        });

    // Enter на поле сообщения

        textarea.on("keypress", function (e) {
            onKeyPress(e, iframe, textarea);
        });
    }

    this.iframes = $("iframe");

    $.each(this.iframes, function (index, value) {
        setEvents(value);
    });
}

View.prototype.getRecipient = function (senderName) {
    "use strict";

    return $("iframe:not([name=" + senderName + "])")[0];
};

View.prototype.addMessage = function (senderName, data) {
    "use strict";

    var recepient = this.getRecipient(senderName),
        doc = $(recepient.contentWindow.document),
        div = doc.find("#chat"),
        text;

    // Десереализация входного сообщения

    data = JSON.parse(data);

    // Генерация сообщения для вставки в dom

    text = data.alias + ": " + APP.controller.generateMessage(data.msg);

    // добавляем абзац

    div.append("<p>" + text + "</p>");
};