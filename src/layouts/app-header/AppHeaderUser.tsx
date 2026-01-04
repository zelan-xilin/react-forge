import { LogOut, User } from 'lucide-react';
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
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <User className="size-5" />
        <span className="text-base font-medium">{user.username}</span>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="text-destructive hover:text-destructive">
            <LogOut />
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
