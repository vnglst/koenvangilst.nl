import { FC } from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import { TerminalIcon } from "./Icons";

interface Props {
  menu: string;
}

const Navigation: FC<Props> = ({ menu }) => {
  return (
    <nav className="p-4 bg-white">
      <ul className="font-sans text-base uppercase max-w-3xl mb-2 lg:mb-4 mx-auto flex list-none">
        <NavLink className="m-0 mr-auto">
          <Link href="/">
            <a className="text-kvg-blue no-underline">
              <TerminalIcon />
            </a>
          </Link>
        </NavLink>
        <NavLink isActive={menu === "home"}>
          <Link href="/">
            <a className="no-underline text-gray-900">Home</a>
          </Link>
        </NavLink>
        <NavLink isActive={menu === "labs"}>
          <Link href="/labs">
            <a className="no-underline text-gray-900">Labs</a>
          </Link>
        </NavLink>
        <NavLink>
          <a
            href="https://blog.koenvangilst.nl"
            className="no-underline text-gray-900"
          >
            Blog
          </a>
        </NavLink>
      </ul>
    </nav>
  );
};

export default Navigation;
