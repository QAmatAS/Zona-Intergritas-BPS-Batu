import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { createPortal } from 'react-dom';

// --- Type Definitions ---
// Define the shape of the form data state.
interface FormData {
  idAksi: string;
  idKegiatan: string;
  uraianKegiatan: string;
  output: string;
  jumlah: number;
  realisasiQuarter: string;
  realisasiJumlah: number;
  quarter: string;
  pic: string;
  keterangan: string;
}

// Define the shape of the data fetched from the API.
interface RincianKegiatan {
  id: number | string;
  uraian: string;
}

interface AksiData {
  id: number | string;
  rencanaAksi: string;
  rincianKegiatan: RincianKegiatan[];
}

// Define the shape of the custom message box state.
interface MessageState {
  show: boolean;
  type: 'success' | 'error';
  text: string;
}

/**
 * A modal form component for reporting activities.
 * It fetches data from a dynamic API endpoint and allows adding new activities or
 * new action plans. The component is a reusable popup.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the popup.
 * @param {string} props.kodePillar - The dynamic part of the API endpoint (e.g., 'PillarDua').
 * @param {() => void} props.onClose - Function to call when the popup needs to be closed.
 */
const FormulirTambahPopup: React.FC<{ isOpen: boolean; kodePillar: string; onClose: () => void }> = ({ isOpen, kodePillar, onClose }) => {
  // Form state with the defined FormData type
  const [formData, setFormData] = useState<FormData>({
    idAksi: '',
    idKegiatan: '',
    uraianKegiatan: '',
    output: '',
    jumlah: 0,
    realisasiQuarter: '',
    realisasiJumlah: 0,
    quarter: '',
    pic: '',
    keterangan: ''
  });

  // States to hold the fetched data
  const [fullData, setFullData] = useState<AksiData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for the custom message box
  const [message, setMessage] = useState<MessageState>({
    show: false,
    type: 'success',
    text: ''
  });

  // State to toggle between adding to existing aksi or creating a new one
  const [isNewAksi, setIsNewAksi] = useState<boolean>(false);
  const [newRencanaAksi, setNewRencanaAksi] = useState<string>('');

  // Function to show the custom message box
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ show: true, type, text });
    setTimeout(() => {
      setMessage({ show: false, type: 'success', text: '' });
    }, 5000); // Hide after 5 seconds
  };

  // useEffect to fetch data on component mount or when kodePillar changes
  useEffect(() => {
    if (!isOpen) return;

    const fetchFullData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://zona-intergritas-bps-batu-fank.vercel.app/${kodePillar}`);
        if (!response.ok) {
          throw new Error('Gagal mengambil data dari API.');
        }

        const data = await response.json();
        setFullData(data);
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

    fetchFullData();
  }, [isOpen, kodePillar]);

  // Function to handle changes in all form inputs (input, textarea, select)
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Logic for handling the ID Aksi dropdown and auto-generating the next ID Kegiatan
    if (name === 'idAksi') {
      const selectedAksi = fullData.find(aksi => String(aksi.id) === value);
      if (selectedAksi) {
        const maxId = selectedAksi.rincianKegiatan.length > 0
          ? Math.max(...selectedAksi.rincianKegiatan.map(kegiatan => Number(kegiatan.id)))
          : 0;
        const newKegiatanId = String(maxId + 1);
        
        setFormData(prevState => ({
          ...prevState,
          idAksi: value,
          idKegiatan: newKegiatanId,
        }));
      } else {
        setFormData(prevState => ({
          ...prevState,
          idAksi: value,
          idKegiatan: '', // Reset if no Aksi is selected
        }));
      }
    } else {
      // Logic for all other form fields
      setFormData(prevState => ({
        ...prevState,
        [name]: type === 'number' ? parseInt(value) || 0 : value
      }));
    }
  };

  // Function to toggle between existing and new Aksi forms
  const handleToggleForm = () => {
    setIsNewAksi(!isNewAksi);
    setFormData({
      idAksi: '',
      idKegiatan: '',
      uraianKegiatan: '',
      output: '',
      jumlah: 0,
      realisasiQuarter: '',
      realisasiJumlah: 0,
      quarter: '',
      pic: '',
      keterangan: ''
    });
    setNewRencanaAksi('');
  };

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    let dataToPost: any;
    let apiEndpoint: string;
    let requestMethod: string;

    if (isNewAksi) {
      // If creating a new Aksi, prepare data for a new POST request
      const nextAksiId = fullData.length > 0
        ? Math.max(...fullData.map(d => Number(d.id))) + 1
        : 1;
      
      dataToPost = {
        id: nextAksiId,
        rencanaAksi: newRencanaAksi,
        rincianKegiatan: [
          {
            id: 1, // First rincianKegiatan for a new aksi always gets ID 1
            uraian: formData.uraianKegiatan,
            output: formData.output,
            jumlah: formData.jumlah,
            realisasiQuarter: formData.realisasiQuarter,
            realisasiJumlah: formData.realisasiJumlah,
            quarter: formData.quarter,
            pic: formData.pic,
            keterangan: formData.keterangan,
          }
        ]
      };
      apiEndpoint = `https://zona-intergritas-bps-batu-fank.vercel.app/${kodePillar}`;
      requestMethod = 'POST';
    } else {
      // If adding to an existing Aksi, prepare data for the add-rincian endpoint
      dataToPost = {
        id: formData.idKegiatan,
        uraian: formData.uraianKegiatan,
        output: formData.output,
        jumlah: formData.jumlah,
        realisasiQuarter: formData.realisasiQuarter,
        realisasiJumlah: formData.realisasiJumlah,
        quarter: formData.quarter,
        pic: formData.pic,
        keterangan: formData.keterangan,
      };
      apiEndpoint = `https://zona-intergritas-bps-batu-fank.vercel.app/${kodePillar}/add-rincian/${formData.idAksi}`;
      requestMethod = 'POST';
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: requestMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToPost),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Data berhasil dikirim:', result);
        showMessage('success', 'Data berhasil disimpan. Halaman akan dimuat ulang...');
        
        // Refresh the page
        window.location.reload();

      } else if (response.status === 409) {
        showMessage('error', 'Gagal menyimpan data. ID Aksi atau ID Kegiatan sudah ada.');
      } else {
        console.error('Gagal mengirim data:', response.statusText);
        showMessage('error', 'Gagal menyimpan data. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Terjadi kesalahan:', err);
      showMessage('error', 'Terjadi kesalahan saat terhubung ke server.');
    }
  };

  if (!isOpen) return null;

  // Render logic for loading and error states
  if (isLoading) {
    return createPortal(
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full text-center">
          <p className="text-xl text-gray-700">Memuat data...</p>
        </div>
      </div>,
      document.body
    );
  }

  if (error) {
    return createPortal(
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full text-center">
          <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Tutup</button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // Find the selected Rencana Aksi based on the form state
  const selectedAksi = fullData.find(aksi => String(aksi.id) === formData.idAksi);

  // Main form component rendering
  return createPortal(
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans"
      onClick={(e) => {
        // Cek apakah yang diklik adalah elemen div overlay itu sendiri
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold leading-none">&times;</button>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Formulir Laporan Kegiatan</h2>
        
        {/* Custom message box */}
        {message.show && (
          <div className={`p-4 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Toggle button */}
        <button
          type="button"
          onClick={handleToggleForm}
          className="mb-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {isNewAksi ? 'Tambahkan Rincian Saja' : 'Tambahkan Rencana Aksi Baru'}
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* ID Aksi input field */}
          <div className="lg:col-span-1">
            <label htmlFor="idAksi" className="block text-sm font-medium text-gray-700">ID Aksi</label>
            {isNewAksi ? (
              <input
                type="text"
                name="idAksi"
                id="idAksi"
                value={String(fullData.length > 0 ? Math.max(...fullData.map(d => Number(d.id))) + 1 : 1)}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed focus:outline-none"
              />
            ) : (
              <select
                name="idAksi"
                id="idAksi"
                value={formData.idAksi}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Pilih ID Aksi</option>
                {fullData.map(aksi => (
                  <option key={aksi.id} value={String(aksi.id)}>
                    {aksi.id} - {aksi.rencanaAksi}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Rencana Aksi field (Dynamic based on form mode) */}
          <div className="lg:col-span-2">
            <label htmlFor="rencanaAksi" className="block text-sm font-medium text-gray-700">Rencana Aksi</label>
            {isNewAksi ? (
              <input
                name="newRencanaAksi"
                id="newRencanaAksi"
                value={newRencanaAksi}
                onChange={e => setNewRencanaAksi(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            ) : (
              <input
                name="rencanaAksi"
                id="rencanaAksi"
                value={selectedAksi ? selectedAksi.rencanaAksi : ''}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed focus:outline-none"
              />
            )}
          </div>

          {/* ID Kegiatan field (auto-generated) */}
          <div className="lg:col-span-1">
            <label htmlFor="idKegiatan" className="block text-sm font-medium text-gray-700">ID Kegiatan</label>
            <input
              type="text"
              name="idKegiatan"
              id="idKegiatan"
              value={isNewAksi ? '1' : formData.idKegiatan || 'Otomatis'}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* Uraian Rincian Kegiatan field */}
          <div className="md:col-span-2 lg:row-span-2">
            <label htmlFor="uraianKegiatan" className="block text-sm font-medium text-gray-700">Uraian Rincian Kegiatan</label>
            <textarea
              name="uraianKegiatan"
              id="uraianKegiatan"
              value={formData.uraianKegiatan}
              onChange={handleChange}
              rows={5}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-y"
            />
          </div>

          {/* Quarter field (dropdown) */}
          <div>
            <label htmlFor="quarter" className="block text-sm font-medium text-gray-700">Target Quarter</label>
            <select
              name="quarter"
              id="quarter"
              value={formData.quarter}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Pilih Quarter</option>
              <option value="Quarter 1">Quarter 1</option>
              <option value="Quarter 2">Quarter 2</option>
              <option value="Quarter 3">Quarter 3</option>
              <option value="Quarter 4">Quarter 4</option>
            </select>
          </div>

          {/* Jumlah field */}
          <div>
            <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700">Target Jumlah</label>
            <input
              type="number"
              name="jumlah"
              id="jumlah"
              value={formData.jumlah}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Output field */}
          <div>
            <label htmlFor="output" className="block text-sm font-medium text-gray-700">Output</label>
            <input
              type="text"
              name="output"
              id="output"
              value={formData.output}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* PIC field */}
          <div>
            <label htmlFor="pic" className="block text-sm font-medium text-gray-700">PIC</label>
            <input
              type="text"
              name="pic"
              id="pic"
              value={formData.pic}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Realisasi Quarter field (dropdown) */}
          <div>
            <label htmlFor="realisasiQuarter" className="block text-sm font-medium text-gray-700">Realisasi Quarter</label>
            <select
              name="realisasiQuarter"
              id="realisasiQuarter"
              value={formData.realisasiQuarter}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Pilih Quarter</option>
              <option value="Belum Terealisasi">Belum Terealisasi</option>
              <option value="Quarter 1">Quarter 1</option>
              <option value="Quarter 2">Quarter 2</option>
              <option value="Quarter 3">Quarter 3</option>
              <option value="Quarter 4">Quarter 4</option>
            </select>
          </div>
          
          {/* Keterangan field */}
          <div className="md:col-span-2 lg:row-span-2">
            <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">Keterangan</label>
            <textarea
              name="keterangan"
              id="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              rows={5}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-y"
            />
          </div>

          {/* Realisasi Jumlah field */}
          <div>
            <label htmlFor="realisasiJumlah" className="block text-sm font-medium text-gray-700">Realisasi Jumlah</label>
            <input
              type="number"
              name="realisasiJumlah"
              id="realisasiJumlah"
              value={formData.realisasiJumlah}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit button */}
          <div className="lg:col-span-3">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default FormulirTambahPopup;