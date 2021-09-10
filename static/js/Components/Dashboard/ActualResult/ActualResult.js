import React from "react";
import BackArrow from "../../../assets/images/back_arrow.svg";
import "./ActualResult.scss";
import { useHistory } from "react-router";
import BaseURL from "../../../CommonUniversal/api";
import { useThemeLoadingDispatch } from "../ContextHooks/ThemeProvider";
export default function ActualResult() {
  const history = useHistory();
  const loading = useThemeLoadingDispatch();
  const [apiError, setapiError] = React.useState(false);
  var ls = require("local-storage");
  const testID = ls.get("userinfo") || "";
  const testOrderID = ls.get("userinfo") || "";
  const getTestType = ls.get("userinfo") || "";
  //   const congratsMsg = `Congratulation! <br />You have passed the test.`;
  //   const failSorryMsg =
  //     "Sorry, you did not pass the test.Better luck next time!";

  const [resultsData, setresultsData] = React.useState();
  const { score, status, message, total } = resultsData || {};

  //console.log(resultsData);

  const config = {
    headers: { Authorization: `Bearer ${ls.get("token").accessToken}` },
    key: "Authorization",
  };
  const ResultsDataPayload = {
    testId: testID.testId,
    testOrderId: testOrderID.testOrderId,
  };
  function getResults() {
    loading(true);
    BaseURL.post("/test/result", ResultsDataPayload, config)
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
  React.useEffect(() => {
    getResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <React.Fragment>
      <div className="result_wrapper w-lg-80 mx-auto py-5">
        <div className="top_heading lightgray-border-bottom white-tx t">
          <h4>
            <img
              onClick={(e) => history.push("/home")}
              src={`${window.location.origin}/${BackArrow}`}
              className="backarrow_adjustment"
              alt="Go Back Icon"
            />
            Back to Home
          </h4>
        </div>
        {apiError ? (
          <div className="pb-0 pt-3 pb-4  text-center alert_message question_alert_adjustment">
            <div>Something went wrong please try again later.</div>
          </div>
        ) : (
          ""
        )}

        <div className="pmc_logo d-flex top_logo_label">
          <img
            src={require("../../../assets/images/pmc_logo.svg").default}
            alt="teps light"
            className="logo_teps_adjust_result"
          />{" "}
          {getTestType.testType === "NLE" ? (
            <h2>
              Pakistan Medical Commission <br /> NLE Step 1 August 2021 Result
            </h2>
          ) : (
            <h2 className="text-center">
              Pakistan Medical Commission <br />
              {getTestType.testName} Result
            </h2>
          )}
        </div>
        <div className="practicetest_wrapper pt-3">
          <div className="result_inner_sec text-center">
            {status === "PASS" ? (
              <img
                src={
                  require("../../../assets/images/passing_flower_img.png")
                    .default
                }
                alt="pass img"
                className="img-fluid mx-auto d-block"
              />
            ) : (
              ""
            )}
          </div>
          <div className="text-center">
            {status === "PASS" ? (
              <h3 className="text-center pt-5 sm-br-none ">
                {/* <div
                dangerouslySetInnerHTML={{
                  __html: status === "PASS" ? congratsMsg : failSorryMsg,
                }}
              /> */}
                {message}
              </h3>
            ) : (
              <h3 className="text-center pt-5 pb-5 semi-bold ">
                {/* <div
              dangerouslySetInnerHTML={{
                __html: status === "PASS" ? congratsMsg : failSorryMsg,
              }}
            /> */}
                {message}
              </h3>
            )}

            {score || score === 0 ? (
              <div>
                <h3 className="text-center pt-5 text-uppercase">
                  Your score is
                </h3>
                <h1>
                  {score}/{total}
                </h1>
              </div>
            ) : (
              ""
            )}
            {status ? (
              <div
                className={
                  status === "FAIL" ? "status_label fail" : "status_label"
                }
              >
                {status}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
