import cx from "classnames";

const Card = ({ extraClasses, children }) => {
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

const Footer = ({ children }) => {
  return <span className="mt-auto">{children}</span>;
};

Card.Footer = Footer;

export default Card;
