import { useLocation, useOutlet } from 'react-router';

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import OffscreenFrame from './OffscreenFrame';
import { useKeepAlive } from './useKeepAlive';

interface KeepAliveOutletProps {
  max?: number;
}
const KeepAliveOutlet = ({ max = Infinity }: KeepAliveOutletProps) => {
  const outlet = useOutlet();
  const location = useLocation();
  const { getKeys, getOutlet, addOutlet, subscribeOutlets, getOutletVersion } = useKeepAlive();
  const outletVersion = useSyncExternalStore(subscribeOutlets, getOutletVersion, getOutletVersion);

  useEffect(() => {
    const current = getOutlet(location.pathname);

    addOutlet(location.pathname, current?.node ?? outlet, current?.title, max);
  }, [addOutlet, getOutlet, location.pathname, outlet, max]);

  const keys = useMemo(() => {
    void outletVersion;

    return getKeys();
  }, [getKeys, outletVersion]);

  return (
    <>
      {keys.map(k => {
        const element = getOutlet(k);

        return (
          <OffscreenFrame key={`${k}-${element?.version ?? 0}`} active={k === location.pathname}>
            {element?.node}
          </OffscreenFrame>
        );
      })}
    </>
  );
};

export default KeepAliveOutlet;
