/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
//import BackArrow from "../../../assets/images/back_arrow.svg";
import "./PracticeTest.scss";
import { useHistory } from "react-router-dom";
import BackArrow from "../../../assets/images/back_arrow.svg";
import "react-toastify/dist/ReactToastify.css";
import LinkBody from "./BodyElements/LinkBody";
import baseURL from "../../../CommonUniversal/api";
import infoico from "../../../assets/images/i_ico_small.svg";
import ReactLoading from "react-loading";
//import BaseURL from "../../../CommonUniversal/api";
import $ from "jquery";
import ModalPopupBootstrap from "../../../CommonUniversal/ModalPopup/ModalPopupBootstrap";
function PracticeTestBundles({ match }) {
  let history = useHistory();
  var ls = require("local-storage");
  const countryStatus = ls.get("token").examCenter || "";

  const config = {
    headers: { Authorization: `Bearer ${ls.get("token").accessToken}` },
    key: "Authorization",
  };

  const [apiError, setapiError] = React.useState(false);
  const [loading, setloading] = useState(false);
  const [bundlesList, setbundlesList] = React.useState();
  const [bundleName, setbundleName] = React.useState();
  const [currentBundleID, securrentBundleID] = React.useState({
    bundleID: "",
    bundleName: "",
    bundleQuantity: "",
  });
  // Send practice test ID and order ID to child component using react router dom

  const GTSPData = {
    testId: ls.get("userinfo").testId,
  };

  function getBundleList() {
    baseURL
      .post("/practicetest/bundles", GTSPData, config)
      .then((res) => {
        setbundlesList(res.data);
        setloading(false);
        setapiError(false);
        setloading(true);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data.status === 500) {
            setapiError(true);
          }
        }
      });
  }

  // var d = new Date();
  // var utc = d.getTime() + d.getTimezoneOffset() * 60000;
  // var date = new Date(utc + 3600000 * +5); // some mock date
  // var milliseconds = date.getTime();
  const [setBundleDataJSX, setsetBundleDataJSX] = React.useState();
  React.useEffect(() => {
    setTimeout(() => {
      getBundleList();
    }, 800);
  }, []);
  React.useEffect(() => {
    if (bundlesList) {
      const loopBundlesList = bundlesList.map((item, i) => {
        const index = i + 1;

        return (
          <div
            className={
              item.purchaseStatus === "PENDING"
                ? "purchaseBundle avoid-mouse-clicks"
                : "purchaseBundle"
            }
            onClick={() =>
              item.purchaseStatus === "PAID"
                ? history.push("/home/practicetest")
                : item.purchaseStatus === "PENDING" ||
                  item.purchaseStatus === "INQUIRED" ||
                  item.purchaseStatus === "AUTHORIZED" ||
                  item.purchaseStatus === "CAPTURED" ||
                  item.purchaseStatus === "INTERIM" ||
                  item.purchaseStatus === "INITIATED" ||
                  item.purchaseStatus === "WAITING"
                ? false
                : purchaseThisBundle(
                    item.bundleId,
                    item.bundleName,
                    item.quantity
                  )
            }
            key={i}
          >
            <LinkBody
              courseNumber={index}
              courseHeading={`${item.bundleName}`}
              courseDesc={
                item.purchaseStatus === "WAITING"
                  ? "If you have sucessfully paid for this bundle, do not buy it again. Please wait for another 5 minutes and then refresh the page to view updated payment status."
                  : `${item.description ? item.description : ""}`
              }
              percentageGraph={false}
              newCourse={false}
              unPaid={false}
              buyNow={
                item.purchaseStatus === "FAILED" ||
                item.purchaseStatus === null ||
                item.purchaseStatus === "EXPIRED" ||
                item.purchaseStatus === "CANCELLED" ||
                item.purchaseStatus === "REVERSED" ||
                item.purchaseStatus === "TERMINATED" ||
                item.purchaseStatus === "BLOCKED" ||
                item.purchaseStatus === "VOID" ||
                item.purchaseStatus === "REJECTED"
                  ? true
                  : false
              }
              Bought={item.purchaseStatus === "PAID" ? true : false}
              Pending={
                item.purchaseStatus === "PENDING" ||
                item.purchaseStatus === "INQUIRED" ||
                item.purchaseStatus === "AUTHORIZED" ||
                item.purchaseStatus === "CAPTURED" ||
                item.purchaseStatus === "INTERIM" ||
                item.purchaseStatus === "INITIATED" ||
                item.purchaseStatus === "WAITING"
                  ? true
                  : false
              }
            />
          </div>
        );
      });

      setsetBundleDataJSX(loopBundlesList);
    }
  }, [bundlesList]);

  // trigger back button logic
  function purchaseThisBundle(value1, value2, value3) {
    securrentBundleID({
      ...currentBundleID,
      bundleID: value1,
      bundleName: value2,
      bundleQuantity: value3,
    });
    $("#purchaseBundleModal").modal("show");
    setbundleName(value2);
  }
  // Waiting case popup code
  // function repurchaseThisBundle(value1, value2, value3) {
  //   securrentBundleID({
  //     ...currentBundleID,
  //     bundleID: value1,
  //     bundleName: value2,
  //     bundleQuantity: value3,
  //   });
  //   if (countryStatus !== "Intl") {
  //     $("#purchaseBundleWarning").modal("show");
  //   }
  // }

  function redirectToPayments() {
    $("#purchaseBundleModal").modal("hide");

    history.push({
      pathname: "/home/payments",
      state: {
        bundleID: currentBundleID.bundleID,
        bundleName: currentBundleID.bundleName,
        bundleQuantity: currentBundleID.bundleQuantity,
      },
    });
  }
  function redirectToPaymentsagain() {
    $("#purchaseBundleWarning").modal("hide");

    history.push({
      pathname: "/home/payments",
      state: {
        bundleID: currentBundleID.bundleID,
        bundleName: currentBundleID.bundleName,
        bundleQuantity: currentBundleID.bundleQuantity,
      },
    });
  }

  return (
    <React.Fragment>
      <ModalPopupBootstrap
        themeMode={"offwhite"}
        modalID={"purchaseBundleWarning"}
        closebtn={false}
      >
        <>
          <div className="modal_wrongemail">
            <div className="top_heading text-center pb-3 text-uppercase pt-4 semi-bold">
              <img src={infoico} alt="ifo ico" className="mr-2 " width="40" />{" "}
              Purchase Bundle Warning
            </div>
            <div className="text-center pb-4">
              <p>
                <span className="text-uppercase semi-bold ">
                  If you have successfully paid for this bundle, do not buy it
                  again.
                </span>{" "}
                <br />
                <br />
                Please wait for another <strong>5 minutes</strong> and then
                refresh the page to view updated payment status. <br />
                <br />
              </p>

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
                    onClick={() => redirectToPaymentsagain()}
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      </ModalPopupBootstrap>

      <ModalPopupBootstrap
        themeMode={"offwhite"}
        modalID={"purchaseBundleModal"}
        closebtn={true}
      >
        <div className="text-center">
          <div className="top_heading text-center pb-3  pt-4 mt-minus-35 ">
            Purchase {bundleName} for Purchase for Rs{" "}
            <span className="semi-bold">
              {countryStatus === "Intl" ? "$9.99" : "600 PKR"}
            </span>
            ?
          </div>
          {countryStatus === "Intl" ? (
            ""
          ) : (
            <div className="sample_instruction alert_message pb-4">
              <img
                src={require("../../../assets/images/i_ico_small.svg").default}
                alt="infoIco"
              />{" "}
              Please do not proceed in incognito/private mode of your browser.
            </div>
          )}

          <div className="purchaseBundleBtn">
            <button
              type="submit"
              className="btn btn-primary btn-lg d-block col-md-6 mx-auto mb-5 w-100 border-radious-10 p-3 small-font-16"
              onClick={() => redirectToPayments()}
            >
              Proceed
            </button>
          </div>
        </div>
      </ModalPopupBootstrap>
      <div className="practicetest_wrapper w-lg-80 mx-auto py-5">
        <div className="top_heading lightgray-border-bottom white-tx t">
          <h2>
            <img
              onClick={(e) => history.push("/home")}
              src={`${window.location.origin}/${BackArrow}`}
              className="backarrow_adjustment"
              alt="Go Back Icon"
            />
            Purchase Practice Test
          </h2>
        </div>
        {apiError ? (
          <div className="pb-0 pt-3 pb-4  text-center alert_message question_alert_adjustment">
            <div>Something went wrong please try again later.</div>
          </div>
        ) : (
          ""
        )}
        <div className="practicetest_wrapper pt-5">
          {!loading ? (
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
            setBundleDataJSX
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
export default PracticeTestBundles;
