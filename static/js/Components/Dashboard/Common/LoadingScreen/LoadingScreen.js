import React from "react";
import "./LoadingScreen.scss";
import CenterImg from "../../../../assets/images/splashscreen_img.svg";
function LoadingScreen() {
  return (
    <>
      <div className="loadingScreenWrapper">
        <div className="center_img text-center">
          <div className="center_wrapper">
            <img
              src={`${window.location.origin}/${CenterImg}`}
              alt="center logo"
            />
          </div>
          <div className="message_txt">Loading. Please wait</div>
        </div>
      </div>
    </>
  );
}
export default LoadingScreen;
