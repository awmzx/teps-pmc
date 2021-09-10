import React, { useState } from "react";
import "./Results.scss";
import BackArrow from "../../../../assets/images/back_arrow.svg";
import { Link, useHistory, useLocation } from "react-router-dom";
import DoughnutChartWithValues from "../../Common/Charts/DoughnutChartWithValues";
import BaseURL from "../../../../CommonUniversal/api";
import { useThemeLoadingDispatch } from "../../ContextHooks/ThemeProvider";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const Results = () => {
  let query = useQuery();
  const history = useHistory();
  const loading = useThemeLoadingDispatch();
  const [apiError, setapiError] = React.useState(false);
  var ls = require("local-storage");
  const testType = ls.get("userinfo").testType || "";

  const config = {
    headers: { Authorization: `Bearer ${ls.get("token").accessToken}` },
    key: "Authorization",
  };

  const [resultsData, setresultsData] = useState();
  const {
    attemptedQuestions,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    skippedQuestions,
    score,
  } = resultsData || {};

  /////// Get Results again Test
  const ResultsDataPayload = {
    testId: ls.get("userinfo").testId,
    practiceTestId: query.get("ptid"),
    practiceTestOrderId: query.get("ptoid"),
  };
  function getResults() {
    loading(true);
    BaseURL.post("/practicetest/result", ResultsDataPayload, config)
      .then((res) => {
        setresultsData(res.data);
        loading(false);
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
  /////// Get Results again Test
  const memoDoughnutChart = React.useMemo(
    () => (
      <DoughnutChartWithValues
        chartDataValues1={(incorrectAnswers * 100) / totalQuestions}
        chartDataValues2={(skippedQuestions * 100) / totalQuestions}
        chartDataValues3={(correctAnswers * 100) / totalQuestions}
        cart1Color={"#E56564"}
        cart2Color={"#4183D7"}
        cart3Color={"#33B49B"}
        totalQuestions={totalQuestions}
      />
    ),
    [totalQuestions, correctAnswers, incorrectAnswers, skippedQuestions]
  );

  React.useEffect(() => {
    getResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function retakeTest() {
    loading(true);
    BaseURL.post("/practicetest/retake", ResultsDataPayload, config)
      .then((res) => {
        practiceTestStartTime();
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

  function practiceTestStartTime() {
    BaseURL.post("practicetest/start", ResultsDataPayload, config)
      .then((res) => {
        loading(false);
        setapiError(false);
        //  ls.set("PTQATimer",);
        history.push("/home/practicetest");
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data.status === 500) {
            setapiError(true);
          }
        }
      });
  }
  return (
    <>
      <div className="results_wrapper w-lg-80 mx-auto py-5">
        <div className="top_heading lightgray-border-bottom white-tx t">
          <h2>
            <img
              onClick={(e) => history.push("/home/practicetest")}
              src={`${window.location.origin}/${BackArrow}`}
              className="backarrow_adjustment"
              alt="Go Back Icon"
            />
            Result
          </h2>
        </div>
        {apiError ? (
          <div className="pb-0 pt-3 pb-4  text-center alert_message question_alert_adjustment">
            <div>Something went wrong please try again later.</div>
          </div>
        ) : (
          ""
        )}
        {resultsData ? (
          <div>
            <div className="results_wrapper_inner">
              <div className="row m-0">
                <div className="col-lg-6 p-0">
                  <div className="result_grid border-right-lg border-bottom-lg">
                    <div className="top_label">Total Questions</div>
                    <div className="result_num">{totalQuestions}</div>
                  </div>
                </div>
                <div className="col-lg-6 p-0">
                  <div className="result_grid border-bottom-lg ">
                    <div className="top_label">Questions Attempted</div>
                    <div className="result_num">{attemptedQuestions}</div>
                  </div>
                </div>
                <div className="col-lg-6 p-0">
                  <div className="result_grid border-right-lg ">
                    <div className="top_label"> Correct Answers</div>
                    <div className="result_num">{correctAnswers}</div>
                  </div>
                </div>
                <div className="col-lg-6 p-0">
                  <div className="result_grid ">
                    <div className="top_label">Incorrect Answers</div>
                    <div className="result_num">{incorrectAnswers}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row align-items-center py-5 graph_char_bottom mx-auto">
              <div className="col-md-7">
                <div className="graph_chart ">
                  {totalQuestions ? memoDoughnutChart : ""}
                </div>
              </div>

              <div className="col-md-5 text-center text-lg-left pt-5 pt-lg-0">
                <div className="pb-3">
                  <div
                    className="dot d-inline-block mr-2"
                    style={{ background: "#4183D7" }}
                  ></div>
                  Unattempted <strong>{skippedQuestions}</strong>
                </div>
                <div className="pb-3">
                  <div
                    className="dot d-inline-block mr-2"
                    style={{ background: "#33B49B" }}
                  ></div>
                  Correct <strong>{correctAnswers}</strong>
                </div>
                <div className="">
                  <div
                    className="dot d-inline-block mr-2"
                    style={{ background: "#E56564" }}
                  ></div>
                  Incorrect <strong>{incorrectAnswers}</strong>
                </div>
              </div>
            </div>
            <div className="time_taken">
              <div className="total_time_lrg">
                {testType === "NLE" ? (
                  score <= 69 ? (
                    <div className="primary_color">FAIL</div>
                  ) : (
                    <div>
                      <h4 className="white_txt">Total Score </h4>
                      {score + "%"}
                    </div>
                  )
                ) : score <= 64 ? (
                  <div className="primary_color">FAIL</div>
                ) : (
                  <div>
                    <h4 className="white_txt">Total Score </h4>
                    {score + "%"}
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="pt-4">
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg d-block  w-100 border-radious-10 p-3 small-font-16 text-center text-uppercase bg-light-blue"
                      onClick={() => retakeTest()}
                    >
                      Retake This Test
                    </button>
                  </div>{" "}
                </div>
              </div>
              <div className="col-lg-6 mx-auto">
                <div className="pt-3 pt-lg-5">
                  <Link
                    to={{
                      pathname: "/home/practicetest/wronganswers",

                      search:
                        "?ptid=" +
                        query.get("ptid") +
                        "&ptoid=" +
                        query.get("ptoid"),
                      //   "&ptoid=" +
                      //   practiceTestOrderId +
                      //   "&nq=" +
                      //   numQuestions +
                      //   "&td=" +
                      //   testDuration +
                      //   "&atq=" +
                      //   attemptedQuestions,
                      // // hash: "#the-hash",
                    }}
                  >
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg d-block  w-100 border-radious-10 p-3 small-font-16 text-center text-uppercase"
                    >
                      View Incorrect Answers
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pb-5  pt-5 text-left alert_message">
            Unable to load results. Something went wrong!
          </div>
        )}
      </div>
    </>
  );
};
export default Results;
