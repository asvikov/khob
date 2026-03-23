# KHOB (EventHub)

Платформа для создания и управления событиями.

## Стек технологий

### Frontend
- **React 18** - библиотека для создания пользовательского интерфейса
- **React Router DOM 7** - маршрутизация приложения
- **Tailwind CSS** - утилитарная CSS-библиотека для стилизации
- **Vite 5** - быстрый сборщик модулей
- **@tanstack/react-query** - управление серверными данными
- **Remix Icon** - библиотека иконок
- **Google Fonts (Plus Jakarta Sans)** - шрифт

### Backend
- **Laravel 11** - PHP-фреймворк для backend-логики

### Базы данных
- **MySQL/PostgreSQL** - основное хранилище данных
- **Redis** - кэширование и работа с лайками

### Инструменты разработки
- **npm** - менеджер пакетов
- **Composer** - менеджер зависимостей PHP
- **Vite** - dev-сервер и сборка

## Структура проекта

```
khob/
├── app/                    # Laravel приложение
│   ├── Http/Controllers/   # Контроллеры
│   ├── Models/            # Модели
│   └── Services/          # Сервисы
├── resources/js/src/      # React приложение
│   ├── components/        # React компоненты
│   ├── hooks/            # Custom hooks
│   └── services/         # API сервисы
├── database/migrations/   # Миграции БД
└── public/               # Публичные файлы
```

## Запуск

```bash
# Установка зависимостей
composer install
npm install

# Запуск dev-сервера
npm run dev

# Сборка продакшена
npm run build
```
