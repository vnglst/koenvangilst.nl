export type Photo = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  isVertical: boolean;
  createdAt?: Date;
  location?: string;
};
