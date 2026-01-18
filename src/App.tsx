import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { routerInstance } from './router';
import { preloadIdle } from './router/preloader';

function App() {
  useEffect(() => {
    preloadIdle();
  }, []);

  return (
    <>
      <RouterProvider router={routerInstance} />
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
