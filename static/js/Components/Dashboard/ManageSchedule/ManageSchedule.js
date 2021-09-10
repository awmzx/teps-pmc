import React, { useEffect } from "react";
import ReactLoading from "react-loading";
//import BackArrow from "../../../assets/images/back_arrow.svg";
import "./ManageSchedule.scss";
import infoico from "../../../assets/images/i_ico_small.svg";
import "react-toastify/dist/ReactToastify.css";
import ManageScheduleModal from "./ManageScheduleModal";
import BaseURL from "../../../CommonUniversal/api";
import $ from "jquery";
import moment from "moment";
//import { useHistory } from "react-router";
const ManageSchedule = () => {
  //const history = useHistory();
  var ls = require("local-storage");
  //var testDesc = ls.get("userinfo").description || "";
  var userID = ls.get("token").authrisationNo || "";
  var testType = ls.get("userinfo").testType || "";
  const lsProfileImg = ls.get("profileImg") || "";
  const [apiError, setapiError] = React.useState(false);

  const config = {
    headers: { Authorization: `Bearer ${ls.get("token").accessToken}` },
    key: "Authorization",
  };
  const [loading, setLoading] = React.useState(false);

  const getUserInfols = ls.get("userinfo") || {};
  const testNamels = getUserInfols !== null ? getUserInfols.testName : "";
  ////// Store all API values
  const [updateSheduleState, setupdateSheduleState] = React.useState({});

  //Object destructring
  const {
    locationAddress,
    locationCity,
    testScheduleId,
    testStartTime,
    enterenceClosingTime,
    reportingTime,
    changeOnUserRequest,
    isUserSetPriorities,
    updateScheduleAllowed,
    rollNumber,
    updateScheduleMsg,
  } = updateSheduleState;
  const isPMCUser = ls.get("isPMCUser") || {};

  useEffect(() => {
    if (updateSheduleState) {
      if (
        locationAddress === null &&
        locationCity === null &&
        testStartTime === null &&
        isUserSetPriorities === 0
      ) {
        if (isPMCUser === true) {
          ls.set("sheduledate", { ifpmcuser: true, datesheduled: false });
        } else {
          ls.set("sheduledate", { ifpmcuser: false, datesheduled: false });
        }
        //history.push("/home/sheduletestdatetime");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSheduleState]);

  // var currentTimeInSeconds = Math.floor(testStartTime / 1000); //unix timestamp in seconds
  // var currentTimeInMilliseconds = Date.now(testStartTime); // unix timestamp in milliseconds

  // console.log(currentTimeInSeconds);
  // const unixTime = testStartTime;
  // const date = new Date(unixTime * 1000);
  // console.log(date.toLocaleString("en-US"));

  const [actualTime, setactualTime] = React.useState();
  const [tsStarteTime, settsStarteTime] = React.useState();
  const [etCloseTime, setetCloseTime] = React.useState();
  const [rtTime, setrtTime] = React.useState();
  useEffect(() => {
    if (testStartTime) {
      const date = new Date(testStartTime);
      const dateTwo = new Date(enterenceClosingTime);
      const dateThree = new Date(reportingTime);
      const seprateDate = moment.utc(date).format("DD-MMM-YYYY");
      const TSStartTime = moment.utc(date).format("h:mm A");
      const ENClosingTime = moment.utc(dateTwo).format(" h:mm A");
      const RPTime = moment.utc(dateThree).format(" h:mm A");

      setactualTime(seprateDate);
      settsStarteTime(TSStartTime);
      setetCloseTime(ENClosingTime);
      setrtTime(RPTime);
    }

    // if (testStartTime) {
    //   const convertDate = new Date(testStartTime);
    //   const formateSecondDate = format(
    //     new Date(convertDate),
    //     "MM/dd/yyyy HH:MM:ss"
    //   );
    //   setupdateSheduleState({
    //     ...updateSheduleState,
    //     testStartTime: formateSecondDate,
    //   });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSheduleState.testStartTime]);

  // Get user sheduled values
  const [reloadResponse, setreloadResponse] = React.useState(false);
  function checkUserSetShedule() {
    setLoading(true);
    const GTSPData = {
      testId: ls.get("userinfo").testId,
    };
    BaseURL.post("/test/userschedule", GTSPData, config)
      .then((res) => {
        setapiError(false);
        setupdateSheduleState(res.data);
        setLoading(false);
        //console.log(res.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 500) {
            setapiError(true);
          }
        }
      });
  }

  React.useEffect(() => {
    setLoading(true);
    checkUserSetShedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // user sheduled values ended
  function showAvailbleValues() {
    $("#UpdateShedule_modal").modal("show");
  }
  function UpdateSheduleCallBack() {
    // setupdateSheduleState({
    //   ...updateSheduleState,
    //   locationCity: value1,
    //   testStartTime: value2,
    // });
    checkUserSetShedule();
    checkUserSetPriorities();
  }
  function SchedulePending() {
    return (
      <div className="pt-5">
        Thank you for submitting your test schedule. You’ll get an email when
        your test schedule is finalized.
      </div>
    );
  }
  function ScheduleNotSetByUserOnTime() {
    return (
      <div className="pt-5">
        The schedule process is now closed. We will assign your exam schedule
        according to your PMC registration fee payment date and city you
        selected at the time of registration. You will get an email with your
        finalized test schedule.
      </div>
    );
  }
  function printDiv() {
    var divToPrint = document.getElementById("print_div");
    var newWin = window.open("", "Print-Window");
    newWin.document.open();
    newWin.document.write(
      '<html><style type="text/css">*{margin:0; padding:0;}.profile_img_left{width:160px; border:1px solid #ccc;} body{font-family: "Helvetica Neue",Gotham,  Helvetica, Arial, "sans-serif"; font-size:13px;}.row .col-lg-4{float: left;}.row .col-lg-8{ float: left;padding-left: 25px; width: 500px;}.row{display:flex;line-height:25px;}.dig_number {padding: 0px 18px;float: left;} h4{padding:25px 0px;}.main-heading{padding-bottom:35px; padding-top:15px;} .disable_in_print{display:none;}.top_logo_pring{max-width:250px;}.top_logo_print_page{text-align:center; padding-bottom:10px;}</style><body onload="window.print()">' +
        divToPrint.innerHTML +
        "</body></html>"
    );

    newWin.document.close();

    setTimeout(function () {
      newWin.close();
    }, 10);
  }

  const [priorityData, setpriorityData] = React.useState(null);
  function checkUserSetPriorities() {
    const GTSPData = {
      testId: ls.get("userinfo").testId,
    };
    BaseURL.post("/test/schedule/priorities/get", GTSPData, config)
      .then((res) => {
        setpriorityData(res.data);
        setapiError(false);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 500) {
            setapiError(true);
          }
        }
      });
  }
  React.useEffect(() => {
    if (reloadResponse) {
      setTimeout(() => {
        setreloadResponse(false);
        checkUserSetPriorities();
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadResponse]);

  useEffect(() => {
    checkUserSetPriorities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { alternateCityName, cityName, shift } = priorityData
    ? priorityData
    : "";
  const [eachprioritydata, seteachprioritydata] = React.useState(null);
  useEffect(() => {
    if (
      priorityData &&
      alternateCityName !== null &&
      cityName !== null &&
      shift !== null
    ) {
      const eachpriority = priorityData.priorities.map((items) => {
        return items.prefferedTestDate;
      });
      seteachprioritydata(eachpriority);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priorityData]);
  return (
    <React.Fragment>
      <ManageScheduleModal
        UpdateSheduleCallBack={UpdateSheduleCallBack}
        testScheduleId={testScheduleId}
        locationCity={updateSheduleState.locationCity}
      />

      <div className="updateshedule_wrapper w-lg-80 mx-auto py-5">
        <div className="top_heading lightgray-border-bottom white-tx t">
          <h2>
            {/* <img
              onClick={(e) => history.goBack()}
              src={BackArrow}
              className="backarrow_adjustment"
              alt="Go Back Icon"
            /> */}
            Manage Schedule
          </h2>
        </div>
        <div>
          {locationCity === null && locationAddress === null ? (
            ""
          ) : (
            <div
              className="float-right pt-2 top_pring_btn"
              onClick={() => printDiv()}
            >
              <img
                src={require("../../../assets/images/printer_ico.png").default}
                style={{ maxWidth: "22px" }}
                alt="printer ico"
                className="cursor-pointer"
              />
              Print Test Admission Slip
            </div>
          )}
        </div>
        <div className="update_shedule_innerdiv mt-5 pb-3 ">
          {apiError ? (
            <div className="pb-0 pt-3 pb-4  text-center alert_message question_alert_adjustment">
              <div>Something went wrong please try again later.</div>
            </div>
          ) : (
            ""
          )}
          <div className="top_roll_number">
            <h4>{testNamels}</h4>
            <p className=" light-color-para">
              Please Click the Print button to take out print of your Test
              Admission Slip.
            </p>
          </div>
          <div id="print_div">
            <div className="top_logo_print_page d-none">
              <img
                src={
                  require("../../../assets/images/teps+pmc-dark.png").default
                }
                alt="print logo main"
                className="top_logo_pring"
              />
            </div>
            <h3 className="d-none text-center main-heading">
              PMC {testNamels} (TEPS Test Center) Admission Slip
            </h3>
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
            ) : locationCity === null &&
              locationAddress === null &&
              isUserSetPriorities === 1 ? (
              <div>
                <SchedulePending />
                <div className="pt-5">
                  <div className="shedule_fields">
                    <div className="py-2">
                      <p className="p-lrg">
                        <span className="light-color-para pr-1"> City:</span>
                        {priorityData ? cityName : ""}
                      </p>
                    </div>
                  </div>
                  <div className="shedule_fields">
                    <div className="py-2">
                      <p className="p-lrg">
                        <span className="light-color-para pr-1">
                          Alternate City:
                        </span>
                        {priorityData ? alternateCityName : ""}
                      </p>
                    </div>
                  </div>
                  <div className="shedule_fields">
                    <div className="py-2">
                      <p className="p-lrg">
                        <span className="light-color-para pr-1">
                          Selected Session:
                        </span>{" "}
                        {shift}
                      </p>
                    </div>
                  </div>

                  <div className="py-2">
                    <p className="p-lrg">
                      <span className="light-color-para pr-1">
                        1st Priority:{" "}
                      </span>{" "}
                      {eachprioritydata !== null ? eachprioritydata[0] : ""}
                    </p>
                  </div>

                  <div className="py-2">
                    <p className="p-lrg">
                      <span className="light-color-para pr-1">
                        2nd Priority:{" "}
                      </span>{" "}
                      {eachprioritydata !== null ? eachprioritydata[1] : ""}
                    </p>
                  </div>

                  <div className="py-2">
                    <p className="p-lrg">
                      <span className="light-color-para pr-1">
                        3rd Priority:{" "}
                      </span>
                      {eachprioritydata !== null ? eachprioritydata[2] : ""}
                    </p>
                  </div>
                </div>
              </div>
            ) : locationCity === null && locationAddress === null ? (
              <ScheduleNotSetByUserOnTime />
            ) : locationCity !== null && locationAddress !== null ? (
              <div>
                <div className="row pt-3">
                  <div className="col-lg-4 d-none d-lg-block">
                    <div className="profile_img">
                      {lsProfileImg === "noimage" ||
                      lsProfileImg === "image not found" ? (
                        <img
                          src={
                            require("../../../assets/images/profile_avatar_03.jpg")
                              .default
                          }
                          alt="profile img"
                        />
                      ) : (
                        <img
                          className="img-fluid profile_img_left"
                          src={`data:image/jpeg;base64,${lsProfileImg}`}
                          alt=""
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-lg-8">
                    {" "}
                    <div className="shedule_fields">
                      <div className="py-2">
                        <p className="p-lrg mb-0">
                          <span className="light-color-para pr-1">Name: </span>
                          {ls.get("token").name || ""}
                        </p>
                      </div>
                      <div className="py-2">
                        <p className="p-lrg mb-0">
                          <span className="light-color-para pr-1">
                            Father Name:{" "}
                          </span>
                          {ls.get("token").fatherName || ""}
                        </p>
                      </div>
                      <div className="py-2">
                        <p className="p-lrg mb-0">
                          <span className="light-color-para pr-1">
                            Roll Number:{" "}
                          </span>
                          {rollNumber}
                        </p>
                      </div>
                      <div className="py-2">
                        <p className="p-lrg mb-0">
                          <span className="light-color-para pr-1">
                            CNIC/ID:{" "}
                          </span>
                          {userID}
                        </p>
                      </div>
                      <div className="py-2">
                        <p className="p-lrg mb-0">
                          <span className="light-color-para pr-1">
                            Test Name:{" "}
                          </span>
                          {testType}
                        </p>
                      </div>
                      <div className="py-2">
                        <p className="p-lrg mb-0">
                          <span className="light-color-para pr-1">City: </span>
                          {locationCity ? locationCity : "City not avaible"}
                        </p>
                      </div>
                      <div className="py-2">
                        <p className="p-lrg mb-0">
                          <span className="light-color-para pr-1">Date: </span>
                          <span className="text-uppercase">{actualTime}</span>
                        </p>
                      </div>
                      <div className="py-2">
                        <p className="p-lrg mb-0">
                          <span className="light-color-para pr-1">
                            Reporting Time:{" "}
                          </span>
                          {rtTime}
                        </p>
                      </div>
                      <div className="py-2">
                        <p className="p-lrg mb-0">
                          <span className="light-color-para pr-1">
                            Entrance Close Time:{" "}
                          </span>
                          {etCloseTime}
                        </p>
                      </div>
                      <div className="py-2">
                        <p className="p-lrg mb-0">
                          <span className="light-color-para pr-1">
                            Test Start Time:{" "}
                          </span>
                          {tsStarteTime}
                        </p>
                      </div>
                      <div className="py-2">
                        <p className="p-lrg mb-0">
                          <span className="light-color-para pr-1 disable_in_print">
                            Test Center:{" "}
                          </span>
                          <span className="light-color-para pr-1 d-none">
                            TEPS Test Center:{" "}
                          </span>
                          {locationAddress
                            ? locationAddress
                            : "Test center not available"}
                        </p>
                      </div>
                      <div className="info_sec pt-2 light-color-para disable_in_print">
                        {/* This is your test schedule. Click Update Schedule to get a new recommendation. You can update your schedule only one time. */}
                        {changeOnUserRequest === 1 ? (
                          <span>
                            <img
                              src={infoico}
                              alt="ifo ico"
                              className="mr-2 "
                            />
                            {updateScheduleMsg}
                          </span>
                        ) : updateScheduleAllowed === 0 ? (
                          <span>
                            <img
                              src={infoico}
                              alt="ifo ico"
                              className="mr-2 "
                            />
                            {updateScheduleMsg}
                          </span>
                        ) : updateScheduleAllowed === 1 ? (
                          <span>
                            This is your current test schedule. Click update
                            schedule to get a new schedule
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className=" mx-auto ">
                      {updateScheduleAllowed === 1 ? (
                        changeOnUserRequest === 1 ? (
                          ""
                        ) : (
                          <div>
                            <button
                              type="submit"
                              className="btn btn-primary btn-lg d-block w-100 border-radious-10 mt-2"
                              onClick={() => showAvailbleValues()}
                              disabled={
                                changeOnUserRequest === 1 ? true : false
                              }
                            >
                              Update Schedule
                            </button>
                          </div>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                    {updateScheduleAllowed === 1 &&
                    changeOnUserRequest === 0 ? (
                      <div className="primary-color pt-2 primary_color font-20">
                        <img
                          src={infoico}
                          alt="ifo ico"
                          width="20"
                          className="mr-2 "
                        />{" "}
                        You can change your schedule only one time.
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="covid-19-alert mt-5">
              <div className="practice_test_inner">
                <div className="heading">
                  <h4>COVID-19 Instructions:</h4>
                </div>
              </div>

              <div className="instructions_wrapper  mt-3">
                <div className="row m-0  align-items-lg-center">
                  <div className="col-auto p-0">
                    <div className="dig_number">1</div>
                  </div>
                  <div className="col-8 col-md-11 p-0 p-2 pl-3">
                    In compliance with government instructions regarding
                    COVID-19 all candidates should wear Face Masks and maintain
                    social discipline at the test center.
                  </div>
                </div>
                <div className="row m-0 pb-3 align-items-lg-center">
                  <div className="col-auto p-0">
                    <div className="dig_number">2</div>
                  </div>
                  <div className="col-8 col-md-11 p-0 p-2 pl-3">
                    As per government instructions, candidates having
                    Coronavirus symptoms like Fever, Flu, Cough, Diarrhea, etc.
                    are advised not to come to the test centers.
                  </div>
                </div>
              </div>

              <div className="practice_test_inner">
                <div className="heading">
                  <h4>Note (Warning):</h4>
                </div>
              </div>
              <div className="instructions_wrapper  mt-3">
                <div className="row m-0  pb-3 align-items-lg-center">
                  <div className="col-auto p-0">
                    <div className="dig_number">1</div>
                  </div>
                  <div className="col-8 col-md-11 p-0 pl-3">
                    You are advised to bring this TEST ADMISSION SLIP along with
                    your Original National ID Card/ Smart Card/Juvenile Card/
                    NICOP or Passport.
                  </div>
                </div>
                <div className="row m-0  pb-3 align-items-lg-center">
                  <div className="col-auto p-0">
                    <div className="dig_number">2</div>
                  </div>
                  <div className="col-8 col-md-11 p-0 pl-3">
                    ORIGINAL B forms will be accepted as a special provision
                    along with the father's ORIGINAL CNIC and ORIGINAL
                    matriculation or intermediate mark sheet with photo ID.
                  </div>
                </div>

                <div className="row m-0  pb-3 align-items-lg-center">
                  <div className="col-auto p-0">
                    <div className="dig_number">3</div>
                  </div>
                  <div className="col-8 col-md-11 p-0 pl-3">
                    Mobile Phone, Calculators, Cameras, Smart watches, (Any
                    Other Electronic Device), Pen, Pencils (any Stationery
                    items), Jewellery items, Handbags or other Contraband items
                    (as per law) are not allowed in the test center premises.
                  </div>
                </div>
                <div className="row m-0  pb-3  align-items-lg-center">
                  <div className="col-auto p-0">
                    <div className="dig_number">4</div>
                  </div>
                  <div className="col-8 col-md-11 p-0 pl-3">
                    Please don't bring any of gadget with you. Candidates shall
                    be searched, if found it will be confiscated and paper will
                    be cancelled.
                  </div>
                </div>
                <div className="row m-0 pb-3  align-items-lg-center">
                  <div className="col-auto p-0">
                    <div className="dig_number">5</div>
                  </div>
                  <div className="col-8 col-md-11 p-0 pl-3">
                    No candidate will be allowed to enter the examination hall
                    after 30 minutes of reporting time of test.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ManageSchedule;
