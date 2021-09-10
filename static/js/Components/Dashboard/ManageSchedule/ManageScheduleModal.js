import React from "react";
import "./ManageSchedule.scss";

//import { format } from "date-fns";
import shedulecityico from "../../../assets/images/shedule_city_ico.svg";
import sheduledateico from "../../../assets/images/shedule_date_ico.svg";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import $ from "jquery";
import { ToastContainer, toast } from "react-toastify";
import FormikFieldWrap from "../../../CommonUniversal/FormikFieldWrap/FormikFieldWrap";
import ModalPopupBootstrap from "../../../CommonUniversal/ModalPopup/ModalPopupBootstrap";
import BaseURL from "../../../CommonUniversal/api";
import ReactLoading from "react-loading";
import moment from "moment";

import Checkbox from "@material-ui/core/Checkbox";

const UpdateSheduleModal = ({ UpdateSheduleCallBack }) => {
  var ls = require("local-storage");

  const config = {
    headers: { Authorization: `Bearer ${ls.get("token").accessToken}` },
    key: "Authorization",
  };

  const notify = () => toast.dark("Schedule updated successfully");

  const [userLocation, setuserLocation] = React.useState();
  const [changeSheduleState, setchangeSheduleState] = React.useState();
  const { testStartTime, testScheduleId } = changeSheduleState || "";
  const [availableSheduleValues, setavailableSheduleValues] = React.useState(
    "Available date & time will appear here"
  );
  const [apiError, setapiError] = React.useState(false);

  React.useEffect(() => {
    const roundFigureTimeStamp = testStartTime;

    if (userLocation) {
      if (roundFigureTimeStamp) {
        const date = new Date(roundFigureTimeStamp);
        const TSStartTime = moment
          .utc(date)
          .format("DD MMM YYYY, h:mm A")
          .toUpperCase();
        setavailableSheduleValues(TSStartTime);
      }
    }
    if (userLocation === "" || userLocation === undefined) {
      setavailableSheduleValues("Available date & time will appear here");
    } else if (roundFigureTimeStamp === null) {
      setavailableSheduleValues(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, changeSheduleState]);

  const [changeScheduleLoading, setchangeScheduleLoading] =
    React.useState(false);

  function changeShedule() {
    setchangeScheduleLoading(true);
    const ChangeScheduleData = {
      testId: ls.get("userinfo").testId,
      cityName: userLocation,
    };
    BaseURL.post("/test/changeschedule", ChangeScheduleData, config)
      .then((res) => {
        setchangeSheduleState(res.data);
        setapiResponseErro(res.data.message);
        setchangeScheduleLoading(false);
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
    if (userLocation) {
      changeShedule();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation]);

  const [responseSendingLoader, setresponseSendingLoader] =
    React.useState(false);

  const [allSeatsAccopied, setallSeatsAccopied] = React.useState();

  function newDateAccepted() {
    setresponseSendingLoader(true);
    const OrderNewDatesData = {
      testId: ls.get("userinfo").testId,
      testOrderId: ls.get("userinfo").testOrderId,
      testScheduleId: testScheduleId,
    };
    BaseURL.post("/test/order", OrderNewDatesData, config)
      .then((res) => {
        if (res.data.message) {
          setallSeatsAccopied(res.data.message);
        } else {
          setresponseSendingLoader(false);
          UpdateSheduleCallBack();
          notify();
          $("#UpdateShedule_modal").modal("hide");
          $("#areyousure").modal("hide");
          setapiError(false);
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data.status === 500) {
            setapiError(true);
          }
        }
      });
  }

  // Get all Cities

  const [citiesandDates, setcitiesandDates] = React.useState();
  const { cities } = citiesandDates || {}; // Object destructring and get cites and cites dates
  const [getallcitesnames, setgetallcitesnames] = React.useState([]);
  React.useEffect(() => {
    if (citiesandDates) {
      const getcitiesnames = cities.map((value) => {
        return { name: value.cityName };
      });

      setgetallcitesnames(getcitiesnames);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citiesandDates]);
  const [apiResponseErro, setapiResponseErro] = React.useState();
  const getdatashedulepriority = () => {
    const citesdatesdata = {
      testId: ls.get("userinfo").testId,
    };
    BaseURL.post("/test/availablecities", citesdatesdata, config)
      .then((res) => {
        setcitiesandDates(res.data);
        setapiError(false);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 500) {
            setapiError(true);
          }
        }
      });
  };

  React.useEffect(() => {
    getdatashedulepriority();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Get all Cities Ended
  const [handleCheckBox, sethandleCheckBox] = React.useState(false);
  function handleCheckBoxfun() {
    if (handleCheckBox === false) {
      sethandleCheckBox(true);
    } else {
      sethandleCheckBox(false);
    }
  }

  function showAreyouSure() {
    $("#areyousure").modal("show");
    $("#UpdateShedule_modal").modal("hide");
  }
  function updateScheduleShow() {
    $("#areyousure").modal("hide");
    $("#UpdateShedule_modal").modal("show");
  }

  React.useEffect(() => {
    if (allSeatsAccopied) {
      $("#areyousure").modal("hide");
      $("#sheduleupdateerror").modal("show");
    }
  }, [allSeatsAccopied]);
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* are you sure popup */}
      <ModalPopupBootstrap
        themeMode="offwhite"
        modalID="areyousure"
        closebtn={false}
      >
        <div className="are_you_sure_wraper mt-1 pb-3">
          <div className="top_heading text-center pb-3 pb-3 text-uppercase semi-bold">
            Are you Sure?
          </div>
          <div className=" semi-bold">
            Are you sure you want to update your schedule? If you update your
            schedule, you will lose your current slot and be assigned the
            schedule you just accepted.
          </div>

          <div className="checkbox py-3 pb-5 primary_color  semi-bold">
            <label>
              {/* <input
                type="checkbox"
                checked={handleCheckBox}
                onChange={() => handleCheckBoxfun()}
                className="checkboxAdj"
              />{" "} */}
              <Checkbox
                checked={handleCheckBox}
                onChange={() => handleCheckBoxfun()}
                inputProps={{ "aria-label": "primary checkbox" }}
                labelstyle={{ color: "#d18075" }}
                iconstyle={{ fill: "#d18075" }}
                inputstyle={{ color: "#d18075" }}
                style={{ color: "#d18075", marginTop: "-5px" }}
              />
              YES, change my schedule
            </label>
          </div>
          <div className="urdu_alert pb-3 mr-auto ">
            <img
              src={require("../../../assets/images/urdu_alert.png").default}
              alt="urdu alert"
              className="w-100 ml-auto urdu-img-adjustment d-block"
            />
          </div>
          <div className="text-center semi-bold pb-3 alert_message font-14 px-4"></div>
          <div className="row m-0 justify-content-md-center">
            <div className="col-6 col-md-5 pb-2 p-0 px-2">
              <button
                type="reset"
                className="btn btn-primary btn-bordered-only btn-lg d-block  w-100 border-radious-10 p-3 small-font-16"
                data-dismiss="modal"
              >
                Cancel
              </button>
            </div>
            <div className="col-6 col-md-5 pb-2 p-0 px-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg d-block  w-100 border-radious-10 p-3 small-font-16"
                disabled={handleCheckBox === false ? true : false}
                onClick={() => newDateAccepted()}
              >
                {responseSendingLoader ? (
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
                  " UPDATE NOW"
                )}
              </button>
            </div>
          </div>
        </div>
      </ModalPopupBootstrap>

      {/* shedule update error*/}
      <ModalPopupBootstrap
        themeMode="offwhite"
        modalID="sheduleupdateerror"
        closebtn={false}
      >
        <div className="shedule_udpate_error mt-1 pb-3">
          <div className="top_heading text-center pb-3 pb-3 text-uppercase semi-bold">
            schedule update ERROR
          </div>
          <div className=" pb-4">{allSeatsAccopied}</div>

          <div className="row m-0 justify-content-md-center">
            <div className="col-6 col-md-5 pb-2 p-0 px-2">
              <button
                type="reset"
                className="btn btn-primary btn-bordered-only btn-lg d-block  w-100 border-radious-10 p-3 small-font-16"
                data-dismiss="modal"
              >
                Cancel
              </button>
            </div>
            <div className="col-6 col-md-5 pb-2 p-0 px-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg d-block  w-100 border-radious-10 p-3 small-font-16"
                onClick={() => updateScheduleShow()}
              >
                TRY AGAIN
              </button>
            </div>
          </div>
        </div>
      </ModalPopupBootstrap>

      {/* main shedule modle*/}
      <ModalPopupBootstrap themeMode="offwhite" modalID="UpdateShedule_modal">
        <div className="update_shedule_innerdiv mt-1 pb-3">
          <div className="top_heading text-center pb-3 pb-3 mt-minus-35 text-uppercase">
            Available schedule
          </div>
          {apiError ? (
            <div className="pb-0 pt-3 pb-4  text-center alert_message question_alert_adjustment">
              <div>Something went wrong please try again later.</div>
            </div>
          ) : (
            ""
          )}
          <div className="shedule_fields">
            <div className="row m-0 ">
              <div className="col-md-12 col-lg-4 col-xl-4 align-self-center">
                Selected City
              </div>
              <div className="col-md-12 col-lg-8 col-xl-8">
                <div className="input_field_wrapper_margin_left_45">
                  <FormikFieldWrap
                    icon={shedulecityico}
                    darkmode={false}
                    lock={false}
                  >
                    <Autocomplete
                      id="auto-complete-3"
                      options={getallcitesnames}
                      onChange={(e, value) =>
                        setuserLocation(value !== null ? value.name : "")
                      }
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select test center"
                        />
                      )}
                    />
                  </FormikFieldWrap>
                </div>
              </div>
            </div>
            <div className="row m-0 ">
              <div className="col-md-12 col-lg-4 col-xl-4 align-self-center">
                Available Date
              </div>
              <div className="col-md-12 col-lg-8 col-xl-8">
                <div className="input_field_wrapper_margin_left_45">
                  <FormikFieldWrap
                    icon={sheduledateico}
                    darkmode={false}
                    lock={true}
                  >
                    <input
                      type="text"
                      name="name"
                      className="transparent_fields"
                      value={
                        changeScheduleLoading
                          ? "Loading..."
                          : availableSheduleValues === 0
                          ? "No seat available."
                          : availableSheduleValues
                      }
                      disabled={true}
                    />
                  </FormikFieldWrap>
                </div>
              </div>
            </div>
            <div className="text-right alert_message font-14 px-4">
              {" "}
              {apiResponseErro}
            </div>
          </div>
        </div>
        <div className="pt-1 pb-3">
          <div className="row m-0 justify-content-md-center">
            <div className="col-md-5 pb-2 p-0 px-2">
              <button
                type="submit"
                className="btn btn-primary btn-bordered-only btn-lg d-block  w-100 border-radious-10 p-3 small-font-16"
                data-dismiss="modal"
              >
                Reject
              </button>
            </div>
            <div className="col-md-5 pb-2 p-0 px-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg d-block  w-100 border-radious-10 p-3 small-font-16"
                disabled={!userLocation || availableSheduleValues === 0}
                onClick={() => showAreyouSure()}
              >
                Accept & Update
              </button>
            </div>
          </div>
        </div>
      </ModalPopupBootstrap>
    </>
  );
};
export default UpdateSheduleModal;
