import { Box, Typography, Stack, Avatar, Button, Paper } from "@mui/material";

/**
 * RightPanel Component
 * * Renders the right-hand sidebar content for the application.
 * * Key Features:
 * - **"Who to Follow" Widget**: A card displaying suggested users to connect with.
 * - **Mock Data Handling**: Currently iterates over a static array to simulate API results.
 * - **Footer Links**: Static legal/navigation links (Terms, Privacy, etc.) often found in social footers.
 * * @component
 * @returns {JSX.Element} The rendered Sidebar Widgets UI.
 */
const RightPanel = () => {
  return (
    <Box sx={{ p: 2, height: "100%" }}> 
      
      {/* Suggestions Card */}
      <Paper 
        elevation={0}
        sx={{ 
          bgcolor: "#fff", 
          borderRadius: 4, 
          p: 2,
          border: "1px solid #eff3f4"
        }}
      >
        <Typography variant="h6" fontWeight="800" sx={{ mb: 2, fontSize: "1rem" }}>
          Who to follow
        </Typography>

        {/* Mock Data Mapping: 
            In a real app, this would be data fetched from an API (e.g., 'recommended users') */}
        
        {[1, 2, 3].map((item) => (
          <Stack key={item} direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            {/* User Avatar */}
            <Avatar src={`https://i.pravatar.cc/150?u=${item}`} sx={{ width: 40, height: 40 }} />
            {/* User Info (Name & Handle) */}
            <Box flex={1} sx={{ overflow: "hidden" }}>
              <Typography variant="subtitle2" fontWeight="bold" noWrap>User Name</Typography>
              <Typography variant="caption" color="text.secondary" noWrap>@username</Typography>
            </Box>

            {/* Follow Button */}
            <Button 
                size="small" 
                variant="outlined" // Changed to outlined for lighter look
                sx={{ 
                    borderRadius: 50, textTransform: "none",
                    borderColor: "#cfd9de", color: "#000",
                    minWidth: "70px",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.05)", borderColor: "#000" }
                }}
            >
                Follow
            </Button>
          </Stack>
        ))}
        
        {/* 'Show More' Action */}
        <Typography variant="body2" color="primary" sx={{ cursor: "pointer", fontSize: "0.85rem", mt: 1 }}>
            Show more
        </Typography>
      </Paper>
      
      {/* Footer Links */}
      <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mt: 2, px: 1 }}>
          {["Terms", "Privacy", "Cookie", "More"].map(text => (
              <Typography key={text} variant="caption" color="text.secondary" sx={{ cursor:"pointer", "&:hover":{textDecoration:"underline"} }}>
                  {text}
              </Typography>
          ))}
      </Stack>
    </Box>
  );
};

export default RightPanel;