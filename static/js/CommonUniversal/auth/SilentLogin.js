/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import BaseURL from "../api";
import { useRefreshToken } from "../../Components/Dashboard/ContextHooks/ThemeProvider";
export default function SilentLogin() {
  var ls = require("local-storage");
  // Jwt token Refresh
  var jwt = require("jsonwebtoken");
  const RefreshTokenAgain = useRefreshToken();
  const [tokenExpiredReload, settokenExpiredReload] = React.useState(false);

  // check 401 error with intercepter
  const UNAUTHORIZED = 401;

  React.useEffect(() => {
    BaseURL.interceptors.response.use(
      (response) => response,
      (error) => {
        const { status } = error.response;
        if (status === UNAUTHORIZED) {
          settokenExpiredReload(true);
        }

        return Promise.reject(error);
      }
    );
  }, []);
  React.useEffect(() => {
    if (tokenExpiredReload) {
      RefreshTokenAgain(true);
    }
  }, [tokenExpiredReload]);
  // check 401 error with intercepter Ended
  // get the decoded payload and header
  function decodeAndCheckRefresh(value) {
    const getTokenFromLocal = ls.get("token").accessToken || "";
    var decoded = jwt.decode(getTokenFromLocal, { complete: true });
    const tokentime =
      decoded !== null ? decoded.payload.exp : RefreshTokenAgain(value);
    const localStorageToken = new Date(
      tokentime * 1000 - 2000 * 60
    ).toLocaleString();
    const localUserDate = new Date().toLocaleString();
    // console.log(localStorageToken + "--local storage token");
    // console.log(localUserDate);

    if (Date.parse(localStorageToken) < Date.parse(localUserDate)) {
      RefreshTokenAgain(value);
    }
  }
  React.useEffect(() => {
    decodeAndCheckRefresh(true);
    const interval = setInterval(() => {
      decodeAndCheckRefresh(false);
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  // Jwt token Refresh Ended
  // var jwt = require("jsonwebtoken");

  // jwt.verify(usertoken, usertoken.accessToken, function (err, decoded) {
  //   if (err) {
  //     if (err.message === "jwt expired") {
  //       refreshToken();
  //     } /*
  //       err = {
  //         name: 'TokenExpiredError',
  //         message: 'jwt expired',
  //         expiredAt: 1408621000
  //       }
  //     */
  //   }
  // });

  // Silent login user

  return false;
}
