import { useState, useEffect } from 'react';
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
  const [isQuarterDropdownOpen, setIsQuarterDropdownOpen] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Semua'); // New state for selected quarter
  const [selectedForm, setSelectedForm] = useState('');

  const apiEndpoint = `http://localhost:3000/${kodeApi}`;
  const { data, isLoading, error } = useFetchData(apiEndpoint);
  const { pillarInfo, isLoadingPillar, errorPillar } = useFetchPillarTitle(IdPillar);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsQuarterDropdownOpen(false); // Close quarter dropdown when opening form dropdown
  };

  const handleQuarterDropdownToggle = () => {
    setIsQuarterDropdownOpen(!isQuarterDropdownOpen);
    setIsDropdownOpen(false); // Close form dropdown when opening quarter dropdown
  };

  const handleQuarterSelect = (quarter: string) => {
    setSelectedQuarter(quarter);
    setIsQuarterDropdownOpen(false);
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

  // Filter the data based on the selected quarter
  const filteredData = data.map(aksi => ({
    ...aksi,
    rincianKegiatan: aksi.rincianKegiatan.filter(rincian => 
      selectedQuarter === 'Semua' || rincian.quarter === selectedQuarter
    )
  })).filter(aksi => aksi.rincianKegiatan.length > 0);

  return (
    <div className="flex w-full h-full bg-white justify-center">
      <div className="w-full bg-white shadow-2xl overflow-hidden pb-10">
        <main className="p-6 sm:p-8">
          <section className="mb-8">
            <div className="w-full">
              <div className="flex items-center justify-between relative mb-4">
                {/* Quarter Filter Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={handleQuarterDropdownToggle}
                  >
                    <span>Filter: {selectedQuarter}</span>
                    <svg className={`-mr-1 h-5 w-5 text-white transition-transform duration-200 ${isQuarterDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isQuarterDropdownOpen && (
                    <div className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1" role="none">
                        <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" onClick={(e) => { e.preventDefault(); handleQuarterSelect('Semua'); }}>Semua Quarter</a>
                        <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" onClick={(e) => { e.preventDefault(); handleQuarterSelect('Quarter 1'); }}>Quarter 1</a>
                        <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" onClick={(e) => { e.preventDefault(); handleQuarterSelect('Quarter 2'); }}>Quarter 2</a>
                        <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" onClick={(e) => { e.preventDefault(); handleQuarterSelect('Quarter 3'); }}>Quarter 3</a>
                        <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" onClick={(e) => { e.preventDefault(); handleQuarterSelect('Quarter 4'); }}>Quarter 4</a>
                      </div>
                    </div>
                  )}
                </div>
                {/* Use the namaPillar from the pillarInfo object */}
                <h3 className="text-3xl font-semibold text-gray-800">{pillarInfo.namaPillar}</h3>
                {/* Form Options Dropdown */}
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
              {filteredData.map((item) => (
                <div key={item.id} className="flex h-full">
                  <div className="flex w-8/40 border-b-2 border-gray-700">
                    <div className="w-1/8 border-l-2 border-gray-700 bg-blue-300"><TableCell text={item.id} /></div>
                    <div className="w-7/8 border-l-2 border-white"><TableCell text={item.rencanaAksi} /></div>
                  </div>
                  <div className="flex-col w-32/40">
                    {item.rincianKegiatan.map((rincian) => (
                      <div key={rincian.id} className="flex border-b-2 border-gray-700">
                        <div className="w-1/32 bg-blue-300"><TableCell text={rincian.id} /></div>
                        <div className="w-9/32"><TableCell text={rincian.uraian} /></div>
                        <div className="w-3/32"><TableCell text={rincian.output} /></div>
                        <div className="w-2/32"><TableCell text={rincian.jumlah} /></div>
                        <div className="w-3/32"><TableCell text={rincian.quarter} /></div>
                        <div className="w-2/32"><TableCell text={rincian.realisasiJumlah} /></div>
                        <div className="w-3/32"><TableCell text={rincian.realisasiQuarter} /></div>
                        <div className="w-3/32"><TableCell text={rincian.pic} /></div>
                        <div className="w-6/32 border-r-2"><TableCell text={rincian.keterangan} /></div>
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