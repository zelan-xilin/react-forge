import type { ComponentType } from 'react';

export interface SummaryVo {
  key: string;
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
}
interface SummaryProps {
  data: SummaryVo[];
}
const Summary = ({ data }: SummaryProps) => {
  return (
    <div className="flex gap-2">
      {data.map(item => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="flex-1 border rounded-2xl p-4 box-border flex justify-between items-start border-border/65 bg-muted/65"
          >
            <div className="flex flex-col gap-2">
              <div className="text-xs text-muted-foreground">{item.label}</div>
              <div className="text-2xl font-semibold">{item.value.toLocaleString()}</div>
            </div>

            <div className="border border-border/65 rounded-full bg-muted/75 p-2">
              <Icon className="size-4 text-muted-foreground" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Summary;
