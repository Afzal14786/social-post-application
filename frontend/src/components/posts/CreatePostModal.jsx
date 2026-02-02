import { useState, useRef } from "react";
import { 
  Dialog, DialogContent, IconButton, Typography, 
  Box, TextField, Button, Stack, Divider, CircularProgress 
} from "@mui/material";
import { Close, CloudUpload, Send, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";

// API
import { createPost } from "../../api/api.axios";

/**
 * CreatePostModal Component
 * * A Modal Dialog that allows users to draft and publish new posts.
 * * Key Features:
 * - **Text Input**: Auto-expanding text area.
 * - **Image Upload**: Supports selecting up to 4 images.
 * - **Live Preview**: Shows thumbnails of selected images before uploading.
 * - **FormData**: Wraps data in `multipart/form-data` for backend compatibility.
 * * @component
 * @param {Object} props
 * @param {boolean} props.open - Controls the visibility of the modal.
 * @param {Function} props.onClose - Function to close the modal (triggered by X or clicking outside).
 * @param {Function} [props.onSuccess] - Callback function triggered after a successful post (used to refresh the feed).
 * @returns {JSX.Element} The Create Post Modal UI.
 */
const CreatePostModal = ({ open, onClose, onSuccess }) => {
  // --- State ---
  const [text, setText] = useState("");
  const [images, setImages] = useState([]); // Stores temporary URL blobs for UI Preview
  const [files, setFiles] = useState([]);   // Stores actual JS File objects to send to Backend
  const [loading, setLoading] = useState(false);
  
  // Ref to trigger hidden file input programmatically
  const fileInputRef = useRef(null);

  // --- Handlers ---

  /**
   * Handles file selection from the input.
   * 1. Validates that total images do not exceed 4.
   * 2. Generates local preview URLs using `URL.createObjectURL`.
   * 3. Updates both preview state and file object state.
   */
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validation: Max 4 images total
    if (images.length + selectedFiles.length > 4) {
      toast.error("Max 4 images allowed.");
      return;
    }

    // Generate previews
    const newImages = selectedFiles.map((file) => URL.createObjectURL(file));
    
    setImages((prev) => [...prev, ...newImages]); // UI State
    setFiles((prev) => [...prev, ...selectedFiles]); // Data State
  };

  /**
   * Removes a specific image from the staging area.
   * @param {number} index - The index of the image to remove.
   */
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Submits the post to the server.
   * 1. Checks validation (not empty).
   * 2. Wraps data in FormData (Required for file uploads).
   * 3. Calls API and handles response.
   */
  const handleSubmit = async () => {
    // Validation: Ensure post isn't empty
    if (!text.trim() && files.length === 0) {
      return toast.error("Post cannot be empty!");
    }

    setLoading(true);
    
    // Construct FormData
    const formData = new FormData();
    formData.append("content", text);
    
    // Append images using the key "images" (Must match backend Multer config)
    files.forEach((file) => {
      formData.append("images", file); 
    });

    try {
      const { data } = await createPost(formData);
      
      if (data.success) {
        toast.success("Post Created!");
        // Reset Form State
        setText("");
        setImages([]);
        setFiles([]);
        
        onClose(); // Close Modal
        if (onSuccess) onSuccess(); // Refresh Parent Feed
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  /** Prevents closing the modal accidentally while uploading */
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
      {/* ==============================
          HEADER: Title & Close Button
         ============================== */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, pt: 2 }}>
        <Typography variant="h6" fontWeight="bold">Create Post</Typography>
        <IconButton onClick={handleClose} disabled={loading}><Close /></IconButton>
      </Stack>

      {/* ==============================
          BODY: Inputs
         ============================== */}
      <DialogContent sx={{ minHeight: 300, display: "flex", flexDirection: "column" }}>
        
        {/* 1. Text Area */}
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

        {/* 2. Horizontal Image Preview Scrollbar */}
        {images.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, overflowX: "auto", py: 2 }}>
            {images.map((img, index) => (
              <Box key={index} sx={{ position: "relative", minWidth: 100, height: 100, borderRadius: 2, overflow: "hidden" }}>
                <img src={img} alt="prev" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                
                {/* Delete Button overlay */}
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

        {/* ==============================
            FOOTER: Actions
           ============================== */}
        <Box sx={{ mt: "auto", pt: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" justifyContent="space-between">
            
            {/* Upload Trigger Button */}
            <Button 
                component="label" 
                startIcon={<CloudUpload />} 
                disabled={loading}
                sx={{ color: "#555", textTransform: "none", fontWeight: "bold" }} 
            >
              Upload
              {/* Hidden File Input */}
              <input type="file" hidden multiple accept="image/*" ref={fileInputRef} onChange={handleImageChange} />
            </Button>
            
            {/* Submit Button */}
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