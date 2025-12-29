import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

import { useKeepAlive } from './useKeepAlive';

type Options = {
  onActivated?: () => void;
  onDeactivated?: () => void;
  onUnmounted?: () => void;
};

export const useKeepAliveLifecycle = (pagePath: string, options: Options) => {
  const location = useLocation();
  const { getOutlet } = useKeepAlive();

  const optionsRef = useRef(options);
  const prevActivatedRef = useRef<boolean>(false);

  useEffect(() => {
    const isCurrentPath = location.pathname === pagePath;
    const outletExists = !!getOutlet(pagePath);

    if (isCurrentPath && !prevActivatedRef.current) {
      optionsRef.current.onActivated?.();
      prevActivatedRef.current = true;
    }

    if (!isCurrentPath && prevActivatedRef.current && outletExists) {
      optionsRef.current.onDeactivated?.();
      prevActivatedRef.current = false;
    }
  }, [pagePath, location.pathname, getOutlet]);

  useEffect(() => {
    const current = optionsRef.current;

    return () => {
      current.onUnmounted?.();
      prevActivatedRef.current = false;
    };
  }, []);
};
