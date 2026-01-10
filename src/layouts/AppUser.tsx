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
import { LogOut, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

const AppUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  const onLogout = () => {
    dispatch(clearUser());
    dispatch(clearAuth());
  };

  return (
    <div className="flex justify-between items-center gap-4 px-5 py-3 box-border rounded-lg bg-muted">
      <div className="flex items-center gap-2">
        <User className="size-6" />
        <div>
          <div>{user.username}</div>
          <div className="text-xs text-primary">值班中</div>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-transparent"
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

export default AppUser;
