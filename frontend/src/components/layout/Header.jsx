import { useState } from "react";
import { 
  AppBar, Toolbar, Typography, Box, InputAdornment, TextField, 
  Avatar, Menu, MenuItem, ListItemIcon, IconButton 
} from "@mui/material";
import { Search, Logout, KeyboardArrowDown } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Dropdown State
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login");
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        bgcolor: "#fff", 
        borderBottom: "1px solid #eff3f4",
        zIndex: 1200 
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: "70px !important" }}>
        
        {/* --- LEFT: BRANDING & SEARCH --- */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          {/* Brand Name */}
          <Typography
            variant="h5"
            fontWeight="900"
            onClick={() => navigate("/")}
            sx={{
              color: "#000",
              fontFamily: "'Segoe UI', Roboto, sans-serif",
              letterSpacing: "-0.5px",
              cursor: "pointer",
              minWidth: "fit-content"
            }}
          >
            writespace
          </Typography>

          {/* Search Bar (Hidden on very small screens if needed) */}
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            sx={{
              width: { xs: "180px", sm: "300px" },
              display: { xs: "none", sm: "block" }, // Hide on mobile if space is tight
              "& .MuiOutlinedInput-root": {
                borderRadius: 50,
                bgcolor: "#eff3f4",
                "& fieldset": { border: "none" },
                "&.Mui-focused": { bgcolor: "#fff", boxShadow: "0 0 0 1px #1d9bf0 inset" } // Focus effect
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* --- RIGHT: PROFILE DROPDOWN --- */}
        <Box>
          <Box 
            onClick={handleProfileClick}
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              cursor: "pointer",
              p: 0.5,
              borderRadius: 50,
              "&:hover": { bgcolor: "rgba(0,0,0,0.05)" }
            }}
          >
            <Avatar 
              src={user?.avatar} 
              alt={user?.name}
              sx={{ width: 38, height: 38, border: "1px solid #dbdbdb" }} 
            />
            
            {/* Dropdown Arrow (Visual Cue) */}
            <KeyboardArrowDown sx={{ color: "#000", ml: 0.5, display: { xs: "none", sm: "block" } }} />
          </Box>

          {/* Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 3,
              sx: { 
                mt: 1.5, 
                width: 200, 
                borderRadius: 3, 
                boxShadow: "0px 4px 20px rgba(0,0,0,0.1)" 
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: "red" }} />
              </ListItemIcon>
              <Typography variant="body2" fontWeight="500" color="error">
                Log Out
              </Typography>
            </MenuItem>
          </Menu>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Header;