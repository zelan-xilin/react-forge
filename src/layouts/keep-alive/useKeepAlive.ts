import { createContext, useContext } from 'react';

import type { KeepAliveContextType } from './types';

export const KeepAliveContext = createContext<KeepAliveContextType>({} as KeepAliveContextType);
export const useKeepAlive = (): KeepAliveContextType => useContext(KeepAliveContext);
