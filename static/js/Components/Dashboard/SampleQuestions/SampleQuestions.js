import React from "react";
import "./SampleQuestions.scss";

import BackArrow from "../../../assets/images/back_arrow.svg";
import { useHistory } from "react-router";
import { Link, useRouteMatch } from "react-router-dom";
import {
  useThemeUpdate,
  useThemeDisabledUpdateContext,
} from "../ContextHooks/ThemeProvider";
export default function SampleQuestions() {
  const history = useHistory();
  var ls = require("local-storage");
  const userInfo = ls.get("userinfo") || "";
  const testType = ls.get("userinfo").testType || "";
  var testDesc = ls.get("userinfo").description || "";
  const testNamels = userInfo !== null ? userInfo.testName : "";
  const disabledModeUpdate = useThemeDisabledUpdateContext();
  const applyDarkMode = useThemeUpdate();
  React.useEffect(() => {
    applyDarkMode(true);
    disabledModeUpdate(false);
  });

  const subjectList = [
    { name: "Biology", path: "biology" },
    { name: "Physics", path: "physics" },
    { name: "Chemistry", path: "chemistry" },
    { name: "English", path: "english" },
    { name: "Logical Reasoning", path: "logicalreasoning" },
  ];
  const NLESubjectList = [
    { name: "Basic Sciences", path: "basicsciences" },
    { name: "Clinical Sciences", path: "clinicalsciences" },
  ];
  let { url } = useRouteMatch();

  return (
    <>
      <div className="review_sampleQuestions  w-lg-80 mx-auto">
        <div className="top_heading lightgray-border-bottom white-tx t">
          <h2>
            <img
              src={`${window.location.origin}/${BackArrow}`}
              className="backarrow_adjustment"
              alt="Go Back Icon"
              onClick={(e) => history.push("/home")}
            />
            View Sample Questions
          </h2>
        </div>
        <h4>{testNamels}</h4>
        <div className="top_roll_number">
          <p className=" light-color-para">{testDesc}</p>
        </div>

        <div className="sample_instruction">
          <img
            src={require("../../../assets/images/i_ico_small.svg").default}
            alt="infoIco"
          />{" "}
          Sample tests are designed to test individual subjects in a drill
          fashion. They are not meant to follow the number of questions of the
          syllabus.
        </div>
        <div className="listdown_questions list_wrapper  py-5 ">
          {testType === "NLE"
            ? NLESubjectList.map((items, i) => {
                const count = i + 1;
                return (
                  <div className="row m-0 pb-3 align-items-center" key={i}>
                    <div className="col-auto p-0">
                      <div className="dig_number">{count}</div>
                    </div>
                    <div className="col-8 col-md-11 p-0 p-2 pl-3">
                      <Link
                        to={`${url}/topics?name=${items.name}&pdf=${items.path}`}
                      >
                        {items.name}
                      </Link>
                    </div>
                  </div>
                );
              })
            : subjectList.map((items, i) => {
                const count = i + 1;
                return (
                  <div className="row m-0 pb-3 align-items-center" key={i}>
                    <div className="col-auto p-0">
                      <div className="dig_number">{count}</div>
                    </div>
                    <div className="col-8 col-md-11 p-0 p-2 pl-3">
                      <Link
                        to={`${url}/topics?name=${items.name}&pdf=${items.path}`}
                      >
                        {items.name}
                      </Link>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </>
  );
}
