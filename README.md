# 🍳 Recipe Tracker

Fullstack веб-приложение для поиска, создания и управления кулинарными рецептами.  
Пользователи могут просматривать рецепты, искать по ингредиентам, а администраторы – управлять категориями, ингредиентами и всеми рецептами.

## 📦 Стек технологий

### Backend
- **Node.js** + **Express** – серверная платформа
- **PostgreSQL** – реляционная база данных
- **Sequelize** – ORM для работы с БД
- **JWT + bcryptjs** – аутентификация и хеширование паролей
- **Swagger (OpenAPI)** – документация API

### Frontend
- **Vue 3** + **Vite** – фронтенд фреймворк
- **Vue Router** – маршрутизация
- **Tailwind CSS** – стилизация (светлая тема, адаптив)
- **Axios** – HTTP-запросы к бэкенду

### Инструменты
- **pgAdmin** – управление БД
- **Postman** – тестирование API
- **Git** + **GitHub** – контроль версий

## ✨ Возможности

- **Публичная часть:**
  - Просмотр всех рецептов с фильтрацией по категории, сложности и времени приготовления
  - Детальная страница рецепта с инструкцией, ингредиентами и пищевой ценностью (КБЖУ на порцию)
  - Поиск рецептов по ингредиентам (например, «яйцо, сыр»)
- **Аутентификация и роли:**
  - Регистрация и логин (JWT-токены)
  - Роль **пользователь** – может просматривать и создавать рецепты
  - Роль **администратор** – может редактировать/удалять любые рецепты, категории и ингредиенты
- **Личный кабинет:**
  - Профиль пользователя (просмотр своих рецептов)
  - Кнопки «Создать рецепт», «Редактировать», «Удалить»
- **Админ-панель:**
  - Управление категориями (CRUD)
  - Управление ингредиентами (CRUD)
- **API документация** (Swagger) доступна по адресу `/api-docs`

## 📁 Структура проекта
recipe-project/
├── recipe_tracker/ # бэкенд (Express + PostgreSQL)
│ ├── app/
│ │ ├── config/ # конфигурация БД
│ │ ├── controllers/ # логика обработки запросов
│ │ ├── models/ # модели Sequelize и связи
│ │ └── routes/ # маршруты API
│ ├── .env # переменные окружения (не попадает в Git)
│ ├── server.js # точка входа
│ └── package.json
├── recipe-frontend/ # фронтенд (Vue 3 + Tailwind)
│ ├── src/
│ │ ├── views/ # страницы (Home, Search, RecipeDetail, Profile, Login…)
│ │ ├── router/ # настройки маршрутов
│ │ ├── App.vue
│ │ └── main.js
│ ├── package.json
│ └── vite.config.js
└── README.md # этот файл
## 🛠 Установка и запуск

### Требования

- Node.js (v18+)
- PostgreSQL (v14+)
- Git

### 1. Клонирование репозитория

```bash
git clone https://github.com/umonomi/recipe-tracker.git
cd recipe-tracker
2. Настройка бэкенда
Создайте базу данных в PostgreSQL:

Через pgAdmin выполните:

sql
CREATE DATABASE recipe_tracker;
Перейдите в папку бэкенда и установите зависимости:

bash
cd recipe_tracker
npm install
Создайте файл .env в папке recipe_tracker:

env
PORT=8080
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=ВАШ_ПАРОЛЬ
DB_NAME=recipe_tracker
DB_PORT=5432
JWT_SECRET=your_super_secret_key_change_me
Выполните миграцию таблиц (автоматически при запуске):

bash
node server.js
При первом запуске Sequelize создаст все таблицы.

Создайте первого администратора (один раз):

Зарегистрируйтесь через API:

bash
POST /api/auth/register
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123"
}
Затем в pgAdmin выполните:

sql
UPDATE users SET role = 'admin' WHERE username = 'admin';
3. Настройка фронтенда
Откройте новый терминал и перейдите в папку фронтенда:

bash
cd recipe-frontend
npm install
4. Запуск (два процесса)
Бэкенд: в папке recipe_tracker выполните node server.js

Фронтенд: в папке recipe-frontend выполните npm run dev

Приложение станет доступно по адресу:
http://localhost:5173 (фронтенд)
API – http://localhost:8080
Swagger-документация – http://localhost:8080/api-docs

📖 API эндпоинты (основные)
Метод	Эндпоинт	Описание	Доступ
POST	/api/auth/register	Регистрация	публичный
POST	/api/auth/login	Вход (возвращает токен)	публичный
GET	/api/recipes	Получить все рецепты (с фильтрацией)	публичный
GET	/api/recipes/:id	Получить рецепт по ID	публичный
POST	/api/recipes	Создать рецепт (требуется токен)	авторизованный
PUT	/api/recipes/:id	Обновить рецепт (только автор или админ)	авторизованный
DELETE	/api/recipes/:id	Удалить рецепт (только автор или админ)	авторизованный
GET	/api/categories	Все категории	публичный
POST	/api/categories	Создать категорию (только админ)	админ
GET	/api/ingredients	Все ингредиенты	публичный
POST	/api/ingredients	Создать ингредиент (только админ)	админ
GET	/api/analytics/search?ingredients=яйцо,сыр	Поиск рецептов по ингредиентам	публичный
GET	/api/analytics/recipe-nutrition/:id	КБЖУ на порцию	публичный
Полная документация доступна в Swagger: http://localhost:8080/api-docs

🧪 Тестирование (Postman)
Коллекция запросов Recipe Tracker API (экспортирована из Postman) прилагается в папке postman_collection.json (необязательно). Основные запросы:

Регистрация пользователя – POST /api/auth/register

Логин – POST /api/auth/login (сохранить токен)

Создание рецепта – POST /api/recipes (с токеном в заголовке Authorization: Bearer ...)

Поиск по ингредиентам – GET /api/analytics/search?ingredients=яйцо

📌 Возможные проблемы и их решение
Ошибка подключения к БД (ECONNREFUSED 5432)
Убедитесь, что PostgreSQL запущен.

Проверьте пароль в .env.

404 при запросе к API
Проверьте, запущен ли бэкенд на порту 8080.

Посмотрите консоль бэкенда на ошибки.

Стили Tailwind не применяются
Убедитесь, что в recipe-frontend выполнен npm install.

Проверьте, что tailwind.config.js содержит путь к компонентам:

js
content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"]
Не отображаются ингредиенты в рецепте
Проверьте, что в таблице recipe_ingredients есть записи с recipeId и ingredientId.

Убедитесь, что в модели Recipe есть include модели Ingredient.

📄 Лицензия
Проект выполнен в учебных целях. Лицензия – MIT (можете указать свою).

👨‍💻 Автор
Имя: Наджафова Дарья [КИПУ]
GitHub: umonomi