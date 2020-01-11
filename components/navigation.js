import "./styling/navigation.css";
import Link from "next/link";

export default ({ menu }) => (
  <header>
    <nav>
      <div className="nav-wrapper">
        <span className="terminal">
          <Link href="/">
            <a>
              <i className="fa fa-terminal fa-2x" aria-hidden="true" />
            </a>
          </Link>
        </span>
        <span className="nav-links">
          <Link href="/">
            <a className={menu === "home" ? "active" : null}>Home</a>
          </Link>
          <Link href="/labs">
            <a className={menu === "labs" ? "active" : null}>Labs</a>
          </Link>
          <a href="https://blog.koenvangilst.nl" className="blog">
            Blog
          </a>
        </span>
      </div>
    </nav>
  </header>
);
