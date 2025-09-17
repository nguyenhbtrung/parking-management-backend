# Parking Management Backend - Node.js (Express + Sequelize + PostgreSQL)

## 📌 Overview
This is a backend API built with **Node.js + Express**, using **Sequelize ORM** with **PostgreSQL** as the database.  
The system supports authentication with **JWT**, environment configuration with **dotenv**, and is ready to integrate with a frontend client.

---

## 🚀 Tech Stack
- [Node.js](https://nodejs.org/)  
- [Express](https://expressjs.com/)  
- [Sequelize](https://sequelize.org/)  
- [PostgreSQL](https://www.postgresql.org/)  
- [JWT](https://jwt.io/)  
- [dotenv](https://www.npmjs.com/package/dotenv)  

---

## 📂 Project Structure (example)
```

.
├── src
│   ├── models/        # Sequelize models
│   ├── migrations/    # Sequelize migrations
│   ├── routes/        # API routes
│   ├── controllers/   # Request handlers
│   ├── middlewares/   # Middlewares
│   ├── config/        # Sequelize config
│   └── index.js         # Express entry point
├── .env               # Environment variables
├── package.json
└── README.md

````

---

## ⚙️ Environment Variables
Create a `.env` file in the project root and configure as follows:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_username
DB_PASS=your_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

PORT=8080
NODE_ENV=development

CLIENT_URL=http://localhost:5173
````

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/nguyenhbtrung/parking-management-backend.git
cd parking-management-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure database

* Ensure PostgreSQL is installed and running.
* Update `.env` with your database credentials.

### 4. Create database & run migrations

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

### 5. Start the server

```bash
npm run dev   # with nodemon (development)
npm start     # production
```

Server will run at: [http://localhost:8080](http://localhost:8080)

---

## 🛠️ Useful Scripts

```bash
npm run dev                      # Start server with nodemon
npm start                        # Start server normally
npx sequelize-cli db:migrate     # Run migrations
npx sequelize-cli db:migrate:undo # Rollback last migration
npx sequelize-cli db:seed:all    # Run all seeders
npx sequelize-cli db:seed:undo:all # Undo all seeders
```

---

## 🔑 Authentication

* The backend uses **JWT** for authentication.
* On successful login, the server returns a **JWT token**.
* Include the token in request headers for protected routes:

```
Authorization: Bearer <token>
```

---

## 🌐 Client Integration

The frontend is expected to run at:
[http://localhost:5173](http://localhost:5173) (configured in `.env`).

---

## 📝 Notes

* Ensure `.env` is listed in `.gitignore` and never committed.
* For production, set `NODE_ENV=production` and configure environment variables securely.
