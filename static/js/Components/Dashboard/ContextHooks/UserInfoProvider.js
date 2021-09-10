import React, { useContext } from "react";
import BaseURL from "../../../CommonUniversal/api";

const RefreshUserInfoAgain = React.createContext();
const RefreshUserInfoStatus = React.createContext();

export function useRefreshUserInfo() {
  return useContext(RefreshUserInfoAgain);
}
export function useRefreshUserInfoStatus() {
  return useContext(RefreshUserInfoStatus);
}

export default function UserInfoProvider({ children }) {
  var ls = require("local-storage");
  //const userCredentials = ls.get("userCredentials") || "";
  const isTokenAvailable = ls.get("token") || "";
  const accessToken = isTokenAvailable ? isTokenAvailable.accessToken : "";
  if (!accessToken) {
    ls.remove("token");
    ls.remove("userCredentials");
    ls.remove("isValidate");
    ls.remove("userinfo");
    window.location.reload();
  }
  const [infoStatus, setinfoStatus] = React.useState(false);
  // Auth jwt token refresh hook
  const refreshUserInfo = () => {
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
      key: "Authorization",
    };
    BaseURL.get("/test/info", config)
      .then((res) => {
        ls.set("userinfo", res.data);
        setinfoStatus(true);
      })
      .catch((err) => {});
  };

  //Refresh user infor on loging call ended
  // Auth jwt token refresh hook ended

  return (
    <RefreshUserInfoAgain.Provider value={refreshUserInfo}>
      <RefreshUserInfoStatus.Provider value={infoStatus}>
        {children}
      </RefreshUserInfoStatus.Provider>
    </RefreshUserInfoAgain.Provider>
  );
}
