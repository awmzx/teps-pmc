import React from "react";
import BaseURL from "../../../../../CommonUniversal/api";

export default function UserAvatar() {
  // Set profile image
  var ls = require("local-storage");
  const lsProfileImg = ls.get("profileImg") || "";
  const config = {
    headers: { Authorization: `Bearer ${ls.get("token").accessToken}` },
    key: "Authorization",
    responseType: "arraybuffer",
  };

  const [saveFile, setsaveFile] = React.useState();
  function fileDownload() {
    const fileDownload = {
      fileName: ls.get("token").photoFileName || "",
      type: "user",
    };
    BaseURL.post("/cloud/file", fileDownload, config)
      .then((response) => {
        const buffer = Buffer.from(response.data, "binary").toString("base64");
        setsaveFile(buffer);
        ls.set("profileImg", buffer);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          ls.set("profileImg", "noimage");
        }
      });
  }

  React.useEffect(() => {
    if (
      !lsProfileImg ||
      lsProfileImg === "noimage" ||
      lsProfileImg === "image not found"
    ) {
      fileDownload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Set profile image ended here

  return (
    <>
      <div className="profile_pic float-right">
        {lsProfileImg ? (
          <img
            className="img-fluid"
            src={`data:image/jpeg;base64,${lsProfileImg}`}
            alt=""
          />
        ) : (
          <img
            className="img-fluid"
            src={`data:image/jpeg;base64,${saveFile}`}
            alt=""
          />
        )}
      </div>
    </>
  );
}
