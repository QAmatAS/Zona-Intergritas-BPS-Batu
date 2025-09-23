import { createBrowserRouter } from 'react-router-dom';
import App from './../App';
import FormTambah from '../components/FormTambah';
import FormEdit from '../components/FormEdit';
import FormHapus from '../components/FormHapus';
import FormUbahLink from '../components/FormUbahLink';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/FormTambah',
    element: <FormTambah />,
  },
  {
    path: '/FormEdit',
    element: <FormEdit />,
  },
  {
    path: '/FormHapus',
    element: <FormHapus />,
  },
  {
    path: '/FormUbahLink',
    element: <FormUbahLink />,
  },
]);

export default router;

// <div className="flex items-center justify-between relative mb-4">
//                 {/* Ini Judul Pillar */}
//                 <h3 className="text-3xl font-semibold text-gray-800">Judul Pillar</h3>
//                 {/* Button Options */}
//                 <div className="relative">
//                   <button
//                     type="button"
//                     className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     onClick={handleDropdownToggle}
//                   >
//                     <span>Opsi Formulir</span>
//                     <svg className={`-mr-1 h-5 w-5 text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                       <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                   {isDropdownOpen && (
//                     <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                       <div className="py-1" role="none">
//                         <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => handleFormSelect('FormulirTambahPopup')}>Formulir Tambah</a>
//                         <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => handleFormSelect('FormulirEditPopup')}>Formulir Edit</a>
//                         <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => handleFormSelect('FormulirHapusPopup')}>Formulir Hapus</a>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

// {data.map((item) => (
//                 <div key={item.id} className="flex h-full">
//                   <div className="flex w-7/40">
//                     <div className="w-1/7 border-b-2 border-gray-700"><TableCell text={item.id} /></div>
//                     <div className="w-6/7 border-b-2 border-gray-700"><TableCell text={item.rencanaAksi} /></div>
//                   </div>
//                   <div className="flex-col w-33/40">
//                     {item.rincianKegiatan.map((rincian) => (
//                       <div key={rincian.id} className="flex border-gray-700 border-b-2">
//                         <div className="w-1/13"><TableCell text={rincian.id} /></div>
//                         <div className="w-12/13"><TableCell text={rincian.uraian} /></div>
//                         <div className="w-4/13"><TableCell text={rincian.output} /></div>
//                         <div className="w-2/13"><TableCell text={rincian.jumlah} /></div>
//                         <div className="w-4/13"><TableCell text={rincian.quarter} /></div>
//                         <div className="w-4/13"><TableCell text={rincian.pic} /></div>
//                         <div className="w-6/13"><TableCell text={rincian.keterangan} /></div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}