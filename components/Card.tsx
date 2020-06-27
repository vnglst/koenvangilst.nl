import { FC } from "react";
import cx from "classnames";

interface Props {
  extraClasses: string;
}

interface Footer {
  Footer: React.FC;
}

const Card: FC<Props> & Footer = ({ children, extraClasses }) => {
  return (
    <article
      className={cx(
        "p-2 m-3 overflow-hidden flex flex-col rounded-md",
        extraClasses
      )}
    >
      {children}
    </article>
  );
};

const Footer: FC = ({ children }) => {
  return <span className="mt-auto">{children}</span>;
};

Card.Footer = Footer;

export default Card;
