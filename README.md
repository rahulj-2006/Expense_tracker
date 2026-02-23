# 💰 Expense Tracker | Smart Financial Management

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwind-css)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED?logo=docker)

A full-stack, state-of-the-art Expense tracking application designed to help users manage their finances with elegance and ease. Featuring a sleek, responsive interface, detailed transaction logging, and a powerful admin console.

---

## ✨ Features

- **Intuitive Dashboard**: At-a-glance view of your spending patterns and recent transactions.
- **Dynamic Categorization**: Smart category management including a "Specify Other" option for flexible tracking.
- **Admin Console**: dedicated management interface for administrators to monitor all system users and transactions.
- **Modern UI/UX**: Built with Tailwind CSS, featuring glassmorphism, smooth animations, and a fully responsive layout.
- **Auth System**: Secure user registration and login powered by JWT and bcrypt.
- **Currency Support**: Optimized for INR (₹) with flexible entry for global use.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL (with Sequelize ORM) |
| **Security** | JSON Web Tokens (JWT), Bcrypt Password Hashing |
| **Deployment** | Docker & Docker Compose |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Docker](https://www.docker.com/) (Optional, for easy setup)
- [MySQL](https://www.mysql.com/) (If not using Docker)

### Installation & Run (with Docker)

1. Clone the repository:
   ```bash
   git clone https://github.com/rahulj-2006/Expense_tracker.git
   cd Expense_tracker
   ```

2. Spin up the entire environment:
   ```bash
   docker-compose up --build
   ```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---

## 🛡️ Privacy & Security

This project uses a `.gitignore` to ensure sensitive environment variables (like database credentials and JWT secrets) stored in `.env` files are **never** uploaded to version control. 

> [!IMPORTANT]  
> Never commit your `.env` files. If you are contributing, copy `backend/.env.example` (if provided) to `.env` and fill in your local credentials.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Made with ❤️ by [rahulj-2006](https://github.com/rahulj-2006)*