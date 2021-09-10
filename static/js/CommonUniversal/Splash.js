import React, { useLayoutEffect } from "react";
import TepsLogo from "../assets/images/teps_log.svg";
import CenterImg from "../assets/images/splashscreen_img.svg";
import { getToken } from "./auth/localStorage";

const Splash = (props) => {
  useLayoutEffect(() => {
    const token = getToken();

    if (token) {
      props.history.push("/home");
    } else {
      props.history.push("/login");
    }
  });

  return (
    <>
      <div className="loadingScreenWrapper">
        <div className="teps_logo">
          <img src={TepsLogo} alt="teps logo" />
        </div>
        <div className="center_img text-center">
          <div className="center_wrapper">
            <img src={CenterImg} alt="not found img" />
          </div>
          <div className="message_txt mx-auto col-lg-3">
            <p>Loading please wait…</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Splash;
