import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { menuRoutes, type MenuRouterConfig } from '@/router';
import type { RootState } from '@/store';

const AppHeaderMenu = () => {
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);

  const navList = useMemo(() => {
    const result: MenuRouterConfig[] = [];

    menuRoutes.forEach(r => {
      if (!r.children?.length && (auth.hasUnrestrictedPermissions || auth.menus.includes(r.path))) {
        result.push(r);
        return;
      }

      const childMenus = r.children?.filter(
        child => auth.hasUnrestrictedPermissions || auth.menus.includes(child.path),
      );
      if (childMenus?.length) {
        result.push({
          ...r,
          children: childMenus,
        });
      }
    });

    return result;
  }, [auth.menus, auth.hasUnrestrictedPermissions]);

  const menuClassName = (path: string, parent?: boolean) => {
    const classes = ['text-sm', 'font-medium'];

    if (parent ? location.pathname.startsWith(path) : location.pathname === path) {
      classes.push('bg-primary!', 'text-primary-foreground!');
    }

    return classes.join(' ');
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-wrap">
        {navList.map(n => {
          if (n.children?.length) {
            return (
              <NavigationMenuItem key={n.path}>
                <NavigationMenuTrigger className={menuClassName(n.path, true)}>
                  {n.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-50">
                    {n.children.map(child => {
                      return (
                        <li key={child.path}>
                          <NavigationMenuLink asChild>
                            <Link to={child.path} className={menuClassName(child.path)}>
                              {child.title}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={n.path}>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to={n.path} className={menuClassName(n.path)}>
                  {n.title}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default AppHeaderMenu;
