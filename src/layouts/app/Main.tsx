import LoadingFallback from '@/components/LoadingFallback';
import { Suspense } from 'react';
import { KeepAliveOutlet, useKeepAliveActiveKey } from '../keep-alive';

const Main = () => {
  const activeKey = useKeepAliveActiveKey();

  return (
    <main>
      <Suspense fallback={<LoadingFallback />}>
        <KeepAliveOutlet activeKey={activeKey} />
      </Suspense>
    </main>
  );
};

export default Main;
