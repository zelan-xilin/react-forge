import { useKeepAliveLifecycle } from '@/layouts';

const User = () => {
  useKeepAliveLifecycle('/user', {
    onActivated: () => {
      console.log('User 被激活（显示）');
    },
    onDeactivated: () => {
      console.log('User 被隐藏（切换走）');
    },
    onUnmounted: () => {
      console.log('User 被缓存卸载（从 Map 删除）');
    },
  });

  return <input type="text" placeholder="User" className="border" />;
};

export default User;
