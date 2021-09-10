/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
//import BackArrow from "../../../assets/images/back_arrow.svg";
import "./PracticeTest.scss";
import { useHistory } from "react-router-dom";
import BackArrow from "../../../assets/images/back_arrow.svg";
import "react-toastify/dist/ReactToastify.css";
import LinkBody from "./BodyElements/LinkBody";
import PracticeTestInstructions from "./BodyElements/PracticeTestInstructions";
import ReactLoading from "react-loading";
import BaseURL from "../../../CommonUniversal/api";

function PracticeTest({ match }) {
  let history = useHistory();
  var ls = require("local-storage");
  const config = {
    headers: { Authorization: `Bearer ${ls.get("token").accessToken}` },
    key: "Authorization",
  };
  const [testInstructions, settestInstructions] = useState(false);

  const [apiError, setapiError] = React.useState(false);
  const [loading, setloading] = useState(false);
  const [practicetestlist, setpracticetestlist] = useState();
  const [practiceTestData, setpracticeTestData] = useState();
  const [DatatoInstructions, setDatatoInstructions] = useState({
    insturctions: "",
    practiceTestOrderId: "",
    practiceTestId: "",
    attemptedQuestions: "",
    numQuestions: "",
    testDuration: "",
  });

  const [chartValueState] = React.useState({
    chart1Color: "#E56564",
    chart2Color: "#33B49B",
  });

  // For calculate percentage

  useEffect(() => {
    if (practicetestlist) {
      const PractriceTestListResponse = practicetestlist.map((items, i) => {
        const index = i + 1;

        return (
          <div
            className={`${
              items.practiceTestOrderId !== null
                ? "eabled_click"
                : "disabled_click"
            }`}
            onClick={() =>
              setDatatoInstructions(
                {
                  ...DatatoInstructions,
                  insturctions: items.insturctions,
                  practiceTestOrderId: items.practiceTestOrderId,
                  practiceTestId: items.practiceTestId,
                  attemptedQuestions: items.attemptedQuestions,
                  numQuestions: items.numQuestions,
                  testDuration: items.testDuration,
                },
                TestInstruction()
              )
            }
            key={i}
          >
            <LinkBody
              courseNumber={index}
              courseHeading={items.name || ""}
              courseDesc={items.description || ""}
              chartDataValues1={Math.floor(
                (items.attemptedQuestions * 100) / items.numQuestions
              )}
              chartDataValues2={
                100 - (items.attemptedQuestions * 100) / items.numQuestions
              }
              cart1Color={chartValueState.chart2Color}
              percentageGraph={
                items.attemptedQuestions !== null ||
                items.attemptedQuestions === 0
                  ? true
                  : false
              }
              viewResultsLink={
                items.attemptedQuestions === items.numQuestions ? true : false
              }
              newCourse={
                items.practiceTestOrderId !== null &&
                items.attemptedQuestions === null
                  ? true
                  : false
              }
              unPaid={
                items.practiceTestOrderId === 0 ||
                items.practiceTestOrderId === null
                  ? true
                  : false
              }
            />
          </div>
        );
      });

      setpracticeTestData(PractriceTestListResponse);
    }
  }, [practicetestlist]);
  // Send practice test ID and order ID to child component using react router dom

  function TestInstruction() {
    settestInstructions(true);
  }
  const GTSPData = {
    testId: ls.get("userinfo").testId,
  };
  function getPracticeTestList() {
    setloading(true);

    BaseURL.post("/test/practicetestlist", GTSPData, config)
      .then((res) => {
        setpracticetestlist(res.data);
        setloading(false);
        setapiError(false);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data.status === 500) {
            setapiError(true);
          }
        }
      });
  }

  // var d = new Date();
  // var utc = d.getTime() + d.getTimezoneOffset() * 60000;
  // var date = new Date(utc + 3600000 * +5); // some mock date
  // var milliseconds = date.getTime();

  React.useEffect(() => {
    getPracticeTestList();
  }, []);

  // trigger back button logic

  function triggerBack() {
    if (testInstructions === true) {
      settestInstructions(false);
    } else {
      history.push("/home");
    }
  }

  return (
    <React.Fragment>
      <div className="practicetest_wrapper w-lg-80 mx-auto py-5">
        <div className="top_heading lightgray-border-bottom white-tx t">
          <h2>
            <img
              onClick={(e) => triggerBack()}
              src={`${window.location.origin}/${BackArrow}`}
              className="backarrow_adjustment"
              alt="Go Back Icon"
            />
            Start a Practice Test
          </h2>
        </div>
        <div className="practicetest_wrapper pt-5">
          {apiError ? (
            <div className="pb-0 pt-3 pb-4  text-center alert_message question_alert_adjustment">
              <div>Something went wrong please try again later.</div>
            </div>
          ) : (
            ""
          )}
          {loading ? (
            <span className="block text-center pt-5">
              <ReactLoading
                type={"spin"}
                color={"#fff"}
                height={"30px"}
                width={"30px"}
                className={"mx-auto mt-5"}
              />
            </span>
          ) : testInstructions === true ? (
            <PracticeTestInstructions
              textinstructions={DatatoInstructions.insturctions}
              practiceTestId={DatatoInstructions.practiceTestId}
              practiceTestOrderId={DatatoInstructions.practiceTestOrderId}
              numQuestions={DatatoInstructions.numQuestions}
              attemptedQuestions={DatatoInstructions.attemptedQuestions}
              testDuration={DatatoInstructions.testDuration * 60000}
            />
          ) : (
            practiceTestData
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
export default PracticeTest;
