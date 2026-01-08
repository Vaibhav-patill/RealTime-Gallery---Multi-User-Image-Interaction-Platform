

import axios from 'axios';
import { UNSPLASH_API } from '../utils/constants';



const unsplashClient = axios.create({
  baseURL: UNSPLASH_API.BASE_URL,
  headers: {
    Authorization: `Client-ID ${UNSPLASH_API.ACCESS_KEY}`
  }
});


export const fetchImages = async (page = 1, perPage = UNSPLASH_API.PER_PAGE) => {
  try {
    const response = await unsplashClient.get('/photos', {
      params: {
        page,
        per_page: perPage,
        order_by: 'popular'
      }
    });

   
    return response.data.map(photo => ({
      id: photo.id,
      url: photo.urls.regular, 
      fullUrl: photo.urls.full, 
      thumbUrl: photo.urls.thumb, 
      description: photo.description || photo.alt_description || 'Untitled',
      photographer: {
        name: photo.user.name,
        username: photo.user.username,
        profileUrl: photo.user.links.html
      },
      color: photo.color, 
      likes: photo.likes,
      downloadUrl: photo.links.download
    }));
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    
    
    if (error.response?.status === 401) {
      throw new Error('Invalid Unsplash API key. Please check your .env file.');
    } else if (error.response?.status === 403) {
      throw new Error('Unsplash API rate limit exceeded. Please try again later.');
    } else {
      throw new Error('Failed to fetch images. Please check your internet connection.');
    }
  }
};


export const searchImages = async (query, page = 1, perPage = UNSPLASH_API.PER_PAGE) => {
  try {
    const response = await unsplashClient.get('/search/photos', {
      params: {
        query,
        page,
        per_page: perPage,
        order_by: 'relevant'
      }
    });

   
    return response.data.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      fullUrl: photo.urls.full,
      thumbUrl: photo.urls.thumb,
      description: photo.description || photo.alt_description || 'Untitled',
      photographer: {
        name: photo.user.name,
        username: photo.user.username,
        profileUrl: photo.user.links.html
      },
      color: photo.color,
      likes: photo.likes,
      downloadUrl: photo.links.download
    }));
  } catch (error) {
    console.error('Error searching images:', error);
    throw new Error('Failed to search images. Please try again.');
  }
};

export const getPhotoById = async (photoId) => {
  try {
    const response = await unsplashClient.get(`/photos/${photoId}`);
    const photo = response.data;

    return {
      id: photo.id,
      url: photo.urls.regular,
      fullUrl: photo.urls.full,
      thumbUrl: photo.urls.thumb,
      description: photo.description || photo.alt_description || 'Untitled',
      photographer: {
        name: photo.user.name,
        username: photo.user.username,
        profileUrl: photo.user.links.html
      },
      color: photo.color,
      likes: photo.likes,
      downloadUrl: photo.links.download,
      exif: photo.exif,
      location: photo.location 
    };
  } catch (error) {
    console.error('Error fetching photo details:', error);
    throw new Error('Failed to load image details.');
  }
};


export const triggerDownload = async (downloadUrl) => {
  try {
    await unsplashClient.get(downloadUrl);
  } catch (error) {
    console.error('Error triggering download:', error);
  }
};

export default {
  fetchImages,
  searchImages,
  getPhotoById,
  triggerDownload
};