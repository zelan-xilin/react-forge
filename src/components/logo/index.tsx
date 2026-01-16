import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IMAGES, randomIndex } from './config';

interface LogoProps {
  className?: string;
}
const Logo = ({ className = 'size-14' }: LogoProps) => {
  return (
    <div className="flex -space-x-1">
      {IMAGES.map((img, index) => (
        <div key={img.alt} className="relative">
          <Avatar
            className={`${className} ring-2 ring-background ${index === randomIndex ? '' : 'opacity-65'}`}
          >
            <AvatarImage src={img.src} alt={img.alt} />
            <AvatarFallback>{img.fallback}</AvatarFallback>
          </Avatar>

          {index === randomIndex && (
            <div className="size-3 absolute top-0 right-1 bg-success rounded-full"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Logo;
