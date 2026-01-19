import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu-trigger-style';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { isExactPathMatch } from '@/lib/router';
import { navigationRoutes, type NavigationRoute } from '@/router/navigation';
import type { RootState } from '@/store';
import { Menu } from 'lucide-react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router';
import HeaderExtra from './HeaderExtra';

interface NavigationMenuItemRenderProps {
  route: NavigationRoute;
}
const NavigationMenuItemRender = ({ route }: NavigationMenuItemRenderProps) => {
  const Icon = route.icon;
  const location = useLocation();

  const firstMenuPathActive = isExactPathMatch(
    route.fullPath,
    location.pathname,
    false,
  );
  const firstMenuBaseClass =
    "flex flex-row items-center gap-2 py-4 h-auto relative bg-card after:content-[''] after:rounded-[2px] after:absolute after:h-1.5 after:w-4/5 after:-bottom-0.75 after:left-1/10 after:transition";
  const firstMenuActiveClass = firstMenuPathActive
    ? 'bg-muted! after:bg-primary'
    : '';

  if (route.children?.length) {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger
          className={`${firstMenuBaseClass} ${firstMenuActiveClass}`}
        >
          {Icon && <Icon className="size-6 text-foreground" />}
          {route.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid gap-2 w-50">
            {route.children.map(child => {
              const childrenActive = isExactPathMatch(
                child.fullPath,
                location.pathname,
              );

              return (
                <li key={child.fullPath}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={child.fullPath}
                      className={childrenActive ? 'bg-muted' : ''}
                    >
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
    <NavigationMenuItem>
      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
        <Link
          to={route.fullPath}
          className={`${firstMenuBaseClass} ${firstMenuActiveClass}`}
        >
          {Icon && <Icon className="size-6 text-foreground" />}
          {route.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const SheetMenuItemRender = ({ route }: NavigationMenuItemRenderProps) => {
  const Icon = route.icon;
  const location = useLocation();

  const firstMenuPathActive = isExactPathMatch(
    route.fullPath,
    location.pathname,
    false,
  );

  if (route.children?.length) {
    return (
      <div className='flex flex-col gap-1'>
        <div className={`flex items-center gap-2 p-4 rounded-xl transition hover:bg-muted ${firstMenuPathActive ? 'bg-muted' : ''}`}>
          {Icon && <Icon className="size-6 text-foreground" />}
          {route.title}
        </div>

        <div className='border-l border-primary ml-7 pl-4'>
          {route.children.map(child => {
            const childrenActive = isExactPathMatch(
              child.fullPath,
              location.pathname,
            );

            return (
              <Link
                key={child.fullPath}
                to={child.fullPath}
                className={`flex items-center gap-2 p-4 rounded-xl transition hover:bg-muted ${childrenActive ? 'bg-primary! text-primary-foreground' : ''}`}
              >
                {child.title}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        to={route.fullPath}
        className={`flex items-center gap-2 p-4 rounded-xl transition hover:bg-muted ${firstMenuPathActive ? 'bg-primary! text-primary-foreground' : ''}`}
      >
        {Icon && <Icon className={`size-6 ${firstMenuPathActive ? 'text-primary-foreground' : 'text-foreground'}`} />}
        {route.title}
      </Link>
    </div>
  );
}

const HeaderMenu = () => {
  const auth = useSelector((state: RootState) => state.auth);

  const authorizedMenus = useMemo(() => {
    if (auth.hasUnrestrictedPermissions) {
      return navigationRoutes;
    }

    const result: NavigationRoute[] = [];
    navigationRoutes.forEach(route => {
      if (
        !route.fullPath.includes(':') &&
        auth.paths.includes(route.fullPath)
      ) {
        result.push(route);
        return;
      }

      const authorizedChildren = route.children?.filter(
        child =>
          !child.fullPath.includes(':') && auth.paths.includes(child.fullPath),
      );
      if (authorizedChildren?.length) {
        result.push({
          ...route,
          children: authorizedChildren,
        });
      }
    });
    return result;
  }, [auth.hasUnrestrictedPermissions, auth.paths]);

  return (
    <div>
      <NavigationMenu viewport={false} className="z-10 xl:block hidden">
        <NavigationMenuList>
          {authorizedMenus.map(route => (
            <NavigationMenuItemRender key={route.fullPath} route={route} />
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className='inline-flex xl:hidden'>
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <SheetBody className='flex flex-col gap-2'>
            {authorizedMenus.map(route => (
              <SheetMenuItemRender key={route.fullPath} route={route} />
            ))}
          </SheetBody>

          <SheetFooter>
            <HeaderExtra className='justify-between' />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HeaderMenu;
