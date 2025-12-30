import { useMemo } from 'react';
import { useLocation } from 'react-router';

export const useKeepAliveActiveKey = () => {
  const location = useLocation();

  return useMemo(() => {
    return location.pathname;
  }, [location.pathname]);
};
