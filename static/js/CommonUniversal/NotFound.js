import React from "react";
import "./NotFound.scss";
import CenterImg from "../assets/images/splashscreen_img.svg";
function LoadingScreen() {
  return (
    <>
      <div className="nofoundScreenWrapper">
        <div className="center_img text-center">
          <div className="center_wrapper">
            <img src={CenterImg} alt="not found img" />
          </div>
          <div className="message_txt mx-auto col-lg-3">
            <h3>Page Not Found</h3>
            <p>
              The page you were looking for could not be found. It might have
              been removed, renamed, or did not exist in the first place.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
export default LoadingScreen;
