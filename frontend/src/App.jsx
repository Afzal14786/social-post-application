import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context & Shared Components
import { AuthProvider } from "./context/AuthContext";
import Loading from "./components/common/Loading";
import LayoutWrapper from "./components/layout/LayoutWrapper";

// --- PERFORMANCE: LAZY LOADING ---
// Instead of loading all pages at once, we import them only when needed.
// This reduces the initial bundle size and speeds up the first paint.
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/auth/SignupPage"));
const FeedPage = lazy(() => import("./pages/home/FeedPage"));

// Route Guards
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";

/**
 * App Component
 * * The root component of the application.
 * * Key Responsibilities:
 * 1. **Routing**: Manages navigation using `react-router-dom`.
 * 2. **Global State**: Wraps the app in `AuthProvider` for session management.
 * 3. **Feedback**: Initializes `Toaster` for global notifications.
 * 4. **Code Splitting**: Uses `Suspense` to handle loading states for lazy-loaded pages.
 * 5. **Security**: Implements Route Guards (`PublicRoute` / `ProtectedRoute`) to control access.
 * * @returns {JSX.Element} The rendered application tree.
 */
function App() {
  return (
    <BrowserRouter>
      {/* Provides User Session State to the entire app */}
      <AuthProvider>
        {/* Global Toast Notification Container */}
        <Toaster position="top-center" />
        
        {/* Suspense Boundary:
          Shows the <Loading /> spinner while the lazy-loaded page chunk is being downloaded.
        */}
        <Suspense fallback={<Loading />}>
          <Routes>
            
            {/* === PUBLIC ROUTES ===
              Restricted to Unauthenticated Users only.
              If a logged-in user tries to access these, <PublicRoute> redirects them to Home.
            */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* === PROTECTED ROUTES ===
              Restricted to Authenticated Users only.
              If a guest tries to access these, <ProtectedRoute> redirects them to Login.
            */}
            <Route element={<ProtectedRoute />}>
              {/* Note: FeedPage currently contains the Layout logic internally or via wrapper */}
              <Route path="/" element={<FeedPage />} />
            </Route>

            {/* === CATCH-ALL ===
              Redirects any unknown URL back to the Home page.
              This prevents 404 errors and keeps the user in the app flow.
            */}
            <Route path="*" element={<Navigate to="/" />} />
            
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;