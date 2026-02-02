import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  TextField, Button, Box, InputAdornment, IconButton, Typography, 
  Link as MuiLink, Paper, Divider 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import toast from "react-hot-toast";
import AuthLayout from "../../components/layout/AuthLayout";
import { loginUser } from "../../api/api.axios.js";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(formData);
      if (data.success) {
        toast.success("Welcome back!");
        login({ ...data.data, token: data.accessToken });
        navigate("/");
      }
    } catch (error) {
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
          background: "rgba(255,255,255,0.95)",
        }}
      >
        {/* Page Title */}
        <Typography component="h1" variant="h5" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
          Sign In
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Email Input */}
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

          {/* Password Input with Eye Icon */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
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

          {/* Switch Link */}
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