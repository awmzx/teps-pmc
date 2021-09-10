import React from "react";
import "./LeftMenu.scss";
import PMClogo from "../../../../assets/images/teps dark.svg";
import TipsLogo from "../../../../assets/images/teps light.svg";

//White icons
import lefticohome from "../../../../assets/images/left-nav-home-ico.svg";
//import lefticodashboard from "../../../assets/images/left-nav-dashboard-ico.svg";
import lefticoupdateshedule from "../../../../assets/images/left-nav-shedule-ico.svg";
//import lefticomyprofile from "../../../assets/images/left-nav-profile-ico.svg";
//import lefticoupdatepassword from "../../../assets/images/left-nav-updatepassword-ico.svg";
import lefticologout from "../../../../assets/images/left-nav-logout-ico.svg";
import { useLocation } from "react-router-dom";
import {
  useThemeDisabledContext,
  useTheme,
} from "../../ContextHooks/ThemeProvider";

// white icons end

import LeftMenuLinks from "./LeftMenuLinks/LeftMenuLinks";

//import { useTheme } from "../ContextHooks/ThemeProvider";
//import { useLocation } from "react-router-dom";
// const pageLocationPath = useLocation();
const LeftMenu = () => {
  const location = useLocation();
  const diabledMode = useThemeDisabledContext();
  const darkMode = useTheme();

  const [logo, setlogo] = React.useState();

  React.useEffect(() => {
    if (darkMode === true) {
      setlogo(TipsLogo);
    } else {
      setlogo(PMClogo);
    }
  }, [darkMode]);

  const [menuState, setmenuState] = React.useState(true);
  function toggleOnOff() {
    setmenuState((preMenuState) => !preMenuState);
  }
  const DashboardLinks = () => {
    return (
      <div>
        <LeftMenuLinks
          linkName={"Home"}
          pageName={"/home"}
          isActive={"is-active"}
          forceActive={
            location.pathname === "/home/practicetest" ||
            location.pathname === "/home/practicetest/questionanswer" ||
            location.pathname === "/home/practicetest/results" ||
            location.pathname === "/home/practicetest/wronganswers" ||
            location.pathname === "/home/reviewsyllabus" ||
            location.pathname === "/home/samplequestions" ||
            location.pathname === "/home/reviewsyllabus" ||
            location.pathname === "/home/samplequestions/topics" ||
            location.pathname === "/home/purchasebundles" ||
            location.pathname === "/home/payments"
              ? true
              : false
          }
          icon={lefticohome}
          alt={"Home Ico Left"}
        />
        {/* <LeftMenuLinks
          linkName={"Dashboard"}
          pageName={"/dashboard"}
          isActive={""}
          icon={lefticodashboard}
          alt={"Dashboard Ico Left"}
          pointerEvent={false}
        /> */}
        <LeftMenuLinks
          linkName={"Manage Schedule"}
          pageName={"/home/manageschedule"}
          isActive={"is-active"}
          icon={lefticoupdateshedule}
          alt={"Dashboard Ico Left"}
        />
        <LeftMenuLinks
          linkName={"Logout"}
          pageName={"/home/logout"}
          isActive={"is-active"}
          icon={lefticologout}
          alt={"logout Ico"}
        />
        {/* <LeftMenuLinks
          linkName={"My Profile"}
          pageName={"/"}
          isActive={"is-active"}
          icon={lefticomyprofile}
          alt={"Dashboard Ico Left"}
          pointerEvent={false}
        /> */}
        {/* <LeftMenuLinks
          linkName={"Update Password"}
          pageName={"/"}
          isActive={""}
          icon={lefticoupdatepassword}
          alt={"Dashboard Ico Left"}
          pointerEvent={false}
        /> */}
      </div>
    );
  };

  return (
    <>
      <div
        className={`left_menu_wrapper position-relative ${
          darkMode === true ? "removebg_whitelinks" : ""
        }`}
      >
        <div className="top_logo p-2">
          <div
            className="mobile_btn d-md-none float-right"
            onClick={() => toggleOnOff()}
          >
            <div className="line"></div> <div className="line"></div>
            <div className="line"></div>
          </div>
          <img
            src={logo}
            alt="pmc logo"
            className="img-fluid d-block adjust-logo"
          />
        </div>

        <div
          className={`menu_btns_list py-3 pt-3  ${
            menuState ? "display_menu_adjust" : ""
          }`}
          style={
            diabledMode === true
              ? { pointerEvents: "none", opacity: "0.5" }
              : {}
          }
        >
          <ul className="pl-4" onClick={() => toggleOnOff()}>
            <DashboardLinks />
          </ul>
        </div>
        <div className="copyrights_txt">
          <div className="supportButtons pb-5">
            <span className="semi-bold">Contact Us</span>: FB{" "}
            <a
              href="https://www.facebook.com/groups/2937183139849587"
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              Support Group
            </a>{" "}
            <br />
            {"  "}
            <span className="semi-bold">Call Us:</span>{" "}
            <a href="tel:+923311006191" rel="noreferrer">
              +923311006191
            </a>
          </div>
          Copyright &#169; 2021 SOAR Testing and Evaluation Platform
          (SMC-Private) Limited. <br /> <br />
          All rights reserved.
        </div>
      </div>
    </>
  );
};
export default LeftMenu;
