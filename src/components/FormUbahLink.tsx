import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';

// --- Type Definitions ---
// Define the shape of the data for a single Pillar.
interface PillarData {
  id: number | string;
  namaPillar: string;
  linkFolder: string;
}

// Define the shape of the custom message box state.
interface MessageState {
  show: boolean;
  type: 'success' | 'error';
  text: string;
}

const FormUbahLink: React.FC = () => {
  // State to hold the fetched data from the API.
  const [pillars, setPillars] = useState<PillarData[]>([]);
  // State for the selected pillar ID from the dropdown.
  const [selectedPillarId, setSelectedPillarId] = useState<string>('');
  // State for the new linkFolder value.
  const [linkFolder, setLinkFolder] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for the custom message box
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
    }, 5000); // Hide after 5 seconds
  };

  // Function to fetch all pillars on component mount
  const fetchPillars = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/DaftarPillar');
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari API.');
      }
      const data = await response.json();
      setPillars(data);
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
    fetchPillars();
  }, []);

  // Handler for dropdown selection
  const handlePillarSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const pillarId = e.target.value;
    setSelectedPillarId(pillarId);

    const selectedPillar = pillars.find(p => String(p.id) === pillarId);
    if (selectedPillar) {
      setLinkFolder(selectedPillar.linkFolder);
    } else {
      setLinkFolder('');
    }
  };

  // Handler for input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLinkFolder(e.target.value);
  };

  // Handler for form submission
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
        showMessage('success', 'Tautan folder berhasil diperbarui!');
        // Re-fetch data to update the dropdown with the new link
        fetchPillars();
      } else {
        console.error('Gagal memperbarui data:', response.statusText);
        showMessage('error', 'Gagal memperbarui tautan. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Terjadi kesalahan:', err);
      showMessage('error', 'Terjadi kesalahan saat terhubung ke server.');
    }
  };

  // --- Render logic for loading and error states ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-gray-700">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // --- Main form component rendering ---
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Ubah Tautan Folder Pilar</h2>
        
        {/* Custom message box */}
        {message.show && (
          <div className={`p-4 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          
          {/* Pillar Selection Field */}
          <div>
            <label htmlFor="pillarSelect" className="block text-sm font-medium text-gray-700">Pilih Pilar</label>
            <select
              name="pillarSelect"
              id="pillarSelect"
              value={selectedPillarId}
              onChange={handlePillarSelect}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Pilih Pilar</option>
              {pillars.map(pillar => (
                <option key={pillar.id} value={String(pillar.id)}>
                  {pillar.namaPillar}
                </option>
              ))}
            </select>
          </div>

          {/* New Link Folder Field */}
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

          {/* Submit button */}
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
    </div>
  );
};

export default FormUbahLink;
