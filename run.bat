@echo off
echo.
echo ========================================
echo    TaskFlow - Менеджер задач
echo ========================================
echo.
echo Запуск приложения...
echo.

REM Проверяем, есть ли index.html
if not exist "index.html" (
    echo ОШИБКА: Файл index.html не найден!
    echo Убедитесь, что вы находитесь в папке с приложением.
    pause
    exit /b 1
)

REM Открываем приложение в браузере
echo Открываем приложение в браузере...
start index.html

echo.
echo Приложение запущено!
echo.
echo Для остановки закройте это окно.
echo.
pause
