import React, { useState, type ChangeEvent, type FormEvent } from 'react';

// Definisikan tipe data untuk state formulir
interface FormData {
  idAksi: string;
  uraianAksi: string;
  linkLaporanAksi: string;
  idKegiatan: string;
  uraianKegiatan: string;
  linkLaporanKegiatan: string;
  output: string;
  jumlah: number;
  quarter: string;
  pic: string;
  keterangan: string;
}

const Formulir: React.FC = () => {
  // State dengan tipe FormData yang telah didefinisikan
  const [formData, setFormData] = useState<FormData>({
    idAksi: '',
    uraianAksi: '',
    linkLaporanAksi: '',
    idKegiatan: '',
    uraianKegiatan: '',
    linkLaporanKegiatan: '',
    output: '',
    jumlah: 0, 
    quarter: '',
    pic: '',
    keterangan: ''
  });

  // Fungsi untuk menangani perubahan pada input dan textarea
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  // Fungsi untuk menangani saat formulir disubmit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Buat objek dengan struktur JSON yang diinginkan
    const dataToPost = {
      id: formData.idAksi,
      rencanaAksi: formData.uraianAksi,
      linkLaporanAksi: formData.linkLaporanAksi,
      rincianKegiatan: [
        {
          id: formData.idKegiatan,
          uraian: formData.uraianKegiatan,
          linkLaporanKegiatan: formData.linkLaporanKegiatan,
          output: formData.output,
          jumlah: formData.jumlah,
          quarter: formData.quarter,
          pic: formData.pic,
          keterangan: formData.keterangan,
        },
      ],
    };
    
    // URL API endpoint yang telah diperbarui
    const apiEndpoint = 'http://localhost:3000/SOP'; 

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToPost),
      });

      if (response.ok) {
        // Jika permintaan berhasil (status 200-299)
        const result = await response.json();
        console.log('Data berhasil dikirim:', result);
        alert('Data berhasil disimpan ke API!');
      } else if (response.status === 409) {
        // Jika status respons adalah 409 (Conflict)
        alert('Gagal menyimpan data. ID Aksi atau ID Kegiatan sudah ada.');
      } else {
        // Jika permintaan gagal dengan status lain
        console.error('Gagal mengirim data:', response.statusText);
        alert('Gagal menyimpan data. Silakan coba lagi.');
      }
    } catch (error) {
      // Menangkap kesalahan jaringan atau kesalahan lain
      console.error('Terjadi kesalahan:', error);
      alert('Terjadi kesalahan saat terhubung ke server.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Formulir Laporan Aksi</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Kolom ID Aksi (1 kolom) */}
          <div>
            <label htmlFor="idAksi" className="block text-sm font-medium text-gray-700">ID Aksi</label>
            <input 
              type="text" 
              name="idAksi" 
              id="idAksi" 
              value={formData.idAksi} 
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Kolom Uraian Aksi (2 kolom) */}
          <div className="md:col-span-2">
            <label htmlFor="uraianAksi" className="block text-sm font-medium text-gray-700">Rencana Aksi</label>
            <textarea 
              name="uraianAksi" 
              id="uraianAksi" 
              value={formData.uraianAksi} 
              onChange={handleChange}
              rows={3} 
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-y"
            />
          </div>

          {/* Kolom Link Dokumen Laporan Aksi (3 kolom penuh) */}
          <div className="lg:col-span-3">
            <label htmlFor="linkLaporanAksi" className="block text-sm font-medium text-gray-700">Link Dokumen Laporan Aksi</label>
            <input 
              type="text" 
              name="linkLaporanAksi" 
              id="linkLaporanAksi" 
              value={formData.linkLaporanAksi} 
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Kolom ID Kegiatan (1 kolom) */}
          <div>
            <label htmlFor="idKegiatan" className="block text-sm font-medium text-gray-700">ID Kegiatan</label>
            <input 
              type="text" 
              name="idKegiatan" 
              id="idKegiatan" 
              value={formData.idKegiatan} 
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Kolom Uraian Kegiatan (2 kolom) */}
          <div className="md:col-span-2">
            <label htmlFor="uraianKegiatan" className="block text-sm font-medium text-gray-700">Uraian Rincian Kegiatan</label>
            <textarea 
              name="uraianKegiatan" 
              id="uraianKegiatan" 
              value={formData.uraianKegiatan} 
              onChange={handleChange}
              rows={3} 
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-y"
            />
          </div>
          
          {/* Kolom Link Dokumen Laporan Kegiatan (3 kolom penuh) */}
          <div className="lg:col-span-3">
            <label htmlFor="linkLaporanKegiatan" className="block text-sm font-medium text-gray-700">Link Dokumen Laporan Kegiatan</label>
            <input 
              type="text" 
              name="linkLaporanKegiatan" 
              id="linkLaporanKegiatan" 
              value={formData.linkLaporanKegiatan} 
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Kolom Output (1 kolom) */}
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

          {/* Kolom Jumlah (1 kolom) */}
          <div>
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

          {/* Kolom Quarter (1 kolom) */}
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

          {/* Kolom PIC (1 kolom) */}
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
          
          {/* Kolom Keterangan (menempati 2 kolom pada tampilan medium) */}
          <div className="md:col-span-2">
            <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">Keterangan</label>
            <textarea
              name="keterangan" 
              id="keterangan" 
              value={formData.keterangan} 
              onChange={handleChange}
              rows={4}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-y"
            />
          </div>

          {/* Tombol Simpan */}
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
    </div>
  );
};

export default Formulir;