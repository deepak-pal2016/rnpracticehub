/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect } from 'react';

const EMPTY_ARRAY: any[] = [];

/**
 * Generic pagination hook for React Native FlatLists
 * @param allData 
 * @param pageSize 
 */

export const UsePagination = <T,>(allData: T[] = EMPTY_ARRAY, pageSize: number) => {
  const [page, setPage] = useState<any>(1);
  const [data, setData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const firstData = allData.slice(0, pageSize);
    setData(firstData);
    setPage(2);
    setHasMore(firstData.length < allData?.length);
  }, [allData, pageSize]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      setPage((prevPage: any) => {
        const start = (prevPage - 1) * pageSize;
        const end = prevPage * pageSize;

        const newItems = allData.slice(start, end);

        if (newItems.length === 0) {
          setHasMore(false);
        } else {
          setData(prev => [...prev, ...newItems]);
        }

        return prevPage + 1;
      });

      setLoading(false);
    }, 500);
  }, [loading, hasMore, allData, pageSize]);

  return { data, loading, hasMore, loadMore };
};