import { createBrowserRouter } from 'react-router-dom';
import Pillar1 from '../Pillar1';
import Pillar2 from '../Pillar2';
import Pillar3 from '../Pillar3';
import Pillar4 from '../Pillar4';
import Pillar5 from '../Pillar5';
import Pillar6 from '../Pillar6';

const router = createBrowserRouter([
  {
    path: '/PillarSatu',
    element: <Pillar1 />,
  },
  {
    path: '/PillarDua',
    element: <Pillar2 />,
  },
  {
    path: '/PillarTiga',
    element: <Pillar3 />,
  },
  {
    path: '/PillarEmpat',
    element: <Pillar4 />,
  },
  {
    path: '/PillarLima',
    element: <Pillar5 />,
  },
  {
    path: '/PillarEnam',
    element: <Pillar6 />,
  },
  {
    path: '/',
    element: <Pillar1 />,
  },
]);

export default router;