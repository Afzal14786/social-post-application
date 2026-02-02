import { useState } from "react"; 
import { Box, Grid, Fab, useMediaQuery, useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";

// Keep your exact imports
import Header from "./Header";
import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel"; 
import CreatePostModal from "../posts/CreatePostModal";

/**
 * MainLayout Component
 * * The primary scaffold for the application's authenticated pages.
 * * Implementation:
 * - Uses a **"Holy Grail" Layout**: Fixed Header at top, Scrollable Content Area below.
 * - **3-Column Grid**: 
 * 1. Left: Profile/Nav (Hidden on Mobile)
 * 2. Center: Feed (Always Visible, Scrollable)
 * 3. Right: Widgets (Hidden on Tablet/Mobile)
 * - **Modal Manager**: Manages the state of the "Create Post" modal at a global level so it can be triggered from the Sidebar or the Mobile FAB.
 * * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - The main content to display in the center feed (e.g., Post List).
 * @param {Function} [props.onPostCreated] - Optional callback to refresh data when a new post is successfully created.
 * @returns {JSX.Element} The responsive application shell.
 */

const MainLayout = ({ children, onPostCreated }) => {
  // --- Hooks ---
  const theme = useTheme();
  // Detects if the screen is Mobile/Tablet sized (md or smaller)
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // --- State ---
  // Controls the visibility of the Create Post Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    // ROOT CONTAINER: Locks the viewport to 100vh to prevent full-page scrolling.
    // Instead, only the center column scrolls.
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f5f7fa", overflow: "hidden" }}>
      
      {/* --- GLOBAL MODAL --- */}
      {/* Placed here to sit on top of everything when open */}
      <CreatePostModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={onPostCreated} // Triggers feed refresh when post is done
      />

      {/* --- HEADER --- */}
      {/* flexShrink: 0 ensures the header never squishes when content is tall */}
      <Box sx={{ flexShrink: 0, zIndex: 1200 }}>
        <Header />
      </Box>

      {/* --- MAIN CONTENT AREA --- */}
      {/* flex: 1 makes this take up all remaining vertical space */}
      <Box sx={{ flex: 1, overflow: "hidden", display: "flex", justifyContent: "center" }}>
        
        {/* Constrains width on large screens (e.g., 1250px) to keep content readable */}
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
              {/* Pass the State Setter to the Button inside LeftPanel */}
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

      {/* --- MOBILE FLOATING ACTION BUTTON (FAB) --- */}
      {/* Only rendered on small screens to provide access to "Create Post" */}
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