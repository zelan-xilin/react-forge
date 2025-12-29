import { useKeepAliveLifecycle } from '@/layouts';

const Home = () => {
  useKeepAliveLifecycle('/home', {
    onActivated: () => {
      console.log('Home 被激活（显示）');
    },
    onDeactivated: () => {
      console.log('Home 被隐藏（切换走）');
    },
    onUnmounted: () => {
      console.log('Home 被缓存卸载（从 Map 删除）');
    },
  });
  return <input type="text" placeholder="home" className="border" />;
};

export default Home;
