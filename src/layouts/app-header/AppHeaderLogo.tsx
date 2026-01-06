import { Logo } from '@/assets/svg';

const AppHeaderLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <Logo />
      <h1 className="text-base font-semibold">Zelan.</h1>
    </div>
  );
};

export default AppHeaderLogo;
