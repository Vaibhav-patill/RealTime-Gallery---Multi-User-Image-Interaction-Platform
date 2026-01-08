
export const UNSPLASH_API = {
  BASE_URL: 'https://api.unsplash.com',
  ACCESS_KEY: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
  PER_PAGE: 12, 
  COLLECTIONS: 'nature,architecture,people' 
};

export const INSTANTDB_APP_ID = import.meta.env.VITE_INSTANTDB_APP_ID;

export const ADMIN_EMAILS = [
  'vaibhav01302@gmail.com'
];

export const AVAILABLE_EMOJIS = ['❤️', '😍', '🔥', '👏', '😂', '🎉', '💯', '✨'];

export const ACTIVITY_TYPES = {
  EMOJI_ADDED: 'emoji_added',
  COMMENT_ADDED: 'comment_added',
  EMOJI_REMOVED: 'emoji_removed',
  COMMENT_DELETED: 'comment_deleted'
};

export const USER_COLORS = [
  '#FF6B6B',  
  '#4ECDC4',  
  '#45B7D1',  
  '#FFA07A',  
  '#98D8C8',  
  '#F7DC6F',  
  '#BB8FCE', 
  '#85C1E2', 
];

export const QUERY_KEYS = {
  IMAGES: 'images',
  IMAGE_DETAIL: 'imageDetail'
};

export const STORAGE_KEYS = {
  USER_ID: 'gallery_user_id',
  USER_NAME: 'gallery_user_name',
  USER_COLOR: 'gallery_user_color'
};