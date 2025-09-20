@echo off
echo.
echo ========================================
echo    TaskFlow - Быстрый деплой
echo ========================================
echo.

REM Проверяем наличие Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: Git не установлен!
    echo Скачайте Git с https://git-scm.com/
    pause
    exit /b 1
)

echo Шаг 1: Инициализация Git...
git init

echo Шаг 2: Добавление файлов...
git add .

echo Шаг 3: Создание коммита...
git commit -m "TaskFlow - Менеджер задач для портфолио"

echo Шаг 4: Переименование ветки...
git branch -M main

echo.
echo ========================================
echo    ВАЖНО! Замените ВАШ_USERNAME на ваш GitHub username
echo ========================================
echo.
echo Выполните эти команды вручную:
echo.
echo git remote add origin https://github.com/ВАШ_USERNAME/taskflow-app.git
echo git push -u origin main
echo.
echo Затем:
echo 1. Зайдите на github.com
echo 2. Создайте репозиторий 'taskflow-app'
echo 3. Settings → Pages → Deploy from branch 'main'
echo 4. Ваше приложение: https://ВАШ_USERNAME.github.io/taskflow-app
echo.

pause
