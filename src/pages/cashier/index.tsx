import { useKeepAliveLifecycle } from '@/layouts';

const Cashier = () => {
  useKeepAliveLifecycle('/cashier', {
    onActivated: () => {
      console.log('Cashier 被激活（显示）');
    },
    onDeactivated: () => {
      console.log('Cashier 被隐藏（切换走）');
    },
    onUnmounted: () => {
      console.log('Cashier 被缓存卸载（从 Map 删除）');
    },
  });
  return <input type="text" placeholder="cashier" className="border" />;
};

export default Cashier;
