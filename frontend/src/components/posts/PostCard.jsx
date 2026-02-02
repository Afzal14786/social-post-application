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

// --- SUB-COMPONENT: Image Slider (UI: Wireframe 1) ---
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
          objectFit: "contain", // 'contain' shows full image without cropping
          transition: "opacity 0.3s ease",
          bgcolor: "#000"
        }}
      />

      {/* Dots Indicator (Only if > 1 image) */}
      {images.length > 1 && (
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ position: "absolute", bottom: 15, left: "50%", transform: "translateX(-50%)" }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
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

// --- SUB-COMPONENT: Single Comment Item (UI: Wireframe 2) ---
// Handles the "Gray Box" look and indentation
const CommentItem = ({ comment, level = 0 }) => {
  // Safe check for user object in case it's missing
  const user = comment.user || {}; 
  const avatar = user.avatar || "";

  const name = user.name || comment.name || "User";
  // Fallback for username, checking nested user object first
  const username = user.username || comment.username || "username";
  const time = comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "";

  return (
    <Box sx={{ display: "flex", mt: 2, ml: level * 4, position: "relative" }}>
      {/* Indentation Line for nested comments */}
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
        {/* The Gray Bubble */}
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

        {/* Action Links (Like/Reply) */}
        <Stack direction="row" spacing={2} sx={{ mt: 0.5, ml: 1 }}>
            <Typography variant="caption" sx={{ cursor: "pointer", fontWeight: "600", color: "text.secondary" }}>Like</Typography>
            <Typography variant="caption" sx={{ cursor: "pointer", fontWeight: "600", color: "text.secondary" }}>Reply</Typography>
        </Stack>
      </Box>
    </Box>
  );
};

// --- MAIN COMPONENT: PostCard ---
const PostCard = ({ post }) => {
  const { user } = useAuth(); // Current Logged In User
  
  const [liked, setLiked] = useState(() => {
      return post.likes?.some(id => String(id) === String(user?._id)) || false;
  });
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  
  // -- EFFECTS --
  useEffect(() => {
    // Sync 'liked' state whenever user or post data updates
    if (user && post.likes) {
       setLiked(post.likes.some(id => String(id) === String(user._id)));
    }
  }, [user, post.likes]);

  const [comments, setComments] = useState(post.comments || []);
  const [commentCount, setCommentCount] = useState(post.comments?.length || 0);
  
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // -- HANDLERS --

  // 1. Like Post
  const handleLike = async () => {
    try {
      // Optimistic UI Update
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

  // 2. Add Comment
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const { data } = await commentOnPost(post._id, commentText);
      if (data.success) {
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
      {/* 1. HEADER */}
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

      {/* 2. TEXT CONTENT */}
      <CardContent sx={{ pt: 0, pb: 1 }}>
        <Typography variant="body1" color="text.primary" component="div" sx={{ lineHeight: 1.5 }}>
          {formatContent(post.content)}
        </Typography>
      </CardContent>

      {/* 3. IMAGES (Slider) */}
      {post.images && post.images.length > 0 && (
        <ImageSlider images={post.images} />
      )}

      {/* 4. ACTIONS */}
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

      {/* 5. COMMENTS SECTION */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <Box sx={{ bgcolor: "#fafafa", p: 2 }}>
            
            {/* Scrollable List */}
            <Box 
                sx={{ 
                    maxHeight: "300px", 
                    overflowY: "auto", 
                    mb: 2,
                    "&::-webkit-scrollbar": { width: "6px" },
                    "&::-webkit-scrollbar-thumb": { backgroundColor: "#dbdbdb", borderRadius: "10px" }
                }}
            >
                {comments.map((comment, index) => (
                    <Box key={comment._id || index}>
                        <CommentItem comment={comment} />
                        {/* If you add nested replies later, map them here with level={1} */}
                    </Box>
                ))}
            </Box>

            {/* Input Field */}
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