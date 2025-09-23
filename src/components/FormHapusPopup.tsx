import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { createPortal } from 'react-dom';

// --- Type Definitions ---
interface RincianKegiatan {
  id: number | string;
  uraian: string;
  output: string;
  jumlah: number;
  quarter: string;
  pic: string;
  keterangan: string;
}

interface AksiData {
  id: number | string;
  rencanaAksi: string;
  rincianKegiatan: RincianKegiatan[];
}

interface MessageState {
  show: boolean;
  type: 'success' | 'error';
  text: string;
}

/**
 * A modal form component for deleting activities or entire action plans.
 * It fetches data from a dynamic API endpoint and allows users to delete
 * a specific activity or a whole action plan. The component is a reusable popup.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the popup.
 * @param {string} props.kodePillar - The dynamic part of the API endpoint (e.g., 'PillarDua').
 * @param {() => void} props.onClose - Function to call when the popup needs to be closed.
 */
const FormulirHapusPopup: React.FC<{ isOpen: boolean; kodePillar: string; onClose: () => void }> = ({ isOpen, kodePillar, onClose }) => {
  // States to hold the fetched data and selected IDs
  const [fullData, setFullData] = useState<AksiData[]>([]);
  const [selectedAksiId, setSelectedAksiId] = useState<string>('');
  const [selectedRincianId, setSelectedRincianId] = useState<string>('');
  const [rincianDisplayData, setRincianDisplayData] = useState<RincianKegiatan | null>(null);

  // States for loading, error, and custom messages
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageState>({
    show: false,
    type: 'success',
    text: ''
  });

  // Function to show the custom message box
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ show: true, type, text });
    setTimeout(() => {
      setMessage({ show: false, type: 'success', text: '' });
    }, 5000);
  };

  // useEffect to fetch data when the popup opens or kodePillar changes
  useEffect(() => {
    if (!isOpen) return;

    const fetchFullData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/${kodePillar}`);
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

  // Function to handle changes in the ID Aksi dropdown
  const handleAksiChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedAksiId(value);
    setSelectedRincianId('');
    setRincianDisplayData(null);
  };

  // Function to handle changes in the ID Rincian Kegiatan dropdown
  const handleRincianChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRincianId(value);
    
    const selectedAksi = fullData.find(aksi => String(aksi.id) === selectedAksiId);
    if (selectedAksi) {
      const selectedRincian = selectedAksi.rincianKegiatan.find(rincian => String(rincian.id) === value);
      setRincianDisplayData(selectedRincian || null);
    }
  };

  // Function to handle the deletion of a specific activity
  const handleDeleteRincian = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAksiId || !selectedRincianId) {
      showMessage('error', 'Silakan pilih ID Aksi dan ID Rincian untuk dihapus.');
      return;
    }
    
    const apiEndpoint = `http://localhost:3000/${kodePillar}/delete-rincian/${selectedAksiId}/${selectedRincianId}`; 
    
    if (!window.confirm(`Apakah Anda yakin ingin menghapus Rincian Kegiatan dengan ID: ${selectedRincianId} dari Aksi dengan ID: ${selectedAksiId}?`)) {
      return;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'DELETE',
      });

      if (response.ok) {
        showMessage('success', 'Rincian Kegiatan berhasil dihapus!');
        window.location.reload(); // Refresh halaman setelah penghapusan
      } else if (response.status === 404) {
        showMessage('error', 'Gagal menghapus data. ID Aksi atau ID Rincian tidak ditemukan.');
      } else {
        console.error('Gagal menghapus data:', response.statusText);
        showMessage('error', 'Gagal menghapus data. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Terjadi kesalahan:', err);
      showMessage('error', 'Terjadi kesalahan saat terhubung ke server.');
    }
  };

  // Function to handle the deletion of a whole action plan
  const handleDeleteAksi = async () => {
    if (!selectedAksiId) {
      showMessage('error', 'Silakan pilih ID Aksi yang ingin dihapus.');
      return;
    }

    const apiEndpoint = `http://localhost:3000/${kodePillar}/${selectedAksiId}`;

    if (!window.confirm(`Apakah Anda yakin ingin menghapus seluruh Aksi dengan ID: ${selectedAksiId} beserta rinciannya?`)) {
      return;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'DELETE',
      });

      if (response.ok) {
        showMessage('success', 'Aksi berhasil dihapus!');
        window.location.reload(); // Refresh halaman setelah penghapusan
      } else if (response.status === 404) {
        showMessage('error', 'Gagal menghapus Aksi. ID Aksi tidak ditemukan.');
      } else {
        console.error('Gagal menghapus Aksi:', response.statusText);
        showMessage('error', 'Gagal menghapus Aksi. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Terjadi kesalahan:', err);
      showMessage('error', 'Terjadi kesalahan saat terhubung ke server.');
    }
  };

  if (!isOpen) return null;

  // Render logic for loading and error states within the portal
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
          <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Tutup</button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  const selectedAksi = fullData.find(aksi => String(aksi.id) === selectedAksiId);
  const rincianOptions = selectedAksi ? selectedAksi.rincianKegiatan : [];

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold leading-none">&times;</button>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Formulir Penghapusan Rincian Aksi</h2>
        
        {/* Custom message box */}
        {message.show && (
          <div className={`p-4 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleDeleteRincian} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Dropdown ID Aksi */}
          <div>
            <label htmlFor="idAksi" className="block text-sm font-medium text-gray-700">ID Aksi</label>
            <select
              name="idAksi"
              id="idAksi"
              value={selectedAksiId}
              onChange={handleAksiChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Pilih ID Aksi</option>
              {fullData.map(aksi => (
                <option key={aksi.id} value={String(aksi.id)}>
                  {aksi.id} - {aksi.rencanaAksi}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown ID Rincian Kegiatan */}
          <div>
            <label htmlFor="idRincian" className="block text-sm font-medium text-gray-700">ID Rincian Kegiatan</label>
            <select
              name="idRincian"
              id="idRincian"
              value={selectedRincianId}
              onChange={handleRincianChange}
              required
              disabled={!selectedAksiId}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              <option value="">Pilih ID Rincian</option>
              {rincianOptions.map(rincian => (
                <option key={rincian.id} value={String(rincian.id)}>
                  {rincian.id} - {rincian.uraian}
                </option>
              ))}
            </select>
          </div>
          
          {/* Rincian Kegiatan Display */}
          {rincianDisplayData && (
            <div className="md:col-span-2 mt-4 p-4 bg-gray-50 border border-gray-300 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Rincian Kegiatan yang Dipilih:</h3>
              <p><strong>Uraian:</strong> {rincianDisplayData.uraian}</p>
              <p><strong>Output:</strong> {rincianDisplayData.output}</p>
              <p><strong>Jumlah:</strong> {rincianDisplayData.jumlah}</p>
              <p><strong>Quarter:</strong> {rincianDisplayData.quarter}</p>
              <p><strong>PIC:</strong> {rincianDisplayData.pic}</p>
              <p><strong>Keterangan:</strong> {rincianDisplayData.keterangan}</p>
            </div>
          )}

          {/* Delete Rincian Kegiatan button */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={!selectedRincianId}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              Hapus Rincian Kegiatan
            </button>
          </div>
        </form>
        <hr className="my-8 border-gray-300"/>
        
        {/* Delete Aksi section */}
        <div className="text-center">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Atau Hapus Seluruh Aksi</h3>
            <p className="text-sm text-gray-500 mb-4">
                Pilih ID Aksi di dropdown di atas, lalu klik tombol di bawah untuk menghapus seluruh Aksi beserta semua rincian kegiatannya.
            </p>
            <button
                onClick={handleDeleteAksi}
                disabled={!selectedAksiId}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
            >
                Hapus Seluruh Aksi
            </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FormulirHapusPopup;