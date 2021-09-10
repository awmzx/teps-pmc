/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import $ from "jquery";
import BackArrow from "../../../../assets/images/back_arrow.svg";
import { useHistory, useLocation, Prompt } from "react-router-dom";
import leftArrow from "../../../../assets/images/left_pick_arrow.svg";
import "./QuestionAnswer.scss";
import rightArrow from "../../../../assets/images/right_pick_arrow.svg";
import TimeCounter from "../../Common/TimeCounter/TimeCounter";
import BaseURL from "../../../../CommonUniversal/api";
import ModalPopupBootstrap from "../../../../CommonUniversal/ModalPopup/ModalPopupBootstrap";
import { useThemeLoadingDispatch } from "../../ContextHooks/ThemeProvider";
import ItemsCarousel from "react-items-carousel";

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }
function QuestionAnswer() {
  const loadingSplashScreen = useThemeLoadingDispatch();

  // let query = useQuery();
  // console.log(query.get("atq"));
  const location = useLocation();
  let history = useHistory();
  var ls = require("local-storage");
  const config = {
    headers: { Authorization: `Bearer ${ls.get("token").accessToken}` },
    key: "Authorization",
  };

  const [loading, setloading] = useState();
  const practiceTestId = location.state?.practiceTestId || "";
  const practiceTestOrderId = location.state?.practiceTestOrderId || "";
  const testDuration = location.state?.testDuration || "";
  const numQuestions = location.state?.numQuestions || "";

  const [attemptedQuestions, setattemptedQuestions] = React.useState();
  if (practiceTestId === "") {
    setTimeout(() => {
      loadingSplashScreen(false);
      history.push("/home");
    }, 100);
  }
  const [questionsData, setquestionsData] = useState();
  const [filteredQuestion, setfilteredQuestion] = useState();
  const [reload, setreload] = useState(false);
  const [failedretry, setfailedretry] = useState(false);
  const currentattemptedQuestions = attemptedQuestions ? attemptedQuestions : 0;
  // Counter to show one question at a time.
  const [counter, setCounter] = useState(0 + currentattemptedQuestions);

  const skippedQuestionsFromLocal =
    ls.get(`skippedQuestions${practiceTestOrderId}`) || "";
  const [skippedArray, setskippedArray] = useState([]);
  useEffect(() => {
    if (skippedQuestionsFromLocal) {
      setskippedArray(skippedQuestionsFromLocal);
    }
  }, []);

  const checklastlargenumber =
    ls.get(`lastlargenumber${practiceTestOrderId}`) || 0;
  useEffect(() => {
    if (filteredQuestion) {
      if (counter > checklastlargenumber) {
        ls.set(`lastlargenumber${practiceTestOrderId}`, counter);
        if (skippedQuestionsFromLocal !== skippedArray) {
          ls.set(`skippedQuestions${practiceTestOrderId}`, skippedArray);
        }
      }
    }
  }, [filteredQuestion]);

  const incrementCounter = () => {
    setCounter(counter + 1);
    if (reload === true) {
      submitPRacticeTestQuestion();
      const index = skippedArray.indexOf(filteredQuestion.ptQuestionOrder);
      if (index > -1) {
        skippedArray.splice(index, 1);
      }
      ls.set(`skippedQuestions${practiceTestOrderId}`, skippedArray);
    } else if (counter >= attemptedQuestions) {
      submitPRacticeTestQuestion();
      // i have set reload false to studentMcqAnswer null
      if (studentMcqAnswer === null && counter >= checklastlargenumber) {
        ls.set(`skippedQuestions${practiceTestOrderId}`, skippedArray);
        setskippedArray((skippedArray) => [
          ...skippedArray,
          filteredQuestion.ptQuestionOrder,
        ]);
      }
    }
    setreload(false);
  };
  let decrementCounter = () => {
    setCounter(counter - 1);
    if (reload === true) {
      submitPRacticeTestQuestion();
      //setreload(false);
    }
    setreload(false);
    if (reload === true) {
      const index = skippedArray.indexOf(filteredQuestion.ptQuestionOrder);
      if (index > -1) {
        skippedArray.splice(index, 1);
      }
      ls.set(`skippedQuestions${practiceTestOrderId}`, skippedArray);
    }
  };
  // This function will trigger on last button
  const submitTestFunction = () => {
    if (counter === numQuestions - 1) {
      submitPRacticeTestQuestion();
      submitCompletedPracticeTest();
      $("#confirmtestsubmission").modal("hide");
    }
    setreload(false);
  };
  // Counter to show one question at a time.//ended//

  useEffect(() => {
    if (questionsData) {
      const filterEachQuestion = questionsData.filter((value) => {
        return value;
      });
      setfilteredQuestion(filterEachQuestion[counter]);
      setActiveId("");
      setstoredActiveId("");
    }
  }, [questionsData, counter]);

  const {
    mcqOptions,
    practiceQuestionId,
    supportingImg,
    ptQuestionOrder,
    sptestQuestionId,
    questionText,
    studentMcqAnswer,
    subject,
    topic,
    subTopic,
  } = filteredQuestion || {};

  useEffect(() => {
    if (studentMcqAnswer !== null) {
      setActiveId(studentMcqAnswer);
      setstoredActiveId(studentMcqAnswer);
    } else {
      setActiveId();
    }
  }, [filteredQuestion]);

  // Check if user attempted all question and answers navigate back to homepage.
  const [practicetestlist, setpracticetestlist] = useState();

  React.useEffect(() => {
    if (practicetestlist) {
      const findCurrentArray = practicetestlist.find((filteredItem) => {
        return filteredItem.practiceTestOrderId === practiceTestOrderId;
      });

      setattemptedQuestions(findCurrentArray.attemptedQuestions);
      setCounter(findCurrentArray.attemptedQuestions);
    }
  }, [practicetestlist]);
  const [apiError, setapiError] = React.useState(false);

  const [navigateBack, setnavigateBack] = useState(false);
  function getPracticeTestList() {
    loadingSplashScreen(true);
    const GTSPData = {
      testId: ls.get("userinfo").testId,
    };
    BaseURL.post("/test/practicetestlist", GTSPData, config)
      .then((res) => {
        setpracticetestlist(res.data);
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

  useEffect(() => {
    if (practicetestlist) {
      const filterPracticeTest = practicetestlist.find((PTOID) => {
        return PTOID.practiceTestOrderId === practiceTestOrderId;
      });

      if (
        filterPracticeTest.attemptedQuestions ===
        filterPracticeTest.numQuestions
      ) {
        setnavigateBack(true);
        setTimeout(() => {
          loadingSplashScreen(false);
          history.push("/home");
        }, 500);
      }
    }
  }, [practicetestlist]);
  // Check if user attempted all question and answers navigate back to homepage ended.
  /////// Get Question again Test

  function getQuestions() {
    settimeCounter(true);
    if (reload === true) {
      setloading(false);
    } else {
      loadingSplashScreen(true);
    }

    const getQuestionData = {
      testId: ls.get("userinfo").testId,
      practiceTestId: practiceTestId,
      practiceTestOrderId: practiceTestOrderId,
    };
    BaseURL.post("/practicetest/questions/get", getQuestionData, config)
      .then((res) => {
        setquestionsData(res.data);
        setActiveId("");
        setstoredActiveId("");
        loadingSplashScreen(false);
        settimeCounter(false);
        setapiError(false);
      })
      .catch((err) => {
        setloading(false);
        if (err.response) {
          if (err.response.status === 500) {
            setapiError(true);
          }
        }
      });
  }

  React.useEffect(() => {
    getQuestions(); // uncomment here
    getPracticeTestList();
  }, []);
  /////// Get Question again Test// Ended

  ///// Submit Submit Practice Test Question

  function submitPRacticeTestQuestion() {
    const submitQuestionData = {
      sptestQuestionId: sptestQuestionId,
      testId: ls.get("userinfo").testId,
      practiceTestId: practiceTestId,
      practiceTestOrderId: practiceTestOrderId,
      studentId: ls.get("token").studentId,
      practiceQuestionId: practiceQuestionId,
      studentMcqAnswer: activeId || activeId === 0 ? activeId : null,
      skipped: activeId || activeId === 0 ? 0 : 1,
      ptQuestionOrder: ptQuestionOrder,
    };
    BaseURL.post(
      "/practicetest/questions/submitanswer",
      submitQuestionData,
      config
    )
      .then((res) => {
        setloading(false);
        setreload(false);
        setfailedretry(false);
        setapiError(false);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data.status === 500) {
            setapiError(true);
          }
        } else {
          retryiffaildmethod();
          if (counter === numQuestions - 1 && failedretry === true) {
            loadingSplashScreen(true);
          }
          setloading(false);
        }
      });
  }

  //Internet lost during test retry untill test is fully submitted.
  const retry = require("retry");
  function retryiffaildmethod() {
    const submitQuestionDatatwo = {
      sptestQuestionId: sptestQuestionId,
      testId: ls.get("userinfo").testId,
      practiceTestId: practiceTestId,
      practiceTestOrderId: practiceTestOrderId,
      studentId: ls.get("token").studentId,
      practiceQuestionId: practiceQuestionId,
      studentMcqAnswer: activeId || activeId === 0 ? activeId : null,
      skipped: activeId || activeId === 0 ? 0 : 1,
      ptQuestionOrder: ptQuestionOrder,
    };
    const operation = retry.operation({
      retries: 2000,
      factor: 2000,
      minTimeout: 1 * 1000,
      maxTimeout: 10 * 1000,
      randomize: false,
    });

    operation.attempt(async (currentAttempt) => {
      //console.log("sending request: ", currentAttempt, " attempt");

      try {
        await BaseURL.post(
          "/practicetest/questions/submitanswer",
          submitQuestionDatatwo,
          config
        );

        if (counter === numQuestions - 1 && failedretry === true) {
          setTimeout(() => {
            loadingSplashScreen(false);
            submitCompletedPracticeTest();
          }, 50000);
          setfailedretry(false);
        }
      } catch (e) {
        if (operation.retry(e)) {
          setfailedretry(true);
          return;
        }
      }
    });
  }

  // Internet lost during test retry untill test is fully submitted//Ended.
  ///// Submit Submit Practice Test Question//Ended

  ///////Check which answer is click by user//////////
  const [storedActiveId, setstoredActiveId] = React.useState();
  const [activeId, setActiveId] = React.useState();
  const [counterValue] = React.useState(testDuration);

  // Random component
  function CounterCallback() {
    // submitPRacticeTestQuestion();
    // submitCompletedPracticeTest();
  }
  function SelectedAnswer(value) {
    setreload(true);
    setstoredActiveId(value);
    setActiveId(value);
    // filteredQuestion.studentMcqAnswer = value;
    // setfilteredQuestion({ ...filteredQuestion });
    let changeMCQAnswer = questionsData.filter((q) => {
      return q.ptQuestionOrder === filteredQuestion.ptQuestionOrder;
    });
    changeMCQAnswer[0].studentMcqAnswer = value;
  }

  ///////Check which answer is click by user//////////Ended Here//
  const [timeCounter, settimeCounter] = useState(true);
  // console.log(PTQATimer);
  // Counter clock
  const memoChild = React.useMemo(
    () => (
      <TimeCounter
        CounterTotal={counterValue}
        CounterCallback={CounterCallback}
        CounterHandelPause={timeCounter}
        practiceTestOrderId={practiceTestOrderId}
      />
    ),

    [timeCounter]
  );
  // Counter clock // Ended

  // Submit Practice Test Completed
  const PTQATimer =
    testDuration - ls.get(`PTQATimer${practiceTestOrderId}`) || "";
  const [reSubmitComplete, setreSubmitComplete] = React.useState(false);
  React.useEffect(() => {
    if (reSubmitComplete) {
      setTimeout(() => {
        setreSubmitComplete(false);
        submitCompletedPracticeTest();
      }, 1000);
    }
  }, [reSubmitComplete]);
  function submitCompletedPracticeTest() {
    loadingSplashScreen(true);
    const submitCompleteData = {
      testId: ls.get("userinfo").testId,
      practiceTestId: practiceTestId,
      practiceTestOrderId: practiceTestOrderId,
      spentTime:
        PTQATimer !== null || PTQATimer !== "" ? PTQATimer : testDuration,
    };
    BaseURL.post("/practicetest/submit", submitCompleteData, config)
      .then((res) => {
        ls.remove(`PTQATimer${practiceTestOrderId}`);
        ls.remove(`lastlargenumber${practiceTestOrderId}`);
        ls.remove(`skippedQuestions${practiceTestOrderId}`);
        loadingSplashScreen(false);
        setapiError(false);
        history.push({
          pathname: "/home/practicetest/results",
          search: "?ptid=" + practiceTestId + "&ptoid=" + practiceTestOrderId,
        });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data.status === 500) {
            setapiError(true);
          }
        }
      });
  }
  function hreftPRacticeTest() {
    history.push("/home/practicetest");
    $("#practiceTestExit").modal("hide");
  }

  // skipped question functionality
  const [questionNo, setquestionNo] = useState();
  const [showLastQuestionBtn, setshowLastQuestionBtn] = useState(false);
  const [showSkipped, setshowSkipped] = useState(false);
  function removeArrayItem(x) {
    setquestionNo(x);
    setshowLastQuestionBtn(true);
    if (filteredQuestion.ptQuestionOrder === questionNo && reload === true) {
      const index = skippedArray.indexOf(questionNo);
      if (index > -1) {
        skippedArray.splice(index, 1);
      }
      ls.set(`skippedQuestions${practiceTestOrderId}`, skippedArray);
      // let removeSelectedQuestion = skippedArray.filter((q) => {
      //   return q !== questionNo;
      // });
      // $(`#${questionNo}`).fadeOut("slow");
      // setTimeout(() => {
      //   setskippedArray(removeSelectedQuestion);
      //   if (skippedArray.length === 1) {
      //     setshowSkipped(false);
      //     setshowLastQuestionBtn(false);
      //     setCounter(ls.get(`lastlargenumber${practiceTestOrderId}`));
      //   }
      // }, 800);
      // ls.set(`skippedQuestions${practiceTestOrderId}`, skippedArray);
      // MOST IMPORATANT CODE FOR FURTURE USE
      // const [smaki, setsmaki] = useState();
      // useEffect(() => {
      //   if (smaki) {
      //     setCounter(smaki - 1);
      //   }
      // }, [smaki]);
      // let result = skippedArray.find((price) => {
      //   return price > questionNo;
      // });
      // setTimeout(() => {
      //   setsmaki(result);
      // }, 500);
      //$(`#${questionNo}`).parent().fadeOut("slow");
      //$(`#${questionNo}`).parent().fadeOut("slow");
      // setTimeout(() => {
      //   const index = skippedArray.indexOf(questionNo);
      //   if (index > -1) {
      //     skippedArray.splice(index, 1);
      //   }
      //   ls.set(`skippedQuestions${practiceTestOrderId}`, skippedArray);
      // }, 500);
      //   $(`#${questionNo}`).parent().fadeOut("slow");
      //   var result = $(skippedArray)
      //   .map(function (i) {
      //     return this > x ? i : null;
      //   })
      //   .get() // un-wraps the jQuery object to a proper Array
      //   .shift();

      // setCounter(skippedArray[result]);
    }
    if (reload === true) {
      submitPRacticeTestQuestion();
    }

    if (skippedArray.length === 0) {
      setshowSkipped(false);
      setshowLastQuestionBtn(false);
      setCounter(ls.get(`lastlargenumber${practiceTestOrderId}`));
    } else {
      setCounter(x - 1);
    }
    setreload(false);
  }

  function loadSkippedAnswers() {
    if (showSkipped === false) {
      setshowSkipped(true);
      $("#confirmtestsubmission").modal("hide");
    } else {
      setshowSkipped(false);
      setshowLastQuestionBtn(false);
      setCounter(ls.get(`lastlargenumber${practiceTestOrderId}`));
    }
  }

  function crossFun() {
    removeArrayItem();
    setshowSkipped(false);
    setshowLastQuestionBtn(false);
    setCounter(ls.get(`lastlargenumber${practiceTestOrderId}`));
  }

  //On load check from server and save to localstorage
  useEffect(() => {
    if (questionsData) {
      const filterFreshUnattempted = questionsData.filter((filteritem) => {
        return filteritem.skipped === 1;
      });
      const loopfilterFreshUnattempted = filterFreshUnattempted.map(
        (setlocall) => {
          return setlocall.ptQuestionOrder;
        }
      );

      setskippedArray(loopfilterFreshUnattempted);
      ls.set(
        `skippedQuestions${practiceTestOrderId}`,
        loopfilterFreshUnattempted
      );
    }
  }, [questionsData]);
  useEffect(() => {
    if (filteredQuestion) {
      if (filteredQuestion.studentMcqAnswer) {
        setActiveId(studentMcqAnswer);
      }
    }
  }, [filteredQuestion]);
  //On load check from server and save to localstorage ended
  // const [allFilteredQuestions, setallFilteredQuestions] = useState();
  // useEffect(() => {
  //   if (skippedArray) {
  //     const loopFiltered = skippedArray.map((x) => {
  //       return (
  //         <div
  //           id={x}
  //           className={
  //             x - 1 === counter && reload === false
  //               ? "circle_num active"
  //               : x - 1 === counter && reload === true
  //               ? "circle_num active-blue"
  //               : "circle_num"
  //           }
  //           onClick={() => removeArrayItem(parseInt(x))}
  //           key={x}
  //         >
  //           {parseInt(x)}
  //         </div>
  //       );
  //     });

  //     setallFilteredQuestions(loopFiltered);
  //   }
  // }, [skippedArray]);
  // on resize adjust carousel

  const [windowWidth, setwindowWidth] = useState(window.innerWidth);
  function reportWindowSize() {
    setwindowWidth(window.innerWidth);
  }

  window.onresize = reportWindowSize;
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const chevronWidth = 40;

  return (
    <React.Fragment>
      <Prompt
        message={(location, action) => {
          if (action === "POP") {
            //console.log("Backing up...");
          }
          if (practiceTestId === "" || navigateBack === true) {
            return location.pathname.startsWith(`/home`)
              ? true
              : `Are you sure you want to exit the practice test mode?`;
          } else {
            return location.pathname.startsWith(`/home/practicetest/results`)
              ? true
              : `Are you sure you want to exit the practice test mode?`;
          }
        }}
      />
      <ModalPopupBootstrap
        themeMode="offwhite"
        modalID="confirmtestsubmission"
        closebtn={false}
      >
        <div className="top_heading  pb-5 pt-5  pl-lg-4">
          <h4 className="sm_br_none semi-bold">Confirm test submission</h4>
          <p className="py-4">
            Are you sure you want to submit the test? In case you have skipped
            some questions, you can attempt them now.
          </p>
          <div className="pb-3">
            <button
              className="submit_tst confirm_btn primary_color semi-bold text-left"
              onClick={() => submitTestFunction()}
            >
              <div className="ico_div">
                {" "}
                <img
                  src={
                    require("../../../../assets/images/tick_mark_ico.png")
                      .default
                  }
                  alt="tick mark"
                />
              </div>
              Submit Test
            </button>
          </div>
          <div className="pb-4">
            <button
              className="submit_tst confirm_btn primary_color semi-bold text-left"
              onClick={() => loadSkippedAnswers()}
            >
              <div className="ico_div">
                <img
                  src={
                    require("../../../../assets/images/back-arrow.png").default
                  }
                  alt="tick mark"
                />
              </div>
              View Skipped Questions
            </button>
          </div>{" "}
          <div className="pb-4">
            <button
              className="submit_tst confirm_btn primary_color semi-bold text-left"
              data-dismiss="modal"
            >
              <div className="ico_div">
                <img
                  src={
                    require("../../../../assets/images/cross_mark_ico.png")
                      .default
                  }
                  alt="tick mark"
                />
              </div>
              Cancel
            </button>
          </div>{" "}
        </div>
      </ModalPopupBootstrap>
      <ModalPopupBootstrap themeMode="offwhite" modalID="practiceTestExit">
        <div className="top_heading text-center pb-5 pt-5 mt-minus-35">
          <h4 className="sm_br_none">
            Are you sure you want to exit the practice <br /> test mode?
          </h4>
        </div>

        <div className="pt-1 pb-3">
          <div className="row m-0 justify-content-md-center">
            <div className="col-md-5 pb-2 p-0 px-2">
              <button
                type="submit"
                className="btn btn-primary btn-bordered-only btn-lg d-block  w-100 border-radious-10 p-3 small-font-16"
                data-dismiss="modal"
              >
                Cancel
              </button>
            </div>
            <div className="col-md-5 pb-2 p-0 px-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg d-block  w-100 border-radious-10 p-3 small-font-16"
                onClick={() => hreftPRacticeTest()}
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      </ModalPopupBootstrap>
      {/* <ul>
        {values.map((val) => (
          <li onClick={() => setActiveId(val.id)}>{val.text} --</li>
        ))}
      </ul> */}

      {/* {loading === false ? questionsData.map((val) => console.log(val)) : ""} */}
      {memoChild}

      <div className="question_ans_wrapper w-lg-80 mx-auto py-5">
        <div className="top_heading lightgray-border-bottom white-tx mt-3">
          <div className="row">
            <div className="col-6">
              <div onClick={() => history.push("/home/practicetest")}>
                <img
                  src={`${window.location.origin}/${BackArrow}`}
                  className="backarrow_adjustment"
                  alt="Go Back Icon"
                />
              </div>
            </div>
            <div className="col-6 text-right">
              <h4 className="font-weight-normal">
                Question {counter + 1}/{numQuestions}
              </h4>
            </div>
          </div>
        </div>
        {apiError ? (
          <div className="pb-3 pt-3  text-center alert_message question_alert_adjustment">
            <div>Something went wrong please try again later.</div>
          </div>
        ) : (
          ""
        )}
        {!failedretry ? (
          ""
        ) : (
          <div className="pb-0 pt-3  pb-3 text-center alert_message question_alert_adjustment">
            <div>Please check your internet connection.</div>
          </div>
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
        ) : (
          <div>
            <div className="topic_detail p-4">
              <div className="light-color">
                {" "}
                <span className="text-uppercase semi-bold">
                  {subject} {">>"}{" "}
                </span>
                {topic}
              </div>
              <span className="pt-3 d-block">{subTopic}</span>
            </div>
            <div className="question_ans_wrapper pt-4">
              <div className="top_question position-relative">
                <div className="circle_question_number">Q {counter + 1}</div>
                {questionText}
              </div>

              {supportingImg !== null && mcqOptions ? (
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

              <div className={skippedArray.length > 0 ? "pb-4" : "pb-4"}>
                {mcqOptions ? (
                  mcqOptions.map((ans, i) => {
                    const indexnumber = i;
                    return (
                      <div
                        key={i}
                        className={`answer position-relative mt-3 ${(() => {
                          if (activeId === indexnumber) {
                            return "active";
                          }
                          if (storedActiveId === indexnumber) {
                            return "active disableAll";
                          }
                          if (storedActiveId !== indexnumber) {
                            if (activeId === "disableAll") {
                              return "disableAll";
                            }
                          } else {
                            return "inactive";
                          }
                        })()}`}
                        onClick={() => SelectedAnswer(indexnumber)}
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
                ) : (
                  <div className="pb-5 text-center alert_message">
                    Unable to load your question. Something went wrong!
                  </div>
                )}
              </div>
              {skippedArray.length > 0 && !showSkipped ? (
                <div className="pt-4 ">
                  <div
                    className="skipped_questions_btn"
                    onClick={() => loadSkippedAnswers()}
                  >
                    {" "}
                    <div className="position-relative">
                      <div className="small_noti">
                        {skippedArray.length ? skippedArray.length : ""}
                      </div>
                    </div>
                    skipped Questions{" "}
                    <img
                      src={
                        require("../../../../assets/images/skipped_question_ico.svg")
                          .default
                      }
                      alt="skipped questions ico"
                    />
                  </div>
                </div>
              ) : (
                ""
              )}

              {showSkipped ? (
                <div>
                  <div className="skipped_adjustment">
                    <div className="corsss" onClick={() => crossFun()}>
                      <img
                        src={
                          require("../../../../assets/images/close.svg").default
                        }
                        alt="cross ico"
                      />
                    </div>{" "}
                  </div>

                  <div className="skippedQuestionsCarousel">
                    <div style={{ padding: `0 ${chevronWidth}px` }}>
                      <ItemsCarousel
                        requestToChangeActive={setActiveItemIndex}
                        activeItemIndex={activeItemIndex}
                        numberOfCards={
                          windowWidth > 1400
                            ? 10
                            : windowWidth < 1400 && windowWidth > 921
                            ? 8
                            : windowWidth < 920 && windowWidth > 600
                            ? 7
                            : windowWidth < 600 && windowWidth > 400
                            ? 4
                            : windowWidth < 400 && windowWidth > 200
                            ? 3
                            : 1
                        }
                        gutter={20}
                        leftChevron={
                          <div className="skipped_left_arrow">
                            <img
                              src={
                                require("../../../../assets/images/skipped_left_arrow.svg")
                                  .default
                              }
                              alt="leftarrow"
                              className="mr-3 mt-minus-2"
                            />
                          </div>
                        }
                        rightChevron={
                          <div className="skipped_right_arrow">
                            <img
                              src={
                                require("../../../../assets/images/skipped_right_arrow.svg")
                                  .default
                              }
                              alt="rightarrow"
                              className="ml-3 mt-minus-2"
                            />
                          </div>
                        }
                        outsideChevron
                        chevronWidth={chevronWidth}
                      >
                        {filteredQuestion
                          ? skippedArray.map((x) => {
                              return (
                                <div
                                  id={x}
                                  className={
                                    x - 1 === counter &&
                                    reload === false &&
                                    skippedArray.length !== 1
                                      ? "circle_num active avoid-mouse-clicks "
                                      : x - 1 === counter &&
                                        reload === true &&
                                        skippedArray.length !== 1
                                      ? "circle_num active-blue avoid-mouse-clicks "
                                      : skippedArray.length === 1 &&
                                        reload === false &&
                                        x === questionNo
                                      ? "circle_num active"
                                      : skippedArray.length === 1 &&
                                        reload === true
                                      ? "circle_num active-blue  "
                                      : "circle_num"
                                  }
                                  onClick={() => removeArrayItem(parseInt(x))}
                                  key={x}
                                >
                                  {parseInt(x)}
                                </div>
                              );
                            })
                          : ""}
                      </ItemsCarousel>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {showLastQuestionBtn ? (
                <button
                  type="submit"
                  className="btn btn-primary btn-lg d-block  w-100  p-3 small-font-16 border-radious-0 last_attempted_btn"
                  onClick={() => crossFun()}
                >
                  GO TO LAST ATTEMPTED QUESTION
                </button>
              ) : (
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
                          className="mr-3 mt-minus-2"
                        />
                        Previous Question
                      </button>
                    </div>
                    <div className="col-6 p-0">
                      {counter === numQuestions - 1 ? (
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg d-block  w-100  p-3 small-font-16 border-radious-0"
                          onClick={() =>
                            $("#confirmtestsubmission").modal("show")
                          }
                        >
                          Submit
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg d-block  w-100  p-3 small-font-16 border-radious-0"
                          onClick={() => incrementCounter()}
                        >
                          Next Question
                          <img
                            src={`${window.location.origin}/${rightArrow}`}
                            alt="rightarrow"
                            className="ml-3 mt-minus-2"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>{" "}
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
export default QuestionAnswer;
