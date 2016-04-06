function Store() {
    "use strict";

    this.data = sessionStorage;

    this.clearStore();
}

Store.prototype.setData = function (data) {
    "use strict";

    var msg = this.getData();

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

Store.prototype.getData = function () {
    "use strict";

    return JSON.parse(this.data.getItem("msg"));
};

Store.prototype.clearStore = function () {
    "use strict";

    this.data.setItem("msg", "{}");
};