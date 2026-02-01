import { Box, Container, Typography, Divider, Stack, IconButton } from "@mui/material";
import { GitHub, Instagram, Facebook } from "@mui/icons-material";
import { Link } from "react-router-dom";

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", // Clean Gradient
        position: "relative",
        padding: { xs: 2, md: 4 },
      }}
    >
      {/* --- HEADER --- */}
      <Box 
        sx={{ 
          position: "absolute", 
          top: { xs: 20, md: 30 }, 
          left: { xs: 20, md: 40 }, 
          zIndex: 10 
        }}
      >
        <Typography 
          variant="h5" 
          fontWeight="900" 
          sx={{ 
            color: "#333", 
            letterSpacing: "-0.5px",
            fontFamily: "'Segoe UI', Roboto, sans-serif" 
          }}
        >
          writespace
        </Typography>
      </Box>

      {/* --- MAIN CONTENT --- */}
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
          width: "100%",
          py: 8,
        }}
      >
        {children}
      </Container>

      {/* --- FOOTER --- */}
      <Box sx={{ width: "100%", pt: 2, pb: 1, zIndex: 10 }}>
        {/* Divider limited to 80% width so it doesn't touch edges */}
        <Divider sx={{ mb: 3, borderColor: "rgba(0,0,0,0.1)", width: "85%", mx: "auto" }} />
        
        <Container maxWidth="sm">
          <Stack spacing={3} alignItems="center">
            
            {/* Links: Docs, About, Contact */}
            <Stack 
              direction="row" 
              spacing={{ xs: 3, sm: 5 }}
              justifyContent="center"
              sx={{ "& a": { textDecoration: "none" } }}
            >
              {["Docs", "About", "Contact"].map((text) => (
                <Link key={text} to="#">
                  <Typography 
                    variant="caption" 
                    fontWeight="500" 
                    color="text.secondary" 
                    sx={{ 
                      fontSize: "0.85rem",
                      transition: "0.2s",
                      "&:hover": { color: "#333" } 
                    }}
                  >
                    {text}
                  </Typography>
                </Link>
              ))}
            </Stack>

            {/* Social Icons */}
            <Stack direction="row" spacing={2} justifyContent="center">
              <IconButton 
                size="small" 
                href="https://github.com/Afzal14786" 
                target="_blank"
                sx={{ color: "#333", "&:hover": { transform: "scale(1.1)", bgcolor: "rgba(0,0,0,0.05)" } }}
              >
                <GitHub fontSize="small" />
              </IconButton>
              
              <IconButton 
                size="small" 
                href="https://instagram.com/iamafzal.ansari" 
                target="_blank" 
                sx={{ color: "#E1306C", "&:hover": { transform: "scale(1.1)", bgcolor: "rgba(225, 48, 108, 0.05)" } }}
              >
                <Instagram fontSize="small" />
              </IconButton>
              
              <IconButton 
                size="small" 
                href="https://facebook.com/0x4f5a4c" 
                target="_blank" 
                sx={{ color: "#1877F2", "&:hover": { transform: "scale(1.1)", bgcolor: "rgba(24, 119, 242, 0.05)" } }}
              >
                <Facebook fontSize="small" />
              </IconButton>
            </Stack>

          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default AuthLayout;