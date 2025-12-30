import { useMemo, useSyncExternalStore } from 'react';

import { Button } from '@/components/ui/button';
import { isExactPathMatch, permissionRoutes } from '@/router';
import { useKeepAlive } from './keep-alive';

const AppTab = () => {
  const { getSnapshot, subscribeTabs, getTabVersion } = useKeepAlive();

  const tabVersion = useSyncExternalStore(subscribeTabs, getTabVersion, getTabVersion);

  const entries = useMemo(() => {
    void tabVersion;

    const snapshot = getSnapshot();
    return Array.from(snapshot.entries())
      .map(([path, item]) => {
        const permissionRoute = permissionRoutes.find(r => isExactPathMatch(r.path, path));

        return {
          path,
          title: item.title ?? permissionRoute?.title,
          icon: permissionRoute?.icon,
        };
      })
      .filter(e => e.title);
  }, [getSnapshot, tabVersion]);

  return (
    <div className="flex gap-6 flex-none">
      {entries.map(t => (
        <Button key={t.path} className="p-2">
          <strong>{t.title}</strong>
          <span>:</span>
          <span>{t.path}</span>
        </Button>
      ))}
    </div>
  );
};

export default AppTab;
