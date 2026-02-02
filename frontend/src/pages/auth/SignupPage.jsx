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
import { registerUser } from "../../api/api.axios.js";
import { useAuth } from "../../context/AuthContext";

/**
 * SignupPage Component
 * * Renders the user registration form.
 * * Key Features:
 * - **Form State**: Manages Name, Email, and Password inputs.
 * - **Security**: Includes password visibility toggle.
 * - **API Integration**: Calls the backend registration endpoint.
 * - **Auto-Login**: Automatically logs the user in upon successful registration by updating the global context.
 * * @component
 * @returns {JSX.Element} The rendered Sign Up Page.
 */
const SignupPage = () => {
  // --- State Management ---
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // Controls password field type
  const [loading, setLoading] = useState(false); // Prevents duplicate submissions
  
  // --- Hooks ---
  const navigate = useNavigate();
  const { login } = useAuth(); // Access global auth action

  /**
   * Handles the registration form submission.
   * 1. Sets loading state.
   * 2. Calls the registration API.
   * 3. On success: Updates global AuthContext with new user data and token.
   * 4. Navigates to the Home page.
   * 5. Handles errors with toast notifications.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(formData);
      
      if (data.success) {
        toast.success("Account created successfully!");
        
        // Update AuthContext immediately so the user doesn't have to log in manually
        // data.data contains user info, data.accessToken contains the JWT
        login({ ...data.data, token: data.accessToken });
        
        navigate("/");
      }
    } catch (error) {
      // Show backend error message or a generic fallback
      toast.error(error.response?.data?.message || "Registration failed");
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
          background: "rgba(255,255,255,0.95)", // Modern semi-transparent background
        }}
      >
        <Typography component="h1" variant="h5" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
          Sign Up
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* 1. Name Input */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
          
          {/* 2. Email Input */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          {/* 3. Password Input with Visibility Toggle */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            // Toggle between text (visible) and password (masked)
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* 4. Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: 50,
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1rem",
              backgroundColor: "#333",
              "&:hover": { backgroundColor: "#000" },
            }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          {/* Divider */}
          <Divider sx={{ my: 2, color: "text.secondary", fontSize: "0.85rem" }}>
            OR
          </Divider>

          {/* Link to Login Page */}
          <Box textAlign="center" sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <MuiLink component={Link} to="/login" fontWeight="bold" underline="hover" sx={{ color: "#333" }}>
                Sign In
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </AuthLayout>
  );
};

export default SignupPage;