import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import $ from "jquery";
import "./Login.scss";
import loginico from "../../assets/images/login_ico.svg";
import rollnumberico from "../../assets/images/rollnumber-ico.svg";
import BaseURL from "../../CommonUniversal/api";
import ReactLoading from "react-loading";
import rollnumbericotwo from "../../assets/images/rollnumber_ico.svg";
import passwordico from "../../assets/images/password_ico.svg";
//import rollnumberico from "../../assets/images/rollnumber-ico.svg";
import FormikFieldWrap from "../../CommonUniversal/FormikFieldWrap/FormikFieldWrap";
import LoginFormBody from "./Body/LoginFormBody";
import ModalPopupBootstrap from "../../CommonUniversal/ModalPopup/ModalPopupBootstrap";
import { useHistory } from "react-router-dom";

const LoginForm = ({ usertype }) => {
  let history = useHistory();
  var ls = require("local-storage");
  React.useEffect(() => {
    history.push("/login?user=pmc");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //Provide token from local storage to api Header Authorization
  const [authToken, setauthToken] = useState({
    tokenID: null,
    isValidated: null,
  });

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");

  //For login
  const [logingValues, setlogingValues] = useState({
    userName: "",
    password: "",
  });
  const { userName, password } = logingValues;
  const [fullAuthInfo, setfullAuthInfo] = useState(); //- just created.

  // store user credentials in localstorage and when ever user will access his account token will be refresh from server
  const [storeusercredentials, setstoreusercredentials] = useState({
    username: "",
    password: "",
  });
  useEffect(() => {
    ls.set("userCredentials", storeusercredentials);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeusercredentials]);

  useEffect(() => {
    if (logingValues.userName) {
      setLoading(true);
      setIsError("");
      const data = {
        userName: userName.toLowerCase(),
        password: password,
      };
      BaseURL.post("/auth/signin", data)
        .then((res) => {
          //ls("token", res.data);//- just hidden.
          setfullAuthInfo(res.data);
          // Teps login will be active from here
          //if (usertype !== "pmc") {
          //   setLoading(false);
          // }
          setauthToken({
            ...authToken,
            tokenID: res.data.accessToken,
            isValidated: res.data.isValidated,
          });
          setstoreusercredentials({
            ...storeusercredentials,
            username: userName,
            password: password,
          });
          // eslint-disable-next-line react-hooks/exhaustive-deps
          if (res.data.isValidated === 1) {
            if (usertype !== "pmc") {
              //$("#rollNumberModal").modal("show"); // Teps Login will be active from here
              // resetRollNumberField();// Teps Login will be active from here
            }
          }
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.data.responseCode === 1002) {
              $("#usernameIncorrectPopup").modal("show");
            }
            if (err.response.data.responseCode === 1001) {
              setIsError("INCORRECT PASSWORD. TRY AGAIN OR RESET");
            }
          }
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logingValues]);

  const handleSubmit = (values, { setSubmitting }) => {
    setlogingValues("");
    setLoading(true);
    setSubmitting(false);
    setlogingValues(values);
  };

  const loginSchemaTeps = Yup.object().shape({
    userName: Yup.string().email("INVALID EMAIL ADDRESS").required(""),
    //password: Yup.string().min(5, "Too Short!").max(60, "Too Long!"),
    password: Yup.string().required(""),
  });

  //For roll number funtionality/////////////////////////////////////////

  const [LoadingRollNo, setLoadingRollNo] = useState(false);
  const [rollNoResponse, setrollNoResponse] = useState(null);
  const [IsErrorRollno, setIsErrorRollno] = useState(false);
  const [IsErrorRollnoPMC, setIsErrorRollnoPMC] = useState(false);
  const [rollNo, setrollNo] = useState({});

  useEffect(() => {
    if (rollNoResponse !== null) {
      if (rollNoResponse.validated === 1) {
        ls.set("isValidate", true);
        usertestinfo();
      } else {
        setIsErrorRollno(true);
        setLoadingRollNo(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollNoResponse]);
  // eslint-disable-next-line
  const config = {
    headers: { Authorization: `Bearer ${authToken.tokenID}` },
    key: "Authorization",
  };

  const VerifyRollNo = () => {
    // Teps login will active from here
    // const data = {
    //   rollNo: rollNo.rollnumber,
    // };
    const data2 = {
      rollNo: rollnumberpmc,
    };
    BaseURL.post("/users/validaterollnumber", data2, config)
      .then((res) => {
        setrollNoResponse(res.data);

        //if (usertype === "pmc") {
        if (res.data.validated === 0) {
          setIsErrorRollnoPMC(true);
          setLoading(false);
        } else {
          ls("token", fullAuthInfo);
        }
        // }
      })
      .catch((err) => {
        setLoadingRollNo(false);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (rollNo.rollnumber) {
      VerifyRollNo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollNo]);
  const handleSubmitRollNo = (values, { setSubmitting }) => {
    setrollNo("");
    setLoadingRollNo(true);
    setSubmitting(false);
    setrollNo(values);
  };
  const loginSchemaRollno = Yup.object().shape({
    rollnumber: Yup.string()
      .min(2, "ROLL NUMBER IS REQUIRED")
      .max(9, "ROLL NUMBER IS TOO LONG")
      .required(""),
  });

  //------------For pmc user----------//
  const [rollnumberpmc, setrollnumberpmc] = useState("");

  function handleChange(e) {
    setrollnumberpmc(e.target.value);
  }
  useEffect(() => {
    // Teps login will active from here
    // if (usertype === "pmc" && rollnumberpmc) {
    //   VerifyRollNo();
    // }
    if (rollnumberpmc) {
      VerifyRollNo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);
  //------------For pmc user ended----------//

  //----------------get user info----------------//
  const usertestinfo = () => {
    BaseURL.get("/test/info", config)
      .then((res) => {
        ls.set("userinfo", res.data);
        // checkUserSetShedule();
        history.push("/home");
      })
      .catch((err) => {});
  };
  // This  Code will enable user to set schedule on login if schedule is not set.
  //const sheduleexist = ls.get("sheduledate")? ls.get("sheduledate").datesheduled: "";
  // function checkUserSetShedule() {
  //   setLoadingRollNo(true);
  //   const GTSPData = {
  //     testId: ls.get("userinfo").testId,
  //   };
  //   BaseURL.post("/test/schedule/priorities/get", GTSPData, config)
  //     .then((res) => {
  //       setLoadingRollNo(false);
  //       $("#rollNumberModal").modal("hide");
  //       if (usertype === "pmc") {
  //         ls.set("isPMCUser", true);
  //       } else {
  //         ls.remove("isPMCUser");
  //       }
  //       if (res.data.cityName === null) {
  //         if (usertype === "pmc" && sheduleexist !== true) {
  //           ls.set("sheduledate", {
  //             ifpmcuser: true,
  //             datesheduled: false,
  //             firstTimeSchedule: true,
  //           });
  //         }
  //         if (usertype !== "pmc" && sheduleexist !== true) {
  //           ls.set("sheduledate", {
  //             ifpmcuser: true,
  //             datesheduled: false,
  //             firstTimeSchedule: true,
  //           });
  //         }
  //         history.push("/home/sheduletestdatetime");
  //       } else {
  //         ls.set("sheduledate", {
  //           ifpmcuser: true,
  //           datesheduled: false,
  //           firstTimeSchedule: false,
  //         });
  //         history.push("/home");
  //       }
  //     })
  //     .catch((err) => {});
  // }
  const formikRef = React.useRef();
  // Teps login will active from here
  // function resetRollNumberField() {
  //   formikRef.current.setFieldValue("rollnumber", "");
  //   setIsErrorRollno(false);

  //   setTimeout(function () {
  //     document.getElementById("rollnumberField").focus();
  //   }, 600);
  // }
  //$("#usernameIncorrectPopup").modal("show");

  const [dateFromTimeZone] = useState(25);

  // React.useEffect(() => {
  //   var d = new Date();
  //   var utc = d.getTime() + d.getTimezoneOffset() * 60000;
  //   var date = new Date(utc + 3600000 * +5);
  //   var currentDate = date.getDate();
  //   setdateFromTimeZone(currentDate - 1);
  // }, []);

  return (
    <>
      <ModalPopupBootstrap
        themeMode={"offwhite"}
        modalID={"usernameIncorrectPopup"}
        closebtn={true}
      >
        <>
          <div className="modal_wrongemail">
            <div className="top_heading text-center pb-3 text-uppercase pt-4 mt-minus-50 semi-bold">
              EMAIL NOT FOUND
            </div>
            <p className="text-center px-lg-5 pb-3">
              Your email address is not available in TEPS right now. If you have
              completed your registration and payment has cleared by{" "}
              <span className="semi-bold">{dateFromTimeZone} July</span> ,
              please share your issue with us on{" "}
              <a
                href="https://www.facebook.com/groups/2937183139849587"
                target="_blank"
                rel="noreferrer"
                className="semi-bold"
              >
                Facebook Support Group
              </a>
              .
              <br />
              <br />
              If you have paid on the PMC website on{" "}
              <span className="semi-bold">{dateFromTimeZone} July</span> or
              after, please wait another{" "}
              <span className="semi-bold">48 hrs</span> , so we can set up your
              account for scheduling.
              <br />
              <br />
              <span className="semi-bold">
                Note: (Bank Challans take four or more days to get to paid
                status).
              </span>
            </p>
          </div>
        </>
      </ModalPopupBootstrap>

      <ModalPopupBootstrap
        themeMode={"offwhite"}
        modalID={"rollNumberModal"}
        closebtn={false}
      >
        <Formik
          innerRef={formikRef}
          initialValues={rollNo}
          validationSchema={loginSchemaRollno}
          onSubmit={handleSubmitRollNo}
        >
          {({ dirty, isValid, setFieldValue }) => (
            <Form>
              <div className="update_shedule_innerdiv mt-1">
                <div className="top_heading text-center pb-3 text-uppercase pt-4">
                  Verify your roll number
                </div>

                <p className="text-center">
                  Please enter your roll number for verification
                </p>
                <div className="shedule_fields">
                  <div className="row m-0 ">
                    <div className="col-lg-10 mx-auto">
                      <FormikFieldWrap
                        darkmode={false}
                        lock={false}
                        icon={rollnumbericotwo}
                      >
                        <Field
                          type="text"
                          name="rollnumber"
                          label="rollnumber"
                          className="transparent_fields w-100 h-100 "
                          placeholder="Enter your roll number *"
                          id="rollnumberField"
                        />

                        {IsErrorRollno ? (
                          ""
                        ) : (
                          <ErrorMessage
                            name="rollnumber"
                            component="div"
                            className="alert_message pt-3"
                            role="alert"
                          />
                        )}
                      </FormikFieldWrap>
                      <div
                        role="alert"
                        className={`alert_message  text-right mt-0 rollnumber_error_adjustment   ${
                          IsErrorRollno ? "d-block" : "d-none"
                        }`}
                      >
                        INCORRECT ROLL NUMBER
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-1 pb-3">
                <div className="row m-0 justify-content-md-center">
                  <div className="col-6 col-md-5 pb-2 p-0 px-2">
                    <button
                      type="reset"
                      className="btn btn-primary btn-bordered-only btn-lg d-block  w-100 border-radious-10 p-3 small-font-16"
                      data-dismiss="modal"
                      onClick={() => setFieldValue("rollnumber", "")}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="col-6 col-md-5 pb-2 p-0 px-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg d-block  w-100 border-radious-10 p-3 small-font-16"
                      disabled={!dirty || !isValid}
                    >
                      {LoadingRollNo ? (
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
                        "Verify & Login"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </ModalPopupBootstrap>
      <LoginFormBody usertype={usertype}>
        <Formik
          initialValues={logingValues}
          validationSchema={loginSchemaTeps}
          onSubmit={handleSubmit}
        >
          {({ dirty, isValid }) => (
            <Form>
              <FormikFieldWrap icon={loginico} darkmode={false}>
                <Field
                  type="email"
                  name="userName"
                  label="userName"
                  className="transparent_fields w-100 h-100"
                  placeholder="Enter your email address *"
                  autoFocus={true}
                />
                <ErrorMessage
                  name="userName"
                  component="div"
                  className="alert_message pt-3"
                  role="alert"
                />
              </FormikFieldWrap>
              <FormikFieldWrap
                icon={rollnumberico}
                darkmode={false}
                className="mb-2"
              >
                <Field
                  type="number"
                  id="rollNumber"
                  placeholder="Enter digits of roll number*"
                  className="transparent_fields w-100 h-100 "
                  value={rollnumberpmc}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />

                <div
                  className={`alert_message text-right pt-3 ${
                    IsErrorRollnoPMC ? "d-block" : "d-none"
                  }`}
                >
                  INCORRECT ROLL NUMBER
                </div>
              </FormikFieldWrap>
              {/* {usertype === "pmc" ? (
                <FormikFieldWrap
                  icon={rollnumberico}
                  darkmode={false}
                  className="mb-2"
                >
                  <Field
                    type="number"
                    placeholder="Enter digits of roll number*"
                    className="transparent_fields w-100 h-100 "
                    value={rollnumberpmc}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />

                  <div
                    className={`alert_message text-right pt-3 ${
                      IsErrorRollnoPMC ? "d-block" : "d-none"
                    }`}
                  >
                    INCORRECT ROLL NUMBER
                  </div>
                </FormikFieldWrap>
              ) : (
                ""
              )} */}
              <FormikFieldWrap icon={passwordico} darkmode={false}>
                <Field
                  type="password"
                  name="password"
                  label="password"
                  className="transparent_fields w-100 h-100"
                  placeholder="Enter your password *"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="alert_message pt-3"
                  role="alert"
                />
              </FormikFieldWrap>
              <div
                role="alert"
                className={`alert_message  text-right mt-0 pr-3 mt-top-minus-33 password_error ${
                  isError === "" ? "d-none" : "d-block"
                }`}
              >
                {isError}
              </div>
              <div className="pt-lg-4 pt-lg-4 pb-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg d-block  w-100 border-radious-10 p-3 small-font-16 text-center"
                  disabled={!dirty || !isValid || rollnumberpmc === ""}
                >
                  {loading ? (
                    <span className="inline-block">
                      <ReactLoading
                        type={"spin"}
                        color={"#fff"}
                        height={"20px"}
                        width={"20px"}
                      />
                    </span>
                  ) : (
                    "Log In"
                  )}
                </button>

                <div className="text-center pt-3 footer_contact_info">
                  <div className="pb-3">Forgot your password?</div>
                  <a
                    href="https://mdcat.pmc.gov.pk/Account/ForgotPassword"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    MDCAT Password Reset
                  </a>{" "}
                  ||{" "}
                  <a
                    href="https://nle.pmc.gov.pk/Account/ForgotPassword"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    NLE Password reset
                  </a>
                </div>
                <div className="pt-5 pt-lg-4">
                  <div className="text-center pt-lg-5 footer_contact_info">
                    For quick support, please join our{" "}
                    <a
                      href="https://www.facebook.com/groups/2937183139849587"
                      target="_blank"
                      rel="noreferrer"
                      className="semi-bold"
                    >
                      TEPS Facebook Support Group
                    </a>
                    .
                    <br />
                    <br />
                    <div className="text-center ">
                      <span className="semi-bold">U A N helpline: </span>
                      <a href="tel:+923311006191">+923311006191</a>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </LoginFormBody>
    </>
  );
};
export default LoginForm;
