import type { ReactNode } from 'react';

interface PageWrapperProps {
  title: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}
const PageWrapper = (props: PageWrapperProps) => {
  const { title, description, extra, actions, children } = props;

  return (
    <div className="h-full py-4 box-border overflow-hidden flex flex-col gap-4">
      <div className="flex-none px-4 flex justify-between items-end gap-2">
        <div className="flex-1 space-y-1 h-full">
          <div className="text-2xl font-bold flex items-center gap-2">
            {title}
          </div>
          {description && (
            <div className="text-xs text-muted-foreground md:block hidden">
              {description}
            </div>
          )}
        </div>

        {extra && (
          <div className="flex-none flex items-center gap-2">{extra}</div>
        )}
      </div>

      {actions && <div className="flex-none px-4 flex gap-x-2 gap-y-1 flex-wrap">{actions}</div>}

      <div className="flex-1 px-4 overflow-auto">{children}</div>
    </div>
  );
};

export default PageWrapper;
