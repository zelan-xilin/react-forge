import { Logo } from '@/assets/svg';
import AppHeaderMenu from './AppHeaderMenu';
import AppHeaderUser from './AppHeaderUser';

const AppHeader = () => {
  return (
    <header className="flex h-14 flex-none items-center px-4 gap-4">
      <div className="flex-none flex items-center gap-2">
        <Logo />
        <h1 className="text-base font-semibold">Zelan.</h1>
      </div>

      <div className="flex-1">
        <AppHeaderMenu />
      </div>

      <div className="flex-none">
        <AppHeaderUser />
      </div>
    </header>
  );
};

export default AppHeader;
