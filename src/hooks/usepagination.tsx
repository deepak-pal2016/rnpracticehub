import { useState, useCallback, useEffect } from 'react';

/**
 * Generic pagination hook for React Native FlatLists
 * @param allData 
 * @param pageSize 
 */
export const UsePagination = <T,>(allData: T[] = [], pageSize:any) => {
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
  }, [allData]);

  useEffect(() => {
    loadMore();
  }, [allData]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newItems = allData.slice((page - 1) * pageSize, page * pageSize);
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setData(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.log('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, allData, pageSize]);

  return { data, loading, hasMore, loadMore };
};
