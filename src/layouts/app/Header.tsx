import Logo from '@/components/logo';
import HeaderExtra from './HeaderExtra';
import HeaderMenu from './HeaderMenu';

const Header = () => {
  return (
    <header className="grid gap-4 grid-cols-[auto_1fr_auto] items-center p-4 border-b border-border/70 bg-card">
      <Logo />
      <HeaderMenu />
      <HeaderExtra className='hidden xl:flex' />
    </header>
  );
};

export default Header;
