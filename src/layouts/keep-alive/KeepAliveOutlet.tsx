import { useLocation, useOutlet } from 'react-router';

import OffscreenFrame from './OffscreenFrame';
import { useKeepAlive } from './useKeepAlive';

interface KeepAliveOutletProps {
  max?: number;
}
const KeepAliveOutlet = ({ max = Infinity }: KeepAliveOutletProps) => {
  const outlet = useOutlet();
  const location = useLocation();
  const { getKeys, getOutlet, addOutlet } = useKeepAlive();

  const currentOutlet = getOutlet(location.pathname) ?? { node: outlet, title: undefined };
  addOutlet(location.pathname, currentOutlet.node, currentOutlet.title, max);

  const entries = getKeys().map(key => [key, getOutlet(key)] as const);

  return (
    <>
      {entries.map(([k, element]) => (
        <OffscreenFrame key={`${k}-${element?.version}`} active={k === location.pathname}>
          {element?.node}
        </OffscreenFrame>
      ))}
    </>
  );
};

export default KeepAliveOutlet;
