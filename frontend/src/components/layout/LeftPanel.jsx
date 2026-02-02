import { Box, Typography, Avatar, Button, Divider, Paper, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * LeftPanel Component
 * * Displays the user's "Identity Card" on the left sidebar of the feed.
 * * Key Features:
 * - **Visual Profile**: Shows a gradient cover and user avatar.
 * - **User Info**: Displays name and username with links to the profile page.
 * - **Social Stats**: Quick view of "Following" and "Followers" counts.
 * - **Primary Action**: The main "Create Post" button for Desktop users.
 * * @component
 * @param {Object} props
 * @param {Function} props.onOpenCreatePost - Callback function triggered when "Create Post" is clicked.
 * @returns {JSX.Element} The rendered Profile Card UI.
 */

const LeftPanel = ({onOpenCreatePost}) => {
  const { user } = useAuth();   // Access current logged-in user data
  const navigate = useNavigate(); // Hook for navigation

  return (
    <Box sx={{ p: 2, height: "100%" }}>
      
      {/* --- PROFILE CARD --- */}
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 4, 
          overflow: "hidden", 
          border: "1px solid #eff3f4", // Subtle border
          bgcolor: "#fff",
          transition: "transform 0.2s ease-in-out",
          "&:hover": { borderColor: "#cfd9de" } // Slightly darker border on hover
        }}
      >
        {/* 1. COVER IMAGE (Gradient Placeholder) */}
        {/* Ideally, this could be a user-uploaded cover image in the future */}
        <Box 
            sx={{ 
                height: "90px", 
                background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", // Nice soft gradient
                width: "100%"
            }} 
        />
        
        {/* 2. PROFILE INFO SECTION */}
        <Box sx={{ px: 2.5, pb: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
          
          {/* User Avatar */}
          {/* Note: 'mt: -5' creates the overlapping effect on top of the banner */}
          <Avatar 
            src={user?.avatar} 
            alt={user?.name}
            sx={{ 
                width: 80, 
                height: 80, 
                border: "4px solid #fff", // White ring
                mt: -5, // Negative margin to pull it up
                mb: 1.5, 
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
            onClick={() => navigate(`/profile/${user?.username}`)}
          />
          
          {/* Name & Username Links */}
          <Typography 
            variant="h6" 
            fontWeight="800" 
            sx={{ 
                cursor: "pointer", 
                color: "#0F1419",
                fontSize: "1.1rem",
                "&:hover":{ textDecoration:"underline" } 
            }}
            onClick={() => navigate(`/profile/${user?.username}`)}
          >
            {user?.name || "User Name"}
          </Typography>
          
          {/* Following Count */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            @{user?.username || "username"}
          </Typography>

          {/* 3. SOCIAL STATS ROW */}
          <Stack 
            direction="row" 
            divider={<Divider orientation="vertical" flexItem sx={{ mx: 2, height: 20, alignSelf: "center" }} />}
            spacing={0}
            justifyContent="center"
            sx={{ width: "100%", mb: 3 }}
          >
            {/* Following Count */}
             <Box sx={{ textAlign: "center", cursor: "pointer", "&:hover .num": { color: "#1d9bf0" } }}>
                <Typography className="num" variant="subtitle2" fontWeight="800" sx={{ fontSize: "1rem" }}>
                    142
                </Typography>
                <Typography variant="caption" color="text.secondary">Following</Typography>
             </Box>
             
             {/* Followers Count */}
             <Box sx={{ textAlign: "center", cursor: "pointer", "&:hover .num": { color: "#1d9bf0" } }}>
                <Typography className="num" variant="subtitle2" fontWeight="800" sx={{ fontSize: "1rem" }}>
                    3.5k
                </Typography>
                <Typography variant="caption" color="text.secondary">Followers</Typography>
             </Box>
          </Stack>

          {/* 4. PRIMARY ACTION: CREATE POST */}
          <Button
            variant="contained"
            fullWidth
            onClick={onOpenCreatePost}
            startIcon={<Add />}
            sx={{
              borderRadius: 50,
              py: 1.5, // Taller button
              textTransform: "none",
              fontWeight: "700",
              fontSize: "1rem",
              bgcolor: "#1d9bf0", 
              boxShadow: "0 4px 12px rgba(29, 155, 240, 0.2)", // Soft blue shadow
              "&:hover": { 
                  bgcolor: "#1a8cd8", 
                  boxShadow: "0 6px 16px rgba(29, 155, 240, 0.3)" 
              }
            }}
          >
            Create Post
          </Button>
          
        </Box>
      </Paper>
    </Box>
  );
};

export default LeftPanel;