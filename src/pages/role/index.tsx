import { useKeepAliveLifecycle } from '@/layouts';

const Role = () => {
  useKeepAliveLifecycle('/role', {
    onActivated: () => {
      console.log('Role 被激活（显示）');
    },
    onDeactivated: () => {
      console.log('Role 被隐藏（切换走）');
    },
    onUnmounted: () => {
      console.log('Role 被缓存卸载（从 Map 删除）');
    },
  });

  return <input type="text" placeholder="Role" className="border" />;
};

export default Role;
