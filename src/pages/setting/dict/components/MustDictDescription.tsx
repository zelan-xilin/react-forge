import { dictAddApi, dictNameExistsApi } from '@/api/dict';
import { mustHaveDictOptions, STATUS } from '@/assets/enum';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShieldAlert } from 'lucide-react';
import { useEffect } from 'react';

const MustDictDescription = () => {
  useEffect(() => {
    mustHaveDictOptions.forEach(dict => {
      dictNameExistsApi(dict.label, dict.value).then(res => {
        if (!res.data.valueExists) {
          dictAddApi({
            label: dict.label,
            value: dict.value,
            status: STATUS.ENABLE,
            description: dict.description || null,
          });
        }
      });
    });
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="text-destructive!">
          <ShieldAlert />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>
          系统内置字典不允许删除，只能编辑和添加其子项
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {mustHaveDictOptions.map(dict => (
            <DropdownMenuItem key={dict.value} className="gap-20">
              {dict.label}:&nbsp;{dict.value}
              <DropdownMenuShortcut>{dict.description}</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MustDictDescription;
