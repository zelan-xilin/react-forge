import type { ReactNode } from 'react';

interface OffscreenFrameProps {
  active: boolean;
  children: ReactNode;
}
const OffscreenFrame = ({ active, children }: OffscreenFrameProps) => {
  return (
    <div hidden={!active} className="h-full contain-strict overflow-hidden">
      {children}
    </div>
  );
};

export default OffscreenFrame;
