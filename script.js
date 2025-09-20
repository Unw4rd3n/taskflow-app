// TaskFlow - Modern Task Management App
// Author: Лукьянов Никита

class TaskFlow {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.currentTheme = this.loadTheme();
        this.settings = this.loadSettings();
        this.streakDays = this.loadStreak();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupParticles();
        this.updateStats();
        this.renderTasks();
        this.updateStreak();
        
        // Always show welcome screen for new users
        this.showWelcomeScreen();
    }

    setupEventListeners() {
        // Welcome screen
        document.getElementById('getStartedBtn').addEventListener('click', () => {
            this.showDashboard();
        });

        // Add task
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.addTask();
        });

        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });

        document.getElementById('closeSettingsBtn').addEventListener('click', () => {
            this.hideSettings();
        });

        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('resetSettingsBtn').addEventListener('click', () => {
            this.resetSettings();
        });

        document.getElementById('clearDataBtn').addEventListener('click', () => {
            this.clearAllData();
        });

        // Task modal
        document.getElementById('closeTaskBtn').addEventListener('click', () => {
            this.hideTaskModal();
        });

        // Close modals on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'n':
                        e.preventDefault();
                        document.getElementById('taskInput').focus();
                        break;
                    case 's':
                        e.preventDefault();
                        this.showSettings();
                        break;
                    case 'k':
                        e.preventDefault();
                        this.toggleTheme();
                        break;
                }
            }
            
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });

        // Auto-save
        if (this.settings.autoSave) {
            setInterval(() => {
                this.saveTasks();
                this.saveStreak();
            }, 30000); // Auto-save every 30 seconds
        }
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        if (this.currentTheme === 'light') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    setupParticles() {
        const container = document.querySelector('.particles-container');
        const particleCount = window.innerWidth < 768 ? 20 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            container.appendChild(particle);
        }
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const priority = document.getElementById('prioritySelect').value;
        const dueDate = document.getElementById('dueDateInput').value;
        
        const text = input.value.trim();
        if (!text) {
            this.showToast('Введите текст задачи', 'warning');
            return;
        }

        const task = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            priority: priority,
            dueDate: dueDate || null,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.updateStats();
        this.renderTasks();
        this.updateStreak();
        
        input.value = '';
        document.getElementById('dueDateInput').value = '';
        
        this.showToast('Задача добавлена', 'success');
        this.animateTaskAddition();
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.updateStats();
            this.renderTasks();
            this.updateStreak();
            
            const message = task.completed ? 'Задача выполнена!' : 'Задача возвращена в работу';
            this.showToast(message, 'success');
        }
    }

    deleteTask(taskId) {
        if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.updateStats();
            this.renderTasks();
            this.showToast('Задача удалена', 'success');
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const newText = prompt('Редактировать задачу:', task.text);
            if (newText && newText.trim() !== task.text) {
                task.text = newText.trim();
                this.saveTasks();
                this.renderTasks();
                this.showToast('Задача обновлена', 'success');
            }
        }
    }

    showTaskDetails(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const details = document.getElementById('taskDetails');
            const priorityLabels = {
                high: 'Высокий',
                medium: 'Средний',
                low: 'Низкий'
            };
            
            const priorityColors = {
                high: 'var(--accent-secondary)',
                medium: 'var(--accent-primary)',
                low: 'var(--accent-quaternary)'
            };

            details.innerHTML = `
                <div class="task-detail-item">
                    <h3>${task.text}</h3>
                </div>
                <div class="task-detail-item">
                    <strong>Приоритет:</strong>
                    <span class="task-priority ${task.priority}" style="color: ${priorityColors[task.priority]}">
                        ${priorityLabels[task.priority]}
                    </span>
                </div>
                <div class="task-detail-item">
                    <strong>Статус:</strong>
                    <span class="task-status ${task.completed ? 'completed' : 'pending'}">
                        ${task.completed ? 'Выполнено' : 'В процессе'}
                    </span>
                </div>
                <div class="task-detail-item">
                    <strong>Создано:</strong>
                    <span>${new Date(task.createdAt).toLocaleString('ru-RU')}</span>
                </div>
                ${task.dueDate ? `
                    <div class="task-detail-item">
                        <strong>Срок выполнения:</strong>
                        <span>${new Date(task.dueDate).toLocaleDateString('ru-RU')}</span>
                    </div>
                ` : ''}
                ${task.completedAt ? `
                    <div class="task-detail-item">
                        <strong>Выполнено:</strong>
                        <span>${new Date(task.completedAt).toLocaleString('ru-RU')}</span>
                    </div>
                ` : ''}
            `;
            
            document.getElementById('taskModal').classList.add('active');
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderTasks();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'completed':
                return this.tasks.filter(task => task.completed);
            case 'pending':
                return this.tasks.filter(task => !task.completed);
            case 'high':
                return this.tasks.filter(task => task.priority === 'high');
            default:
                return this.tasks;
        }
    }

    renderTasks() {
        const container = document.getElementById('tasksList');
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            const emptyState = this.getEmptyState();
            container.innerHTML = emptyState;
            return;
        }

        container.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
        
        // Add event listeners to task elements
        container.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleTask(checkbox.dataset.taskId);
            });
        });

        container.querySelectorAll('.task-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const taskId = btn.dataset.taskId;
                
                switch (action) {
                    case 'edit':
                        this.editTask(taskId);
                        break;
                    case 'delete':
                        this.deleteTask(taskId);
                        break;
                    case 'details':
                        this.showTaskDetails(taskId);
                        break;
                }
            });
        });

        container.querySelectorAll('.task-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.task-actions')) {
                    this.showTaskDetails(item.dataset.taskId);
                }
            });
        });
    }

    createTaskHTML(task) {
        const priorityLabels = {
            high: 'Высокий',
            medium: 'Средний',
            low: 'Низкий'
        };

        const dueDateText = task.dueDate ? 
            new Date(task.dueDate).toLocaleDateString('ru-RU') : '';

        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-task-id="${task.id}">
                    ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="task-content">
                    <div class="task-text">${task.text}</div>
                    <div class="task-meta">
                        <span class="task-priority ${task.priority}">${priorityLabels[task.priority]}</span>
                        ${dueDateText ? `<span class="task-due-date"><i class="fas fa-calendar"></i> ${dueDateText}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn" data-action="details" data-task-id="${task.id}" title="Подробности">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="task-action-btn" data-action="edit" data-task-id="${task.id}" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-action-btn delete" data-action="delete" data-task-id="${task.id}" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    getEmptyState() {
        const messages = {
            all: 'Нет задач. Добавьте первую задачу!',
            pending: 'Нет задач в процессе',
            completed: 'Нет выполненных задач',
            high: 'Нет задач с высоким приоритетом'
        };

        return `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <h3>${messages[this.currentFilter]}</h3>
                <p>Начните добавлять задачи, чтобы организовать свою работу</p>
            </div>
        `;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
        document.getElementById('streakDays').textContent = this.streakDays;

        // Animate numbers
        this.animateNumber('totalTasks', total);
        this.animateNumber('completedTasks', completed);
        this.animateNumber('pendingTasks', pending);
        this.animateNumber('streakDays', this.streakDays);
    }

    animateNumber(elementId, targetValue) {
        const element = document.getElementById(elementId);
        const currentValue = parseInt(element.textContent) || 0;
        const increment = targetValue > currentValue ? 1 : -1;
        const duration = Math.abs(targetValue - currentValue) * 50; // 50ms per number
        
        if (duration === 0) return;

        let current = currentValue;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            
            if (current === targetValue) {
                clearInterval(timer);
            }
        }, duration / Math.abs(targetValue - currentValue));
    }

    updateStreak() {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        // Check if user completed tasks today
        const completedToday = this.tasks.some(task => 
            task.completed && new Date(task.completedAt).toDateString() === today
        );
        
        if (completedToday) {
            // Check if streak should continue
            const lastStreakUpdate = localStorage.getItem('lastStreakUpdate');
            if (lastStreakUpdate !== today) {
                this.streakDays++;
                localStorage.setItem('lastStreakUpdate', today);
                this.saveStreak();
            }
        } else {
            // Check if streak should reset
            const lastStreakUpdate = localStorage.getItem('lastStreakUpdate');
            if (lastStreakUpdate && lastStreakUpdate !== yesterday && lastStreakUpdate !== today) {
                this.streakDays = 0;
                this.saveStreak();
            }
        }
    }

    showWelcomeScreen() {
        document.getElementById('welcomeSection').style.display = 'flex';
        document.getElementById('dashboardSection').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('welcomeSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setupTheme();
        this.saveTheme();
        this.showToast(`Переключено на ${this.currentTheme === 'dark' ? 'темную' : 'светлую'} тему`, 'success');
    }

    showSettings() {
        // Load current settings into form
        document.getElementById('themeSelect').value = this.currentTheme;
        document.getElementById('notificationsToggle').checked = this.settings.notifications;
        document.getElementById('autoSaveToggle').checked = this.settings.autoSave;
        
        document.getElementById('settingsModal').classList.add('active');
    }

    hideSettings() {
        document.getElementById('settingsModal').classList.remove('active');
    }

    saveSettings() {
        this.currentTheme = document.getElementById('themeSelect').value;
        this.settings.notifications = document.getElementById('notificationsToggle').checked;
        this.settings.autoSave = document.getElementById('autoSaveToggle').checked;
        
        this.setupTheme();
        this.saveTheme();
        this.saveSettingsData();
        this.hideSettings();
        this.showToast('Настройки сохранены', 'success');
    }

    resetSettings() {
        this.currentTheme = 'dark';
        this.settings = {
            notifications: true,
            autoSave: true
        };
        
        this.setupTheme();
        this.saveTheme();
        this.saveSettingsData();
        this.showSettings();
        this.showToast('Настройки сброшены', 'success');
    }

    clearAllData() {
        if (confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
            localStorage.removeItem('taskflow-tasks');
            localStorage.removeItem('taskflow-settings');
            localStorage.removeItem('taskflow-theme');
            localStorage.removeItem('taskflow-streak');
            localStorage.removeItem('lastStreakUpdate');
            
            this.tasks = [];
            this.streakDays = 0;
            this.currentTheme = 'dark';
            this.settings = {
                notifications: true,
                autoSave: true
            };
            
            this.updateStats();
            this.renderTasks();
            this.showWelcomeScreen();
            this.showToast('Все данные удалены', 'success');
        }
    }

    hideTaskModal() {
        document.getElementById('taskModal').classList.remove('active');
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    showToast(message, type = 'success') {
        if (!this.settings.notifications) return;
        
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        }, 3000);
    }

    animateTaskAddition() {
        const tasksList = document.getElementById('tasksList');
        const firstTask = tasksList.querySelector('.task-item');
        if (firstTask) {
            firstTask.style.animation = 'slideInRight 0.5s ease-out';
        }
    }

    // Data persistence methods
    loadTasks() {
        try {
            const saved = localStorage.getItem('taskflow-tasks');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    }

    saveTasks() {
        try {
            localStorage.setItem('taskflow-tasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }

    loadTheme() {
        try {
            return localStorage.getItem('taskflow-theme') || 'dark';
        } catch (error) {
            console.error('Error loading theme:', error);
            return 'dark';
        }
    }

    saveTheme() {
        try {
            localStorage.setItem('taskflow-theme', this.currentTheme);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('taskflow-settings');
            return saved ? JSON.parse(saved) : {
                notifications: true,
                autoSave: true
            };
        } catch (error) {
            console.error('Error loading settings:', error);
            return {
                notifications: true,
                autoSave: true
            };
        }
    }

    saveSettingsData() {
        try {
            localStorage.setItem('taskflow-settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    loadStreak() {
        try {
            return parseInt(localStorage.getItem('taskflow-streak')) || 0;
        } catch (error) {
            console.error('Error loading streak:', error);
            return 0;
        }
    }

    saveStreak() {
        try {
            localStorage.setItem('taskflow-streak', this.streakDays.toString());
        } catch (error) {
            console.error('Error saving streak:', error);
        }
    }

    // Export/Import functionality
    exportTasks() {
        const data = {
            tasks: this.tasks,
            settings: this.settings,
            streak: this.streakDays,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Данные экспортированы', 'success');
    }

    importTasks(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.tasks) {
                    this.tasks = data.tasks;
                    this.saveTasks();
                }
                
                if (data.settings) {
                    this.settings = { ...this.settings, ...data.settings };
                    this.saveSettingsData();
                }
                
                if (data.streak !== undefined) {
                    this.streakDays = data.streak;
                    this.saveStreak();
                }
                
                this.updateStats();
                this.renderTasks();
                this.showToast('Данные импортированы', 'success');
            } catch (error) {
                console.error('Error importing data:', error);
                this.showToast('Ошибка при импорте данных', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskFlow = new TaskFlow();
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add keyboard shortcuts info
console.log(`
🎯 TaskFlow - Keyboard Shortcuts:
• Ctrl/Cmd + N - Focus on task input
• Ctrl/Cmd + S - Open settings
• Ctrl/Cmd + K - Toggle theme
• Escape - Close modals

🚀 Features:
• Add, edit, delete tasks
• Priority levels (High, Medium, Low)
• Due dates
• Task filtering
• Dark/Light theme
• Auto-save
• Streak counter
• Export/Import data
• Responsive design
• PWA ready
`);
