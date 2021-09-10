import React from "react";
import "./ReviewSyllabus.scss";
import PdfMDCAT from "../../../assets/pdfs/PMC MDCAT Syllabus 2021_Final.pdf";

import PdfNLE from "../../../assets/pdfs/NLE 2021 syllabus (June 4, 2021).pdf";
import BackArrow from "../../../assets/images/back_arrow.svg";
import { useHistory } from "react-router";
import {
  useThemeUpdate,
  useThemeDisabledUpdateContext,
} from "../ContextHooks/ThemeProvider";
export default function ReviewSyllabus() {
  const history = useHistory();
  var ls = require("local-storage");
  const userInfo = ls.get("userinfo") || "";
  const disabledModeUpdate = useThemeDisabledUpdateContext();
  const applyDarkMode = useThemeUpdate();
  React.useEffect(() => {
    applyDarkMode(true);
    disabledModeUpdate(false);
  });
  return (
    <>
      <div className="review_syllabus">
        <div className="top_heading lightgray-border-bottom white-tx t">
          <h2>
            <img
              src={`${window.location.origin}/${BackArrow}`}
              className="backarrow_adjustment"
              alt="Go Back Icon"
              onClick={(e) => history.push("/home")}
            />
            Review Syllabus
          </h2>
        </div>

        <embed
          src={userInfo.testType === "NLE" ? PdfNLE : PdfMDCAT}
          width="100%"
          style={{ minHeight: "72vh" }}
          type="application/pdf"
        ></embed>
      </div>
    </>
  );
}
