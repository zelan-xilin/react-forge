import type { RootState } from '@/store';
import { User } from 'lucide-react';
import { useSelector } from 'react-redux';

import { Logo } from '@/assets/svg';
import AppMenu from './AppMenu';

const AppHeader = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <header className="flex h-14 flex-none items-center px-4 gap-4">
      <div className="flex-none flex items-center gap-2">
        <Logo />
        <h1 className="text-base font-semibold">Zelan.</h1>
      </div>

      <div className="flex-1">
        <AppMenu />
      </div>

      <div className="flex-none flex items-center gap-2">
        <User />
        <span>{user.username}</span>
      </div>
    </header>
  );
};

export default AppHeader;
