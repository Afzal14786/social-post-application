# 🌍 Social Media Application (TaskPlanet Clone)

> **Current Status:** 🟢 Backend (Stable) | 🟡 Frontend (In Development)

A full-stack social media platform designed to mimic the core engagement features of modern social networks. This monolithic repository contains both the server-side API and the client-side interface.

---

## 🏗️ Project Architecture

The project is organized as a **Monorepo** with two main directories:

* **`backend/`**: A robust REST API built with Node.js, Express, and MongoDB. It handles authentication, complex file uploads (Cloudinary), and data management.
* **`frontend/`**: (In Progress) A responsive Single Page Application (SPA) built with React.js and Material UI to consume the API.

### 📂 Directory Structure

```text
root/
├── backend/                # Server-side Application
│   ├── src/
│   │   ├── config/         # DB & Cloudinary Configuration
│   │   ├── controllers/    # Modular Controllers (Auth, Post)
│   │   ├── middleware/     # Auth & Upload Middlewares
│   │   ├── models/         # Mongoose Schemas & Models
│   │   └── routes/         # API Routes (Index, Auth, Post)
│   ├── server.js           # Application Entry Point
│   └── README.md           # Backend-specific Documentation
│
├── frontend/               # Client-side Application (Coming Soon)
│   ├── src/
│   ├── public/
│   └── README.md           # Frontend-specific Documentation
│
└── README.md
```
--- 

## 🚀 Key Features

* **🔐 Advanced Authentication:**
    * JWT-based secure login/registration.
    * HTTP-Only Cookies for XSS protection.
    * Auto-generated unique user handles (e.g., `@john4821`).

* **📱 Media-Rich Posts:**
    * Create posts with Text, Images, or Mixed Media.
    * Multi-file upload support (Max 4 images per post).
    * Cloud-based image optimization via **Cloudinary**.

* **💬 Engagement System:**
    * Real-time feed generation (Newest First).
    * Embedded comment architecture for high performance.
    * Scalable schema designed for nested replies. 

--- 

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend Runtime** | Node.js | Server-side JavaScript runtime |
| **Framework** | Express.js | REST API Framework |
| **Database** | MongoDB & Mongoose | NoSQL Data Store with Schema Modeling |
| **Storage** | Cloudinary | Cloud Image Storage & Optimization |
| **Frontend UI** | React.js + MUI | Component-based UI (In Progress) |
| **Auth** | JWT + Bcrypt | Stateless Authentication |  

--- 

## ⚡ Getting Started

Since this is a full-stack repo, you need to set up the backend first.

### 1. Clone the Repository  

- **git clone** [https://github.com/Afzal14786/social-post-application.git](https://github.com/Afzal14786/social-post-application.git)  
- **cd social-post-application**

--- 

## 📚 Documentation & Setup

For detailed installation instructions and API references, please navigate to the specific directory's documentation:

| Component | Status | Documentation Link |
| :--- | :--- | :--- |
| **Backend** | 🟢 Stable | [📄 Read Backend Docs](./backend/README.md) |
| **Frontend** | 🟡 In Progress | [📄 Read Frontend Docs](./frontend/README.md) |

---

## ❤️ Credits & Acknowledgements  

**Thanks for checking out this project!**

If you find this project useful, please consider giving it a ⭐ on GitHub. Your support helps keeps the open-source community alive.

Developed with ❤️ and ☕ by **Md Afzal Ansari**.  
