# TaskFlow - Запуск приложения
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    TaskFlow - Менеджер задач" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Проверяем наличие файлов
if (-not (Test-Path "index.html")) {
    Write-Host "ОШИБКА: Файл index.html не найден!" -ForegroundColor Red
    Write-Host "Убедитесь, что вы находитесь в папке с приложением." -ForegroundColor Yellow
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host "Запуск приложения..." -ForegroundColor Green
Write-Host ""

# Открываем приложение
try {
    Start-Process "index.html"
    Write-Host "Приложение успешно запущено!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Особенности:" -ForegroundColor Yellow
    Write-Host "• Управление задачами с приоритетами" -ForegroundColor White
    Write-Host "• Темная и светлая темы" -ForegroundColor White
    Write-Host "• Адаптивный дизайн" -ForegroundColor White
    Write-Host "• Автосохранение данных" -ForegroundColor White
    Write-Host "• PWA готовность" -ForegroundColor White
    Write-Host ""
    Write-Host "Для хостинга смотрите файл HOSTING.md" -ForegroundColor Cyan
} catch {
    Write-Host "Ошибка при запуске: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Read-Host "Нажмите Enter для выхода"
