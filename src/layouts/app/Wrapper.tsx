import { dictListApi } from '@/api/dict';
import type { MUST_HAVE_DICT } from '@/assets/enum';
import type { AppDispatch } from '@/store';
import { setDict } from '@/store/modules/dictSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { KeepAliveProvider } from '../keep-alive';
import Header from './Header';
import Main from './Main';

const Wrapper = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dictListApi().then(res => {
      res.data?.forEach(it => {
        dispatch(
          setDict({
            [it.value as MUST_HAVE_DICT]: it.children || [],
          }),
        );
      });
    });
  }, [dispatch]);

  return (
    <KeepAliveProvider>
      <div className="h-full grid grid-rows-[auto_1fr]">
        <Header />
        <Main />
      </div>
    </KeepAliveProvider>
  );
};

export default Wrapper;
