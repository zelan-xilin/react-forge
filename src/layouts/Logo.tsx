import dobby from '@/assets/images/dobby.jpg';
import ponyo from '@/assets/images/ponyo.jpg';
import threeTreasures from '@/assets/images/threeTreasures.jpg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LogoProps {
  className?: string;
}
const Logo = ({ className = 'size-14' }: LogoProps) => {
  return (
    <div className="*:data-[slot=avatar]:ring-background flex -space-x-1 *:data-[slot=avatar]:ring-2">
      <Avatar className={className}>
        <AvatarImage src={dobby} alt="dobby" />
        <AvatarFallback>Dobby</AvatarFallback>
      </Avatar>
      <Avatar className={className}>
        <AvatarImage src={ponyo} alt="ponyo" />
        <AvatarFallback>Ponyo</AvatarFallback>
      </Avatar>
      <Avatar className={className}>
        <AvatarImage src={threeTreasures} alt="threeTreasures" />
        <AvatarFallback>ThreeTreasures</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Logo;
