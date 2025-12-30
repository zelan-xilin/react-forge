import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Link } from 'react-router';

const AppHeader = () => {
  return (
    <header className="flex h-16 flex-none items-center px-4">
      <div className="flex-none"></div>
      <div className="flex-1">
        <NavigationMenu>
          <NavigationMenuList className="flex-wrap">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/docs">Docs</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex-none"></div>
    </header>
  );
};

export default AppHeader;
