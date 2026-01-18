import { IMAGES, randomIndex } from '@/components/logo/config';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import type { AppDispatch, RootState } from '@/store';
import { clearAuth } from '@/store/modules/authSlice';
import { setSystem } from '@/store/modules/system';
import { clearUser } from '@/store/modules/userSlice';
import { LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

const HeaderExtra = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const system = useSelector((state: RootState) => state.system);

  const onLogout = () => {
    dispatch(clearUser());
    dispatch(clearAuth());
  };

  return (
    <div className="flex items-center gap-2">
      <Toggle
        aria-label="Toggle theme"
        pressed={system.theme === 'dark'}
        onPressedChange={pressed => {
          dispatch(setSystem({ theme: pressed ? 'dark' : 'light' }));
        }}
      >
        {system.theme === 'dark' ? '🌙' : '☀️'}
      </Toggle>
      <div>
        <div className="font-medium text-lg">{user.username}</div>
        <div className="text-xs text-success">值班中</div>
      </div>
      <Avatar className="size-14">
        <AvatarImage
          src={IMAGES[randomIndex]?.src}
          alt={IMAGES[randomIndex]?.alt}
        />
        <AvatarFallback>{IMAGES[randomIndex]?.fallback}</AvatarFallback>
      </Avatar>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="icon" variant="ghost">
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

export default HeaderExtra;
