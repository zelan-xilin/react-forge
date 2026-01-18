import type { AreaDto } from '@/api/area/types';
import { updateOrderApi } from '@/api/cashier';
import type { OrderDto } from '@/api/cashier/types';
import { ORDER_STATUS } from '@/assets/enum';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDict } from '@/hooks/useDict';
import type { RootState } from '@/store';
import { CirclePlus, Clock5, UserStar } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import OrderEdit from './OrderEdit';

interface ReservedProps {
  data: AreaDto;
  order: OrderDto | undefined;
  onRefresh: () => void;
}
const Reserved = ({ data, order, onRefresh }: ReservedProps) => {
  const { dict } = useDict();
  const user = useSelector((state: RootState) => state.user);

  const [editModal, setEditModal] = useState<{
    open: boolean;
    type: 'reserved';
  }>({
    open: false,
    type: 'reserved',
  });

  const onCloseOrder = () => {
    if (!order) {
      return;
    }

    updateOrderApi({
      orderNo: order.orderNo,
      orderStatus: ORDER_STATUS.CANCELLED,
      closedAt: new Date().toISOString(),
      updatedBy: user.id!,
      updatedByName: user.username!,
    }).then(() => {
      onRefresh();
    });
  };
  const onStart = () => {
    if (!order) {
      return;
    }

    updateOrderApi({
      orderNo: order.orderNo,
      orderStatus: ORDER_STATUS.IN_PROGRESS,
      openedAt: new Date().toISOString(),
      updatedBy: user.id!,
      updatedByName: user.username!,
    }).then(() => {
      onRefresh();
    });
  };

  return (
    <div className="p-4 rounded-lg bg-card border flex flex-col gap-4 border-status-reserved/20">
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

        <div className="text-status-reserved border-status-reserved bg-status-reserved/10 rounded-md px-2 py-1 border font-medium text-xs scale-85">
          预定
        </div>
      </div>

      <ScrollArea className="h-50 pr-4 -mr-4 box-border">
        <div className="flex flex-col gap-4">
          <div
            className="p-4 rounded-lg bg-status-reserved/10 border border-status-reserved/20 flex flex-col gap-1 cursor-pointer"
            onClick={() => setEditModal({ open: true, type: 'reserved' })}
          >
            <div className="flex gap-4 items-center text-xs">
              <Clock5 className="text-status-reserved" />
              <div>
                <div className="text-muted-foreground">预定时间</div>
                <div className="font-semibold">{order?.reserved?.arriveAt}</div>
              </div>
            </div>
            <div className="flex gap-4 items-center text-xs">
              <UserStar className="text-status-reserved" />
              <div>
                <div className="text-muted-foreground">预定人</div>
                <div className="font-semibold">{order?.reserved?.username}</div>
                <div className="font-semibold">{order?.reserved?.contact}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <div className="text-muted-foreground flex justify-between items-center">
              <div>
                已点商品(
                {order?.products?.reduce(
                  (sum, pr) => sum + (pr.quantity ?? 0),
                  0,
                ) || 0}
                )
              </div>
              <Button
                size="sm"
                className="text-xs px-2 py-1 h-auto scale-80 origin-right flex items-center"
                onClick={() => setEditModal({ open: true, type: 'reserved' })}
              >
                <CirclePlus className="size-3" />
                添加商品
              </Button>
            </div>

            {order?.products?.map((pr, i) => (
              <div
                key={pr.id}
                className={`flex gap-2 justify-between pb-2 leading-none ${i < order.products!.length - 1 ? 'border-b' : ''}`}
              >
                <div className="">{pr.productName}</div>
                <div className="text-muted-foreground">
                  ¥&nbsp;{pr.unitPrice}
                  <span>&nbsp;&nbsp;*&nbsp;&nbsp;</span>
                  {pr.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      <Separator className="bg-status-reserved/20" />

      <div className="flex justify-between items-center">
        <Button
          className="bg-muted! text-muted-foreground!"
          onClick={onCloseOrder}
        >
          <span className="text-xs">取消</span>
        </Button>

        <Button className="bg-status-reserved!" onClick={onStart}>
          <span className="text-xs">确认到店</span>
        </Button>
      </div>

      <OrderEdit
        {...editModal}
        area={data}
        order={order}
        onClose={req => {
          setEditModal({ open: false, type: 'reserved' });

          if (req) {
            onRefresh();
          }
        }}
      />
    </div>
  );
};

export default Reserved;
