# Десктопное приложение GOLOS

Представляет собой десктопную версию [Golos Blogs](https://github.com/golos-blockchain/ui-blogs), [Golos Wallet](https://github.com/golos-blockchain/ui-wallet) и [Golos Messenger](https://github.com/golos-blockchain/ui-messenger).

Работает на Windows и Linux.

```js
git clone https://github.com/golos-blockchain/desktop
```

### Сборка приложения

Сборка должна осуществляться на каждой ОС в отдельности, то есть на Windows можно собрать GOLOS Desktop для Windows, а на Linux - для Linux.

1. Установите Node.js 20 ([Windows](https://nodejs.org/dist/v20.19.4/node-v20.19.4-x64.msi), [Linux](https://github.com/nodesource/distributions/blob/master/README.md)). В случае Windows тщательно проследите, нет ли в установщике флажка "Добавить Node.js в переменную PATH", и если он есть, то отметьте его.

2. Скачайте репозиторий с помощью git clone (команда есть выше).

3. Выполните команду:
```sh
node prepare
```
Это скачает исходный код Blogs, Wallet и Messenger, а также файл настроек.

4. Все **настройки** десктопного клиента находятся в файле `desktop/ui-blogs/config/desktop.json`. Проверьте правильность следующих настроек:

- hide_comment_neg_rep
- site_domain (пример: golos.id то есть основной домен блогов)
- another_domains (альтернативные домены Блогов, чтобы можно было вставить ссылку с Блогов и она открылась в десктопном клиенте)
- ws_connection_app (список нод)
- images
- wallet_service (app://wallet.golos.id - чтобы использовался встроенный Кошелек)
- auth_service
- notify_service
- messenger_service (app://chat.golos.app - чтобы использовался встроенный Мессенджер)
- elastic_search
- apidex_service
- hidden_assets
- app_updater
- forums

5. Теперь можно собрать приложение и запустить его в тестовом режиме командой:

```sh
node dev
```

6. Или собрать дистрибутивы приложения:

```sh
node pack
```

Собранные дистрибутивы будут лежать в папке `dist`.

Для Windows будет собран инсталлятор NSIS. Установка максимально проста. Пользователь запускает инсталлятор и он сразу устанавливает клиент и все его зависимости, создает все нужные ярлыки и запускает клиент.

В случае Linux будет собран пакет deb (установить можно также в 1 клик с помощью `dpkg -i golos-desktop-1.0.0.deb`).

### Дополнительно

Команда `node pack` при каждом запуске позволяют учесть изменения, внесенные вами в файл конфигурации (default.json), или же в файлы, находящиеся в папке `tool/electron`. Однако сам код Блогов, Мессенджера и Кошелька эти команды собирают только один раз, но не при изменениях.

Поэтому если вы внесли изменения, например, в Блоги, то вы можете применить их командой
```sh
node pack blogs
```

Или, если вы внесли изменения и в Кошелек и в Блоги, то вы можете выполнить следующие команды:
```sh
node build wallet
node pack blogs
```
Первая команда собирает изменения в Кошельке, вторая - собирает изменения в Блогах и упаковывает все вместе в дистрибутив.

Также, помимо `blogs` и `wallet`, возможен вызов этих команд с аргументом `msgs`, что означает Мессенджер.
