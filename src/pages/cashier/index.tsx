import { areaListApi } from '@/api/area';
import type { AreaDto } from '@/api/area/types';
import { orderPageApi } from '@/api/cashier';
import type { OrderDto } from '@/api/cashier/types';
import { areaPricingListApi } from '@/api/pricing/area';
import type { AreaPricingDto } from '@/api/pricing/area-types';
import { MAX_PAGE_SIZE, ORDER_STATUS, STATUS } from '@/assets/enum';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDict } from '@/hooks/useDict';
import { useKeepAliveRefresh } from '@/layouts';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, RotateCw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Idle from './components/Idle';
import InProgress from './components/InProgress';
import Reserved from './components/Reserved';

const Cashier = () => {
  const { refreshId, refreshLoading, onRefresh } =
    useKeepAliveRefresh('/cashier');
  const { dict } = useDict();

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
      const _data = res.data?.filter(it => it.status === STATUS.ENABLE) || [];
      const areTypeWeight =
        dict.area_type?.reduce(
          (obj, it, idx) => ({ ...obj, [it.value]: (idx + 1) * 1000 }),
          {} as Record<string, number>,
        ) || {};
      const roomSizeWeight =
        dict.room_size?.reduce(
          (obj, it, idx) => ({ ...obj, [it.value]: idx + 1 }),
          {} as Record<string, number>,
        ) || {};
      _data.sort(
        (a, b) =>
          (areTypeWeight[a.areaType] || 0) +
          (roomSizeWeight[a.roomSize ?? ''] || 0) -
          (areTypeWeight[b.areaType] || 0) -
          (roomSizeWeight[b.roomSize ?? ''] || 0),
      );
      setAreaData(_data);
    });
  }, [refreshId, dict.area_type, dict.room_size]);

  /** 区域收费标准 */
  const [areaPricing, setAreaPricing] = useState<AreaPricingDto[]>([]);
  useEffect(() => {
    void refreshId;

    areaPricingListApi().then(res => {
      setAreaPricing(res.data?.filter(it => it.status === STATUS.ENABLE) || []);
    });
  }, [refreshId]);

  /** 区域、订单渲染组件 */
  const [query, setQuery] = useState({
    keyword: '',
    areaType: '',
    roomSize: ''
  })
  const areaRender = (area: AreaDto) => {
    const order = orderData.find(it => it.area?.areaId === area.id);
    const idleAreas = areaData.filter(
      it =>
        it.status === STATUS.ENABLE &&
        !orderData.some(od => od.area?.areaId === it.id),
    );


    /** 关键词检索 */
    const areaName = area.name.toLocaleLowerCase()
    const reservedUsername = order?.reserved?.username?.toLocaleLowerCase() || ''
    const reservedContact = order?.reserved?.contact?.toLocaleLowerCase() || ''
    if (query.keyword && [areaName, reservedUsername, reservedContact].every(field => !field.includes(query.keyword.toLocaleLowerCase()))) {
      return null;
    }

    /** 区域类型检索 */
    if (query.areaType && area.areaType !== query.areaType) {
      return null;
    }

    /** 房间大小检索 */
    if (query.roomSize && area.roomSize !== query.roomSize) {
      return null;
    }

    if (order?.orderStatus === ORDER_STATUS.RESERVED) {
      return (
        <Reserved
          key={area.id}
          idleAreas={idleAreas}
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
          idleAreas={idleAreas}
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
      <Idle
        key={area.id}
        idleAreas={idleAreas}
        data={area}
        order={order}
        onRefresh={onRefresh}
      />
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
      actions={
        <>
          <InputGroup className='w-70'>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput placeholder='区域名称、预定人、号码检索...' value={query.keyword} onChange={e => setQuery({ ...query, keyword: e.target.value })} />
          </InputGroup>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={`w-70 justify-between bg-transparent! font-normal ${query.areaType ? '' : 'text-muted-foreground!'}`}
              >
                {query.areaType
                  ? dict.area_type?.find((it) => it.value === query.areaType)?.label
                  : "区域类型检索..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-70 p-0">
              <Command>
                <CommandInput placeholder="区域类型检索..." className="h-9" />
                <CommandList>
                  <CommandEmpty>无匹配数据</CommandEmpty>
                  <CommandGroup>
                    {dict.area_type?.map((it) => (
                      <CommandItem
                        key={it.value}
                        value={it.value}
                        onSelect={(currentValue) => {
                          setQuery({ ...query, areaType: currentValue === query.areaType ? "" : currentValue })
                        }}
                      >
                        {it.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            query.areaType === it.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={`w-70 justify-between bg-transparent! font-normal ${query.roomSize ? '' : 'text-muted-foreground!'}`}
              >
                {query.roomSize
                  ? dict.room_size?.find((it) => it.value === query.roomSize)?.label
                  : "房间大小检索..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-70 p-0">
              <Command>
                <CommandInput placeholder="房间大小检索..." className="h-9" />
                <CommandList>
                  <CommandEmpty>无匹配数据</CommandEmpty>
                  <CommandGroup>
                    {dict.room_size?.map((it) => (
                      <CommandItem
                        key={it.value}
                        value={it.value}
                        onSelect={(currentValue) => {
                          setQuery({ ...query, roomSize: currentValue === query.roomSize ? "" : currentValue })
                        }}
                      >
                        {it.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            query.roomSize === it.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {areaData.map(area => areaRender(area))}
      </div>
    </PageWrapper>
  );
};

export default Cashier;
