/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import moment from "moment";
import infoico from "../../../../assets/images/i_ico_small.svg";
import { useHistory } from "react-router";
import ModalPopupBootstrap from "../../../../CommonUniversal/ModalPopup/ModalPopupBootstrap";
import $ from "jquery";
import baseURL from "../../../../CommonUniversal/api";

export default function EasyPaisa({
  userorderID,
  mobNum,
  bundleID,
  curpaymentMethod,
}) {
  const [iframeSource, setiframeSource] = React.useState();
  var ls = require("local-storage");
  const history = useHistory();
  const userEmailAddress = ls.get("userCredentials").username;

  React.useEffect(() => {
    //const storeID = 12542; //Dev account
    const storeID = 97725; // Production account
    //const userEmail = ls.get("userCredentials").username || "";
    // var milliseconds = currentTimeStamp.getTime();
    // const currentTimeStamp = new Date();
    // const orderID = `${userEmail},${bundleID},${milliseconds}`;
    const orderID = userorderID;

    const amount =
      window.location.origin === "https://tepsapp.convotest.app"
        ? "2.0"
        : "600.0";
    const email = userEmailAddress;
    const cellNo = mobNum;
    const token = moment().add(2, "days").format("YYYYMMDD 000000");

    const merchantPaymentMethod = curpaymentMethod;

    //const postBackURL = `${window.location.origin}/home/purchasebundles`;

    // var currentTimeStamp = "2021-08-03T02:28:00";

    const currentTimeStamp = moment().format("YYYY-MM-DDTHH:mm:ss");
    // const encryptParams = `amount=${amount}&emailAddress=${email}&expiryDate=${token}&mobileNum=${cellNo}&orderRefNum=${orderID}&paymentMethod=InitialRequest&postBackURL=${postBackURL}&storeId=${storeID}&timeStamp=${currentTimeStamp}`;
    const encryptParams = `amount=${amount}&emailAddress=${email}&expiryDate=${token}&merchantPaymentMethod=${merchantPaymentMethod}&mobileNum=${cellNo}&orderRefNum=${orderID}&paymentMethod=InitialRequest&storeId=${storeID}&timeStamp=${currentTimeStamp}`;

    var aesjs = require("aes-js");
    //const keyBuffer = aesjs.utils.utf8.toBytes("R9798H4B8T4NLRVZ"); //Dev account
    const keyBuffer = aesjs.utils.utf8.toBytes("99T3R1J1UX3Y8R0A"); // Production account
    const inputBuffer = aesjs.padding.pkcs7.pad(
      aesjs.utils.utf8.toBytes(encryptParams)
    );
    const escEcb = new aesjs.ModeOfOperation.ecb(keyBuffer);
    const encryptedBytes = escEcb.encrypt(inputBuffer);
    const encryptedData = Buffer.from(encryptedBytes).toString("base64");

    const codeString = encodeURIComponent(encryptedData).replace(/%20/g, "+");
    // const iframeParams = `https://easypay.easypaisa.com.pk/tpg/?storeId=${storeID}&orderId=${orderID}&transactionAmount=${amount}&mobileAccountNo=${cellNo}&emailAddress=${email}&transactionType=InitialRequest&tokenExpiry=${token}&bankIdentificationNumber=&encryptedHashRequest=${codeString}&merchantPaymentMethod=&postBackURL=${postBackURL}&signature=`;
    const iframeParams = `https://easypay.easypaisa.com.pk/tpg/?storeId=${storeID}&orderId=${orderID}&transactionAmount=${amount}&mobileAccountNo=${cellNo}&emailAddress=${email}&transactionType=InitialRequest&tokenExpiry=${token}&bankIdentificationNumber=&encryptedHashRequest=${codeString}&merchantPaymentMethod=${merchantPaymentMethod}&postBackURL=&signature=`;
    setiframeSource(iframeParams);
  }, []);
  function redirectToPracticetest() {
    $("#purchaseInfoModal").modal("hide");
    history.push("/home/purchasebundles");
  }
  ////////////////////

  var data = {};

  const params = new URLSearchParams({
    request: `${userEmailAddress},${bundleID},${userorderID}`,
  });
  const configAuth = {
    headers: { Authorization: `Bearer ${ls.get("token").accessToken}` },
    key: "Authorization",
  };

  function postIntialRequest() {
    const url = "/practicetest/payment/bundleorder/save?" + params;
    baseURL
      .post(url, data, configAuth)
      .then((res) => {})
      .catch((err) => {});
  }

  /////////////////////

  var axios = require("axios");
  var dataeasypaisa = JSON.stringify({
    orderId: userorderID,
    storeId: "97725",
    accountNum: "124846423",
  });

  var config = {
    method: "post",
    url: "https://easypay.easypaisa.com.pk/easypay-service/rest/v4/inquire-transaction",
    headers: {
      Credentials: "VEVQUzplZmM0ZmExNTQyNDAyMTMxOTkxY2QxNWQzYTAyZjJkMA==",
      "Content-Type": "application/json",
    },
    data: dataeasypaisa,
  };
  function checkOrderIDFromEasyPaisa() {
    axios(config)
      .then(function (response) {
        // This will return you the number of milliseconds
        // elapsed from January 1, 1970
        // if your date is less than that date, the value will be negative
        if (response.data.responseDesc !== "INVALID ORDER ID") {
          postIntialRequest();
        }
      })
      .catch(function (error) {});
  }
  React.useEffect(() => {
    return () => checkOrderIDFromEasyPaisa();
  }, []);

  return (
    <div>
      <p className="d-md-none text-center primary_color">
        <img src={infoico} alt="info ico" className="mr-1" /> Please select the
        payment method and scroll down.
      </p>
      {iframeSource ? (
        <div>
          {/* <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "15px",
                width: "100px",
                height: "100px",
              }}
            ></div>{" "}
          </div> */}
          <iframe
            title="EasyPaisaIframe"
            width="100%"
            height="600"
            src={iframeSource}
            frameBorder="0"
            style={{ background: "#43394d", borderRadius: "20px" }}
          />
          <div className="payment_info">
            <h2 className="pt-3">
              Once you have completed your payment, click the button below to
              confirm your payment.
            </h2>
            <div className="pt-3">
              <button
                type="submit"
                className="btn btn-primary btn-lg d-block  w-100 border-radious-10 p-3 small-font-17 bottom_shedule_btn"
                onClick={() => $("#purchaseInfoModal").modal("show")}
              >
                CONFIRM PAYMENT
              </button>
            </div>
            <h2 className="gray-txt pt-3">
              <img src={infoico} alt="ifo ico" className="mr-2 " /> Payment
              verification takes some time, therefore, your practice tests may
              take up to 5 minutes to get unlocked.
            </h2>
          </div>
          <ModalPopupBootstrap
            themeMode={"offwhite"}
            modalID={"purchaseInfoModal"}
            closebtn={false}
          >
            <>
              <div className="modal_wrongemail">
                <div className="top_heading text-center pb-3 text-uppercase pt-4 semi-bold">
                  <img
                    src={infoico}
                    alt="ifo ico"
                    className="mr-2 "
                    width="40"
                  />{" "}
                  Important Information.
                </div>
                <div className="semi-bold text-center pb-4">
                  <p>
                    Once you have completed your payment please wait for a
                    while. Payment verification takes some time, therefore, your
                    practice tests may take up to 5 minutes to get unlocked.
                  </p>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg d-block col-md-4  mx-auto  w-100 border-radious-10 p-3 small-font-16"
                    onClick={() => redirectToPracticetest()}
                  >
                    OK
                  </button>
                </div>
              </div>
            </>
          </ModalPopupBootstrap>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
