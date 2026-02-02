import { Box, CircularProgress } from "@mui/material";

/**
 * Loading Animation
 */
const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "#f5f7fa",
      }}
    >
      <CircularProgress size={60} thickness={4} sx={{ color: "#333" }} />
    </Box>
  );
};

export default Loading;