import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Loading from "./components/common/Loading";


const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/auth/SignupPage"));
const FeedPage = lazy(() => import("./pages/home/FeedPage"));

import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        
        {/* Suspense shows the Loading spinner while the page downloads */}
        <Suspense fallback={<Loading />}>
          <Routes>
            
            {/* Public Routes (Login/Signup) */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Protected Routes (Feed/Dashboard) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<FeedPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
            
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;