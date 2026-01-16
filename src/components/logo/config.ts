import { dobby, ponyo, threeTreasures } from '@/assets/images';

export const IMAGES = [
  { src: dobby, alt: 'dobby', fallback: 'Dobby' },
  { src: ponyo, alt: 'ponyo', fallback: 'Ponyo' },
  { src: threeTreasures, alt: 'threeTreasures', fallback: 'ThreeTreasures' },
] as const;

export const randomIndex = Math.floor(Math.random() * IMAGES.length);
