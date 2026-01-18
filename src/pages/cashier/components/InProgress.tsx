import type { AreaDto } from '@/api/area/types';
import type { OrderDto } from '@/api/cashier/types';
import type { AreaPricingDto } from '@/api/pricing/area-types';
import { OVERTIME_ROUNDING } from '@/assets/enum';
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
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDict } from '@/hooks/useDict';
import { ArrowRight, BadgeQuestionMark, CirclePlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import OrderEdit from './OrderEdit';

/**
 * 价格组件
 * - 进度百分比
 * - 使用时间（毫秒）
 * - 规则免费时间（毫秒）
 * - 格式化使用时间
 * - 是否超时
 * - 基础价格
 * - 超时价格
 * - 赠送茶水金额
 * - 商品价格
 */
interface PriceProps {
  data: {
    progress: number;
    elapsedMilliseconds: number;
    ruleMilliseconds: number;
    formattedElapsedTime: string;
    isExceeded: boolean;
    basePrice: number;
    extraPrice: number;
    giftPrice: number;
    productPrice: number;
  };
}
const Price = ({ data }: PriceProps) => {
  const { basePrice, extraPrice, giftPrice, productPrice } = data;
  const total = (
    basePrice +
    extraPrice +
    Math.max(0, productPrice - giftPrice)
  ).toFixed();

  const detail = [
    { label: '区域使用价格', value: `¥ ${basePrice}` },
    { label: '区域超时价格', value: `¥ ${extraPrice}` },
    {
      label: '商品价格',
      value: `¥ ${productPrice}(商品价格) - ¥ ${giftPrice}(赠送茶水金额) = ¥ ${Math.max(0, productPrice - giftPrice)}`,
    },
    { label: '总价', value: `¥ ${total}` },
  ];

  return (
    <div className="text-status-in-progress font-semibold flex items-center">
      <span>¥&nbsp;{total}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="-mt-0.5">
            <BadgeQuestionMark />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>价格计算详情</DropdownMenuLabel>
          <DropdownMenuGroup>
            {detail.map((it, i) => (
              <DropdownMenuItem key={i} className="gap-4">
                <span>{it.label}</span>
                <DropdownMenuShortcut>{it.value}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

interface InProgressProps {
  data: AreaDto;
  order: OrderDto | undefined;
  areaPricing: AreaPricingDto[];
  onRefresh: () => void;
}
const InProgress = ({
  data,
  order,
  areaPricing,
  onRefresh,
}: InProgressProps) => {
  const { dict } = useDict();

  const [editModal, setEditModal] = useState<{
    open: boolean;
    type: 'edit';
  }>({
    open: false,
    type: 'edit',
  });

  /** 查找计费规则 */
  const areaPricingRule = useMemo(() => {
    if (!order?.area || !areaPricing.length || !order.openedAt) {
      return undefined;
    }

    const openedAt = new Date(order.openedAt);
    const openedSeconds =
      openedAt.getHours() * 3600 +
      openedAt.getMinutes() * 60 +
      openedAt.getSeconds();

    const parseTimeToSeconds = (timeStr: string): number => {
      const parts = timeStr.split(':').map(Number);
      return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    };

    const matchedRule = areaPricing.find(pri => {
      const startSec = parseTimeToSeconds(pri.applyTimeStart);
      const endSec = parseTimeToSeconds(pri.applyTimeEnd);

      // endSec 小于 startSec，表示跨天计费
      const adjustedEndSec = endSec < startSec ? endSec + 86400 : endSec;
      return openedSeconds >= startSec && openedSeconds < adjustedEndSec;
    });

    return matchedRule;
  }, [order, areaPricing]);

  /** 计算当前时间距离开单时间的时长（毫秒） */
  const [elapsedMilliseconds, setElapsedMilliseconds] = useState(() => {
    if (!order?.openedAt) {
      return 0;
    }

    const openedAt = new Date(order.openedAt);
    const now = new Date();
    return now.getTime() - openedAt.getTime();
  });
  useEffect(() => {
    if (!order?.openedAt) {
      Promise.resolve().then(() => setElapsedMilliseconds(0));
      return;
    }

    const openedAt = new Date(order.openedAt);

    const updateElapsed = () => {
      const now = new Date();
      setElapsedMilliseconds(now.getTime() - openedAt.getTime());
    };

    const timer = setInterval(updateElapsed, 1000);

    return () => clearInterval(timer);
  }, [order?.openedAt]);

  /**
   * 计算使用时间相关数据
   */
  const usedTime = useMemo<PriceProps['data']>(() => {
    const productPrice =
      order?.products?.reduce((sum, pr) => {
        return sum + (pr.unitPrice || 0) * (pr.quantity || 0);
      }, 0) || 0;

    if (!areaPricingRule || elapsedMilliseconds <= 0) {
      return {
        progress: 0,
        elapsedMilliseconds: 0,
        ruleMilliseconds: 0,
        formattedElapsedTime: '00:00:00',
        isExceeded: false,
        basePrice: 0,
        extraPrice: 0,
        giftPrice: 0,
        productPrice,
      };
    }

    /** 规则规则定的使用时间 */
    const ruleMilliseconds =
      (areaPricingRule.usageDurationHours || 0) * 60 * 60 * 1000;

    /** 使用时间在规则内的进度 */
    const progress = ruleMilliseconds
      ? (elapsedMilliseconds / ruleMilliseconds) * 100
      : 0;

    /** 使用时间格式化 */
    const totalSeconds = Math.floor(elapsedMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const formattedElapsedTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    /** 计算超时价格 */
    const extraMs = Math.max(0, elapsedMilliseconds - ruleMilliseconds);
    const overtimeGraceMs =
      (areaPricingRule.overtimeGraceMinutes || 0) * 60 * 1000;
    let extraPrice = 0;
    if (extraMs > overtimeGraceMs) {
      if (areaPricingRule.overtimeRoundType === OVERTIME_ROUNDING.CEIL) {
        const extraHours = Math.ceil(extraMs / (60 * 60 * 1000));
        extraPrice = extraHours * (areaPricingRule.overtimeHourPrice || 0);
      }
      if (areaPricingRule.overtimeRoundType === OVERTIME_ROUNDING.EXACT) {
        const extraMinutes = Math.ceil(extraMs / (60 * 1000));
        extraPrice =
          (extraMinutes / 60) * (areaPricingRule.overtimeHourPrice || 0);
      }
    }

    return {
      progress: parseInt(Math.min(progress, 100).toString(), 10),
      elapsedMilliseconds,
      ruleMilliseconds,
      formattedElapsedTime,
      isExceeded: elapsedMilliseconds > ruleMilliseconds,
      basePrice: areaPricingRule.basePrice || 0,
      extraPrice,
      giftPrice: areaPricingRule.giftTeaAmount || 0,
      productPrice,
    };
  }, [areaPricingRule, elapsedMilliseconds, order?.products]);

  return (
    <div className="p-4 rounded-lg bg-card border flex flex-col gap-4 border-status-in-progress/20">
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

        <div className="text-status-in-progress border-status-in-progress bg-status-in-progress/10 rounded-md px-2 py-1 border font-medium text-xs scale-85">
          消费中
        </div>
      </div>

      <ScrollArea className="h-50 pr-4 -mr-4 box-border">
        <div className="relative flex flex-col gap-4">
          <div className="bg-card sticky top-0">
            <div className="rounded-lg bg-accent p-4 flex flex-col gap-4">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground scale-85 origin-left">
                  入座时长
                </span>
                <span
                  className={`font-semibold ${usedTime.isExceeded ? 'text-destructive' : ''}`}
                >
                  {usedTime.formattedElapsedTime}
                </span>
              </div>

              <Progress value={usedTime.progress} />
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
                onClick={() => setEditModal({ open: true, type: 'edit' })}
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

      <Separator className="bg-status-in-progress/20" />

      <div className="flex justify-between items-center">
        <div>
          <div className="text-xs text-muted-foreground scale-85 origin-left">
            当前消费
          </div>

          <Price data={usedTime} />
        </div>

        <Button className="bg-status-in-progress!">
          <span className="text-xs">结账</span>
          <ArrowRight className="size-3 -mt-1" />
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

export default InProgress;
