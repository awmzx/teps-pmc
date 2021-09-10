import React from "react";
import "./Login.scss";

const Logout = () => {
  React.useEffect(() => {
    var ls = require("local-storage");
    const checkPMCUser = ls.get("sheduledate")
      ? ls.get("sheduledate").ifpmcuser
      : "";
    ls.remove("userCredentials");
    ls.remove("isPMCUser");
    ls.remove("userinfo");
    ls.remove("sheduledate");
    ls.remove("isValidate");
    ls.remove("token");
    ls.remove("profileImg");
    if (checkPMCUser === true) {
      window.location.href = window.location.origin + "/login?user=pmc";
    } else {
      window.location.href = window.location.origin + "/login";
    }
  });

  return <></>;
};

export default Logout;
