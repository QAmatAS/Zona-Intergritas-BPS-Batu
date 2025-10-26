import './App.css'
import MainCategory from './components/MainCategory'
import { Outlet } from 'react-router-dom'

import React, { useState } from 'react';

// --- Data Pilar ---
const PILLARS = [
  { id: '1', kodeApi: 'PillarSatu', label: 'Pilar 1' },
  { id: '2', kodeApi: 'PillarDua', label: 'Pilar 2' },
  { id: '3', kodeApi: 'PillarTiga', label: 'Pilar 3' },
  { id: '4', kodeApi: 'PillarEmpat', label: 'Pilar 4' },
  { id: '5', kodeApi: 'PillarLima', label: 'Pilar 5' },
];

// --- Komponen Utama Aplikasi ---
const App: React.FC = () => {
  // State untuk melacak ID pilar yang saat ini dipilih. Null berarti tidak ada yang dipilih.
  const [selectedPillarId, setSelectedPillarId] = useState<string | null>(null);

  // Cari objek pilar yang dipilih berdasarkan ID state
  const selectedPillar = PILLARS.find(p => p.id === selectedPillarId);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">Navigasi Kategori Utama</h1>

      {/* Kontainer Tombol Navigasi */}
      <div className="flex flex-wrap justify-center gap-3 p-4 bg-white rounded-xl shadow-md">
        {PILLARS.map((pillar) => (
          <button
            key={pillar.id}
            onClick={() => setSelectedPillarId(pillar.id)}
            className={`
              px-6 py-3 text-sm font-semibold rounded-full transition-all duration-200 shadow-lg
              ${selectedPillarId === pillar.id
                ? 'bg-indigo-600 text-white transform scale-105 ring-4 ring-indigo-300' // Gaya aktif
                : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-400 hover:shadow-xl' // Gaya non-aktif
              }
              min-w-[120px]
            `}
            aria-pressed={selectedPillarId === pillar.id}
          >
            {pillar.label}
          </button>
        ))}
      </div>

      {/* Tampilan Konten Dinamis */}
      <div className="mt-8">
        {selectedPillar ? (
          // Hanya tampilkan MainCategory jika ada pilar yang dipilih
          <div className="p-6 bg-white rounded-xl shadow-2xl transition-opacity duration-300 opacity-100">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">
              Menampilkan {selectedPillar.label}
            </h2>
            <MainCategory
              kodeApi={selectedPillar.kodeApi}
              IdPillar={selectedPillar.id}
            />
          </div>
        ) : (
          // Tampilkan pesan panduan jika belum ada pilar yang dipilih
          <div className="p-6 bg-white rounded-xl shadow-inner border border-dashed border-gray-400 text-center text-gray-600">
            <p className="text-lg">Silakan klik salah satu tombol di atas untuk menampilkan detail Kategori Utama.</p>
          </div>
        )}
      </div>

      {/* Outlet tetap dipertahankan di bagian bawah */}
      <Outlet />
    </div>
  );
};

export default App;
