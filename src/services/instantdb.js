

import { init, tx, id } from '@instantdb/react';
import { INSTANTDB_APP_ID } from '../utils/constants';

const db = init({
  appId: INSTANTDB_APP_ID
});

export const addReaction = async (imageId, emoji, user) => {
  const reactionId = id(); 
  
  const reaction = {
    id: reactionId,
    imageId,
    emoji,
    userId: user.userId,
    username: user.username,
    userColor: user.userColor,
    timestamp: Date.now()
  };

  await db.transact([
    tx.reactions[reactionId].update(reaction)
  ]);

  
  await addActivity({
    type: 'emoji_added',
    imageId,
    userId: user.userId,
    username: user.username,
    userColor: user.userColor,
    emoji,
    timestamp: Date.now()
  });

  return reaction;
};


export const removeReaction = async (reactionId, imageId, user) => {
  await db.transact([
    tx.reactions[reactionId].delete()
  ]);

  await addActivity({
    type: 'emoji_removed',
    imageId,
    userId: user.userId,
    username: user.username,
    userColor: user.userColor,
    timestamp: Date.now()
  });
};


export const addComment = async (imageId, text, user) => {
  const commentId = id(); 
  
  const comment = {
    id: commentId,
    imageId,
    text,
    userId: user.userId,
    username: user.username,
    userColor: user.userColor,
    timestamp: Date.now()
  };

  await db.transact([
    tx.comments[commentId].update(comment)
  ]);

  await addActivity({
    type: 'comment_added',
    imageId,
    userId: user.userId,
    username: user.username,
    userColor: user.userColor,
    commentText: text,
    timestamp: Date.now()
  });

  return comment;
};

export const deleteComment = async (commentId, imageId, user) => {
  await db.transact([
    tx.comments[commentId].delete()
  ]);

  await addActivity({
    type: 'comment_deleted',
    imageId,
    userId: user.userId,
    username: user.username,
    userColor: user.userColor,
    timestamp: Date.now()
  });
};

export const addActivity = async (activityData) => {
  const activityId = id(); 
  
  const activity = {
    id: activityId,
    ...activityData
  };

  await db.transact([
    tx.activities[activityId].update(activity)
  ]);

  return activity;
};

export const cleanupOldActivities = async (activities) => {
  if (activities.length > 100) {
    const toDelete = activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(100); 

    const deletions = toDelete.map(activity => 
      tx.activities[activity.id].delete()
    );

    await db.transact(deletions);
  }
};

export { db };

export default {
  addReaction,
  removeReaction,
  addComment,
  deleteComment,
  addActivity,
  cleanupOldActivities
};