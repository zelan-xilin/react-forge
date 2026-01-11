import {
  areaPricingRuleDeleteApi,
  areaPricingRuleListApi,
  areaResourceDeleteApi,
  areaResourceListApi,
} from '@/api/area';
import type { AreaPricingRuleDto, AreaResourceDto } from '@/api/area/types';
import {
  areaTypeOptions,
  overtimeRoundingOptions,
  roomSizeOptions,
  STATUS,
  timeTypeOptions,
} from '@/api/types';
import Delete from '@/components/Delete';
import PageWrapper from '@/components/PageWrapper';
import SearchInput from '@/components/SearchInput';
import Status from '@/components/Status';
import type { Column } from '@/components/Table';
import Table, { TableExtra } from '@/components/Table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useKeepAliveRefresh } from '@/layouts';
import { Plus, RotateCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import ResourceEdit from './components/ResourceEdit';
import RuleEdit from './components/RuleEdit';

const areaTabs = [
  { label: '资源管理', value: 'resource' },
  { label: '收费标准', value: 'rule' },
];
const resourceColumns: Column<AreaResourceDto>[] = [
  {
    title: '序号',
    field: 'index',
    width: 80,
    render: (_, index) => index + 1,
  },
  {
    title: '资源名称',
    field: 'name',
    render: item => item.name,
  },
  {
    title: '区域类型',
    field: 'areaType',
    render: item =>
      areaTypeOptions.find(option => option.value === item.areaType)?.label || item.areaType,
  },
  {
    title: '包间大小',
    field: 'roomSize',
    render: item => roomSizeOptions.find(option => option.value === item.roomSize)?.label,
  },
  {
    title: '容量(人)',
    field: 'capacity',
    render: item => item.capacity,
  },
  {
    title: '状态',
    field: 'status',
    render: item => <Status value={item.status === STATUS.ENABLE} />,
  },
  {
    title: '描述',
    field: 'description',
    render: item => item.description,
  },
];
const ruleColumns: Column<AreaPricingRuleDto>[] = [
  {
    title: '序号',
    field: 'index',
    width: 80,
    render: (_, index) => index + 1,
  },
  {
    title: '区域类型',
    field: 'areaType',
    render: item =>
      areaTypeOptions.find(option => option.value === item.areaType)?.label || item.areaType,
  },
  {
    title: '包间大小',
    field: 'roomSize',
    render: item => roomSizeOptions.find(option => option.value === item.roomSize)?.label,
  },
  {
    title: '应用时间',
    field: 'timeType',
    render: item => (
      <div>
        <div>
          {timeTypeOptions.find(option => option.value === item.timeType)?.label || item.timeType}
        </div>
        <div className="text-muted-foreground">{item.startTimeFrom}</div>
      </div>
    ),
  },
  {
    title: '使用时长(小时)',
    field: 'baseDurationMinutes',
    render: item => Number((item.baseDurationMinutes / 60).toFixed(1)),
  },
  {
    title: '价格',
    field: 'priceCents',
    render: item => (
      <div>
        <div>起步价格：¥{item.basePrice}</div>
        <div>超时价格：¥{item.overtimePricePerHour}&nbsp;/小时</div>
      </div>
    ),
  },
  {
    title: '超时计算方式',
    field: 'overtimeCalculateType',
    render: item => (
      <div>
        <div>
          超时取整方式：
          {overtimeRoundingOptions.find(option => option.value === item.overtimeRounding)?.label ||
            item.overtimeRounding}
        </div>
        <div>超时宽限分钟：{item.overtimeGraceMinutes}分钟</div>
      </div>
    ),
  },
  {
    title: '赠送茶水额度(元)',
    field: 'giftTeaAmount',
    render: item => item.giftTeaAmount,
  },
  {
    title: '状态',
    field: 'status',
    render: item => <Status value={item.status === STATUS.ENABLE} />,
  },
  {
    title: '描述',
    field: 'description',
    render: item => item.description,
  },
];
const Area = () => {
  const { refreshId, refreshLoading, onRefresh } = useKeepAliveRefresh('/area');

  const [areaType, setAreaType] = useState(areaTabs[0].value);

  const [resourceQuery, setResourceQuery] = useState({
    name: '',
  });
  const [resourceData, setResourceData] = useState<AreaResourceDto[]>([]);
  const resourceDataFilter = useMemo(() => {
    let data = resourceData;
    if (resourceQuery.name) {
      data = data.filter(item => item.name.includes(resourceQuery.name));
    }
    return data;
  }, [resourceData, resourceQuery]);
  useEffect(() => {
    void refreshId;

    areaResourceListApi().then(res => {
      setResourceData(res.data || []);
    });
  }, [refreshId]);
  const [resourceModal, setResourceModal] = useState<{
    open: boolean;
    data: AreaResourceDto | undefined;
  }>({
    open: false,
    data: undefined,
  });
  const onDeleteRule = (data: AreaPricingRuleDto) => {
    areaPricingRuleDeleteApi(data.id).then(() => {
      onRefresh();
      toast.success('删除成功');
    });
  };
  const resourceActions: Column<AreaResourceDto>[] = [
    {
      title: '操作',
      field: 'actions',
      width: 100,
      render: item => (
        <div className="flex gap-2">
          <Button
            variant="link"
            size="sm"
            className="px-0 text-xs"
            onClick={() => setResourceModal({ open: true, data: item })}
          >
            编辑
          </Button>
          <Delete onDelete={() => onDeleteResource(item)}>
            <Button variant="link-destructive" size="sm" className="px-0 text-xs">
              删除
            </Button>
          </Delete>
        </div>
      ),
    },
  ];

  const [ruleQuery, setRuleQuery] = useState({
    areaType: '',
  });
  const [ruleData, setRuleData] = useState<AreaPricingRuleDto[]>([]);
  const ruleDataFilter = useMemo(() => {
    let data = ruleData;

    const areaTypeObj = areaTypeOptions.reduce(
      (acc, option) => {
        acc[option.value] = option.label;
        return acc;
      },
      {} as Record<string, string>,
    );

    if (ruleQuery.areaType) {
      data = data.filter(item => {
        return areaTypeObj[item.areaType]?.includes(ruleQuery.areaType);
      });
    }
    return data;
  }, [ruleData, ruleQuery]);
  useEffect(() => {
    void refreshId;

    areaPricingRuleListApi().then(res => {
      setRuleData(res.data || []);
    });
  }, [refreshId]);
  const [ruleModal, setRuleModal] = useState<{
    open: boolean;
    data: AreaPricingRuleDto | undefined;
  }>({
    open: false,
    data: undefined,
  });
  const onDeleteResource = (item: AreaResourceDto) => {
    areaResourceDeleteApi(item.id).then(() => {
      onRefresh();
      toast.success('删除成功');
    });
  };
  const ruleActions: Column<AreaPricingRuleDto>[] = [
    {
      title: '操作',
      field: 'actions',
      width: 100,
      render: item => (
        <div className="flex gap-2">
          <Button
            variant="link"
            size="sm"
            className="px-0 text-xs"
            onClick={() => setRuleModal({ open: true, data: item })}
          >
            编辑
          </Button>
          <Delete onDelete={() => onDeleteRule(item)}>
            <Button variant="link-destructive" size="sm" className="px-0 text-xs">
              删除
            </Button>
          </Delete>
        </div>
      ),
    },
  ];

  return (
    <PageWrapper
      title="区域管理"
      description="配置各区域资源在不同时间段的收费标准及茶水赠送额度。"
      extra={
        <div className="flex items-center gap-2">
          <Tabs value={areaType} onValueChange={setAreaType}>
            <TabsList>
              {areaTabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          {areaType === 'resource' ? (
            <SearchInput
              key="resource-search-input"
              placeholder="搜索资源名称..."
              onChange={name => setResourceQuery({ name })}
            />
          ) : (
            <SearchInput
              key="rule-search-input"
              placeholder="搜索区域类型..."
              onChange={areaType => setRuleQuery({ areaType })}
            />
          )}
        </div>
      }
      action={
        <>
          <Button
            onClick={() => {
              if (areaType === 'resource') {
                setResourceModal({ open: true, data: undefined });
              } else {
                setRuleModal({ open: true, data: undefined });
              }
            }}
          >
            <Plus />
            <span>新增{areaType === 'resource' ? '资源' : '收费'}</span>
          </Button>
          <Button
            hideChildrenOnLoading
            variant="ghost"
            loading={refreshLoading}
            onClick={onRefresh}
          >
            <RotateCw />
          </Button>
        </>
      }
    >
      {areaType === 'resource' ? (
        <Table
          key="resource"
          columns={[...resourceColumns, ...resourceActions]}
          data={resourceDataFilter}
          extra={<TableExtra dataLength={resourceDataFilter.length} total={resourceData.length} />}
        />
      ) : (
        <Table
          key="rule"
          columns={[...ruleColumns, ...ruleActions]}
          data={ruleDataFilter}
          extra={<TableExtra dataLength={ruleDataFilter.length} total={ruleData.length} />}
        />
      )}

      <RuleEdit
        {...ruleModal}
        onClose={dto => {
          setRuleModal({ open: false, data: undefined });

          if (dto) {
            onRefresh();
          }
        }}
      />
      <ResourceEdit
        {...resourceModal}
        onClose={dto => {
          setResourceModal({ open: false, data: undefined });

          if (dto) {
            onRefresh();
          }
        }}
      />
    </PageWrapper>
  );
};

export default Area;
