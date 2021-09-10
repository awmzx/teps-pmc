import React from "react";

import "./ModalPopup.scss";
const ModalPopupBootstrap = ({ children, themeMode, modalID, closebtn }) => {
  return (
    <React.Fragment>
      <div
        className="modal fade"
        id={modalID}
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered max-popup-width-600 "
          role="document"
        >
          <div
            className={
              themeMode === true
                ? "modal-content darkmode"
                : themeMode === false
                ? "modal-content lightmode"
                : themeMode === "offwhite"
                ? "modal-content offwhite"
                : "modal-content darkmode"
            }
          >
            {closebtn !== false ? (
              <div className="modal-header  border-0">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            ) : (
              ""
            )}

            <div className="modal-body">
              <div className="content_sec">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ModalPopupBootstrap;
