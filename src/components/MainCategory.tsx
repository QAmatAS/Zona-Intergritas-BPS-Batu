import { useState, useEffect } from 'react';
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
  linkLaporanKegiatan: string;
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
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Semua');
  const [selectedForm, setSelectedForm] = useState('');
  
  // State untuk melacak aksi mana yang terbuka (Tingkat 1)
  const [openAksiIds, setOpenAksiIds] = useState<(number | string)[]>([]);

  // State baru untuk melacak rincian kegiatan mana yang terbuka (Tingkat 2)
  // Kita akan menggunakan kombinasi AksiId-RincianId untuk memastikan keunikan (misalnya "1-2")
  const [openRincianIds, setOpenRincianIds] = useState<string[]>([]);


  const apiEndpoint = `http://localhost:3000/${kodeApi}`;
  const { data, isLoading, error } = useFetchData(apiEndpoint);
  const { pillarInfo, isLoadingPillar, errorPillar } = useFetchPillarTitle(IdPillar);

  // Fungsi untuk membuka/menutup detail rincian kegiatan (Tingkat 1)
  const handleAksiToggle = (id: number | string) => {
    setOpenAksiIds(prevIds => 
      prevIds.includes(id) 
        ? prevIds.filter(aksiId => aksiId !== id)
        : [...prevIds, id]
    );
  };
  
  // Fungsi untuk membuka/menutup detail rincian kegiatan (Tingkat 2)
  const handleRincianToggle = (aksiId: number | string, rincianId: number | string) => {
    const uniqueId = `${aksiId}-${rincianId}`;
    setOpenRincianIds(prevIds =>
      prevIds.includes(uniqueId)
        ? prevIds.filter(id => id !== uniqueId)
        : [...prevIds, uniqueId]
    );
  };


  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsQuarterDropdownOpen(false);
  };

  const handleQuarterDropdownToggle = () => {
    setIsQuarterDropdownOpen(!isQuarterDropdownOpen);
    setIsDropdownOpen(false);
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
  
  // Fungsi helper untuk memeriksa apakah aksi terbuka (Tingkat 1)
  const isAksiOpen = (id: number | string) => openAksiIds.includes(id);

  // Fungsi helper untuk memeriksa apakah rincian terbuka (Tingkat 2)
  const isRincianOpen = (aksiId: number | string, rincianId: number | string) => openRincianIds.includes(`${aksiId}-${rincianId}`);


  return (
    <div className="flex w-full h-full bg-gray-100 justify-center">
      <div className="w-full max-w-7xl bg-white shadow-2xl overflow-hidden pb-10">
        <main className="p-6 sm:p-8">
          <section className="mb-8">
            <div className="w-full">
              <div className="flex items-center justify-between relative mb-8">
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
                <h3 className="text-3xl font-bold text-gray-800 text-center flex-grow">{pillarInfo.namaPillar}</h3>
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
              {/* Main Content: Action Plans and Activities */}
              <div className="space-y-8">
                {filteredData.map((aksi) => (
                  <div key={aksi.id} className="bg-white border border-gray-300 rounded-lg shadow-md">
                    {/* Action Plan (Rencana Aksi) Header - Clickable to toggle activities list (Tingkat 1) */}
                    <div 
                      className="flex items-center justify-between p-5 cursor-pointer hover:bg-indigo-50 transition duration-150"
                      onClick={() => handleAksiToggle(aksi.id)}
                    >
                      <h4 className="text-xl font-semibold text-indigo-700 flex-grow">
                        {aksi.id}. {aksi.rencanaAksi}
                      </h4>
                      <svg 
                        className={`w-5 h-5 text-indigo-600 transition-transform duration-300 ${isAksiOpen(aksi.id) ? 'rotate-180' : ''}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>

                    {/* Activities (Rincian Kegiatan) List - Conditional Rendering (Tingkat 1) */}
                    {isAksiOpen(aksi.id) && (
                      <div className="border-t border-indigo-200 p-5 pt-0">
                        <div className="space-y-3 ml-4">
                          {aksi.rincianKegiatan.map((rincian) => (
                            <div key={rincian.id} className="bg-white border border-gray-200 rounded-md shadow-sm">
                              {/* Rincian Kegiatan Uraian - Clickable to toggle details (Tingkat 2) */}
                              <div
                                className="flex items-center justify-between p-3 cursor-pointer hover:bg-indigo-50 transition duration-150"
                                onClick={() => handleRincianToggle(aksi.id, rincian.id)}
                              >
                                <p className="font-medium text-gray-800 flex-grow">
                                  {/* <span className="text-indigo-600 font-bold mr-2">[{rincian.id}]</span> */}
                                  {rincian.uraian}
                                </p>
                                <svg 
                                  className={`w-4 h-4 text-indigo-500 transition-transform duration-300 ${isRincianOpen(aksi.id, rincian.id) ? 'rotate-180' : ''}`} 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  viewBox="0 0 20 20" 
                                  fill="currentColor"
                                >
                                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </div>

                              {/* Rincian Kegiatan Detail - Conditional Rendering (Tingkat 2) */}
                              {isRincianOpen(aksi.id, rincian.id) && (
                                <div className="border-t border-gray-200 p-3 bg-gray-50 text-sm">
                                  
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-md text-gray-600">
                                    <div>
                                      <span className="font-semibold text-indigo-500">Target:</span> {rincian.jumlah} {rincian.output} ({rincian.quarter})
                                    </div>
                                    <div>
                                      <span className="font-semibold text-indigo-500">Realisasi:</span> {rincian.realisasiJumlah} {rincian.output} ({rincian.realisasiQuarter})
                                    </div>
                                    <div>
                                      <span className="font-semibold text-indigo-500">PIC:</span> {rincian.pic}
                                    </div>
                                    <div>
                                      <span className="font-semibold text-indigo-500">Link Folder:</span> {rincian.linkLaporanKegiatan}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-1 gap-3 text-md text-gray-600 mt-5">
                                    <div className="">
                                      <span className="font-semibold text-indigo-500">Keterangan:</span> {rincian.keterangan || '-'}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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