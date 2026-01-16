import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { useOutlet } from 'react-router';
import OffscreenFrame from './OffscreenFrame';
import { useKeepAlive } from './useKeepAlive';

interface KeepAliveOutletProps {
  max?: number;
  activeKey: string;
}
const KeepAliveOutlet = ({
  max = Infinity,
  activeKey,
}: KeepAliveOutletProps) => {
  const outlet = useOutlet();
  const { getKeys, getOutlet, addOutlet, subscribeOutlets, getOutletVersion } =
    useKeepAlive();

  const outletVersion = useSyncExternalStore(
    subscribeOutlets,
    getOutletVersion,
    getOutletVersion,
  );

  useEffect(() => {
    addOutlet(activeKey, outlet, max);
  }, [addOutlet, activeKey, outlet, max]);

  const keys = useMemo(() => {
    void outletVersion;

    return getKeys();
  }, [getKeys, outletVersion]);

  return (
    <>
      {keys.map(k => {
        const element = getOutlet(k);

        if (!element?.node) {
          return null;
        }

        return (
          <OffscreenFrame
            key={`${k}-${element.instanceId ?? 0}`}
            active={k === activeKey}
          >
            {element.node}
          </OffscreenFrame>
        );
      })}
    </>
  );
};

export default KeepAliveOutlet;
