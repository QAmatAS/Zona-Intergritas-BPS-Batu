import { createBrowserRouter } from 'react-router-dom';
import App from './../App';
import FormAksi from './../components/FormTambahAksi';
import FormKegiatan from './../components/FormTambahKegiatan';
import FormEditKegiatan from '../components/FormEditKegiatan';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/FormAksi',
    element: <FormAksi />,
  },
  {
    path: '/FormKegiatan',
    element: <FormKegiatan />,
  },
  {
    path: '/FormEditKegiatan',
    element: <FormEditKegiatan />,
  },
]);

export default router;