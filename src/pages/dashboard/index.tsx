import { useKeepAliveLifecycle } from '@/layouts';

const Dashboard = () => {
  useKeepAliveLifecycle('/dashboard', {
    onActivated: () => {
      console.log('Dashboard 被激活（显示）');
    },
    onDeactivated: () => {
      console.log('Dashboard 被隐藏（切换走）');
    },
    onUnmounted: () => {
      console.log('Dashboard 被缓存卸载（从 Map 删除）');
    },
  });
  return <input type="text" placeholder="dashboard" className="border" />;
};

export default Dashboard;
