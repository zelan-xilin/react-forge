import type { ReactNode } from 'react';

interface PageWrapperProps {
  title: string;
  description?: string;
  extra?: ReactNode;
  action?: ReactNode;
  summary?: ReactNode;
  children?: ReactNode;
  fixed?: boolean;
}
const PageWrapper = (props: PageWrapperProps) => {
  const { title, description, extra, action, summary, children, fixed } = props;

  return (
    <div className="h-full py-4 box-border overflow-hidden flex flex-col gap-4">
      <div className="flex-none px-6 flex justify-between items-end gap-4 pb-4 border-b">
        <div className="flex-1 space-y-1">
          <div className="text-2xl font-semibold">{title}</div>
          {description && <div className="text-xs text-muted-foreground">{description}</div>}
        </div>

        <div className="flex-none flex gap-2">
          {extra && <div>{extra}</div>}
          {action && <div className="flex gap-2">{action}</div>}
        </div>
      </div>

      {summary && <div className="flex-none px-6">{summary}</div>}

      <div className={`flex-1 px-6 ${fixed ? 'overflow-hidden' : 'overflow-auto'}`}>{children}</div>
    </div>
  );
};

export default PageWrapper;
