//useFetchData.js

import { useState, useEffect } from 'react';

// Define the types for your data structure
interface RincianKegiatan {
  id: number;
  uraian: string;
  output: string;
  jumlah: number;
  quarter: string;
  pic: string;
  keterangan: string;
}

interface RencanaAksi {
  id: number;
  rencanaAksi: string;
  rincianKegiatan: RincianKegiatan[];
}

// Define the type for the data that the hook returns
interface FetchResult<T> {
  data: T;
  isLoading: boolean;
  error: string | null;
}

const useFetchData = (apiEndpoint: string): FetchResult<RencanaAksi[]> => {
  const [data, setData] = useState<RencanaAksi[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json() as RencanaAksi[];
        setData(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  return { data, isLoading, error };
};

export default useFetchData;