# Game Launcher

## Запуск

Для запуска, нужно открыть `client/index.html`.

## Подключение

Подключение файла модуля:

```html
<script src="./launcher/game-launcher.js"></script>
```

Добавление и указание адреса внешнего приложения:

```html
<game-launcher src="./game/index.html"></game-launcher>
```

Пример создания компонента через JavaScript:

```js
const launcher = document.createElement('game-launcher');

launcher.setAttribute('src', './game/index.html');

document.body.append(launcher);
```

## Протокол взаимодействия

Внешнее приложение сообщает о готовности:

```js
window.parent.postMessage({ type: 'GAME_READY' }, '*');
```

Внешнее приложение запрашивает закрытие:

```js
window.parent.postMessage({ type: 'GAME_CLOSE' }, '*');
```

Модуль принимает сообщения только от своего `iframe`.

## Проверка

1. Откройте основной сайт.
2. Нажмите «Запустить игру».
3. Убедитесь, что появился loader.
4. Дождитесь появления внешнего приложения.
5. Нажмите «Выйти».
6. Убедитесь, что модуль удалился, а основной сайт снова прокручивается.
7. Повторно запустите игру.
