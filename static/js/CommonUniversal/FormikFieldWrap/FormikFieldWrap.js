import React from "react";
import "./FormikFieldWrap.scss";
import lockico from "../../assets/images/lock_ico.svg";
const FormikFieldWrap = ({ children, icon, darkmode, lock }) => {
  return (
    <React.Fragment>
      <div className="input_field_wrapper my-3">
        <div className="position-relative">
          <div className={`lock_ico ${lock === true ? "d-block" : "d-none"}`}>
            <img src={lockico} alt="Lock Icon" className="ico_width" />
          </div>
        </div>
        <div className={darkmode === true ? "dark_mode" : "light_mode"}>
          <div className="field_wrapper mb-4">
            <div className="d-flex h-100">
              <div className="left_ico">
                <img src={icon} alt="login Icon" />
              </div>
              <div className="fields_wrapper_design w-100 pl-3">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FormikFieldWrap;
