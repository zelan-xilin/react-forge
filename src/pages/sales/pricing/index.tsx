import { chargeTypeOptions } from '@/assets/enum';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useKeepAliveRefresh } from '@/layouts';
import { Plus, RotateCw } from 'lucide-react';
import { useRef, useState } from 'react';
import AreaTable, { type AreaTableRef } from './components/AreaTable';
import ProductTable, { type ProductTableRef } from './components/ProductTable';

const Pricing = () => {
  const { refreshId, refreshLoading, onRefresh } =
    useKeepAliveRefresh('/sales/pricing');
  const [chargeType, setChargeType] = useState<string>(
    chargeTypeOptions[0].value,
  );

  const areaRef = useRef<AreaTableRef>(null);
  const productRef = useRef<ProductTableRef>(null);

  return (
    <PageWrapper
      title="收费规则"
      description="配置不同区域在各收费类型中的收费规则和商品定价。"
      extra={
        <>
          <Tabs value={chargeType} onValueChange={setChargeType}>
            <TabsList>
              {chargeTypeOptions.map(it => (
                <TabsTrigger key={it.value} value={it.value}>
                  {it.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button
            onClick={() => {
              if (chargeType === 'area') {
                areaRef.current?.setEditModal({ open: true, data: undefined });
              }
              if (chargeType === 'product') {
                productRef.current?.setEditModal({
                  open: true,
                  data: undefined,
                });
              }
            }}
          >
            <Plus />
            <span>
              新增{chargeTypeOptions.find(it => it.value === chargeType)?.label}
            </span>
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
      <Tabs value={chargeType} onValueChange={setChargeType}>
        <TabsContent value="area">
          <AreaTable
            ref={areaRef}
            refreshId={refreshId}
            onRefresh={onRefresh}
          />
        </TabsContent>
        <TabsContent value="product">
          <ProductTable
            ref={productRef}
            refreshId={refreshId}
            onRefresh={onRefresh}
          />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default Pricing;
