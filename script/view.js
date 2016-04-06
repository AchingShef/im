function View() {
    "use strict";

    this.iframes = $("iframe");
}

View.prototype.getRecipient = function (senderName) {
    "use strict";

    return $("iframe:not([name=" + senderName + "])")[0];
};

View.prototype.addMessage = function (senderName, text) {
    "use strict";

    var recepient = this.getRecipient(senderName),
        doc = $(recepient.contentWindow.document),
        div = doc.find("#chat");

    // добавляем абзац

    div.append("<p>" + text + "</p>");
};

View.prototype.clearTextArea = function (textarea) {
    "use strict";

    textarea.val("");
};