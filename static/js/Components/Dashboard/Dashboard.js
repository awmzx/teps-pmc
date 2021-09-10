import React from "react";
import "./Dashboard.scss";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import SilentLogin from "../../CommonUniversal/auth/SilentLogin";
import { useSinginCallinProgress } from "./ContextHooks/ThemeProvider";
//import usePageTracking from "./Analytics/usePageTracking";
import { useTheme, useThemeLoading } from "./ContextHooks/ThemeProvider";
import UserInfoProvider from "./ContextHooks/UserInfoProvider";
import LeftMenu from "./Common/LeftMenu/LeftMenu";
import TopSearch from "./Common/TopSearch/TopSearch";
import Home from "./Home/Home";
import ManageSchedule from "./ManageSchedule/ManageSchedule";
import PracticeTest from "./PracticeTest/PracticeTest";
//import SheduleTestDateTime from "./SheduleTestDateTime/SheduleTestDateTime";
import QuestionAnswer from "./PracticeTest/QuestionAnswer/QuestionAnswer";
import WrongAnswers from "./PracticeTest/GetWrongAnswers/WrongAnswers";
import ReviewSyllabus from "./ReviewSyllabus/ReviewSyllabus";
import Results from "./PracticeTest/Results/Results";
import NotFound from "../../CommonUniversal/NotFound";
import LoadingSreen from "./Common/LoadingScreen/LoadingScreen";
import SampleQuestions from "./SampleQuestions/SampleQuestions";
//import UpdateSchedule from "./ManageSchedule/UpdateSchedule";
import Logout from "../Login/Logout";
import Topics from "./SampleQuestions/Topics/Topics";
import NoInterNet from "../../CommonUniversal/NoInternet/NoInternet";
import PaymentIntegrations from "./Payment_Integrations/PaymentIntegrations";
import PracticeTestBundles from "./PracticeTest/PracticeTestBundles";
import ActualResult from "./ActualResult/ActualResult";
// get browser window height and assign it to div height

// get browser window height and assign it to div height ended here/////////
const Dashboard = () => {
  const darkMode = useTheme();
  const themeLoading = useThemeLoading();
  const isSigninCall = useSinginCallinProgress();
  let { path } = useRouteMatch();
  // Login again if token expired.
  // usePageTracking();
  SilentLogin();
  // Login again if token expired ended.
  return (
    <>
      <NoInterNet />
      {themeLoading === true ? <LoadingSreen /> : ""}
      {isSigninCall ? (
        <LoadingSreen />
      ) : (
        <UserInfoProvider>
          <Route>
            <div className="dashboard_wrapper">
              <div
                className={`container  auto_screen_height white-bg customized_container ${
                  darkMode === true ? "dark_bg" : "light_bg"
                }`}
              >
                <div className="row">
                  <div className="col-sm-12 col-md-3 col-lg-2 p-0">
                    <LeftMenu />
                  </div>
                  <div className="col-sm-12 col-md-9 col-lg-10 p-0">
                    <div className="top_search_wrapper">
                      <TopSearch />
                    </div>

                    <div
                      className={`content_sec ${
                        darkMode === true ? "dark_mode" : "light_mode"
                      }`}
                    >
                      <Switch>
                        {/* <Route path={`${path}/sheduletestdateTime`}>
                      <SheduleTestDateTime />
                    </Route> */}

                        {/* <Route path={`${path}/manageSchedule`}>
                      <UpdateSchedule />
                    </Route> */}
                        {
                          <Route path={`${path}/manageSchedule`}>
                            <ManageSchedule />
                          </Route>
                        }
                        <Route exact path={`${path}/practicetest`}>
                          <PracticeTest />
                        </Route>
                        <Route exact path={`${path}/purchasebundles`}>
                          <PracticeTestBundles />
                        </Route>

                        <Route path={`${path}/practicetest/questionanswer`}>
                          <QuestionAnswer />
                        </Route>
                        <Route path={`${path}/practicetest/results`}>
                          <Results />
                        </Route>
                        <Route path={`${path}/viewresult`}>
                          <ActualResult />
                        </Route>

                        <Route path={`${path}/practicetest/wronganswers`}>
                          <WrongAnswers />
                        </Route>

                        <Route path={`${path}/reviewsyllabus`}>
                          <ReviewSyllabus />
                        </Route>
                        <Route exact path={`${path}/samplequestions`}>
                          <SampleQuestions />
                        </Route>
                        <Route path={`${path}/samplequestions/topics`}>
                          <Topics />
                        </Route>
                        <Route path={`${path}/payments`}>
                          <PaymentIntegrations />
                        </Route>

                        <Route path={`${path}/logout`}>
                          <Logout />
                        </Route>

                        <Route exact path="/home">
                          <Home />
                        </Route>
                        <Route component={NotFound} />
                      </Switch>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Route>
        </UserInfoProvider>
      )}
    </>
  );
};
export default Dashboard;
