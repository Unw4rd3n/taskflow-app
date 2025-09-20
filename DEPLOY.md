# 🚀 Инструкции по деплою TaskFlow

## Быстрый деплой

### 1. GitHub Pages

1. **Создайте репозиторий на GitHub**
2. **Загрузите файлы:**
```bash
git init
git add .
git commit -m "Initial commit: TaskFlow app"
git branch -M main
git remote add origin https://github.com/yourusername/taskflow-app.git
git push -u origin main
```

3. **Включите GitHub Pages:**
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

4. **Ваше приложение будет доступно по адресу:**
   ```
   https://yourusername.github.io/taskflow-app
   ```

### 2. Netlify

1. **Подключите GitHub репозиторий к Netlify**
2. **Настройки сборки:**
   - Build command: `npm run build` (или оставьте пустым)
   - Publish directory: `.` (корневая папка)
3. **Деплой автоматически**

### 3. Vercel

1. **Установите Vercel CLI:**
```bash
npm i -g vercel
```

2. **Деплой:**
```bash
vercel --prod
```

### 4. Firebase Hosting

1. **Установите Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Инициализация:**
```bash
firebase init hosting
```

3. **Деплой:**
```bash
firebase deploy
```

## Настройка PWA

### 1. Обновите manifest.json

Замените `yourusername` на ваш GitHub username:

```json
{
  "start_url": "/taskflow-app/",
  "scope": "/taskflow-app/"
}
```

### 2. Обновите Service Worker

В файле `sw.js` обновите пути:

```javascript
const urlsToCache = [
  '/taskflow-app/',
  '/taskflow-app/index.html',
  // ... остальные пути
];
```

## Оптимизация для продакшена

### 1. Минификация (опционально)

```bash
# Установите инструменты минификации
npm install -g html-minifier-terser clean-css-cli uglify-js

# Минификация HTML
html-minifier-terser --collapse-whitespace --remove-comments --minify-css --minify-js -o index.min.html index.html

# Минификация CSS
cleancss -o styles.min.css styles.css

# Минификация JS
uglifyjs script.js -o script.min.js
```

### 2. Оптимизация изображений

Если добавите изображения, оптимизируйте их:

```bash
# Установите imagemin
npm install -g imagemin-cli

# Оптимизация
imagemin images/* --out-dir=images/optimized
```

### 3. Проверка производительности

```bash
# Lighthouse CLI
npm install -g lighthouse
lighthouse https://yourusername.github.io/taskflow-app --output html --output-path ./lighthouse-report.html
```

## Настройка домена

### 1. Пользовательский домен

1. **Купите домен** (например, taskflow.app)
2. **Настройте DNS:**
   - A record: IP адрес хостинга
   - CNAME: www → ваш-домен.com
3. **Обновите manifest.json:**
```json
{
  "start_url": "https://taskflow.app/",
  "scope": "https://taskflow.app/"
}
```

### 2. HTTPS сертификат

Большинство хостингов предоставляют бесплатные SSL сертификаты:
- **GitHub Pages**: автоматически
- **Netlify**: автоматически
- **Vercel**: автоматически
- **Firebase**: автоматически

## Мониторинг и аналитика

### 1. Google Analytics

Добавьте в `index.html` перед закрывающим `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Мониторинг ошибок

Добавьте Sentry для отслеживания ошибок:

```html
<script src="https://browser.sentry-cdn.com/7.0.0/bundle.min.js"></script>
<script>
  Sentry.init({
    dsn: "YOUR_SENTRY_DSN"
  });
</script>
```

## Обновления приложения

### 1. Версионирование

Обновляйте версию в `package.json` и `sw.js`:

```json
{
  "version": "1.0.1"
}
```

```javascript
const CACHE_NAME = 'taskflow-v1.0.1';
```

### 2. Уведомления об обновлениях

Добавьте в `script.js`:

```javascript
// Проверка обновлений
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (confirm('Доступно обновление приложения. Перезагрузить?')) {
      window.location.reload();
    }
  });
}
```

## Безопасность

### 1. Content Security Policy

Добавьте в `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
  font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
  script-src 'self' 'unsafe-inline';
  img-src 'self' data:;
">
```

### 2. Заголовки безопасности

Настройте на сервере:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## Тестирование после деплоя

### 1. Функциональные тесты

- [ ] Загрузка приложения
- [ ] Добавление задач
- [ ] Переключение тем
- [ ] Фильтрация
- [ ] Настройки
- [ ] PWA установка

### 2. Производительность

- [ ] Скорость загрузки < 3 сек
- [ ] Lighthouse Score > 90
- [ ] Мобильная адаптивность
- [ ] Офлайн работа

### 3. Кроссбраузерность

- [ ] Chrome (последние 2 версии)
- [ ] Firefox (последние 2 версии)
- [ ] Safari (последние 2 версии)
- [ ] Edge (последние 2 версии)

## Troubleshooting

### Проблема: PWA не устанавливается

**Решение:**
1. Проверьте HTTPS
2. Убедитесь в корректности manifest.json
3. Проверьте Service Worker

### Проблема: Данные не сохраняются

**Решение:**
1. Проверьте поддержку localStorage
2. Убедитесь в отсутствии приватного режима
3. Проверьте квоты браузера

### Проблема: Медленная загрузка

**Решение:**
1. Минифицируйте файлы
2. Оптимизируйте изображения
3. Включите сжатие на сервере
4. Используйте CDN

---

**Удачного деплоя! 🚀**
