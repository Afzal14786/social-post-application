import { useEffect, useState, useRef, useCallback } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import toast from "react-hot-toast";

import MainLayout from "../../components/layout/MainLayout";
import PostCard from "../../components/posts/PostCard";
import { fetchPosts } from "../../api/api.axios";

const FeedPage = () => {
  // Infinite Scroll State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerRef = useRef();

  // Data State
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPosts = async (pageNum, isNew = false) => {
    try {
      if (isNew) {
         setLoading(true);
      } else {
         setIsFetchingMore(true);
      }
      
      // Backend expects 'page' and 'limit'
      const { data } = await fetchPosts(pageNum, 10); 
      
      const newPosts = data.data || [];
      
      if (isNew) {
        setPosts(newPosts);
      } else {
        setPosts(prev => {
            const existingIds = new Set(prev.map(post => post._id));
            const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post._id));
            return [...prev, ...uniqueNewPosts];
        });
      }

      // Check if we reached the end
      if (newPosts.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setError(false);
    } catch (err) {
      console.error("Failed to load posts", err);
      // Only show error if it's NOT a 401 (which handles itself)
      if (err.response?.status !== 401) {
        setError(true);
        toast.error("Could not load feed");
      }
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    loadPosts(1, true);
  }, []);

  // Infinite Scroll Observer
  const lastPostRef = useCallback(node => {
      if (loading || isFetchingMore) return;
      
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && hasMore) {
              setPage(prev => {
                  const nextPage = prev + 1;
                  loadPosts(nextPage, false);
                  return nextPage;
              });
          }
      });
      
      if (node) observerRef.current.observe(node);
  }, [loading, hasMore, isFetchingMore]);

  const handlePostCreated = () => {
    setPage(1);
    loadPosts(1, true); 
  };

  return (
    <MainLayout onPostCreated={handlePostCreated}>
      <Box sx={{ p: 0 }}>
        
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress size={40} thickness={4} sx={{ color: "#333" }} />
          </Box>
        )}

        {!loading && error && (
          <Typography textAlign="center" color="error" sx={{ mt: 5 }}>
            Failed to load posts. Please try again later.
          </Typography>
        )}

        {/* This handles the "No Post" case without redirecting */}
        {!loading && !error && posts.length === 0 && (
          <Typography textAlign="center" sx={{ mt: 5, color: "text.secondary" }}>
            No posts yet. Be the first to post!
          </Typography>
        )}

        {!loading && posts.map((post, index) => {
             if (posts.length === index + 1) {
                 return <div ref={lastPostRef} key={post._id}><PostCard post={post} /></div>;
             } else {
                 return <PostCard key={post._id} post={post} />;
             }
        })}
        
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