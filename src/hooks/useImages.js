
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchImages } from '../services/unsplash';
import { QUERY_KEYS } from '../utils/constants';


const useImages = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.IMAGES],
    
    queryFn: async ({ pageParam = 1 }) => {
      const images = await fetchImages(pageParam);
      return {
        images,
        nextPage: pageParam + 1
      };
    },
    
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.images.length > 0) {
        return lastPage.nextPage;
      }
      return undefined; 
    },
    
    initialPageParam: 1,
    
    refetchOnWindowFocus: false,
    
    staleTime: 5 * 60 * 1000,
  });

  const images = data?.pages.flatMap(page => page.images) || [];

  return {
    images,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  };
};

export default useImages;