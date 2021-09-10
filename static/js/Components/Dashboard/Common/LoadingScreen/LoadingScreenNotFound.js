import React from "react";
import "./LoadingScreen.scss";
import CenterImg from "../../../../assets/images/splashscreen_img.svg";

function LoadingScreenNotFound({ showNotFound }) {
  return (
    <>
      <div className="loadingScreenWrapper practice_test_loading">
        <div className="center_img text-center">
          <div className="center_wrapper">
            <img
              src={`${window.location.origin}/${CenterImg}`}
              alt="center logo"
              className="mx-auto"
            />
          </div>
          <div
            className="shedule_message_txt"
            style={{ maxWidth: "1000px", margin: "auto" }}
          >
            <h4>
              The Practice Tests will be temporarily unavailable as the system
              is being updated. The tests will be available and live soon.
              <br /> We apologize for the inconvenience.
            </h4>
          </div>

          <div className="mx-auto mt-5" style={{ maxWidth: "300px" }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg d-block  w-100 border-radious-10 p-3 small-font-20 text-center"
              onClick={() => showNotFound()}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default LoadingScreenNotFound;
