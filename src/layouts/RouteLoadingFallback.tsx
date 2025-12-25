import { Loader } from 'lucide-react';

const RouteLoadingFallback = () => {
  return (
    <div className="text-primary flex h-full items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
};

export default RouteLoadingFallback;
