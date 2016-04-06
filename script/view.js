function View() {
    "use strict";

    this.iframes = $("iframe");
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
        msg = this.generateMessage(data.msg);

    // добавляем абзац

    div.append("<p>" + data.alias + ": " + msg + "</p>");
};

View.prototype.generateMessage = function (msg) {
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

        aliases = Object.keys(data);

        for (i = 0, len = aliases.length; i < len; i += 1) {
            oldSubStr = aliases[i];

            // Если в тексте есть алиас

            if (msg.indexOf(oldSubStr) > -1) {
                // Генерация новый подстроки

                newSubStr = '<span class="alias">' + oldSubStr + "</span>";

                // Экранируем спец символы

                oldSubStr = oldSubStr.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

                // Создаем регулярное выражение, чтобы заменить все значения в строке

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

View.prototype.clearTextArea = function (textarea) {
    "use strict";

    textarea.val("");
};