import { FC } from "react";

type Props = {
  className?: string;
  isActive?: boolean;
};

const NavLink: FC<Props> = ({ className, isActive, children }) => {
  const defaultClass = `border-b-2 ${
    isActive ? "border-kvg-orange" : "border-transparent"
  } hover:border-accent m-0 ml-4`;

  return <li className={className || defaultClass}>{children}</li>;
};

export default NavLink;
