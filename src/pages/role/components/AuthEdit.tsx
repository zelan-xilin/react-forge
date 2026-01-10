import { roleAuthGetApi, roleAuthSaveApi } from '@/api/role';
import type { RoleAddOrUpdateParams } from '@/api/role/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { permissionRoutes } from '@/router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AuthEditProps {
  data: RoleAddOrUpdateParams | undefined;
  open: boolean;
  onClose: (req?: boolean) => void;
}
const AuthEdit = (props: AuthEditProps) => {
  const { data, open, onClose } = props;

  const [isPending, setIsPending] = useState(false);
  const [paths, setPaths] = useState<string[]>([]);
  useEffect(() => {
    if (!open || !data?.id) {
      return;
    }

    roleAuthGetApi(data.id).then(res => {
      setPaths(res.data);
    });
  }, [open, data]);
  const onSubmit = async () => {
    if (!data?.id) {
      return;
    }

    try {
      setIsPending(true);
      await roleAuthSaveApi(data.id, { paths });

      toast.success('保存成功');
      onClose(true);
    } catch {
      // do nothing
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>分配权限</SheetTitle>
          <SheetDescription>为角色分配相应的权限，确保系统安全和功能访问控制。</SheetDescription>
        </SheetHeader>

        <SheetBody className="flex flex-col">
          <div className="flex items-center gap-2 pb-1 mb-1 border-b">
            <Checkbox
              id="all-permissions"
              checked={paths.length === permissionRoutes.length}
              onCheckedChange={checked => {
                setPaths(checked ? permissionRoutes.map(route => route.path) : []);
              }}
            />
            <Label htmlFor="all-permissions" className="cursor-pointer">
              全选
            </Label>

            <Button
              variant="ghost"
              className="ml-2"
              onClick={() => {
                setPaths(prev =>
                  permissionRoutes.map(route => route.path).filter(path => !prev.includes(path)),
                );
              }}
            >
              反选
            </Button>
          </div>

          {permissionRoutes.map(route => (
            <div key={route.path} className="flex items-center gap-2 py-2">
              <Checkbox
                id={route.path}
                checked={paths.includes(route.path)}
                onCheckedChange={checked => {
                  if (checked) {
                    setPaths(prev => [...prev, route.path]);
                  } else {
                    setPaths(prev => prev.filter(p => p !== route.path));
                  }
                }}
              />
              <Label htmlFor={route.path} className="cursor-pointer flex-1">
                {route.title}
              </Label>
            </div>
          ))}
        </SheetBody>

        <SheetFooter>
          <Button loading={isPending} onClick={onSubmit}>
            保存更改
          </Button>
          <SheetClose asChild>
            <Button variant="outline">关闭</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AuthEdit;
