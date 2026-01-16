import { KeepAliveProvider } from '../keep-alive';
import Header from './Header';
import Main from './Main';

const Wrapper = () => {
  return (
    <KeepAliveProvider>
      <div className="h-full grid grid-rows-[auto_1fr]">
        <Header />
        <Main />
      </div>
    </KeepAliveProvider>
  );
};

export default Wrapper;
