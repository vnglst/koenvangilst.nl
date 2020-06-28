import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="my-10 text-gray-600 text-xs text-center">
      <a href="https://www.linkedin.com/in/vangilst/">LinkedIn</a> |{" "}
      <a href="https://twitter.com/vnglst">Twitter</a> |{" "}
      <a href="https://github.com/vnglst">GitHub</a>
      <br />
      <span>
        v. {process.env.APP_VERSION} git{" "}
        <a
          href={`https://github.com/vnglst/koenvangilst.nl/tree/${process.env.COMMIT_HASH}`}
        >
          {process.env.COMMIT_HASH}
        </a>
      </span>
    </footer>
  );
};

export default Footer;
