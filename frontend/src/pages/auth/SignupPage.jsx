import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  TextField, Button, Box, InputAdornment, IconButton, Typography, 
  Link as MuiLink, Paper, Divider 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import toast from "react-hot-toast";
import AuthLayout from "../../components/layout/AuthLayout";
import { registerUser } from "../../api/api.axios.js";
import { useAuth } from "../../context/AuthContext";

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(formData);
      if (data.success) {
        toast.success("Account created successfully!");
        login(data.user);
        navigate("/");
      }
    } catch (error) {
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
          background: "rgba(255,255,255,0.95)",
        }}
      >
        <Typography component="h1" variant="h5" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
          Sign Up
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
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

          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
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

          <Divider sx={{ my: 2, color: "text.secondary", fontSize: "0.85rem" }}>
            OR
          </Divider>

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