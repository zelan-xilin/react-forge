import type { AreaDto } from '@/api/area/types';
import type { OrderDto } from '@/api/cashier/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDict } from '@/hooks/useDict';
import { CirclePlus, Package2 } from 'lucide-react';
import { useState } from 'react';
import OrderEdit from './OrderEdit';

interface InNoneProps {
  data: AreaDto;
  order: OrderDto | undefined;
  onRefresh: () => void;
}
const InNone = (props: InNoneProps) => {
  const { data, order, onRefresh } = props;
  const { dict } = useDict();

  const [editModal, setEditModal] = useState<{
    open: boolean;
    type: 'edit' | 'reserved';
  }>({
    open: false,
    type: 'edit',
  });

  return (
    <div className="p-4 rounded-lg bg-card border flex flex-col gap-4 border-status-idle/20">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold">{data.name}</div>
          <div className="text-xs text-muted-foreground scale-85 origin-left">
            {dict.area_type?.find(item => item.value === data.areaType)
              ?.label || data.areaType}
            {!!data.roomSize && ' · '}
            {dict.room_size?.find(item => item.value === data.roomSize)
              ?.label || data.roomSize}
          </div>
        </div>

        <div className="text-status-idle border-status-idle bg-status-idle/10 rounded-md px-2 py-1 border font-medium text-xs scale-85">
          空闲
        </div>
      </div>

      <ScrollArea className="h-50 pr-4 -mr-4 box-border">
        <div className="mt-10 flex items-center flex-col gap-4 text-muted-foreground">
          <Package2 />
          <div className="text-xs">等待入座</div>
        </div>
      </ScrollArea>

      <Separator className="bg-status-idle/20" />

      <div className="w-full flex gap-4">
        <Button
          className="bg-muted! text-muted-foreground!"
          onClick={() => setEditModal({ open: true, type: 'reserved' })}
        >
          <span className="text-xs">预定</span>
        </Button>

        <Button
          className="flex-1 bg-status-idle! flex items-center"
          onClick={() => setEditModal({ open: true, type: 'edit' })}
        >
          <CirclePlus className="size-3 -mt-0.5" />
          <span className="text-xs">开台点单</span>
        </Button>
      </div>

      <OrderEdit
        {...editModal}
        area={data}
        order={order}
        onClose={req => {
          setEditModal({ open: false, type: 'edit' });

          if (req) {
            onRefresh();
          }
        }}
      />
    </div>
  );
};

export default InNone;
