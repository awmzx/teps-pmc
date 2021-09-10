import React from "react";
import "./NoInternet.scss";
export default function NoInterNet() {
  const [Online, seOnline] = React.useState();

  React.useEffect(() => {
    const interval = setInterval(() => {
      const online = window.navigator.onLine;
      if (!online) {
        seOnline(false);
      } else {
        seOnline(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {Online === false ? (
        <div className={`NoInternetStripTop ${!Online ? "d-block" : "d-none"}`}>
          Please check your internet connection.
        </div>
      ) : (
        ""
      )}
    </>
  );
}
