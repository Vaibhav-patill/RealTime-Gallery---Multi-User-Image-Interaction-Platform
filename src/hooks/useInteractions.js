
import { useMemo, useCallback } from 'react';
import { db, addReaction, removeReaction, addComment, deleteComment } from '../services/instantdb';
import { useAuth } from '../contexts/AuthContext';


const useInteractions = (imageId = null) => {
  const { getCurrentUser } = useAuth();

  const { isLoading, error, data } = db.useQuery({
    reactions: {},
    comments: {},
    activities: {}
  });

  const imageReactions = useMemo(() => {
    if (!data?.reactions || !imageId) return [];
    return data.reactions.filter(r => r.imageId === imageId);
  }, [data?.reactions, imageId]);

  const imageComments = useMemo(() => {
    if (!data?.comments || !imageId) return [];
    return data.comments
      .filter(c => c.imageId === imageId)
      .sort((a, b) => a.timestamp - b.timestamp); 
  }, [data?.comments, imageId]);

  const allActivities = useMemo(() => {
    if (!data?.activities) return [];
    return [...data.activities].sort((a, b) => b.timestamp - a.timestamp);
  }, [data?.activities]);

  const groupedReactions = useMemo(() => {
    if (!imageReactions.length) return {};
    
    return imageReactions.reduce((acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = [];
      }
      acc[reaction.emoji].push(reaction);
      return acc;
    }, {});
  }, [imageReactions]);

  const handleAddReaction = useCallback(async (emoji) => {
    if (!imageId) return;
    
    const user = getCurrentUser();
    
    const existingReaction = imageReactions.find(
      r => r.userId === user.userId
    );

    if (existingReaction) {
      if (existingReaction.emoji === emoji) {
        await removeReaction(existingReaction.id, imageId, user);
      } else {
        await removeReaction(existingReaction.id, imageId, user);
        await addReaction(imageId, emoji, user);
      }
    } else {
      await addReaction(imageId, emoji, user);
    }
  }, [imageId, imageReactions, getCurrentUser]);

  const handleAddComment = useCallback(async (text) => {
    if (!imageId || !text.trim()) return;
    
    const user = getCurrentUser();
    await addComment(imageId, text, user);
  }, [imageId, getCurrentUser]);

  const handleDeleteComment = useCallback(async (commentId) => {
    if (!imageId) return;
    
    const user = getCurrentUser();
    const comment = imageComments.find(c => c.id === commentId);
    
    if (comment && comment.userId === user.userId) {
      await deleteComment(commentId, imageId, user);
    }
  }, [imageId, imageComments, getCurrentUser]);

  const hasUserReacted = useCallback((emoji) => {
    const user = getCurrentUser();
    return imageReactions.some(
      r => r.userId === user.userId && r.emoji === emoji
    );
  }, [imageReactions, getCurrentUser]);

  const getUserReaction = useCallback(() => {
    const user = getCurrentUser();
    const reaction = imageReactions.find(r => r.userId === user.userId);
    return reaction?.emoji || null;
  }, [imageReactions, getCurrentUser]);

  return {
    reactions: imageReactions,
    comments: imageComments,
    activities: allActivities,
    groupedReactions,
    
    isLoading,
    error,
    
    addReaction: handleAddReaction,
    addComment: handleAddComment,
    deleteComment: handleDeleteComment,
    hasUserReacted,
    getUserReaction,
    
    totalReactions: imageReactions.length,
    totalComments: imageComments.length
  };
};

export default useInteractions;