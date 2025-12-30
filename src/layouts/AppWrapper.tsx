import AppHeader from './AppHeader';
import AppMain from './AppMain';
import AppTab from './AppTab';
import { KeepAliveProvider } from './keep-alive';

const AppWrapper = () => {
  return (
    <KeepAliveProvider>
      <div className="h-full flex flex-col">
        <AppHeader />
        <AppTab />
        <AppMain />
      </div>
    </KeepAliveProvider>
  );
};

export default AppWrapper;
