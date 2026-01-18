import { areaListApi } from '@/api/area';
import type { AreaDto } from '@/api/area/types';
import { orderPageApi } from '@/api/cashier';
import type { OrderDto } from '@/api/cashier/types';
import { areaPricingListApi } from '@/api/pricing/area';
import type { AreaPricingDto } from '@/api/pricing/area-types';
import { MAX_PAGE_SIZE, ORDER_STATUS, STATUS } from '@/assets/enum';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { useKeepAliveRefresh } from '@/layouts';
import { RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import Idle from './components/Idle';
import InProgress from './components/InProgress';
import Reserved from './components/Reserved';

const Cashier = () => {
  const { refreshId, refreshLoading, onRefresh } =
    useKeepAliveRefresh('/cashier');

  /** 当前正在进行的订单 */
  const [orderData, setOrderData] = useState<OrderDto[]>([]);
  useEffect(() => {
    void refreshId;

    orderPageApi({
      page: 1,
      pageSize: MAX_PAGE_SIZE,
      orderStatus: [
        ORDER_STATUS.RESERVED,
        ORDER_STATUS.IN_PROGRESS,
        ORDER_STATUS.PENDING_PAY,
      ],
    }).then(res => {
      setOrderData(res.data.records || []);
    });
  }, [refreshId]);

  /** 可用区域 */
  const [areaData, setAreaData] = useState<AreaDto[]>([]);
  useEffect(() => {
    void refreshId;

    areaListApi().then(res => {
      setAreaData(res.data?.filter(it => it.status === STATUS.ENABLE) || []);
    });
  }, [refreshId]);

  /** 区域收费标准 */
  const [areaPricing, setAreaPricing] = useState<AreaPricingDto[]>([]);
  useEffect(() => {
    void refreshId;

    areaPricingListApi().then(res => {
      setAreaPricing(res.data?.filter(it => it.status === STATUS.ENABLE) || []);
    });
  }, [refreshId]);

  /** 区域、订单渲染组件 */
  const areaRender = (area: AreaDto) => {
    const order = orderData.find(it => it.area?.areaId === area.id);

    if (order?.orderStatus === ORDER_STATUS.RESERVED) {
      return (
        <Reserved
          key={area.id}
          data={area}
          order={order}
          onRefresh={onRefresh}
        />
      );
    }

    if (order?.orderStatus === ORDER_STATUS.IN_PROGRESS) {
      return (
        <InProgress
          key={area.id}
          data={area}
          order={order}
          onRefresh={onRefresh}
          areaPricing={areaPricing.filter(
            ap =>
              ap.areaType === area.areaType &&
              (ap.roomSize ? ap.roomSize === area.roomSize : !area.roomSize),
          )}
        />
      );
    }

    return (
      <Idle key={area.id} data={area} order={order} onRefresh={onRefresh} />
    );
  };

  return (
    <PageWrapper
      title="收银台"
      extra={
        <Button
          hideChildrenOnLoading
          variant="ghost"
          loading={refreshLoading}
          onClick={onRefresh}
        >
          <RotateCw />
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {areaData.map(area => areaRender(area))}
      </div>
    </PageWrapper>
  );
};

export default Cashier;
