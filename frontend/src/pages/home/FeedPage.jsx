import { useEffect, useState, useRef, useCallback } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import toast from "react-hot-toast";

// Internal Imports
import MainLayout from "../../components/layout/MainLayout";
import PostCard from "../../components/posts/PostCard";
import { fetchPosts } from "../../api/api.axios";

/**
 * FeedPage Component
 * * The main "Home" view of the application.
 * * Key Features:
 * - **Infinite Scroll**: Automatically fetches the next page of posts when the user scrolls to the bottom.
 * - **Pagination**: Manages page numbers and "hasMore" state to prevent unnecessary API calls.
 * - **Duplicate Filtering**: Ensures the same post isn't rendered twice when appending new data.
 * - **Real-time Refresh**: Resets the feed instantly when a new post is created.
 * * @component
 * @returns {JSX.Element} The rendered Feed UI.
 */
const FeedPage = () => {
  // --- STATE: PAGINATION ---
  const [page, setPage] = useState(1); // Current API page
  const [hasMore, setHasMore] = useState(true); // Flag: Are there more posts to fetch?
  const [isFetchingMore, setIsFetchingMore] = useState(false); // Loading state for the "bottom" spinner
  const observerRef = useRef(); // Ref to hold the IntersectionObserver instance

  // --- STATE: DATA ---
  const [posts, setPosts] = useState([]); // List of all loaded posts
  const [loading, setLoading] = useState(true); // Loading state for the "initial" screen
  const [error, setError] = useState(false);

  /**
   * Fetches posts from the backend.
   * @param {number} pageNum - The page number to fetch.
   * @param {boolean} [isNew=false] - If true, wipes existing posts (used for initial load or refresh).
   */
  const loadPosts = async (pageNum, isNew = false) => {
    try {
      // Set appropriate loading state based on context
      if (isNew) {
         setLoading(true);
      } else {
         setIsFetchingMore(true);
      }
      
      // API Call: Fetch 10 posts per page
      const { data } = await fetchPosts(pageNum, 10); 
      
      const newPosts = data.data || [];
      
      if (isNew) {
        // RESET: Replace all posts (Initial Load)
        setPosts(newPosts);
      } else {
        // APPEND: Add new posts to the bottom
        setPosts(prev => {
            // Defensive Coding: Filter out duplicates based on ID to prevent React key errors
            const existingIds = new Set(prev.map(post => post._id));
            const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post._id));
            return [...prev, ...uniqueNewPosts];
        });
      }

      // Check Logic: If we got fewer than 10 posts, we've reached the end of the DB.
      if (newPosts.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setError(false);
    } catch (err) {
      console.error("Failed to load posts", err);
      // Suppress 401 errors (handled by Axios Interceptor redirect)
      if (err.response?.status !== 401) {
        setError(true);
        toast.error("Could not load feed");
      }
    } finally {
      // Clean up loading states
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // --- EFFECT: INITIAL LOAD ---
  useEffect(() => {
    loadPosts(1, true);
  }, []);

  /**
   * Infinite Scroll Trigger
   * * A Callback Ref attached to the *last* post element in the DOM.
   * * When that element becomes visible (intersects viewport), we increment the page.
   */
  const lastPostRef = useCallback(node => {
      // Stop if already loading to prevent duplicate calls
      if (loading || isFetchingMore) return;
      
      // Disconnect previous observer to prevent memory leaks
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver(entries => {
          // If the last element is visible AND we know there is more data...
          if (entries[0].isIntersecting && hasMore) {
              setPage(prev => {
                  const nextPage = prev + 1;
                  loadPosts(nextPage, false); // Load next page, keeping existing data
                  return nextPage;
              });
          }
      });
      
      if (node) observerRef.current.observe(node);
  }, [loading, hasMore, isFetchingMore]);

  /**
   * Handler passed to CreatePostModal.
   * * Resets the entire feed to Page 1 so the user sees their new post immediately at the top.
   */
  const handlePostCreated = () => {
    setPage(1);
    loadPosts(1, true); 
  };

  return (
    <MainLayout onPostCreated={handlePostCreated}>
      <Box sx={{ p: 0 }}>
        
        {/* 1. INITIAL LOADING STATE (Full Center Spinner) */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress size={40} thickness={4} sx={{ color: "#333" }} />
          </Box>
        )}

        {/* 2. ERROR STATE */}
        {!loading && error && (
          <Typography textAlign="center" color="error" sx={{ mt: 5 }}>
            Failed to load posts. Please try again later.
          </Typography>
        )}

        {/* 3. EMPTY STATE */}
        {!loading && !error && posts.length === 0 && (
          <Typography textAlign="center" sx={{ mt: 5, color: "text.secondary" }}>
            No posts yet. Be the first to post!
          </Typography>
        )}

        {/* 4. POST LIST RENDER */}
        {!loading && posts.map((post, index) => {
             // Logic: Check if this is the LAST element in the array
             if (posts.length === index + 1) {
                 // Attach ref ONLY to the last element to trigger infinite scroll
                 return <div ref={lastPostRef} key={post._id}><PostCard post={post} /></div>;
             } else {
                 return <PostCard key={post._id} post={post} />;
             }
        })}
        
        {/* 5. PAGINATION LOADING STATE (Bottom Mini-Spinner) */}
        {isFetchingMore && (
           <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
             <CircularProgress size={24} />
           </Box>
        )}
      </Box>
    </MainLayout>
  );
};

export default FeedPage;