import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  TextField, Button, Box, InputAdornment, IconButton, Typography, 
  Link as MuiLink, Paper, Divider 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import toast from "react-hot-toast";

// Internal Imports
import AuthLayout from "../../components/layout/AuthLayout";
import { loginUser } from "../../api/api.axios.js";
import { useAuth } from "../../context/AuthContext";

/**
 * LoginPage Component
 * * Renders the user authentication form.
 * * Key Features:
 * - **Form State**: Manages email and password inputs.
 * - **Password Visibility**: Toggles between text/password type using an eye icon.
 * - **API Integration**: Calls the backend login endpoint.
 * - **Global State Update**: On success, updates the AuthContext with user data and token.
 * - **Feedback**: Uses toast notifications for success/error messages.
 * * @component
 * @returns {JSX.Element} The rendered Login Page.
 */
const LoginPage = () => {
  // --- State Management ---
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // Controls password input type (text vs password)
  const [loading, setLoading] = useState(false); // Controls button disabled state
  
  // --- Hooks ---
  const navigate = useNavigate();
  const { login } = useAuth(); // Access the global login function

  /**
   * Handles form submission.
   * 1. Prevents default browser reload.
   * 2. Sets loading state to true.
   * 3. Calls API -> Updates Context -> Navigates to Home.
   * 4. Handles errors via Toast.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(formData);
      
      if (data.success) {
        toast.success("Welcome back!");
        
        // Update Global Auth Context
        // We merge the user details (data.data) with the access token
        // so the Context can persist both to localStorage.
        login({ ...data.data, token: data.accessToken });
        
        navigate("/");
      }
    } catch (error) {
      // Display error message from backend or fallback default
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          borderRadius: 3,
          background: "rgba(255,255,255,0.95)", // Slight transparency for modern feel
        }}
      >
        {/* Page Title */}
        <Typography component="h1" variant="h5" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
          Sign In
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* 1. Email Input */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 2 }, // Improved rounded look
            }}
          />

          {/* 2. Password Input with Visibility Toggle */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            // Toggles type between "text" (visible) and "password" (dots)
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
            InputProps={{
              // Eye Icon Button inside the input field
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* 3. Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading} // Prevent double-clicks
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: 50, // Pill shaped button
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1rem",
              backgroundColor: "#333", // Sleek black button
              "&:hover": { backgroundColor: "#000" },
            }}
          >
            {loading ? "Logging In..." : "Sign In"}
          </Button>

          {/* The "OR" Divider */}
          <Divider sx={{ my: 2, color: "text.secondary", fontSize: "0.85rem" }}>
            OR
          </Divider>

          {/* Switch to Signup Link */}
          <Box textAlign="center" sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <MuiLink component={Link} to="/signup" fontWeight="bold" underline="hover" sx={{ color: "#333" }}>
                Sign Up
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </AuthLayout>
  );
};

export default LoginPage;