import { Outlet } from 'react-router';

const AppWrapper = () => {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* 顶部栏（可替换为你的 Header 组件） */}
      <header className="border-b px-4 py-3">
        <div className="mx-auto w-full max-w-7xl">Header</div>
      </header>

      <div className="flex flex-1">
        {/* 侧边栏（可替换为你的 Sidebar/Menu 组件） */}
        <aside className="w-64 border-r p-4">Sidebar</aside>

        {/* 主内容区：渲染子路由 */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppWrapper;