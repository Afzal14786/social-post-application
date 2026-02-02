import { useState, useEffect } from "react";
import { 
  Card, CardHeader, CardContent, CardActions, Avatar, 
  Typography, IconButton, Box, Button, TextField, 
  InputAdornment, Collapse, Divider, Stack, CircularProgress 
} from "@mui/material";
import { 
  FavoriteBorder, Favorite, ChatBubbleOutline, ShareOutlined, 
  Send, BookmarkBorder 
} from "@mui/icons-material";
import toast from "react-hot-toast";

// API & Context
import { likePost, commentOnPost } from "../../api/api.axios";
import { useAuth } from "../../context/AuthContext";
import { formatContent } from "../../utils/textUtils";

/**
 * ImageSlider Component
 * * Renders a media viewer for the post.
 * * Key Features:
 * - Displays images with `object-fit: contain` to ensure full visibility.
 * - Shows navigation dots if there are multiple images.
 * * @param {Object} props
 * @param {string[]} props.images - Array of image URLs.
 */
const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <Box sx={{ position: "relative", width: "100%", height: 350, bgcolor: "#000", overflow: "hidden" }}>
      {/* Image Display */}
      <Box
        component="img"
        src={images[currentIndex]}
        alt="Post media"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "contain", // Ensures the whole image is visible without cropping
          transition: "opacity 0.3s ease",
          bgcolor: "#000"
        }}
      />

      {/* Dots Indicator (Rendered only if > 1 image) */}
      {images.length > 1 && (
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ position: "absolute", bottom: 15, left: "50%", transform: "translateX(-50%)" }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              // Prevent clicking a dot from triggering parent onClick events (if any)
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                // Highlight the current active dot
                bgcolor: currentIndex === index ? "#fff" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

/**
 * CommentItem Component
 * * Renders a single comment bubble.
 * * Key Features:
 * - **Defensive Data Handling**: Checks for nested `user` objects or flat properties.
 * - **Visual Indentation**: Supports nested replies via the `level` prop.
 * * @param {Object} props
 * @param {Object} props.comment - The comment data object.
 * @param {number} [props.level=0] - Nesting level for indentation (0 = root).
 */
const CommentItem = ({ comment, level = 0 }) => {
  // Defensive Coding: Handle cases where user data might be populated or flat
  const user = comment.user || {}; 
  const avatar = user.avatar || "";

  // Fallback chain: User Name -> Comment Name -> Default
  const name = user.name || comment.name || "User";
  const username = user.username || comment.username || "username";
  
  const time = comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "";

  return (
    <Box sx={{ display: "flex", mt: 2, ml: level * 4, position: "relative" }}>
      {/* Indentation Line for nested comments (Visual Tree) */}
      {level > 0 && (
        <Box 
          sx={{ 
            position: "absolute", left: -20, top: -10, bottom: "50%", 
            width: "2px", bgcolor: "#e0e0e0", 
            borderBottomLeftRadius: 8 
          }} 
        />
      )}
      
      <Avatar src={avatar} sx={{ width: 32, height: 32, mr: 2 }} />
      
      <Box sx={{ flex: 1 }}>
        {/* The Gray Bubble Container */}
        <Box sx={{ bgcolor: "#f5f7fa", p: 1.5, borderRadius: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: "0.9rem" }}>
              {name}
            </Typography>
            <Typography variant="caption" color="text.secondary">{time}</Typography>
          </Stack>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
            @{username}
          </Typography>

          <Typography variant="body2" sx={{ fontSize: "0.95rem", color: "#333" }}>
            {comment.text}
          </Typography>
        </Box>

        {/* Comment Actions */}
        <Stack direction="row" spacing={2} sx={{ mt: 0.5, ml: 1 }}>
            <Typography variant="caption" sx={{ cursor: "pointer", fontWeight: "600", color: "text.secondary" }}>Like</Typography>
            <Typography variant="caption" sx={{ cursor: "pointer", fontWeight: "600", color: "text.secondary" }}>Reply</Typography>
        </Stack>
      </Box>
    </Box>
  );
};

/**
 * PostCard Component
 * * The main feed item component.
 * * Functionality:
 * - **Optimistic Liking**: Updates UI immediately before server response.
 * - **Commenting**: Adds comments via API and updates local list.
 * - **Formatting**: Uses `formatContent` to handle mentions/hashtags in text.
 * - **Responsive Media**: Uses ImageSlider for photos.
 * * @param {Object} props
 * @param {Object} props.post - The full post object from the API.
 */
const PostCard = ({ post }) => {
  const { user } = useAuth(); // Access current logged-in user
  
  // -- STATE: LIKES --
  // Initialize 'liked' by checking if current user's ID exists in post.likes array
  const [liked, setLiked] = useState(() => {
      return post.likes?.some(id => String(id) === String(user?._id)) || false;
  });
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  
  // Effect: Sync local state if the parent 'post' prop updates (e.g., after a refetch)
  useEffect(() => {
    if (user && post.likes) {
       setLiked(post.likes.some(id => String(id) === String(user._id)));
    }
  }, [user, post.likes]);

  // -- STATE: COMMENTS --
  const [comments, setComments] = useState(post.comments || []);
  const [commentCount, setCommentCount] = useState(post.comments?.length || 0);
  const [expanded, setExpanded] = useState(false); // Controls visibility of comment section
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // -- HANDLERS --

  /**
   * Handles the Like action using Optimistic UI pattern.
   * 1. Toggle UI state immediately (make it red, update count).
   * 2. Call API.
   * 3. If API fails, revert UI state.
   */
  const handleLike = async () => {
    try {
      // Optimistic Update
      const isLiked = liked;
      setLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

      await likePost(post._id);
    } catch (error) {
      // Revert on error
      setLiked(!liked);
      setLikeCount(prev => liked ? prev + 1 : prev - 1);
      console.error("Like failed", error);
    }
  };

  /**
   * Submits a new comment.
   * 1. Calls API.
   * 2. Updates local comment list with the response data.
   */
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const { data } = await commentOnPost(post._id, commentText);
      if (data.success) {
        // Backend returns the full updated list of comments
        const updatedComments = data.data.comments;
        
        setComments(updatedComments);
        setCommentCount(updatedComments.length);
        setCommentText(""); // Clear input
      }
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <Card 
      elevation={0} 
      sx={{ 
        maxWidth: 600, 
        width: "100%", 
        mx: "auto", 
        mb: 3, 
        border: "1px solid #dbdbdb", 
        borderRadius: 3 
      }}
    >
      {/* ==============================
          1. HEADER (User Info)
         ============================== */}
      <CardHeader
        avatar={<Avatar src={post.user?.avatar} />}
        action={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button 
                variant="outlined" 
                size="small" 
                sx={{ 
                    borderRadius: 20, textTransform: "none", 
                    borderColor: "#dbdbdb", color: "#333",
                    fontSize: "0.75rem", minWidth: "70px"
                }}
            >
                Follow
            </Button>
          </Stack>
        }
        title={
          <Typography variant="subtitle1" fontWeight="bold">
            {post.user?.name} <span style={{ fontWeight: 400, color: "#8e8e8e" }}>@{post.user?.username}</span>
          </Typography>
        }
        subheader={new Date(post.createdAt).toDateString()}
      />

      {/* ==============================
          2. TEXT CONTENT
         ============================== */}
      <CardContent sx={{ pt: 0, pb: 1 }}>
        <Typography variant="body1" color="text.primary" component="div" sx={{ lineHeight: 1.5 }}>
          {/* formatContent: Utility to parse links/hashtags if needed */}
          {formatContent(post.content)}
        </Typography>
      </CardContent>

      {/* ==============================
          3. MEDIA (Slider)
         ============================== */}
      {post.images && post.images.length > 0 && (
        <ImageSlider images={post.images} />
      )}

      {/* ==============================
          4. ACTIONS (Like, Comment, Share)
         ============================== */}
      <CardActions disableSpacing sx={{ borderTop: "1px solid #f0f0f0", mt: 1 }}>
        <IconButton onClick={handleLike} sx={{ color: liked ? "#ff1744" : "inherit" }}>
          {liked ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2" fontWeight="600" sx={{ mr: 2 }}>{likeCount}</Typography>

        <IconButton onClick={() => setExpanded(!expanded)}>
          <ChatBubbleOutline />
        </IconButton>
        <Typography variant="body2" fontWeight="600" sx={{ mr: 2 }}>{commentCount}</Typography>

        <IconButton><ShareOutlined /></IconButton>
        
        <Box sx={{ flexGrow: 1 }} />
        <IconButton><BookmarkBorder /></IconButton>
      </CardActions>

      {/* ==============================
          5. COMMENTS SECTION (Collapsible)
         ============================== */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <Box sx={{ bgcolor: "#fafafa", p: 2 }}>
            
            {/* Scrollable Comment List */}
            <Box 
                sx={{ 
                    maxHeight: "300px", 
                    overflowY: "auto", 
                    mb: 2,
                    // Custom Scrollbar styling
                    "&::-webkit-scrollbar": { width: "6px" },
                    "&::-webkit-scrollbar-thumb": { backgroundColor: "#dbdbdb", borderRadius: "10px" }
                }}
            >
                {comments.map((comment, index) => (
                    <Box key={comment._id || index}>
                        <CommentItem comment={comment} />
                    </Box>
                ))}
            </Box>

            {/* Comment Input Field */}
            <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={user?.avatar} sx={{ width: 32, height: 32 }} />
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={commentLoading}
                    variant="outlined"
                    sx={{ 
                        bgcolor: "#fff",
                        "& .MuiOutlinedInput-root": { borderRadius: 20 }
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton 
                                    onClick={handleCommentSubmit} 
                                    disabled={commentLoading || !commentText.trim()}
                                    color="primary" 
                                    size="small"
                                >
                                    {commentLoading ? <CircularProgress size={20} /> : <Send fontSize="small" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>
        </Box>
      </Collapse>
    </Card>
  );
};

export default PostCard;