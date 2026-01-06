import { Bell, LogOut, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AppDispatch, RootState } from '@/store';
import { clearAuth } from '@/store/modules/authSlice';
import { clearUser } from '@/store/modules/userSlice';

const AppHeaderUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  const onLogout = () => {
    dispatch(clearUser());
    dispatch(clearAuth());
  };

  return (
    <div className="flex items-center">
      <Button size="icon-xl" variant="ghost">
        <Bell className="size-6" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-xl" variant="ghost">
            <User className="size-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>个人信息</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            用户名
            <DropdownMenuShortcut>{user.username}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            登录账号
            <DropdownMenuShortcut>{user.account}</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="icon-xl"
            variant="ghost"
            className="text-destructive hover:text-destructive"
          >
            <LogOut className="size-6" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>是否确定登出系统？</AlertDialogTitle>
            <AlertDialogDescription>
              登出操作将会清除您的登录状态，您需要重新登录以继续使用系统。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={onLogout}>登出</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppHeaderUser;
