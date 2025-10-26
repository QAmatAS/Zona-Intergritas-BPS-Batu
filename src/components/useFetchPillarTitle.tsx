import { useState, useEffect } from 'react';

// Define the shape of the data fetched from the API
interface PillarData {
  _id: string;
  id: string;
  namaPillar: string;
  linkFolder: string;
  __v: number;
}

const useFetchPillarTitle = (IdPillar: string) => {
  const [pillarInfo, setPillarInfo] = useState<{
    id: string; // Added id to the state
    namaPillar: string;
    linkFolder: string;
  }>({ id: '', namaPillar: '', linkFolder: '' });
  const [isLoadingPillar, setIsLoadingPillar] = useState<boolean>(true);
  const [errorPillar, setErrorPillar] = useState<string | null>(null);

  useEffect(() => {
    if (!IdPillar) {
      setIsLoadingPillar(false);
      return;
    }

    const fetchPillarTitle = async () => {
      setIsLoadingPillar(true);
      try {
        const response = await fetch(`https://zona-intergritas-bps-batu-fank.vercel.app/DaftarPillar/${IdPillar}`);
        if (!response.ok) {
          throw new Error(`Gagal mengambil data pillar: ${response.statusText}`);
        }
        const result: PillarData[] = await response.json();

        if (result && result.length > 0) {
          setPillarInfo({
            id: result[0].id || '', // Set the id from the fetched data
            namaPillar: result[0].namaPillar || 'Judul Tidak Ditemukan',
            linkFolder: result[0].linkFolder || ''
          });
        } else {
          setPillarInfo({ id: '', namaPillar: 'Judul Tidak Ditemukan', linkFolder: '' });
        }
      } catch (err) {
        if (err instanceof Error) {
          setErrorPillar(err.message);
        } else {
          setErrorPillar('Terjadi kesalahan yang tidak diketahui saat mengambil data.');
        }
      } finally {
        setIsLoadingPillar(false);
      }
    };

    fetchPillarTitle();
  }, [IdPillar]);

  return { pillarInfo, isLoadingPillar, errorPillar };
};

export default useFetchPillarTitle;