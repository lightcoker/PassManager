import Link from "next/link";
import { useState } from "react";

export default ({ currentUser }) => {
  const [isActive, setIsActive] = useState("not-active");

  const links = [
    !currentUser && {
      label: "Sign Up",
      href: "/auth/signup",
      btnAttrs: "has-text-weight-bold",
    },
    !currentUser && {
      label: "Sign In",
      href: "/auth/signin",
      btnAttrs: "",
    },
    currentUser && {
      label: "Add Password",
      href: "/password/save",
      btnAttrs: "has-text-weight-bold",
    },
    currentUser && {
      label: "My Passwords",
      href: "/password",
      btnAttrs: "has-text-weight-bold",
    },
    currentUser && {
      label: "Sign Out",
      href: "/auth/signout",
      btnAttrs: "",
    },
  ]
    .filter((linkConfig) => linkConfig) // 依currentUser來判斷是否該link要顯示與否
    .map(({ label, href, btnAttrs }) => {
      return (
        <Link key={label.replace("", "-")} href={href} className="navbar-item">
          <a className={`button is-light ${btnAttrs}`}>{label}</a>
        </Link>
      );
    });

  const handleToggle = () => {
    setIsActive(isActive === "is-active" ? "not-active" : "is-active");
  };
  return (
    <div className="navbar is-primary" role="navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <strong id="project-name" className="is-size-4 px-1">
            PassManager
          </strong>
        </a>
        <div
          className="navbar-burger burger"
          data-target="navMenu"
          onClick={handleToggle}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div
        id="navMenu"
        class={`navbar-menu ${isActive}`}
        onToggle={handleToggle}
      >
        <div className="navbar-start"></div>
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">{links}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
