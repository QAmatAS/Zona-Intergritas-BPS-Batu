import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';

// Definisikan tipe data untuk state formulir
interface FormDataUpdate {
  idAksi: string;
  idRincian: string;
  uraianKegiatan: string;
  output: string;
  jumlah: number;
  quarter: string;
  pic: string;
  keterangan: string;
  realisasiQuarter: string;
  realisasiJumlah: number;
}

// Define types for the fetched data from a single endpoint
interface RincianKegiatan {
  id: number | string;
  uraian: string;
  output: string;
  jumlah: number;
  quarter: string;
  pic: string;
  keterangan: string;
  realisasiQuarter?: string;
  realisasiJumlah?: number;
}

interface AksiData {
  id: number | string;
  rencanaAksi: string;
  rincianKegiatan: RincianKegiatan[];
}

const Formulir: React.FC = () => {
  // State dengan tipe FormData yang telah didefinisikan
  const [formData, setFormData] = useState<FormDataUpdate>({
    idAksi: '',
    idRincian: '',
    uraianKegiatan: '',
    output: '',
    jumlah: 0,
    quarter: '',
    pic: '',
    keterangan: '',
    realisasiQuarter: '',
    realisasiJumlah: 0
  });

  // States to hold the fetched data
  const [fullData, setFullData] = useState<AksiData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rencanaAksiDisplay, setRencanaAksiDisplay] = useState<string>('');

  // useEffect untuk memuat data dari API saat komponen di-mount
  useEffect(() => {
    const fetchFullData = async () => {
      try {
        const response = await fetch('http://localhost:3000/PillarDUa');

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

  // Fungsi untuk menangani perubahan pada input dan textarea
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));

    if (name === 'idAksi') {
      // Set the display for rencanaAksi
      const selectedAksi = fullData.find(aksi => String(aksi.id) === value);
      setRencanaAksiDisplay(selectedAksi ? selectedAksi.rencanaAksi : '');
      
      // Reset the second dropdown and other fields when the first one changes
      setFormData(prevState => ({
        ...prevState,
        idAksi: value,
        idRincian: '',
        uraianKegiatan: '',
        output: '',
        jumlah: 0,
        quarter: '',
        pic: '',
        keterangan: '',
        realisasiQuarter: '',
        realisasiJumlah: 0
      }));
    }

    if (name === 'idRincian') {
      const selectedAksi = fullData.find(aksi => String(aksi.id) === formData.idAksi);
      if (selectedAksi) {
        const selectedRincian = selectedAksi.rincianKegiatan.find(rincian => String(rincian.id) === value);
        if (selectedRincian) {
          setFormData(prevState => ({
            ...prevState,
            idRincian: value,
            uraianKegiatan: selectedRincian.uraian,
            output: selectedRincian.output,
            jumlah: selectedRincian.jumlah,
            quarter: selectedRincian.quarter,
            pic: selectedRincian.pic,
            keterangan: selectedRincian.keterangan,
            realisasiQuarter: selectedRincian.realisasiQuarter || '',
            realisasiJumlah: selectedRincian.realisasiJumlah || 0
          }));
        }
      }
    }
  };

  // Fungsi untuk menangani saat formulir disubmit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Buat objek dengan struktur JSON yang diinginkan untuk dikirim
    const dataToUpdate = {
      uraian: formData.uraianKegiatan,
      output: formData.output,
      jumlah: formData.jumlah,
      quarter: formData.quarter,
      pic: formData.pic,
      keterangan: formData.keterangan,
      realisasiQuarter: formData.realisasiQuarter,
      realisasiJumlah: formData.realisasiJumlah
    };
    
    const apiEndpoint = `http://localhost:3000/PillarDua/update-rincian/${formData.idAksi}/${formData.idRincian}`; 

    try {
      const response = await fetch(apiEndpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Data berhasil diperbarui:', result);
        alert('Data berhasil diperbarui!');
        // Re-fetch data to keep the dropdowns up-to-date
        const updatedResponse = await fetch('http://localhost:3000/PillarDua');
        const updatedData = await updatedResponse.json();
        setFullData(updatedData);
      } else if (response.status === 404) {
        alert('Gagal memperbarui data. ID Aksi atau ID Rincian tidak ditemukan.');
      } else {
        console.error('Gagal memperbarui data:', response.statusText);
        alert('Gagal memperbarui data. Silakan coba lagi.');
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

  const selectedAksi = fullData.find(aksi => String(aksi.id) === formData.idAksi);
  const rincianOptions = selectedAksi ? selectedAksi.rincianKegiatan : [];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Formulir Update Rincian Aksi</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Dropdown ID Aksi */}
          <div className="lg:col-span-1">
            <label htmlFor="idAksi" className="block text-sm font-medium text-gray-700">ID Aksi</label>
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
          </div>

          {/* Kolom Rencana Aksi */}
          <div className="lg:col-span-2">
            <label htmlFor="rencanaAksi" className="block text-sm font-medium text-gray-700">Rencana Aksi</label>
            <input
              type="text"
              id="rencanaAksi"
              value={rencanaAksiDisplay}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Dropdown ID Rincian Kegiatan */}
          <div className="lg:col-span-1">
            <label htmlFor="idRincian" className="block text-sm font-medium text-gray-700">ID Rincian Kegiatan</label>
            <select
              name="idRincian"
              id="idRincian"
              value={formData.idRincian}
              onChange={handleChange}
              required
              disabled={!formData.idAksi}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              <option value="">Pilih ID Rincian</option>
              {rincianOptions.map(rincian => (
                <option key={rincian.id} value={String(rincian.id)}>
                  {rincian.id} - {rincian.uraian}
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2 row-span-2">
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

          <div className='col-span-1'>
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
          
          <div className='col-span-1'>
            <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700">Jumlah</label>
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

          <div>
            <label htmlFor="quarter" className="block text-sm font-medium text-gray-700">Quarter</label>
            <input 
              type="text" 
              name="quarter" 
              id="quarter" 
              value={formData.quarter} 
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className='col-span-1'>
            <label htmlFor="realisasiQuarter" className="block text-sm font-medium text-gray-700">Realisasi Quarter</label>
            <input 
              type="text" 
              name="realisasiQuarter" 
              id="realisasiQuarter" 
              value={formData.realisasiQuarter} 
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className='col-span-1'>
            <label htmlFor="realisasiJumlah" className="block text-sm font-medium text-gray-700">Realisasi Jumlah</label>
            <input 
              type="number" 
              name="realisasiJumlah" 
              id="realisasiJumlah" 
              value={formData.realisasiJumlah} 
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2 row-span-2">
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

          <div className="lg:col-span-3">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Formulir;
