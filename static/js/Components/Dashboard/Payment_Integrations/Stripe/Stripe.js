import React from "react";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";
import baseURL from "../../../../CommonUniversal/api";
import ReactLoading from "react-loading";
import { ToastContainer, toast } from "react-toastify";
import { useHistory } from "react-router";
export default function Stripe({ bundleName, bundleID, bundleQuantity }) {
  var ls = require("local-storage");
  // const testName = ls.get("userinfo").testName || "";
  // const testType = ls.get("userinfo").testType || "";
  const history = useHistory();
  const userEmail = ls.get("userCredentials").username || "";
  const config = {
    headers: { Authorization: `Bearer ${ls.get("token").accessToken}` },
    key: "Authorization",
  };
  const unlockPayloadData = {
    bundleId: bundleID,
  };

  const notifySucess = () => toast("Success! Check email for details");
  const notifyUnsucess = () => toast("Schedule submitted successfully");
  const [paymentResponse, setpaymentResponse] = React.useState(false);
  const [product] = React.useState({
    name: `${bundleName}`,
    price:
      window.location.origin === "https://tepsapp.convotest.app" ? 1.0 : 9.99,
    description: "",
  });
  //var url_string = window.location.href; //window.location.href
  //var url = new URL(url_string);
  //var emailFromURL = url.searchParams.get("e");

  async function handleToken(token, addresses) {
    setpaymentResponse(true);
    const response = await axios.post("https://node.teps.pk/checkout", {
      token,
      product,
    });
    const { status } = response.data;
    //console.log("Response:", response.data);
    if (status === "success") {
      notifySucess();
      unlockBundle();
      setpaymentResponse(false);
    } else {
      setpaymentResponse(false);
      notifyUnsucess();
    }
  }
  function unlockBundle() {
    baseURL
      .post("/practicetest/purchase/bundle", unlockPayloadData, config)
      .then((res) => {
        setpaymentResponse(false);
        history.push("/home/practicetest");
      })
      .catch((err) => {
        setpaymentResponse(false);
      });
  }
  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        className="toaster_dark"
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="product product_payment text-left">
        {paymentResponse ? (
          <div>
            {" "}
            <span className="block text-left pt-2">
              <ReactLoading
                type={"spin"}
                color={"#fff"}
                height={"30px"}
                width={"30px"}
                className={" mt-5"}
              />
            </span>
            <div className=" pt-3">
              Please wait we are verifying your payment.
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="pt-3 paywithcard_btn">
        {
          //dev keys: pk_test_51J2mPDDVfp0NdvnDRAU6GtSLi3qWWjLpeTDRcYRVnAUpSYu6EiKO7e0ghoBOnkqvHKAR0JqTSkStcxAsaXO0DuU000r7ykcKCP
          // live keys: pk_live_51J2mPDDVfp0NdvnDJakl8ZgSbG6ehiJ3aDLdEEWQdXGWiO1hJTfGKperKBahyDySHQTpVednRxsEBUwgeyXG0awU00NQxoXBfy
          // live backend key:  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
        }
        <StripeCheckout
          stripeKey="pk_live_51J2mPDDVfp0NdvnDJakl8ZgSbG6ehiJ3aDLdEEWQdXGWiO1hJTfGKperKBahyDySHQTpVednRxsEBUwgeyXG0awU00NQxoXBfy"
          token={handleToken}
          amount={product.price * 100}
          name={product.name}
          description={product.name}
          email={userEmail}
          billingAddress
          shippingAddress
        />
      </div>
    </div>
  );
}
