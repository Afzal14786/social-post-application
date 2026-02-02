import { useState } from "react";
import { 
  Box, Typography, Stack, Button, Avatar, Menu, MenuItem, 
  ListItemIcon 
} from "@mui/material";
import { 
  Home, Search, Notifications, MailOutline, 
  PersonOutline, Create, Logout 
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Sidebar Component
 * * Renders the vertical navigation bar on the left side of the layout.
 * * Key Features:
 * - **Responsive Design**: Adapts between a full sidebar (Desktop) and an icon strip (Tablet).
 * - **Sticky Positioning**: Stays fixed in view while the main content scrolls.
 * - **Navigation**: Dynamic list of routing buttons.
 * - **User Actions**: Includes the "Create Post" CTA and a Profile/Logout menu.
 * * @component
 * @returns {JSX.Element} The rendered Sidebar UI.
 */
const Sidebar = () => {
  // --- Hooks ---
  const { user, logout } = useAuth(); // Access user session and logout function
  const navigate = useNavigate();     // Navigation hook
  
  // --- State for Profile Dropdown ---
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // --- Handlers ---

  /** Opens the profile menu */
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /** Closes the profile menu */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /** * Handles user logout sequence:
   * 1. Close menu -> 2. Clear Auth Context -> 3. Redirect to Login
   */
  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login");
  };

  // Navigation Configuration
  const menuItems = [
    { icon: <Home fontSize="large" />, label: "Home", path: "/" },
    { icon: <Search fontSize="large" />, label: "Explore", path: "/explore" },
    { icon: <Notifications fontSize="large" />, label: "Notifications", path: "/notifications" },
    { icon: <MailOutline fontSize="large" />, label: "Messages", path: "/messages" },
    { icon: <PersonOutline fontSize="large" />, label: "Profile", path: `/profile/${user?.username}` },
  ];

  return (
    <Box
      sx={{
        height: "100vh",
        position: "sticky", // Keeps sidebar visible on scroll
        top: 0,
        px: { xs: 1, lg: 4 }, // Responsive Padding: Compact on tablet, wide on desktop
        py: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid #eff3f4" // Subtle separation line
      }}
    >
      <Box>
        {/* ==============================
            SECTION 1: BRANDING
           ============================== */}
        
        {/* Desktop View: Full Text */}
        <Typography
          variant="h4"
          fontWeight="900"
          onClick={() => navigate("/")}
          sx={{
            mb: 4,
            pl: { xs: 0, lg: 2 },
            fontFamily: "'Segoe UI', Roboto, sans-serif",
            letterSpacing: "-1px",
            cursor: "pointer",
            display: { xs: "none", lg: "block" }, // Hidden on Tablet
            color: "#000"
          }}
        >
          writespace
        </Typography>

        {/* Tablet View: Logo Icon Only */}
        <Box 
            sx={{ display: { xs: "flex", lg: "none" }, justifyContent: "center", mb: 4 }}
            onClick={() => navigate("/")}
        >
            <Box sx={{ width: 30, height: 30, bgcolor: "#000", borderRadius: "50%" }} />
        </Box>

        {/* ==============================
            SECTION 2: NAVIGATION LINKS
           ============================== */}
        <Stack spacing={1}>
          {menuItems.map((item) => (
            <Button
              key={item.label}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                // Alignment: Center icons on Tablet, Start align on Desktop
                justifyContent: { xs: "center", lg: "flex-start" }, 
                color: "#0F1419", // Twitter Black
                fontSize: "1.25rem",
                textTransform: "none",
                fontWeight: "500",
                borderRadius: 50,
                px: 2,
                py: 1.5,
                minWidth: { xs: "fit-content", lg: "100%" },
                "&:hover": { bgcolor: "rgba(15, 20, 25, 0.1)" },
                // Margin handling for the icon when text is hidden/shown
                "& .MuiButton-startIcon": { margin: { xs: 0, lg: "0 16px 0 0" } },
              }}
            >
              {/* Text Label: Hidden on Tablet, Visible on Desktop */}
              <Box component="span" sx={{ display: { xs: "none", lg: "block" } }}>
                {item.label}
              </Box>
            </Button>
          ))}

          {/* ==============================
              SECTION 3: CREATE POST ACTION
             ============================== */}

          {/* Desktop: Full "Create Post" Button */}
          <Button
            variant="contained"
            sx={{
              mt: 4,
              borderRadius: 50,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: "bold",
              textTransform: "none",
              bgcolor: "#1d9bf0", 
              boxShadow: "none",
              width: "100%",
              "&:hover": { bgcolor: "#1a8cd8", boxShadow: "none" },
              display: { xs: "none", lg: "block" }, // Hide on Tablet
            }}
          >
            Create Post
          </Button>

          {/* Tablet: Circle Icon Button (FAB style) */}
           <Box sx={{ display: { xs: "flex", lg: "none" }, justifyContent:"center", mt: 4 }}>
               <Box 
                sx={{ 
                    bgcolor:"#1d9bf0", p:1.5, borderRadius:"50%", 
                    color:"#fff", cursor:"pointer", boxShadow: 3,
                    "&:hover": { bgcolor: "#1a8cd8" }
                }}
               >
                    <Create />
               </Box>
           </Box>
        </Stack>
      </Box>

      {/* ==============================
          SECTION 4: USER PROFILE & MENU
         ============================== */}
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          onClick={handleProfileClick}
          sx={{
            p: 1.5,
            borderRadius: 50,
            cursor: "pointer",
            "&:hover": { bgcolor: "rgba(15, 20, 25, 0.1)" },
            justifyContent: { xs: "center", lg: "flex-start" }
          }}
        >
          <Avatar 
            src={user?.avatar || ""} 
            alt={user?.name}
            sx={{ width: 40, height: 40, border: "1px solid #eee" }} 
          />
          
          {/* User Info: Hidden on Tablet */}
          <Box sx={{ ml: 1.5, display: { xs: "none", lg: "block" }, flex: 1 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
              {user?.name || "User"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{user?.username || "username"}
            </Typography>
          </Box>

          {/* Three dots icon (Visual cue for menu) */}
          <Box sx={{ display: { xs: "none", lg: "block" } }}>...</Box>
        </Stack>

        {/* --- LOGOUT DROPDOWN MENU --- */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 4,
            sx: {
              width: 250,
              borderRadius: 4,
              mb: 1, // Add spacing above the trigger
              boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
              overflow: 'visible',
            },
          }}
          // Anchor the menu to the top-center of the profile button
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Typography variant="caption" sx={{ px: 2, py: 1, fontWeight: "bold", color: "text.secondary" }}>
            Account
          </Typography>
          
          <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <Typography fontWeight="500">Log out @{user?.username}</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Sidebar;