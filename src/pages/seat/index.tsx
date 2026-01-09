import { useKeepAliveLifecycle } from '@/layouts';

const Seat = () => {
  useKeepAliveLifecycle('/seat', {
    onActivated: () => {
      console.log('Seat 被激活（显示）');
    },
    onDeactivated: () => {
      console.log('Seat 被隐藏（切换走）');
    },
    onUnmounted: () => {
      console.log('Seat 被缓存卸载（从 Map 删除）');
    },
  });
  return <input type="text" placeholder="seat" className="border" />;
};

export default Seat;