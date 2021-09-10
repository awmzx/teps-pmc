import React from "react";
import "./Home.scss";
import ReviewSlabus from "../../../assets/images/review_slabuse_ico.svg";
import TakeSampleTest from "../../../assets/images/take_sample_test_ico.svg";
import StartPracticeTest from "../../../assets/images/start_practice_test_ico.svg";
import DrillaTopic from "../../../assets/images/drill_a_topic_ico.svg";
import PurchaseaTest from "../../../assets/images/purchase_a_test_ico.svg";
import ViewResult from "../../../assets/images/view_result_ico.svg";
import LoadingScreenNotFound from "../Common/LoadingScreen/LoadingScreenNotFound";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  useThemeUpdate,
  useThemeDisabledUpdateContext,
} from "../ContextHooks/ThemeProvider";
import {
  useRefreshUserInfo,
  useRefreshUserInfoStatus,
} from "../ContextHooks/UserInfoProvider";
const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    textAlign: "center",
  },
}))(Tooltip);
const Home = () => {
  var ls = require("local-storage");
  const getTestType = ls.get("userinfo") || "";
  const ResultGenerated = ls.get("userinfo") || "";
  const notify = () => toast("This feature isn't available now.");
  const RefreshUserInfo = useRefreshUserInfo();
  const CheckResultStatusFromInfo = useRefreshUserInfoStatus();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUserInfols = ls.get("userinfo") || {};
  const testNamels = getUserInfols !== null ? getUserInfols.testName : {};

  const [callbackScreen, setcallbackScreen] = React.useState(false);
  const disabledModeUpdate = useThemeDisabledUpdateContext();
  const applyDarkMode = useThemeUpdate();

  React.useEffect(() => {
    applyDarkMode(true); // If apply dark mode will be false it will trigger the white version
    disabledModeUpdate(false); //Don't diable left section that's why it is false if true it will disable the left sec.
    RefreshUserInfo(); //Refresh user info on reload because some values are changing frequently
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function showNotFound() {
    if (callbackScreen === true) {
      setcallbackScreen(false);
    } else {
      setcallbackScreen(true);
    }
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        className="toaster_dark "
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {callbackScreen === true ? (
        <LoadingScreenNotFound showNotFound={showNotFound} />
      ) : (
        ""
      )}
      <div className="categories_tabs w-lg-80 mx-auto pt-5">
        <div className="top_heading lightgray-border-bottom white-txt">
          <h2>
            Manage Test:
            <strong> {testNamels}</strong>
          </h2>
        </div>

        <div className="py-5">
          <div className="row">
            <div className="col-6 col-md-4 d-none d-lg-block">
              <Link to="/home/reviewsyllabus">
                <div className="each_category_tab gradient_2 mx-auto ">
                  <div className="text-center">
                    <div className="ico_circle">
                      <img src={ReviewSlabus} alt="Manage Test Date" />
                    </div>
                  </div>
                  <div className="label pl-2">Review Syllabus</div>
                </div>
              </Link>
            </div>
            {getTestType.testType === "NLE" ? (
              ""
            ) : (
              <div className="col-6 col-md-4 d-none d-lg-block">
                <Link to="/home/samplequestions">
                  <div className="each_category_tab gradient_3 mx-auto ">
                    <div className="text-center">
                      <div className="ico_circle">
                        <img src={TakeSampleTest} alt="Manage Test Date" />
                      </div>
                    </div>
                    <div className="label pl-2">View Sample Questions</div>
                  </div>
                </Link>
              </div>
            )}

            {/* <div className="col-6 col-md-4">
              <div
                className="each_category_tab gradient_4 "
                onClick={() => showNotFound()}
              >
                <div className="text-center">
                  <div className="ico_circle">
                    <img src={StartPracticeTest} alt="Manage Test Date" />
                  </div>
                </div>
                <div className="label pl-2">Start Practice Test</div>
              </div>
            </div> */}

            <div className="col-6 col-md-4">
              <Link to="/home/practicetest">
                <div className="each_category_tab gradient_4 ">
                  <div className="text-center">
                    <div className="ico_circle">
                      <img src={StartPracticeTest} alt="Manage Test Date" />
                    </div>
                  </div>
                  <div className="label pl-2">Start Practice Test</div>
                </div>
              </Link>
            </div>

            {/* <Link to="/home/practicetest">
              </Link> */}

            <div className="col-6 col-md-4 d-none d-lg-block">
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <em>
                      {
                        "Drills will be available for purchase soon. Drills will allow you to work on your weak topics, so you can improve your test results. You will be able to pick the topic you think needs more practice, we will present a drill that helps you cover all concepts for that topic."
                      }
                    </em>
                  </React.Fragment>
                }
              >
                <Button className="tab_normal_font">
                  <div
                    className="each_category_tab gradient_6 mx-auto disabled_now"
                    onClick={() => notify()}
                    style={{ marginBottom: "0px" }}
                  >
                    <div className="text-center">
                      <div className="ico_circle">
                        <img src={DrillaTopic} alt="Manage Test Date" />
                      </div>
                    </div>
                    <div className="label pl-2">Purchase Topic Drill</div>
                  </div>
                </Button>
              </HtmlTooltip>
            </div>
            <div className="col-6 col-md-4">
              {/* <HtmlTooltip
              title={
                <React.Fragment>
                  <em>
                    {"Practice tests will be available for purchase soon."}
                  </em>
                </React.Fragment>
              }
            >
              <Button className="tab_normal_font">
              </Button>
            </HtmlTooltip> */}
              <Link to="/home/purchasebundles">
                <div
                  className="each_category_tab gradient_6 mx-auto"
                  style={{ marginBottom: "0px" }}
                >
                  <div className="text-center">
                    <div className="ico_circle">
                      <img src={PurchaseaTest} alt="Manage Test Date" />
                    </div>
                  </div>
                  <div className="label pl-2">Purchase Practice Tests</div>
                </div>
              </Link>
            </div>
            {CheckResultStatusFromInfo ? (
              ResultGenerated.isResultGenerated === 1 ? (
                <div className="col-6 col-md-4">
                  <Link to="/home/viewresult">
                    <div
                      className="each_category_tab gradient_9 mx-auto"
                      style={{ marginBottom: "0px" }}
                    >
                      <div className="text-center">
                        <div className="ico_circle">
                          <img src={ViewResult} alt="Manage Test Date" />
                        </div>
                      </div>
                      <div className="label pl-2">
                        View {getTestType.testName} Result
                      </div>
                    </div>
                  </Link>
                </div>
              ) : (
                ""
              )
            ) : (
              ""
            )}

            {/* {getTestType === "NLE" ? (
              ""
            ) : (
             
            )} */}

            {/* <div className="col-6 col-md-4">
              <div
                className="each_category_tab gradient_7 mx-auto disabled_now"
                onClick={() => notify()}
              >
                <div className="text-center ">
                  <div className="ico_circle">
                    <img src={ReviewPreviousResults} alt="Manage Test Date" />
                  </div>
                </div>
                <div className="label pl-2">Review Previous Results</div>
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div
                className="each_category_tab gradient_8 mx-auto disabled_now"
                onClick={() => notify()}
              >
                <div className="text-center ">
                  <div className="ico_circle">
                    <img src={ReviewToDos} alt="Manage Test Date" />
                  </div>
                </div>
                <div className="label pl-2">Review TO-DOs</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
