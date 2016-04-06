function View() {
    "use strict";

    this.iframes = $("iframe");

    // Основные смайлы

    this.smiles = {
        sad: [/:-\(/g, /:\(/g, /=\(/g],
        cry: [/:_\(/g, /:'\(/g],
        smile: [/:-\)/g, /:\)/g, /=]/g],
        wink: [/;-\)/g, /;\)/g],
        happy: [/=\)/g, /<3/g]
    };
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
     
        var newSubStr;

	    $.each(this.smiles, function (key, smile) {
	    	$.each(smile, function (index, value) {
	    		newSubStr = '<img src="../image/smile/' + key + '.ico" width="16" height="16" alt="' + key + '">';
	    		msg = msg.replace(value, newSubStr);
	    	});
	    });

        return msg;
    }

    function checkAlias(msg) {
        // Проверка алиаса в сообщении

        var data = APP.store.getData(),
            newSubStr,
            aliases;

        aliases = Object.keys(data);

        $.each(aliases, function (key, alias) {
	    	// Если в тексте есть алиас

            if (msg.indexOf(alias) > -1) {
                // Генерация новый подстроки

                newSubStr = '<span class="alias">' + alias + "</span>";

                // Экранируем спец символы

                alias = alias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

                // Создаем регулярное выражение, чтобы заменить все значения в строке

                alias = new RegExp(alias, "g");
                msg = msg.replace(alias, newSubStr);
            }
	    });

        return msg;
    }

    msg = checkAlias.call(this, msg);
    msg = checkSmile.call(this, msg);

    return msg;
};

View.prototype.clearTextArea = function (textarea) {
    "use strict";

    textarea.val("");
};