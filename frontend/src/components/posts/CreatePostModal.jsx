import { useState, useRef } from "react";
import { 
  Dialog, DialogContent, IconButton, Typography, 
  Box, TextField, Button, Stack, Divider, CircularProgress 
} from "@mui/material";
import { Close, CloudUpload, Send, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";

// API
import { createPost } from "../../api/api.axios";

const CreatePostModal = ({ open, onClose, onSuccess }) => {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]); // Preview URLs
  const [files, setFiles] = useState([]);   // Actual Files
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle Image Selection
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (images.length + selectedFiles.length > 4) {
      toast.error("Max 4 images allowed.");
      return;
    }
    const newImages = selectedFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  // Remove Image
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit to Backend
  const handleSubmit = async () => {
    if (!text.trim() && files.length === 0) {
      return toast.error("Post cannot be empty!");
    }

    setLoading(true);
    
    // Create FormData object
    const formData = new FormData();
    formData.append("content", text);
    
    files.forEach((file) => {
      formData.append("images", file); 
    });

    try {
      const { data } = await createPost(formData);
      if (data.success) {
        toast.success("Post Created!");
        setText("");
        setImages([]);
        setFiles([]);
        onClose();
        if (onSuccess) onSuccess(); 
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, pt: 2 }}>
        <Typography variant="h6" fontWeight="bold">Create Post</Typography>
        <IconButton onClick={handleClose} disabled={loading}><Close /></IconButton>
      </Stack>

      <DialogContent sx={{ minHeight: 300, display: "flex", flexDirection: "column" }}>
        <TextField
          placeholder="What's on your mind?"
          multiline
          fullWidth
          variant="standard"
          minRows={4}
          value={text}
          disabled={loading}
          onChange={(e) => setText(e.target.value)}
          InputProps={{ disableUnderline: true }}
          sx={{ flex: 1, fontSize: "1.1rem" }}
        />

        {/* Image Previews */}
        {images.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, overflowX: "auto", py: 2 }}>
            {images.map((img, index) => (
              <Box key={index} sx={{ position: "relative", minWidth: 100, height: 100, borderRadius: 2, overflow: "hidden" }}>
                <img src={img} alt="prev" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <IconButton 
                  size="small" onClick={() => handleRemoveImage(index)}
                  sx={{ position: "absolute", top: 2, right: 2, bgcolor: "rgba(0,0,0,0.6)", color: "#fff", p: 0.5 }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* Footer Actions */}
        <Box sx={{ mt: "auto", pt: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" justifyContent="space-between">
            <Button 
                component="label" 
                startIcon={<CloudUpload />} 
                disabled={loading}
                sx={{ color: "#555", textTransform: "none", fontWeight: "bold" }} 
            >
              Upload
              <input type="file" hidden multiple accept="image/*" ref={fileInputRef} onChange={handleImageChange} />
            </Button>
            
            <Button 
              variant="contained" 
              onClick={handleSubmit} 
              disabled={loading}
              endIcon={!loading && <Send />}
              sx={{ borderRadius: 50, px: 3, bgcolor: "#000", "&:hover": { bgcolor: "#333" } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Post"}
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;