import React from "react";
//import BackArrow from "../../../assets/images/back_arrow.svg";
import { useHistory } from "react-router";
import infoico from "../../../../assets/images/i_ico_small.svg";
import BaseURL from "../../../../CommonUniversal/api";
import ReactLoading from "react-loading";
function PracticeTestInstructions({
  textinstructions,
  practiceTestId,
  practiceTestOrderId,
  numQuestions,
  testDuration,
  attemptedQuestions,
}) {
  const history = useHistory();

  const [errors, seterrors] = React.useState();
  const [loading, setloading] = React.useState(false);
  React.useEffect(() => {
    if (attemptedQuestions === numQuestions) {
      seterrors(false);
      history.push({
        pathname: "/home/practicetest/results",
        search: "?ptid=" + practiceTestId + "&ptoid=" + practiceTestOrderId,
      });
    } else if (attemptedQuestions !== null && attemptedQuestions >= 0) {
      seterrors(false);
      history.push({
        pathname: "/home/practicetest/questionanswer",
        state: {
          practiceTestId: practiceTestId,
          practiceTestOrderId: practiceTestOrderId,
          numQuestions: numQuestions,
          testDuration: testDuration,
          attemptedQuestions: attemptedQuestions,
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function practiceTestStartTime() {
    setloading(true);
    var ls = require("local-storage");
    const testStartData = {
      testId: ls.get("userinfo").testId,
      practiceTestId: practiceTestId,
      practiceTestOrderId: practiceTestOrderId,
    };
    const config = {
      headers: { Authorization: `Bearer ${ls.get("token").accessToken}` },
      key: "Authorization",
    };

    BaseURL.post("practicetest/start", testStartData, config)
      .then((res) => {
        if (res.data.status === 400) {
          seterrors(res.data.errors);
        }
        //  ls.set("PTQATimer",);
        setloading(false);
        history.push({
          pathname: "/home/practicetest/questionanswer",
          state: {
            practiceTestId: practiceTestId,
            practiceTestOrderId: practiceTestOrderId,
            numQuestions: numQuestions,
            testDuration: testDuration,
            attemptedQuestions: attemptedQuestions,
          },
        });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data.status === 500) {
            alert("Something went wrong please try again later.");
          }
        }
        setloading(false);
      });
  }

  const string = textinstructions || "";
  var array = string.split("</br>");

  const listNumArray = array.map((eachPara, index) => {
    return (
      <div className="row m-0 pb-3 align-items-center" key={index}>
        <div className="col-auto p-0">
          <div className="dig_number">{index + 1}</div>
        </div>
        <div className="col-8 col-md-11 p-0 p-2 pl-3">{eachPara}</div>
      </div>
    );
  });
  const [handleCheckBox, sethandleCheckBox] = React.useState(false);
  function handleCheckBoxfun() {
    if (handleCheckBox === false) {
      sethandleCheckBox(true);
    } else {
      sethandleCheckBox(false);
    }
  }

  return (
    <React.Fragment>
      {attemptedQuestions !== numQuestions ? (
        <div className="instructions_wrapper">
          <div
            role="alert"
            className={`alert_message  text-left mt-0 pb-2   ${
              errors ? "d-block" : "d-block"
            }`}
          >
            {errors}
          </div>
          <h5 className="font-weight-normal">
            Please read the following instructions carefully:
          </h5>
          <div className="info_sec pt-2 light-color-para">
            <img src={infoico} alt="ifo ico" className="mr-2 " /> There will be
            no negative marking in this practice test
          </div>
          <div className="practice_test_inner py-5">
            {listNumArray}
            <div className="pt-3 pl-1">
              <h5 className="semi_bold terms_label_checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={handleCheckBox}
                    onChange={() => handleCheckBoxfun()}
                    className="checkboxAdj"
                  />
                  I have read and understood the instructions.
                </label>
              </h5>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                className="btn btn-primary btn-lg d-block  w-100  p-3 my-3 small-font-16"
                onClick={() => practiceTestStartTime()}
                disabled={handleCheckBox === false ? true : false}
              >
                {loading ? (
                  <span className="inline-block">
                    <ReactLoading
                      type={"spin"}
                      color={"#fff"}
                      height={"20px"}
                      width={"20px"}
                      margin
                    />
                  </span>
                ) : (
                  "START PRACTICE TEST"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}
export default PracticeTestInstructions;
