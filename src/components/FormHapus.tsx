import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';

// Definisikan tipe data untuk fetched data, sama seperti komponen sebelumnya
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

const FormulirHapusKegiatan: React.FC = () => {
  // State untuk menyimpan data yang diambil dari API
  const [fullData, setFullData] = useState<AksiData[]>([]);
  // State untuk menyimpan ID yang dipilih di dropdown
  const [selectedAksiId, setSelectedAksiId] = useState<string>('');
  const [selectedRincianId, setSelectedRincianId] = useState<string>('');
  // State untuk menampilkan rincian kegiatan yang dipilih
  const [rincianDisplayData, setRincianDisplayData] = useState<RincianKegiatan | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect untuk memuat data dari API saat komponen di-mount
  useEffect(() => {
    const fetchFullData = async () => {
      try {
        const response = await fetch('http://localhost:3000/PillarDua');
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
  }, []);

  // Fungsi untuk menangani perubahan pada dropdown ID Aksi
  const handleAksiChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedAksiId(value);
    // Reset dropdown rincian dan data tampilan saat ID Aksi berubah
    setSelectedRincianId('');
    setRincianDisplayData(null);
  };

  // Fungsi untuk menangani perubahan pada dropdown ID Rincian Kegiatan
  const handleRincianChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRincianId(value);
    
    // Temukan dan atur data rincian untuk ditampilkan
    const selectedAksi = fullData.find(aksi => String(aksi.id) === selectedAksiId);
    if (selectedAksi) {
      const selectedRincian = selectedAksi.rincianKegiatan.find(rincian => String(rincian.id) === value);
      setRincianDisplayData(selectedRincian || null);
    }
  };

  // Fungsi untuk menangani saat formulir penghapusan rincian disubmit
  const handleDeleteRincian = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAksiId || !selectedRincianId) {
      alert('Silakan pilih ID Aksi dan ID Rincian untuk dihapus.');
      return;
    }
    
    // Endpoint yang diminta: http://localhost:3000/PillarDua/delete-rincian/id:idAksi/id:idKegiatan
    const apiEndpoint = `http://localhost:3000/PillarDua/delete-rincian/${selectedAksiId}/${selectedRincianId}`; 
    
    if (!window.confirm(`Apakah Anda yakin ingin menghapus Rincian Kegiatan dengan ID: ${selectedRincianId} dari Aksi dengan ID: ${selectedAksiId}?`)) {
      return;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Rincian Kegiatan berhasil dihapus!');
        // Re-fetch data untuk memperbarui dropdown
        const updatedResponse = await fetch('http://localhost:3000/PillarDua');
        const updatedData = await updatedResponse.json();
        setFullData(updatedData);
        setSelectedAksiId('');
        setSelectedRincianId('');
        setRincianDisplayData(null);
      } else if (response.status === 404) {
        alert('Gagal menghapus data. ID Aksi atau ID Rincian tidak ditemukan.');
      } else {
        console.error('Gagal menghapus data:', response.statusText);
        alert('Gagal menghapus data. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Terjadi kesalahan:', err);
      alert('Terjadi kesalahan saat terhubung ke server.');
    }
  };

  // Fungsi untuk menangani penghapusan seluruh aksi
  const handleDeleteAksi = async () => {
    if (!selectedAksiId) {
      alert('Silakan pilih ID Aksi yang ingin dihapus.');
      return;
    }

    const apiEndpoint = `http://localhost:3000/PillarDua/${selectedAksiId}`;

    if (!window.confirm(`Apakah Anda yakin ingin menghapus seluruh Aksi dengan ID: ${selectedAksiId} beserta rinciannya?`)) {
      return;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Aksi berhasil dihapus!');
        const updatedResponse = await fetch('http://localhost:3000/PillarDua');
        const updatedData = await updatedResponse.json();
        setFullData(updatedData);
        setSelectedAksiId('');
        setSelectedRincianId('');
        setRincianDisplayData(null);
      } else if (response.status === 404) {
        alert('Gagal menghapus Aksi. ID Aksi tidak ditemukan.');
      } else {
        console.error('Gagal menghapus Aksi:', response.statusText);
        alert('Gagal menghapus Aksi. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Terjadi kesalahan:', err);
      alert('Terjadi kesalahan saat terhubung ke server.');
    }
  };

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

  const selectedAksi = fullData.find(aksi => String(aksi.id) === selectedAksiId);
  const rincianOptions = selectedAksi ? selectedAksi.rincianKegiatan : [];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Formulir Penghapusan Rincian Aksi</h2>
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
          
          {/* Kolom Tampilan Rincian Kegiatan */}
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

          {/* Tombol Hapus Rincian Kegiatan */}
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
        {/* Bagian terpisah untuk menghapus seluruh Aksi */}
        <div className="text-center">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Atau Hapus Seluruh Aksi</h3>
            <p className="text-sm text-gray-500 mb-4">
                Pilih ID Aksi di dropdown atas, lalu klik tombol di bawah untuk menghapus seluruh Aksi beserta semua rincian kegiatannya.
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
    </div>
  );
};

export default FormulirHapusKegiatan;