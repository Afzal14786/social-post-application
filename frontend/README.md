# 📱 Social App Frontend (TaskPlanet Clone)

The client-side application for the "Mini Social Post App," built to replicate the clean, modern, and responsive feel of the TaskPlanet social feed. This project focuses on a seamless user experience with optimistic UI updates and robust authentication.

## 🚀 Live Demo & Links
- **Frontend Deployed URL:** [Insert Vercel Link Here]
- **Backend API URL:** [Insert Render Link Here]

---

## 🛠️ Tech Stack & Libraries
* **Framework:** React.js (Vite) - *Chosen for speed and performance.*
* **UI Library:** Material UI (MUI v5) - *Used to ensure a polished, standard-compliant design.*
* **HTTP Client:** Axios - *Configured with interceptors for automatic Token handling.*
* **Routing:** React Router DOM v6
* **State Management:** React Context API (AuthContext)
* **Notifications:** React Hot Toast - *For non-intrusive success/error alerts.*

---
## Folder Structure 
```
/frontend/
├── index.html
├── package.json
├── vite.config.js
├── .env
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── App.css
    │
    ├── api/
    │   ├── axios.js
    │   └── index.js
    │
    ├── assets/
    │
    ├── components/
    │   ├── Layout.jsx
    │   ├── Navbar.jsx
    │   ├── PostCard.jsx
    │   └── Loading.jsx
    │
    ├── context/
    │   └── AuthContext.jsx
    │
    ├── pages/
    │   ├── LoginPage.jsx
    │   ├── SignupPage.jsx
    │   ├── FeedPage.jsx
    │   └── CreatePostPage.jsx
    │
    ├── theme/
    │   └── theme.js
    │
    └── utils/
        └── formatDate.js
```


--- 
## ✨ Key Features Implemented

### 1. 🔐 Robust Authentication
* **JWT Handling:** Securely manages JSON Web Tokens in `localStorage` for persistent user sessions.
* **Protected Routes:** Users cannot access the Feed or Create Post pages without logging in.
* **Auto-Redirects:** If a token expires or is missing, the app automatically redirects users to the Login page.

### 2. 📸 Rich Post Creation
* **Multimedia Support:** Users can create posts with **Text Only**, **Image Only**, or **Both**.
* **Image Preview:** Real-time preview of selected images before uploading.
* **Form Validation:** Prevents submission of empty posts to ensure data integrity.

### 3. ⚡ Interactive Feed (Optimistic UI)
* **Instant Feedback:** "Likes" and "Comments" update **instantly** on the screen before the server responds. This makes the app feel incredibly fast (latency masking).
* **Responsive Layout:** The feed adapts perfectly to mobile screens (vertical scrolling) and desktop views.
* **User Attribution:** Every post and comment clearly displays the username of the author.

---

## ⚙️ Setup & Installation Guide

### Prerequisites
* Node.js installed on your machine.
* The Backend server must be running (locally or deployed).

### Step 1: Install Dependencies
Navigate to the frontend directory and install the required packages:
```bash
cd frontend
npm install
```

### Step 2: Configure Environment
Create a `.env` file in the root of the frontend folder.  
Important: Vite requires environment variables to start with `VITE_.`  

# Point this to your local backend or deployed Render URL  
> VITE_API_URL=`http://localhost:5000/api`  

### Step 3: Run Locally
Start the development server:  
```bash
npm run dev
```
The application will launch at `http://localhost:5173.`  

### Step 4: Build for Production

To create an optimized build for deployment (Vercel/Netlify): 
```bash
npm run build
```
This generates the dist/ folder containing static assets.
