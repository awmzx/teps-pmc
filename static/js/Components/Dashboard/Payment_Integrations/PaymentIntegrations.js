/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import BackArrow from "../../../assets/images/back_arrow.svg";
import CellPhone from "../../../assets/images/cellphone.svg";
import "./PaymentIntegrations.scss";
import EasyPaisa from "./EasyPaisa/EasyPaisa";
import FormikFieldWrap from "../../../CommonUniversal/FormikFieldWrap/FormikFieldWrap";
import Stripe from "./Stripe/Stripe";

import { useHistory, useLocation } from "react-router-dom";
import $ from "jquery";
import ModalPopupBootstrap from "../../../CommonUniversal/ModalPopup/ModalPopupBootstrap";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
export default function PaymentIntegrations() {
  let query = useQuery();
  const location = useLocation();
  const history = useHistory();
  var ls = require("local-storage");
  const bundleName = location.state?.bundleName || "";
  const bundleID = location.state?.bundleID || "";
  const bundleQuantity = location.state?.bundleQuantity || "";
  const countryStatus = ls.get("token").examCenter || "";
  //const ODRN = query.get("orderRefNumber") || "";
  const STATUS = query.get("status") || "";
  //const PAYMETHOD = query.get("paymentMethod") || "";

  const [payNow, setPayNow] = React.useState(false);

  const [tokenStatus, settokenStatus] = React.useState(false);
  //const [postIntiateStatus, setpostIntiateStatus] = React.useState(false);
  const [userorderID, setuserorderID] = React.useState();
  React.useEffect(() => {
    if (!bundleID && !STATUS) {
      history.push("/home/practicetest");
    }
    if (STATUS === "0000") {
      settokenStatus(true);
    }
    if (STATUS) {
      if (STATUS !== "0000") {
        history.push("/home/practicetest");
      }
    }
    var date = new Date(); // some mock date
    var milliseconds = date.getTime();
    setuserorderID(milliseconds);
    // console.log(userorderID);
  }, []);

  function SucessMessage() {
    return <div>This is sucess message for token sent to user</div>;
  }
  const [phoneNumberValue, setphoneNumberValue] = React.useState();

  const SignupSchema = Yup.object().shape({
    phonenumber: Yup.string()
      .min(10, "Please enter correct mobile number.")
      .max(10, "Enter your mobile number without country code")
      .required("Required"),
  });
  // function removeIframe() {
  //   setPayNow(false);
  //   setpostIntiateStatus(false);
  // }
  function showPaymentModePopup() {
    $("#selectpaymentmode").modal("show");
  }
  const [paymentmode, setpaymentmode] = React.useState();
  React.useEffect(() => {
    if (paymentmode) {
      setPayNow(true);
      $("#selectpaymentmode").modal("hide");
    }
  }, [paymentmode]);
  return (
    <>
      <ModalPopupBootstrap
        themeMode={"offwhite"}
        modalID={"selectpaymentmode"}
        closebtn={true}
      >
        <>
          <div className="modal_wrongemail">
            <div className="top_heading text-center pb-3 text-uppercase pt-4 semi-bold mt-minus-50">
              <h4 className="mb-4">
                {" "}
                <img
                  src={
                    require("../../../assets/images/easypaisacard.png").default
                  }
                  width="40"
                  alt="easy pay ico"
                  className="mr-2"
                />{" "}
                Pay via EasyPaisa or Debit/Credit Card
              </h4>
            </div>
            <div className="text-center pb-4">
              <p>Please select payment method from below options.</p>
              {/* <div
                className="paymentButton"
                onClick={() => setpaymentmode("OTC_PAYMENT_METHOD")}
              >
                <img
                  src={
                    require("../../../assets/images/easypay_ico.png").default
                  }
                  width="40"
                  alt="easy pay ico"
                  className="mr-2"
                />
                Pay via Easypaisa Shop
              </div> */}
              <div
                className="paymentButton"
                onClick={() => setpaymentmode("MA_PAYMENT_METHOD")}
              >
                <img
                  src={
                    require("../../../assets/images/easypay_ico.png").default
                  }
                  width="40"
                  alt="easy pay ico"
                  className="mr-2"
                />
                Pay via Easypaisa Mobile Account
              </div>
              <div
                className="paymentButton"
                onClick={() => setpaymentmode("CC_PAYMENT_METHOD")}
              >
                <img
                  src={
                    require("../../../assets/images/easypay_ico.png").default
                  }
                  width="40"
                  alt="easy pay ico"
                  className="mr-2"
                />
                Pay via Debit/Credit Card
              </div>
            </div>
          </div>
        </>
      </ModalPopupBootstrap>
      <div className="integrations_wrapper w-lg-80 mx-auto py-5 ">
        <div className="top_heading lightgray-border-bottom white-tx t">
          <h2>
            <img
              src={BackArrow}
              className="backarrow_adjustment"
              alt="Go Back Icon"
              onClick={(e) => history.push("/home/purchasebundles")}
            />

            {bundleName ? bundleName : ""}
          </h2>
        </div>

        {tokenStatus ? (
          <SucessMessage />
        ) : countryStatus === "Intl" ? (
          <div className="accordion mt-5" id="paymentAccordion">
            <div className="card ">
              <div>
                <h2 className="mb-2 ">
                  {" "}
                  <img
                    src={
                      require("../../../assets/images/stripe_ico.png").default
                    }
                    width="30"
                    alt="easy pay ico"
                  />{" "}
                  Pay via Stripe
                </h2>
                <div className="col-12  pb-2 p-0 px-2 pl-lg-4 ml-lg-3  ">
                  <span className="gray-txt">
                    {" "}
                    It only takes 30 seconds to purchase a Practice Test bundle
                    of 6 practice tests!
                  </span>
                  <div className="steps mt-5">
                    <div className="steps_row">
                      <div className="number">1</div> Enter your billing
                      information
                    </div>
                  </div>

                  <div className="gray_line"></div>
                  <div className="steps">
                    <div className="steps_row">
                      <div className="number">2</div> Enter your card
                      information
                    </div>
                  </div>

                  <div className="gray_line"></div>
                  <div className="steps mb-5">
                    <div className="steps_row">
                      <div className="number">3</div> Pay {"&"} start your new
                      practice test
                    </div>
                  </div>
                  <div className="steps_row">
                    Click the below button to get started.{" "}
                    <img
                      src={
                        require("../../../assets/images/getstarted_ico.png")
                          .default
                      }
                      width="40"
                      alt="easy pay ico"
                      className="ml-2"
                    />{" "}
                  </div>
                  <div className="col-md-7 p-0">
                    <Stripe
                      bundleName={bundleName}
                      bundleID={bundleID}
                      bundleQuantity={bundleQuantity}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="accordion mt-5" id="paymentAccordion">
            <div className="card ">
              <div>
                <h4 className="mb-4">
                  {" "}
                  <img
                    src={
                      require("../../../assets/images/easypaisacard.png")
                        .default
                    }
                    width="40"
                    alt="easy pay ico"
                    className="mr-2"
                  />{" "}
                  Pay via EasyPaisa
                </h4>
                {payNow === false ? (
                  <>
                    <div className="col-12  pb-2 p-0 px-2 pl-lg-5 ml-lg-1 ">
                      <span className="gray-txt">
                        {" "}
                        It only takes 30 seconds to purchase a Practice Test
                        bundle of 6 practice tests!
                      </span>
                      <div className="steps mt-5">
                        <div className="steps_row">
                          <div className="number">1</div> Enter your mobile
                          phone number
                        </div>
                      </div>

                      <div className="gray_line"></div>
                      <div className="steps">
                        <div className="steps_row">
                          <div className="number">2</div> Select your payment
                          method
                        </div>
                      </div>

                      <div className="gray_line"></div>
                      <div className="steps mb-5">
                        <div className="steps_row">
                          <div className="number">3</div> Start your new
                          practice test
                        </div>
                      </div>
                      <div className="steps_row">
                        Enter your phone number to get started!{" "}
                        <img
                          src={
                            require("../../../assets/images/getstarted_ico.png")
                              .default
                          }
                          width="40"
                          height="40"
                          alt="easy pay ico"
                          className="ml-2"
                        />{" "}
                      </div>
                      <div className="col-md-7 p-0">
                        <Formik
                          initialValues={{
                            phonenumber: "",
                          }}
                          validationSchema={SignupSchema}
                          onSubmit={(values) => {
                            // same shape as initial values
                            setphoneNumberValue("0" + values.phonenumber);
                            //setPayNow(true);
                            showPaymentModePopup();
                          }}
                        >
                          {({ errors, touched, dirty, isValid }) => (
                            <Form>
                              <FormikFieldWrap
                                icon={CellPhone}
                                darkmode={true}
                                className="mb-2"
                              >
                                <Field
                                  name="phonenumber"
                                  type="number"
                                  id="phonenumber"
                                  placeholder="Enter your phone number* e.g. 03101234567"
                                  className="transparent_fields w-100 h-100 "
                                  onWheel={(e) => e.target.blur()}
                                />
                                {errors.phonenumber && touched.phonenumber ? (
                                  <div className="alert_message pt-3">
                                    {errors.phonenumber}
                                  </div>
                                ) : null}
                              </FormikFieldWrap>

                              <div className="pt-3">
                                <button
                                  type="submit"
                                  className="btn btn-primary btn-lg d-block  w-100 border-radious-10 p-3 small-font-17 bottom_shedule_btn"
                                  disabled={!dirty || errors.phonenumber}
                                >
                                  SELECT PAYMENT METHOD
                                </button>
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </div>
                    </div>
                  </>
                ) : (
                  <EasyPaisa
                    mobNum={phoneNumberValue}
                    bundleID={bundleID}
                    userorderID={userorderID}
                    curpaymentMethod={paymentmode}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* <div className="accordion" id="paymentAccordion">
          <div className="card">
            <div className="card-header" id="headingOne">
              <h2 className="mb-0">
                <button
                  className="btn btn-link  w-100 accordion_btn_adjustment"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  <div className=" d-flex">
                    <div className="selected_checkbox">
                      <div className="selected-dot"></div>
                    </div>
                    <img
                      src={
                        require("../../../assets/images/easypay_ico.png")
                          .default
                      }
                      width="30"
                      alt="easy pay ico"
                    />{" "}
                    Pay via EasyPaisa
                  </div>
                </button>
              </h2>
            </div>

            <div
              id="collapseOne"
              className="collapse show"
              aria-labelledby="headingOne"
              data-parent="#paymentAccordion"
            >
              <div className="card-body"> </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header" id="headingThree">
              <h2 className="mb-0">
                <button
                  className="btn btn-link accordion_btn_adjustment w-100 collapsed "
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  <div className=" d-flex">
                    {" "}
                    <div className="selected_checkbox">
                      <div className="selected-dot"></div>
                    </div>
                    <img
                      src={
                        require("../../../assets/images/stripe_ico.png").default
                      }
                      width="30"
                      alt="easy pay ico"
                    />{" "}
                    Pay via Stripe
                  </div>
                </button>
              </h2>
            </div>
            <div
              id="collapseThree"
              className="collapse"
              aria-labelledby="headingThree"
              data-parent="#paymentAccordion"
            >
              <div className="card-body">
                <div className="text-center">
                  <Stripe />
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
