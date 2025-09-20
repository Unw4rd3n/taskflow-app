# 🚀 Быстрый деплой на GitHub Pages

## Пошаговая инструкция:

### 1. Создайте репозиторий на GitHub
1. Зайдите на [github.com](https://github.com)
2. Нажмите зеленую кнопку "New" или "+" → "New repository"
3. Название: `taskflow-app`
4. Описание: `TaskFlow - Современный менеджер задач для портфолио`
5. Сделайте репозиторий **публичным** (Public)
6. НЕ ставьте галочки на README, .gitignore, license
7. Нажмите "Create repository"

### 2. Загрузите файлы
Скопируйте и выполните эти команды в терминале (в папке modern-portfolio-app):

```bash
git init
git add .
git commit -m "TaskFlow - Менеджер задач"
git branch -M main
git remote add origin https://github.com/ВАШ_USERNAME/taskflow-app.git
git push -u origin main
```

**Замените `ВАШ_USERNAME` на ваш GitHub username!**

### 3. Включите GitHub Pages
1. В репозитории перейдите в **Settings** (вкладка справа)
2. Прокрутите вниз до раздела **Pages**
3. В разделе **Source** выберите "Deploy from a branch"
4. В разделе **Branch** выберите "main"
5. В разделе **Folder** выберите "/ (root)"
6. Нажмите **Save**

### 4. Получите ссылку
Через 1-2 минуты ваше приложение будет доступно по адресу:
```
https://ВАШ_USERNAME.github.io/taskflow-app
```

## ✅ Готово!

Теперь у вас есть:
- Отдельный хостинг для TaskFlow
- Красивая ссылка для портфолио
- PWA приложение, которое можно установить

## 🔗 Добавьте в портфолио

В вашем основном портфолио добавьте кнопку:
```html
<a href="https://ВАШ_USERNAME.github.io/taskflow-app" target="_blank" class="portfolio-link">
    <i class="fas fa-external-link-alt"></i>
    <span>Посмотреть TaskFlow</span>
</a>
```
