import React from "react";
import "./LeftMenuLinks.scss";
import $ from "jquery";
import { NavLink } from "react-router-dom";
const LeftMenuLinks = ({
  pageName,
  isActive,
  forceActive,
  showpopupStatus,
  pointerEvent,
  icon,
  linkName,
  alt,
}) => {
  function showSaveExitPopup() {
    $("#practiceTestExit").modal("show");
  }

  return (
    <li
      className={forceActive ? "is-active" : ""}
      style={
        pointerEvent === false ? { pointerEvents: "none", opacity: "0.6" } : {}
      }
    >
      {showpopupStatus === true ? (
        <span onClick={() => showSaveExitPopup()}>
          <span className="icon_width_adjust">
            <img src={icon} alt={alt} />
          </span>
          {linkName}
        </span>
      ) : (
        <NavLink to={pageName} exact activeClassName={isActive}>
          <span className="icon_width_adjust">
            <img src={icon} alt={alt} />
          </span>
          {linkName}
        </NavLink>
      )}
    </li>
  );
};
export default LeftMenuLinks;
