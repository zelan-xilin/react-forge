import { useMemo, useSyncExternalStore, type MouseEvent } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { isExactPathMatch, permissionRoutes } from '@/router';
import { X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useKeepAlive } from './keep-alive';

const AppTab = () => {
  const location = useLocation();
  const { getSnapshot, subscribeTabs, getTabVersion, removeOutlet } = useKeepAlive();

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
        };
      })
      .filter(e => e.title);
  }, [getSnapshot, tabVersion]);

  const onCloseTab = (e: MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (location.pathname === path) {
      return;
    }

    removeOutlet(path, true);
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap flex-none border-b">
      <div className="flex w-max gap-2 px-4 py-0">
        {entries.map(t => {
          const isActive = location.pathname === t.path;
          const baseClassName =
            'flex gap-1 items-center rounded-sm py-1.5 px-2 my-1 text-xs hover:bg-primary/10 bg-secondary text-secondary-foreground';
          const activeClassName = isActive ? 'bg-primary! text-primary-foreground!' : '';

          return (
            <Link key={t.path} to={t.path} className={`${baseClassName} ${activeClassName}`}>
              <span>{t.title}</span>

              {!isActive && (
                <Button
                  variant="ghost"
                  className="size-3 text-destructive! hover:bg-destructive/30 rounded-full p-2!"
                  onClick={evt => onCloseTab(evt, t.path)}
                >
                  <X className="size-3" />
                </Button>
              )}
            </Link>
          );
        })}
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default AppTab;
