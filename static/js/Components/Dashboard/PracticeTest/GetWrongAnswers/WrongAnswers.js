import React, { useState } from "react";
import BackArrow from "../../../../assets/images/back_arrow.svg";
import ReactLoading from "react-loading";
import { useHistory, useLocation } from "react-router-dom";
import leftArrow from "../../../../assets/images/left_pick_arrow.svg";
import "./WrongAnswers.scss";
import rightArrow from "../../../../assets/images/right_pick_arrow.svg";
import BaseURL from "../../../../CommonUniversal/api";
import { useThemeLoadingDispatch } from "../../ContextHooks/ThemeProvider";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function WrongAnswers() {
  let loadingSpalsh = useThemeLoadingDispatch();
  const [apiError, setapiError] = React.useState(false);
  let history = useHistory();
  let query = useQuery();
  const [counter, setCounter] = useState(0);
  const incrementCounter = () => {
    setCounter(counter + 1);
  };
  const decrementCounter = () => {
    setCounter(counter - 1);
  };

  const [loading, setloading] = useState();
  const [wrongAnsData, setwrongAnsData] = useState();
  const { correctAnswer, userAnswer, questionText, supportingImg, mcqOptions } =
    wrongAnsData ? wrongAnsData[counter] : {};

  function objectLength(obj) {
    var result = 0;
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        // or Object.prototype.hasOwnProperty.call(obj, prop)
        result++;
      }
    }
    return result;
  }

  let TotalWrongAnswers = objectLength(wrongAnsData);
  // Random component

  var ls = require("local-storage");
  const config = {
    headers: { Authorization: `Bearer ${ls.get("token").accessToken}` },
    key: "Authorization",
  };

  /////// Get Results again Test
  function getWrongAnswers() {
    setloading(true);
    loadingSpalsh(true);
    const GetWrongAnsData = {
      testId: ls.get("userinfo").testId,
      practiceTestId: query.get("ptid"),
      practiceTestOrderId: query.get("ptoid"),
    };
    BaseURL.post("/practicetest/wronganswers", GetWrongAnsData, config)
      .then((res) => {
        setwrongAnsData(res.data);
        setloading(false);
        loadingSpalsh(false);
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
    getWrongAnswers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      {/* <ul>
        {values.map((val) => (
          <li onClick={() => setActiveId(val.id)}>{val.text} --</li>
        ))}
      </ul> */}

      <div className="get_wrong_answer_wrapper w-lg-80 mx-auto py-5">
        <div className="top_heading lightgray-border-bottom white-tx mt-1">
          <div className="row">
            <div className="col-6">
              <img
                onClick={(e) =>
                  history.push(
                    `/home/practicetest/results?ptid=${query.get(
                      "ptid"
                    )}&ptoid=${query.get("ptoid")}`
                  )
                }
                src={`${window.location.origin}/${BackArrow}`}
                className="backarrow_adjustment"
                alt="Go Back Icon"
              />
            </div>
            <div className="col-6 text-right">
              <h4 className="font-weight-normal">
                Question {counter + 1}/{TotalWrongAnswers}
              </h4>
            </div>
          </div>
        </div>
        {apiError ? (
          <div className="pb-0 pt-3 pb-4  text-center alert_message question_alert_adjustment">
            <div>Something went wrong please try again later.</div>
          </div>
        ) : (
          ""
        )}
        {loading ? (
          <span className="block text-center pt-5 ">
            <ReactLoading
              type={"spin"}
              color={"#fff"}
              height={"30px"}
              width={"30px"}
              className={"mx-auto mt-5 mb-5"}
            />
          </span>
        ) : wrongAnsData ? (
          <div className="question_ans_wrapper pt-5">
            {
              <div>
                <div className="top_question position-relative">
                  <div className="circle_question_number">Q{counter + 1}</div>
                  {questionText}
                </div>
                {supportingImg !== null ? (
                  <div className="question_related_assets text-center py-3">
                    <img
                      src={supportingImg}
                      alt="center img"
                      className="img-fluid  mx-auto"
                    />
                  </div>
                ) : (
                  ""
                )}

                {wrongAnsData
                  ? mcqOptions.map((ans, i) => {
                      const indexnumber = i;
                      return (
                        <div
                          key={indexnumber}
                          className={`answer position-relative mt-3 ${(() => {
                            if (indexnumber === userAnswer) {
                              return "active";
                            }
                            if (indexnumber === correctAnswer) {
                              return "active_correct_ans";
                            }
                          })()}`}
                        >
                          <div className="circle_question_number">
                            {i === 0
                              ? "A"
                              : i === 1
                              ? "B"
                              : i === 2
                              ? "C"
                              : i === 3
                              ? "D"
                              : i === 4
                              ? "E"
                              : i === 5
                              ? "F"
                              : i === 6
                              ? "G"
                              : i === 7
                              ? "H"
                              : i === 8
                              ? "I"
                              : i === 9
                              ? "J"
                              : i === 10
                              ? "K"
                              : i === 11
                              ? "L"
                              : i === 12
                              ? "M"
                              : i === 13
                              ? "N"
                              : ""}
                          </div>
                          {ans}
                        </div>
                      );
                    })
                  : ""}
              </div>
            }

            <div>
              {" "}
              <div className="next_back_btns">
                <div className="row m-0">
                  <div className="col-6 p-0">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg d-block  w-100  p-3 small-font-16 border-radious-0 bg-none question_back_btn"
                      onClick={() => decrementCounter()}
                      disabled={counter === 0 ? true : false}
                    >
                      <img
                        src={`${window.location.origin}/${leftArrow}`}
                        alt="leftarrow"
                        className="mr-2 mt-minus-2"
                      />
                      Previous Question
                    </button>
                  </div>
                  <div className="col-6 p-0">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg d-block  w-100  p-3 small-font-16 border-radious-0  "
                      onClick={() => incrementCounter()}
                      disabled={
                        counter + 1 === TotalWrongAnswers ? true : false
                      }
                    >
                      Next Question
                      <img
                        src={`${window.location.origin}/${rightArrow}`}
                        alt="rightarrow"
                        className="ml-2 mt-minus-2"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pb-5  pt-5 text-left alert_message">
            Unable to load wrong answers. Something went wrong!
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
export default WrongAnswers;
