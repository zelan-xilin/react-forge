import type { OrderDto } from '@/api/cashier/types';
import { orderStatusOptions } from '@/assets/enum';
import { Button } from '@/components/ui/button';
import { FieldLabel } from '@/components/ui/field';
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
import { useDict } from '@/hooks/useDict';

interface DetailProps {
  data: OrderDto | undefined;
  open: boolean;
  onClose: () => void;
}
const Detail = (props: DetailProps) => {
  const { data, open, onClose } = props;
  const { dict } = useDict();

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{data?.orderNo}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <SheetBody>
          <div className="flex flex-col gap-4">
            <div>
              <FieldLabel className="tracking-widest">订单信息</FieldLabel>

              <div className="rounded-lg border bg-card p-4 flex flex-col gap-2 mt-2">
                <div>
                  开单时间：
                  {data?.openedAt
                    ? new Date(data.openedAt).toLocaleString()
                    : ''}
                </div>
                <div>
                  结账时间：
                  {data?.closedAt
                    ? new Date(data.closedAt).toLocaleString()
                    : ''}
                </div>
                <div>
                  订单状态：
                  {orderStatusOptions.find(o => o.value === data?.orderStatus)
                    ?.label || data?.orderStatus}
                </div>
                <div>理论金额：{data?.expectedAmount}</div>
                <div>实际金额：{data?.actualAmount}</div>
                <div>收费差异原因：{data?.paymentDifferenceReason || '-'}</div>
              </div>
            </div>

            <div>
              <FieldLabel className="tracking-widest">区域信息</FieldLabel>

              <div className="rounded-lg border bg-card p-4 flex flex-col gap-2 mt-2">
                <div>区域名称：{data?.area?.areaName}</div>
                <div>
                  区域类型：
                  {dict.area_type?.find(o => o.value === data?.area?.areaType)
                    ?.label || data?.area?.areaType}
                </div>
                <div>
                  房间大小：
                  {dict.room_size?.find(o => o.value === data?.area?.roomSize)
                    ?.label || data?.area?.roomSize}
                </div>
              </div>
            </div>

            {data?.reserved && (
              <div>
                <FieldLabel className="tracking-widest">预定人信息</FieldLabel>

                <div className="rounded-lg border bg-card p-4 flex flex-col gap-2 mt-2">
                  <div>预定人：{data?.reserved?.username}</div>
                  <div>联系方式：{data?.reserved?.contact}</div>
                  <div>预定时间：{data?.reserved?.arriveAt}</div>
                </div>
              </div>
            )}

            <div>
              <FieldLabel className="tracking-widest">售卖商品</FieldLabel>

              <div className="rounded-lg border bg-card p-4 flex flex-col gap-2 mt-2">
                {data?.products?.map((p, i) => (
                  <div key={i} className="flex justify-between">
                    <div>{p.productName}</div>
                    <div>
                      ¥&nbsp;{p.unitPrice}&nbsp;x&nbsp;{p.quantity}
                    </div>
                  </div>
                ))}
                {!data?.products?.length && (
                  <div className="text-muted-foreground text-center text-xs">
                    无售卖商品
                  </div>
                )}
              </div>
            </div>

            <div>
              <FieldLabel className="tracking-widest">支付方式</FieldLabel>

              <div className="rounded-lg border bg-card p-4 flex flex-col gap-2 mt-2">
                {data?.payments?.map((p, i) => (
                  <div key={i} className="flex justify-between">
                    <div>{p.paymentMethodName}</div>
                    <div>¥&nbsp;{p.paymentAmount}</div>
                  </div>
                ))}
                {!data?.payments?.length && (
                  <div className="text-muted-foreground text-center text-xs">
                    无支付记录
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetBody>

        <SheetFooter>
          <SheetClose asChild>
            <Button>关闭</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Detail;
