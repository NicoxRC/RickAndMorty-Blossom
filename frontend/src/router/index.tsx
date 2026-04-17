import { createBrowserRouter } from 'react-router-dom';
import { App } from '@/App';
import { CharactersPage } from '@/pages/CharactersPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <CharactersPage />,
      },
    ],
  },
]);
