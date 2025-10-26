import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { createPortal } from 'react-dom';

// --- Type Definitions ---
// Define the shape of the form data state.
interface FormDataUpdate {
  idAksi: string;
  idRincian: string;
  uraianKegiatan: string;
  output: string;
  jumlah: number;
  quarter: string;
  pic: string;
  keterangan: string;
  linkLaporanKegiatan: string;
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
  linkLaporanKegiatan: string;
  realisasiQuarter?: string;
  realisasiJumlah?: number;
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
 * A modal form component for updating activities.
 * It fetches data from a dynamic API endpoint and allows users to update
 * a specific activity. The component is a reusable popup.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the popup.
 * @param {string} props.kodePillar - The dynamic part of the API endpoint (e.g., 'PillarDua').
 * @param {() => void} props.onClose - Function to call when the popup needs to be closed.
 */
const FormulirEditPopup: React.FC<{ isOpen: boolean; kodePillar: string; onClose: () => void }> = ({ isOpen, kodePillar, onClose }) => {
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
    linkLaporanKegiatan: '',
    realisasiQuarter: '',
    realisasiJumlah: 0
  });

  // States to hold the fetched data
  const [fullData, setFullData] = useState<AksiData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rencanaAksiDisplay, setRencanaAksiDisplay] = useState<string>('');
  
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
    }, 5000);
  };

  // useEffect untuk memuat data dari API saat popup terbuka
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
        linkLaporanKegiatan: '',
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
            linkLaporanKegiatan: selectedRincian.linkLaporanKegiatan,
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
      linkLaporanKegiatan: formData.linkLaporanKegiatan,
      realisasiQuarter: formData.realisasiQuarter,
      realisasiJumlah: formData.realisasiJumlah
    };
    
    const apiEndpoint = `https://zona-intergritas-bps-batu-fank.vercel.app/${kodePillar}/update-rincian/${formData.idAksi}/${formData.idRincian}`; 

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
        showMessage('success', 'Data berhasil diperbarui!');
        // Reload the page to show the updated data
        window.location.reload(); 
      } else if (response.status === 404) {
        showMessage('error', 'Gagal memperbarui data. ID Aksi atau ID Rincian tidak ditemukan.');
      } else {
        console.error('Gagal memperbarui data:', response.statusText);
        showMessage('error', 'Gagal memperbarui data. Silakan coba lagi.');
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

  const selectedAksi = fullData.find(aksi => String(aksi.id) === formData.idAksi);
  const rincianOptions = selectedAksi ? selectedAksi.rincianKegiatan : [];

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
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Formulir Update Rincian Aksi</h2>
        
        {/* Custom message box */}
        {message.show && (
          <div className={`p-4 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

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
          
          <div className="md:col-span-2 row-span-1">
            <label htmlFor="uraianKegiatan" className="block text-sm font-medium text-gray-700">Uraian Rincian Kegiatan</label>
            <input
              name="uraianKegiatan" 
              id="uraianKegiatan" 
              value={formData.uraianKegiatan} 
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-y"
            />
          </div>

          {/* Perubahan pada elemen input Quarter */}
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
          
          <div className='col-span-2'>
            <label htmlFor="linkLaporanKegiatan" className="block text-sm font-medium text-gray-700">Link Folder</label>
            <input 
              type="text" 
              name="linkLaporanKegiatan"
              id="linkLaporanKegiatan" 
              value={formData.linkLaporanKegiatan} 
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Perubahan pada elemen input Realisasi Quarter */}
          <div className='col-span-1'>
            <label htmlFor="realisasiQuarter" className="block text-sm font-medium text-gray-700">Realisasi Quarter</label>
            <select
              name="realisasiQuarter"
              id="realisasiQuarter"
              value={formData.realisasiQuarter}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Pilih Quarter</option>
              <option value="Quarter 1">Belum Terealisasi</option>
              <option value="Quarter 1">Quarter 1</option>
              <option value="Quarter 2">Quarter 2</option>
              <option value="Quarter 3">Quarter 3</option>
              <option value="Quarter 4">Quarter 4</option>
            </select>
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
    </div>,
    document.body
  );
};

export default FormulirEditPopup;