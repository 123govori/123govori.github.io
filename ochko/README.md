# Meta × Kylie Jenner Glasses — сайт

Статический лендинг + одна серверная функция (Netlify Functions) для приёма оплаты через ЮKassa.

## Структура

- `index.html`, `styles.css`, `script.js` — сам сайт (лендинг + выбор варианта товара + форма заказа)
- `thank-you.html` — страница после успешной оплаты
- `netlify/functions/create-payment.js` — создаёт платёж в ЮKassa и возвращает ссылку на оплату
- `netlify.toml` — конфиг деплоя на Netlify

## Как запустить локально

```bash
npm install -g netlify-cli
netlify dev
```

Откроется сайт на `http://localhost:8888` вместе с функцией оплаты.

## Настройка ЮKassa

1. Зарегистрируйтесь на yookassa.ru, получите `shopId` и `secretKey` (в тестовом режиме — тестовые ключи).
2. В Netlify (Site settings → Environment variables) добавьте:
   - `YOOKASSA_SHOP_ID`
   - `YOOKASSA_SECRET_KEY`
   - `SITE_URL` — адрес сайта после деплоя, например `https://your-site.netlify.app`
3. Задеплойте сайт — форма заказа автоматически начнёт создавать платежи и перенаправлять клиента на страницу оплаты ЮKassa, а после оплаты — на `thank-you.html`.

## Деплой на Netlify

```bash
netlify deploy --prod
```

или подключите репозиторий к Netlify через веб-интерфейс — сборка не требуется, `publish = "."`.

## Что нужно добавить/доделать перед запуском

- Реальные фото товара в `assets/img/` (`hero.jpg`, `product-black.jpg`, `product-honey.jpg`, `product-clear.jpg`)
- Реальные цены в `index.html` (сейчас плейсхолдеры)
- Юридические реквизиты продавца в футере (для чека 54-ФЗ через ЮKassa нужна регистрация как самозанятый/ИП)
- Уведомления о новых заказах: сейчас данные клиента передаются в `metadata` платежа и видны в личном кабинете ЮKassa. При желании можно добавить вебхук `payment.succeeded` → отправку в Telegram.
