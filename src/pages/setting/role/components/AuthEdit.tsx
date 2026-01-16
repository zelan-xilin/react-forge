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
import type { NavigationRoute } from '@/router/navigation';
import { navigationRoutes } from '@/router/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const hasChildren = (route: NavigationRoute) =>
  (route.children?.length ?? 0) > 0;
const getChildrenPaths = (route: NavigationRoute) =>
  route.children?.map(c => c.fullPath) ?? [];
const getParentState = (route: NavigationRoute, paths: string[]) => {
  if (!hasChildren(route)) {
    return {
      checked: paths.includes(route.fullPath),
      indeterminate: false,
    };
  }

  const children = getChildrenPaths(route);
  const checkedCount = children.filter(p => paths.includes(p)).length;

  if (checkedCount === 0) {
    return {
      checked: false,
      indeterminate: false,
    };
  }
  if (checkedCount === children.length) {
    return {
      checked: true,
      indeterminate: false,
    };
  }
  return {
    checked: false,
    indeterminate: true,
  };
};

interface AuthEditProps {
  data: RoleAddOrUpdateParams | undefined;
  open: boolean;
  onClose: (req?: boolean) => void;
}
const AuthEdit = ({ data, open, onClose }: AuthEditProps) => {
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

  const toggleParent = (route: NavigationRoute, checked: boolean) => {
    if (!hasChildren(route)) {
      setPaths(prev =>
        checked
          ? [...new Set([...prev, route.fullPath])]
          : prev.filter(p => p !== route.fullPath),
      );
      return;
    }

    const children = getChildrenPaths(route);
    setPaths(prev => {
      if (checked) {
        return [...new Set([...prev, ...children])];
      }
      return prev.filter(p => !children.includes(p));
    });
  };
  const toggleChild = (path: string, checked: boolean) => {
    setPaths(prev =>
      checked ? [...new Set([...prev, path])] : prev.filter(p => p !== path),
    );
  };

  const buildSubmitPaths = () => {
    const result: string[] = [];

    navigationRoutes.forEach(route => {
      if (hasChildren(route)) {
        route.children?.forEach(c => {
          if (paths.includes(c.fullPath)) {
            result.push(c.fullPath);
          }
        });
        return;
      }

      if (paths.includes(route.fullPath)) {
        result.push(route.fullPath);
      }
    });

    return result;
  };

  const onSubmit = async () => {
    if (!data?.id) {
      return;
    }

    try {
      setIsPending(true);
      await roleAuthSaveApi(data.id, { paths: buildSubmitPaths() });
      toast.success('分配权限成功');
      onClose(true);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>分配权限</SheetTitle>
          <SheetDescription>为角色分配可访问的功能模块</SheetDescription>
        </SheetHeader>

        <SheetBody className="flex flex-col gap-1">
          {navigationRoutes.map(route => {
            const state = getParentState(route, paths);

            return (
              <div key={route.fullPath}>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={route.fullPath}
                    checked={
                      state.indeterminate ? 'indeterminate' : state.checked
                    }
                    onCheckedChange={v => toggleParent(route, !!v)}
                  />
                  <Label
                    htmlFor={route.fullPath}
                    className="cursor-pointer flex-1 py-2"
                  >
                    {route.title}
                  </Label>
                </div>

                {!!route.children?.length && (
                  <div className="pl-6">
                    {route.children.map(sub => (
                      <div
                        key={sub.fullPath}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          id={sub.fullPath}
                          checked={paths.includes(sub.fullPath)}
                          onCheckedChange={v => toggleChild(sub.fullPath, !!v)}
                        />
                        <Label
                          htmlFor={sub.fullPath}
                          className="cursor-pointer flex-1 py-2"
                        >
                          {sub.title}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </SheetBody>

        <SheetFooter>
          <Button loading={isPending} onClick={onSubmit}>
            保存
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
