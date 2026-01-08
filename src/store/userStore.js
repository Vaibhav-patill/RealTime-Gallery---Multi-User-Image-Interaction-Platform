
import { create } from 'zustand';
import { generateUserId, generateUsername, getRandomColor } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';


const useUserStore = create((set, get) => ({
  userId: null,
  username: null,
  userColor: null,
  isInitialized: false,

  
  initializeUser: () => {
    try {
      const storedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      const storedUsername = localStorage.getItem(STORAGE_KEYS.USER_NAME);
      const storedColor = localStorage.getItem(STORAGE_KEYS.USER_COLOR);

      if (storedUserId && storedUsername && storedColor) {
        set({
          userId: storedUserId,
          username: storedUsername,
          userColor: storedColor,
          isInitialized: true
        });
      } else {
        const newUserId = generateUserId();
        const newUsername = generateUsername();
        const newColor = getRandomColor();

        localStorage.setItem(STORAGE_KEYS.USER_ID, newUserId);
        localStorage.setItem(STORAGE_KEYS.USER_NAME, newUsername);
        localStorage.setItem(STORAGE_KEYS.USER_COLOR, newColor);

        set({
          userId: newUserId,
          username: newUsername,
          userColor: newColor,
          isInitialized: true
        });
      }
    } catch (error) {
      console.error('Error initializing user:', error);
      
      set({
        userId: generateUserId(),
        username: generateUsername(),
        userColor: getRandomColor(),
        isInitialized: true
      });
    }
  },

 
  updateUsername: (newUsername) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_NAME, newUsername);
      set({ username: newUsername });
    } catch (error) {
      console.error('Error updating username:', error);
    }
  },

  
  resetUser: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
      localStorage.removeItem(STORAGE_KEYS.USER_NAME);
      localStorage.removeItem(STORAGE_KEYS.USER_COLOR);

      const newUserId = generateUserId();
      const newUsername = generateUsername();
      const newColor = getRandomColor();

      localStorage.setItem(STORAGE_KEYS.USER_ID, newUserId);
      localStorage.setItem(STORAGE_KEYS.USER_NAME, newUsername);
      localStorage.setItem(STORAGE_KEYS.USER_COLOR, newColor);

      set({
        userId: newUserId,
        username: newUsername,
        userColor: newColor
      });
    } catch (error) {
      console.error('Error resetting user:', error);
    }
  },

  
  getCurrentUser: () => {
    const state = get();
    return {
      userId: state.userId,
      username: state.username,
      userColor: state.userColor
    };
  }
}));

export default useUserStore;