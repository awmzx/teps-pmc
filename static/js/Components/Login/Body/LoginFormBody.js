import React from "react";
import "../Login.scss";
import grayTepsLogo from "../../../assets/images/teps-light.svg";
import pmcLogo from "../../../assets/images/teps dark.svg";

export default function LoginFormBody({ children, usertype }) {
  return (
    <>
      <div className="login_form_wrapper mx-auto  px-3">
        <div className="top_teps_logo_gray text-center pb-1">
          <img src={grayTepsLogo} alt="teps logo" />
          <div className="text-center below-r-logo-txt">
            The smartest way to prepare for career exams
          </div>
        </div>
        <div className="middle_align_adjustment">
          <div className="new_PMC text-center pb-1">
            <img src={pmcLogo} alt="teps logo" />
          </div>
          <div>
            <div className="pb-3 pt-3  login_with_pmc_txt text-center">
              Login in with your PMC account credentials
            </div>
            <div className="login_register_btns py-3 row d-none">
              <div className="col-6 pl-lg-0 pb-3 pl-lg-0 pl-lg-3">
                <button
                  type="submit"
                  className={`btn btn-primary  btn-lg d-block  w-100 border-radious-10 p-3 small-font-16 teps_right_btns_underline  ${
                    usertype !== "pmc" ? "" : ""
                  }`}
                >
                  LOG IN
                </button>
              </div>

              <div className="col-6 pb-3 pr-lg-3">
                <button
                  type="submit"
                  className={`btn btn-primary btn-bordered-only btn-lg d-block  w-100 border-radious-10 p-3 small-font-16  teps_right_btns_nounderline${
                    usertype !== "pmc" ? "" : ""
                  }`}
                >
                  REGISTER
                </button>
              </div>
            </div>
            <div className="form_fields py-md-4">
              <div>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
