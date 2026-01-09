import { useKeepAliveLifecycle } from '@/layouts';

const Report = () => {
  useKeepAliveLifecycle('/report', {
    onActivated: () => {
      console.log('Report 被激活（显示）');
    },
    onDeactivated: () => {
      console.log('Report 被隐藏（切换走）');
    },
    onUnmounted: () => {
      console.log('Report 被缓存卸载（从 Map 删除）');
    },
  });
  return <input type="text" placeholder="report" className="border" />;
};

export default Report;