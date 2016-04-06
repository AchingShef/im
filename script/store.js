function Store() {
    "use strict";

    this.data = sessionStorage;
}

Store.prototype.setData = function (data) {
    "use strict";

    var msg = this.getData("msg");

    msg = JSON.parse(msg);

    // Проверяем, что сообщения этого псевдонима есть в хранилище

    if (!msg.hasOwnProperty(data.alias)) {
        msg[data.alias] = [];
    }

    msg[data.alias].push(data.msg);

    // Сериализация json

    msg = JSON.stringify(msg);

    // Добавляем сообщение в хранилище

    this.data.setItem("msg", msg);
};

Store.prototype.getData = function (key) {
    "use strict";

    if (!key) {
        key = "msg";
    }

    return this.data.getItem(key);
};

Store.prototype.clearStore = function () {
    "use strict";

    this.data.setItem("msg", "{}");
};

var store = new Store();