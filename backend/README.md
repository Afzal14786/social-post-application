# Social App Backend

The server-side application for the Social Post App, built with Node.js, Express, and MongoDB.

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Atlas)
* **Image Storage:** Cloudinary
* **Authentication:** JWT & Bcrypt

## ⚙️ Setup & Installation

1.  **Navigate to the backend folder:**
    ```bash
    cd backend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Create a `.env` file in this directory with the following:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=some_super_secret_key_123
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```
4.  **Run Server:**
    ```bash
    npm dev
    ```

## 📂 Folder Structure
* `/config` - DB connection & Cloudinary setup.
* `/controllers` - Request logic (Auth, Posts).
* `/models` - Mongoose schemas (User, Post).
* `/routes` - API endpoints.

## 📡 API Endpoints Workflow

### 1. User Auth
* **POST** `/api/auth/signup` -> Creates user -> Returns Token
* **POST** `/api/auth/login` -> Verifies Creds -> Returns Token

### 2. Posts (Requires Token)
* **POST** `/api/posts` -> Uploads Image (if any) -> Creates Post -> Returns Post Data
* **GET** `/api/posts` -> Fetches all posts (sorted by newest).

### 3. Interactions
* **PUT** `/api/posts/:id/like` -> Toggles UserID in `likes` array.
* **POST** `/api/posts/:id/comment` -> Pushes comment object to `comments` array.

## 🚀 Deployment (Render)
This backend is configured to run on **Render**.
* **Build Command:** `npm install`
* **Start Command:** `node server.js`
* **Root Directory:** `backend`