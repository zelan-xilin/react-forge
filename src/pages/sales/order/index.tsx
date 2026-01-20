import { orderPageApi } from '@/api/cashier';
import type { OrderDto, OrderPageParams } from '@/api/cashier/types';
import { orderStatusOptions } from '@/assets/enum';
import PageWrapper from '@/components/PageWrapper';
import type { Column } from '@/components/Table';
import Table, { TableExtra } from '@/components/Table';
import { Button } from '@/components/ui/button';
import { useKeepAliveRefresh } from '@/layouts';
import { RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import Detail from './components/Detail';

const Order = () => {
  const { refreshId, refreshLoading, onRefresh } =
    useKeepAliveRefresh('/sales/order');

  const [query, setQuery] = useState<OrderPageParams>({
    page: 1,
    pageSize: 10,
  });
  const [data, setData] = useState<OrderDto[]>([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    void refreshId;

    orderPageApi(query).then(res => {
      setData(res.data.records || []);
      setTotal(res.data.total || 0);
    });
  }, [refreshId, query]);

  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    data: OrderDto | undefined;
  }>({
    open: false,
    data: undefined,
  });
  const columns: Column<OrderDto>[] = [
    {
      title: '序号',
      field: 'index',
      width: 80,
      render: (_, index) => index + 1,
    },
    {
      title: '订单编号',
      field: 'orderNo',
      render: item => item.orderNo,
    },
    {
      title: '开单时间',
      field: 'openedAt',
      render: item =>
        item.openedAt ? new Date(item.openedAt).toLocaleString() : '',
    },
    {
      title: '结账时间',
      field: 'closedAt',
      render: item =>
        item.closedAt ? new Date(item.closedAt).toLocaleString() : '',
    },
    {
      title: '订单状态',
      field: 'orderStatus',
      render: item =>
        orderStatusOptions.find(o => o.value === item.orderStatus)?.label || '',
    },
    {
      title: '理论金额',
      field: 'theoreticalAmount',
      render: item => item.expectedAmount,
    },
    {
      title: '实际金额',
      field: 'actualAmount',
      render: item => item.actualAmount,
    },
    {
      title: '收费差异原因',
      field: 'paymentDifferenceReason',
      render: item => item.paymentDifferenceReason,
    },
    {
      title: '操作',
      field: 'actions',
      width: 70,
      render: item => (
        <div className="flex gap-2">
          <Button
            variant="link"
            size="sm"
            className="px-0 text-xs"
            onClick={() => setDetailModal({ open: true, data: item })}
          >
            详情
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageWrapper
      title="订单管理"
      description="查看销售订单信息，包括开单时间、结账时间、金额等。"
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
      <Table
        columns={columns}
        data={data}
        rowKey={it => it.id}
        extra={
          <TableExtra
            dataLength={data.length}
            total={total}
            query={query}
            setQuery={q => setQuery(prev => ({ ...prev, ...q }))}
          />
        }
      />

      <Detail
        {...detailModal}
        onClose={() => {
          setDetailModal({ open: false, data: undefined });
        }}
      />
    </PageWrapper>
  );
};

export default Order;
