
import { db } from './instantdb';
import { tx } from '@instantdb/react';


export const deleteUser = async (userId, allReactions, allComments, allActivities) => {
  try {
    const deletions = [];
    
    deletions.push(tx.users[userId].delete());
    
    const userReactions = allReactions.filter(r => r.userId === userId);
    userReactions.forEach(r => deletions.push(tx.reactions[r.id].delete()));
    
    const userComments = allComments.filter(c => c.userId === userId);
    userComments.forEach(c => deletions.push(tx.comments[c.id].delete()));
    
    const userActivities = allActivities.filter(a => a.userId === userId);
    userActivities.forEach(a => deletions.push(tx.activities[a.id].delete()));
    
    await db.transact(deletions);
    
    return { 
      success: true, 
      deleted: {
        reactions: userReactions.length,
        comments: userComments.length,
        activities: userActivities.length
      }
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message };
  }
};

export const deleteReaction = async (reactionId) => {
  try {
    await db.transact([
      tx.reactions[reactionId].delete()
    ]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting reaction:', error);
    return { success: false, error: error.message };
  }
};


export const deleteComment = async (commentId) => {
  try {
    await db.transact([
      tx.comments[commentId].delete()
    ]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error: error.message };
  }
};


export const deleteActivity = async (activityId) => {
  try {
    await db.transact([
      tx.activities[activityId].delete()
    ]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting activity:', error);
    return { success: false, error: error.message };
  }
};

export const deleteAllImageReactions = async (imageId, reactions) => {
  try {
    const imageReactions = reactions.filter(r => r.imageId === imageId);
    const deletions = imageReactions.map(r => tx.reactions[r.id].delete());
    
    await db.transact(deletions);
    return { success: true, count: imageReactions.length };
  } catch (error) {
    console.error('Error deleting image reactions:', error);
    return { success: false, error: error.message };
  }
};


export const deleteAllImageComments = async (imageId, comments) => {
  try {
    const imageComments = comments.filter(c => c.imageId === imageId);
    const deletions = imageComments.map(c => tx.comments[c.id].delete());
    
    await db.transact(deletions);
    return { success: true, count: imageComments.length };
  } catch (error) {
    console.error('Error deleting image comments:', error);
    return { success: false, error: error.message };
  }
};


export const banUser = async (userId) => {
  try {
    await db.transact([
      tx.users[userId].update({ banned: true, bannedAt: Date.now() })
    ]);
    return { success: true };
  } catch (error) {
    console.error('Error banning user:', error);
    return { success: false, error: error.message };
  }
};

export const unbanUser = async (userId) => {
  try {
    await db.transact([
      tx.users[userId].update({ banned: false, bannedAt: null })
    ]);
    return { success: true };
  } catch (error) {
    console.error('Error unbanning user:', error);
    return { success: false, error: error.message };
  }
};

export const clearAllActivities = async (activities) => {
  try {
    const deletions = activities.map(a => tx.activities[a.id].delete());
    await db.transact(deletions);
    return { success: true, count: activities.length };
  } catch (error) {
    console.error('Error clearing activities:', error);
    return { success: false, error: error.message };
  }
};

export const deleteUserContent = async (userId, allReactions, allComments) => {
  try {
    const deletions = [];
    
    const userReactions = allReactions.filter(r => r.userId === userId);
    userReactions.forEach(r => deletions.push(tx.reactions[r.id].delete()));
    
    const userComments = allComments.filter(c => c.userId === userId);
    userComments.forEach(c => deletions.push(tx.comments[c.id].delete()));
    
    await db.transact(deletions);
    
    return { 
      success: true, 
      deleted: {
        reactions: userReactions.length,
        comments: userComments.length
      }
    };
  } catch (error) {
    console.error('Error deleting user content:', error);
    return { success: false, error: error.message };
  }
};

export default {
  deleteUser,
  deleteUserContent,
  deleteReaction,
  deleteComment,
  deleteActivity,
  deleteAllImageReactions,
  deleteAllImageComments,
  banUser,
  unbanUser,
  clearAllActivities
};