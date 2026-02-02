import { useState } from "react"; 
import { Box, Grid, Fab, useMediaQuery, useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";

// Keep your exact imports
import Header from "./Header";
import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel"; 
import CreatePostModal from "../posts/CreatePostModal";

const MainLayout = ({ children, onPostCreated }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 1. State for the Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    // LOCK VIEWPORT (Your existing layout)
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f5f7fa", overflow: "hidden" }}>
      
      {/* 2. Render Modal (Hidden by default) */}
      <CreatePostModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={onPostCreated} // Triggers feed refresh when post is done
      />

      {/* HEADER (Fixed) */}
      <Box sx={{ flexShrink: 0, zIndex: 1200 }}>
        <Header />
      </Box>

      {/* CONTENT AREA */}
      <Box sx={{ flex: 1, overflow: "hidden", display: "flex", justifyContent: "center" }}>
        
        {/* Max Width Container */}
        <Box sx={{ width: "100%", maxWidth: "1250px" }}>
          <Grid container sx={{ height: "100%" }} spacing={0}>
            
            {/* --- LEFT PANEL --- */}
            <Grid 
              item lg={3} 
              sx={{ 
                display: { xs: "none", md: "block" }, // Changed from lg to md
                height: "100%",
                pt: 3 
              }}
            >
              {/* 3. Pass the Open Trigger to LeftPanel */}
              <LeftPanel onOpenCreatePost={() => setIsModalOpen(true)} />
            </Grid>

            {/* --- FEED COLUMN --- */}
            <Grid 
              item xs={12} md={8} lg={6} 
              sx={{ 
                height: "100%", 
                overflowY: "auto",
                "&::-webkit-scrollbar": { display: "none" },
                "-ms-overflow-style": "none",
                "scrollbar-width": "none",
              }}
            >
                <Box sx={{ pt: 3, pb: 10, px: 2 }}>
                  {children}
                </Box>
            </Grid>

            {/* --- RIGHT PANEL --- */}
            <Grid 
              item md={4} lg={3} 
              sx={{ 
                display: { xs: "none", md: "block" },
                height: "100%",
                pt: 3
              }}
            >
              <RightPanel />
            </Grid>

          </Grid>
        </Box>
      </Box>

      {/* MOBILE FAB */}
      {isMobile && (
        <Fab 
          color="primary" 
          onClick={() => setIsModalOpen(true)} // 4. Mobile Trigger
          aria-label="add" 
          sx={{ 
            position: "fixed", bottom: 20, right: 20, zIndex: 1300,
            bgcolor: "#1d9bf0", "&:hover": { bgcolor: "#1a8cd8" } 
          }}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
};

export default MainLayout;