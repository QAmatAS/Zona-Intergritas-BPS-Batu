import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { createPortal } from 'react-dom';

// --- Type Definitions ---
interface PillarData {
  id: number | string;
  namaPillar: string;
  linkFolder: string;
}

interface MessageState {
  show: boolean;
  type: 'success' | 'error';
  text: string;
}

/**
 * A modal form component for updating a pillar's folder link.
 * It fetches pillar data and allows a user to update the link of a specific pillar.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the popup.
 * @param {() => void} props.onClose - Function to call when the popup needs to be closed.
 * @param {string} props.initialPillarId - The ID of the pillar to pre-select in the dropdown.
 */
const FormUbahLinkPopup: React.FC<{ isOpen: boolean; onClose: () => void; initialPillarId: string }> = ({ isOpen, onClose, initialPillarId }) => {
  const [pillars, setPillars] = useState<PillarData[]>([]);
  const [selectedPillarId, setSelectedPillarId] = useState<string>(initialPillarId);
  const [linkFolder, setLinkFolder] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState<MessageState>({
    show: false,
    type: 'success',
    text: ''
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ show: true, type, text });
    setTimeout(() => {
      setMessage({ show: false, type: 'success', text: '' });
    }, 5000);
  };

  const fetchPillars = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/DaftarPillar');
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari API.');
      }
      const data: PillarData[] = await response.json();
      setPillars(data);
      
      const selectedPillar = data.find(p => String(p.id) === initialPillarId);
      if (selectedPillar) {
        setLinkFolder(selectedPillar.linkFolder);
      }
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

  useEffect(() => {
    if (isOpen && initialPillarId) {
      setSelectedPillarId(initialPillarId);
      fetchPillars();
    }
  }, [isOpen, initialPillarId]);

  const handlePillarSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    // Fungsi ini tidak akan pernah terpanggil karena elemen sudah di-disabled
    // Namun, kita tetap menyediakannya untuk menjaga struktur kode.
    const pillarId = e.target.value;
    setSelectedPillarId(pillarId);
    const selectedPillar = pillars.find(p => String(p.id) === pillarId);
    if (selectedPillar) {
      setLinkFolder(selectedPillar.linkFolder);
    } else {
      setLinkFolder('');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLinkFolder(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPillarId || !linkFolder) {
      showMessage('error', 'Silakan pilih pilar dan isi tautan.');
      return;
    }

    const apiEndpoint = `http://localhost:3000/DaftarPillar/${selectedPillarId}`;
    const dataToPatch = {
      linkFolder: linkFolder,
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToPatch),
      });

      if (response.ok) {
        showMessage('success', 'Tautan folder berhasil diperbarui! Halaman akan dimuat ulang...');
        window.location.reload(); 
      } else {
        console.error('Gagal memperbarui data:', response.statusText);
        showMessage('error', 'Gagal memperbarui tautan. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Terjadi kesalahan:', err);
      showMessage('error', 'Terjadi kesalahan saat terhubung ke server.');
    }
  };

  if (!isOpen) return null;

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

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold leading-none">&times;</button>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Ubah Tautan Folder Pilar</h2>
        
        {message.show && (
          <div className={`p-4 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          
          <div>
            <label htmlFor="pillarSelect" className="block text-sm font-medium text-gray-700">Pilih Pilar</label>
            <select
              name="pillarSelect"
              id="pillarSelect"
              value={selectedPillarId}
              disabled={true} // Perubahan utama: Dropdown dinonaktifkan
              onChange={handlePillarSelect}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Pilih Pilar</option>
              {pillars.map(pillar => (
                <option key={pillar.id} value={String(pillar.id)}>
                  {pillar.namaPillar}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="linkFolder" className="block text-sm font-medium text-gray-700">Tautan Folder Baru</label>
            <input
              type="text"
              name="linkFolder"
              id="linkFolder"
              value={linkFolder}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default FormUbahLinkPopup;