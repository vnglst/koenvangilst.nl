import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="my-8 text-gray-600 text-sm text-center">
      <a href="https://www.linkedin.com/in/vangilst/">LinkedIn</a> |{" "}
      <a href="https://twitter.com/vnglst">Twitter</a> |{" "}
      <a href="https://github.com/vnglst">GitHub</a>
      <br />
      <a href="https://github.com/vnglst/koenvangilst.nl">source code</a>
      <br />
      <span className="text-xs">
        v. {process.env.APP_VERSION} git {process.env.COMMIT_HASH}
      </span>
    </footer>
  );
};

export default Footer;
