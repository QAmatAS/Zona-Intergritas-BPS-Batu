import React, { useState, useEffect } from 'react';
import TableCell from './TableCell';
import TableHeader from './TableHeader';
import FormulirTambahPopup from './FormTambahPopup';
import FormulirEditPopup from './FormEditPopup';
import FormulirHapusPopup from './FormHapusPopup';
import FormUbahLinkPopup from './FormUbahLinkPopup';
import useFetchPillarTitle from './useFetchPillarTitle';

// --- Type Definitions ---
interface RincianKegiatan {
  id: number | string;
  uraian: string;
  output: string;
  jumlah: number;
  quarter: string;
  pic: string;
  keterangan: string;
  realisasiQuarter: string;
  realisasiJumlah: number;
}

interface AksiData {
  id: number | string;
  rencanaAksi: string;
  rincianKegiatan: RincianKegiatan[];
}

const useFetchData = (apiEndpoint: string) => {
  const [data, setData] = useState<AksiData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`Gagal mengambil data: ${response.statusText}`);
        }
        const result: AksiData[] = await response.json();
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Terjadi kesalahan yang tidak diketahui saat mengambil data.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  return { data, isLoading, error };
};

const MainCategory = ({ kodeApi, IdPillar }: { kodeApi: string; IdPillar: string }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState('');

  const apiEndpoint = `http://localhost:3000/${kodeApi}`;
  const { data, isLoading, error } = useFetchData(apiEndpoint);
  // Destructure the new object from the hook
  const { pillarInfo, isLoadingPillar, errorPillar } = useFetchPillarTitle(IdPillar);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedForm('');
  };

  const handleFormSelect = (formName: string) => {
    setSelectedForm(formName);
    setIsPopupOpen(true);
    setIsDropdownOpen(false);
  };

  if (isLoading || isLoadingPillar) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <p className="text-xl font-semibold">Memuat data...</p>
      </div>
    );
  }

  if (error || errorPillar) {
    return (
      <div className="flex w-full h-full justify-center items-center text-red-600">
        <p className="text-xl font-semibold">Error: {error || errorPillar}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <p className="text-xl font-semibold">Data tidak tersedia.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full bg-pink-100 justify-center">
      <div className="w-full bg-white shadow-2xl overflow-hidden">
        <main className="p-6 sm:p-8">
          <section className="mb-8">
            <div className="w-full">
              <div className="flex items-center justify-between relative mb-4">
                <div></div>
                {/* Use the namaPillar from the pillarInfo object */}
                <h3 className="text-3xl font-semibold text-gray-800">{pillarInfo.namaPillar}</h3>
                {/* <h2 className="text-2xl font-semibold text-gray-800">{pillarInfo.linkFolder}</h2> */}
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleDropdownToggle}
                  >
                    <span>Opsi Formulir</span>
                    <svg className={`-mr-1 h-5 w-5 text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1" role="none">
                        <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" onClick={(e) => { e.preventDefault(); handleFormSelect('FormulirTambah'); }}>Formulir Tambah</a>
                        <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" onClick={(e) => { e.preventDefault(); handleFormSelect('FormulirEdit'); }}>Formulir Edit</a>
                        <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" onClick={(e) => { e.preventDefault(); handleFormSelect('FormulirHapus'); }}>Formulir Hapus</a>
                        <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" onClick={(e) => { e.preventDefault(); handleFormSelect('FormulirUbahLink'); }}>Ubah Link Folder</a>
                        <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(pillarInfo.linkFolder).then(() => { alert('Teks berhasil disalin!'); }); }}>Salin Link Folder</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <TableHeader />
              {data.map((item) => (
                <div key={item.id} className="flex h-full">
                  <div className="flex w-7/40">
                    <div className="w-1/7 border-b-2 border-gray-700"><TableCell text={item.id} /></div>
                    <div className="w-6/7 border-b-2 border-gray-700"><TableCell text={item.rencanaAksi} /></div>
                  </div>
                  <div className="flex-col w-33/40">
                    {item.rincianKegiatan.map((rincian) => (
                      <div key={rincian.id} className="flex border-gray-700 border-b-2">
                        <div className="w-1/13"><TableCell text={rincian.id} /></div>
                        <div className="w-12/13"><TableCell text={rincian.uraian} /></div>
                        <div className="w-4/13"><TableCell text={rincian.output} /></div>
                        <div className="w-2/13"><TableCell text={rincian.jumlah} /></div>
                        <div className="w-4/13"><TableCell text={rincian.quarter} /></div>
                        <div className="w-4/13"><TableCell text={rincian.pic} /></div>
                        <div className="w-6/13"><TableCell text={rincian.keterangan} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
      {selectedForm === 'FormulirTambah' && isPopupOpen && (
        <FormulirTambahPopup
          isOpen={true}
          kodePillar={kodeApi}
          onClose={closePopup}
        />
      )}
      {selectedForm === 'FormulirEdit' && isPopupOpen && (
        <FormulirEditPopup
          isOpen={true}
          kodePillar={kodeApi}
          onClose={closePopup}
        />
      )}
      {selectedForm === 'FormulirHapus' && isPopupOpen && (
        <FormulirHapusPopup
          isOpen={true}
          kodePillar={kodeApi}
          onClose={closePopup}
        />
      )}
      {selectedForm === 'FormulirUbahLink' && isPopupOpen && (
        <FormUbahLinkPopup
          isOpen={true}
          onClose={closePopup} 
          initialPillarId={pillarInfo.id}
          />
      )}
    </div>
  );
};

export default MainCategory;