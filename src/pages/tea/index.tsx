import { useKeepAliveLifecycle } from '@/layouts';

const Tea = () => {
  useKeepAliveLifecycle('/tea', {
    onActivated: () => {
      console.log('Tea 被激活（显示）');
    },
    onDeactivated: () => {
      console.log('Tea 被隐藏（切换走）');
    },
    onUnmounted: () => {
      console.log('Tea 被缓存卸载（从 Map 删除）');
    },
  });
  return <input type="text" placeholder="tea" className="border" />;
};

export default Tea;
