# Social App Backend

A robust full-stack social media application built with the **MERN Stack**. This project mimics key features of platforms like TaskPlanet, allowing users to share posts (text & images), comment in real-time, and view a dynamic feed.

---

## 🚀 Features

- **🔐 Secure Authentication:**
  - User Registration & Login with **JWT** (Access + Refresh Tokens).
  - **HTTP-Only Cookies** for secure token storage.
  - Auto-generated unique usernames (handles) from email.

- **📝 Post Management:**
  - Create posts with **Text**, **Images (Max 4)**, or both.
  - Support for **Multipart/Form-Data** uploads.
  - Images optimized and stored via **Cloudinary**.

- **🌊 Dynamic Feed:**
  - Real-time feed fetching (Newest posts first).
  - Efficient data population (User details & Commenters).

- **💬 Interaction System:**
  - Comment on posts (Embedded data model for performance).
  - Scalable schema design supporting future nested replies.

---


## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose (ODM)
- **Authentication:** JSON Web Tokens (JWT) & Cookie-Parser
- **File Uploads:** Multer (Memory Storage) & Cloudinary
- **Security:** Bcrypt.js (Password Hashing), CORS

## ⚙️ Setup & Installation
Follow these steps to get the backend running locally.   

### 1. Prerequisites  
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Cloudinary Account  

### 2. Clone the Repository  

> **git clone** [https://github.com/Afzal14786/social-post-application.git](https://github.com/Afzal14786/social-post-application.git)  
> cd **social-post-application**
  

### 3. Install Backend Dependencies  
Navigate to the backend folder and install the required packages:  

```bash
cd backend
npm install
```    
### 4. Configure Environment Variables  
Create a `.env` file in the `backend` root directory and add the following keys:  

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=some_super_secret_key_123
JWT_REFRESH_SECRET=some_super_secret_refresh_key_123
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```  

### 5. Run the Server
```bash
npm run dev
```

> Server should be running on `http://localhost:5000`  

--

# 📡 API Documentation  

### **1. User Authentication**
| Method | Endpoint | Description | Auth Required | Request Body (JSON) |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/user/auth/register` | Register a new user | ❌ No | `{ "name": "John", "email": "john@ex.com", "password": "123" }` |
| `POST` | `/api/v1/user/auth/login` | Login & set HTTP-Only Cookie | ❌ No | `{ "email": "john@ex.com", "password": "123" }` |
| `POST` | `/api/v1/user/auth/logout` | Logout & clear session | ✅ Yes | N/A |

### **2. Post Management**
| Method | Endpoint | Description | Auth Required | Request Body / Type |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/posts/creates` | Create a post (Text/Images) | ✅ Yes | **Type:** `multipart/form-data`<br>**Fields:**<br>- `content` (Text)<br>- `images` (File, Max 4) |
| `GET` | `/api/v1/posts/` | Get All Posts (Feed) | ✅ Yes | N/A |
| `GET` | `/api/v1/posts/:postId` | Get Single Post + Comments | ✅ Yes | N/A |

### **3. Interactions**
| Method | Endpoint | Description | Auth Required | Request Body (JSON) |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/posts/:postId/comment` | Add a comment to a post | ✅ Yes | `{ "text": "This is a comment" }` |  

--- 

# API Testing (cURL)  
You can test the API directly using your terminal.  
**Prerequisite:** Replace `<YOUR_ACCESS_TOKEN>` with the token received from the Login response.  

### 1. User Registration
```bash
curl -X POST http://localhost:5000/api/v1/user/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe", 
    "email": "john@example.com", 
    "password": "password123"
  }'
```  

### 2. User Login  
```
curl -X POST http://localhost:5000/api/v1/user/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com", 
    "password": "password123"
  }'
```  

### 3. Create Post (Text Only)  

```
curl -X POST http://localhost:5000/api/v1/posts/creates \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -F "content=This is a test post from terminal!"
```  

### 4. Create Post (Text + Image)  
> Note: Replace `@/path/to/image.jpg` with the actual file path on your system.  
```
curl -X POST http://localhost:5000/api/v1/posts/creates \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -F "content=Here is a photo" \
  -F "images=@/home/user/pictures/photo.jpg"
```  

### 5. Get Feed (All Posts)  
```
curl -X GET http://localhost:5000/api/v1/posts/ \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### 6. Add Comment  
Note: Replace `<POST_ID>` with an actual ID from the feed response.  
```
curl -X POST http://localhost:5000/api/v1/posts/<POST_ID>/comment \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a comment via cURL"
  }'
```  

### 7. Get Single Post (View Comments)  
```
curl -X GET http://localhost:5000/api/v1/posts/<POST_ID> \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```   

### 8. Logout  
```
curl -X POST http://localhost:5000/api/v1/user/auth/logout \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

## 📂 Folder Structure

```
backend/
├── src/
│   ├── config/                 # Configuration files
│   │   └── (cloudinary.js, db.js)
│   │
│   ├── controllers/            # Route Logic
│   │   ├── auth/
│   │   │   └── auth.controller.js
│   │   └── post/
│   │       └── posts.controller.js
│   │
│   ├── helper/                 # Utility Functions
│   │   └── tokens.js
│   │
│   ├── middleware/             # Custom Middleware
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   │
│   ├── models/                 # Database Schemas & Models
│   │   ├── post/
│   │   │   ├── model.post.js
│   │   │   └── schema.post.js
│   │   └── user/
│   │       ├── model.user.js
│   │       └── schema.user.js
│   │
│   └── routes/                 # API Routes
│       ├── auth.routes.js
│       ├── index.routes.js
│       └── post.routes.js
│
├── .env                        # Environment Variables
├── app.js                      # Express App Setup
├── package-lock.json
├── package.json                # Dependencies
├── README.md                   # Documentation
└── server.js                   # Entry Point
```