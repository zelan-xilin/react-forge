import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router';
import { dictListApi } from './api/dict';
import { Toaster } from './components/ui/sonner';
import { routerInstance } from './router';
import { preloadIdle } from './router/preloader';
import type { AppDispatch } from './store';
import { setDict } from './store/modules/dictSlice';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dictListApi().then(res => {
      res.data?.forEach(it => {
        dispatch(
          setDict({
            [it.value]: it.children || [],
          }),
        );
      });
    });
  }, [dispatch]);

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
