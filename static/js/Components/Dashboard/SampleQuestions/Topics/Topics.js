import React from "react";
import "../SampleQuestions.scss";
import BackArrow from "../../../../assets/images/back_arrow.svg";
import { useHistory, useLocation } from "react-router";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Topics() {
  const [newFlag, setnewFlag] = React.useState(true);
  const [sampleNo, setsampleNo] = React.useState(1);
  const history = useHistory();
  let query = useQuery();
  const name = query.get("name") || "";
  const pdfName = query.get("pdf") || "";
  const pdfNumber = pdfName + "-" + sampleNo;
  React.useEffect(() => {
    if (sampleNo === 4) {
      setnewFlag(false);
    }
  }, [sampleNo]);

  return (
    <>
      <div className="review_syllabus">
        <div className="top_heading lightgray-border-bottom white-tx t">
          <h2
            onClick={(e) => history.push("/home/samplequestions")}
            className="cursor-pointer"
          >
            <img
              src={`${window.location.origin}/${BackArrow}`}
              className="backarrow_adjustment"
              alt="Go Back Icon"
            />
            {name}
          </h2>
        </div>
        <div className="Selecte_top_links">
          <ul>
            <li
              onClick={() => setsampleNo(1)}
              className={sampleNo === 1 ? "active" : ""}
            >
              Sample 1
            </li>
            <li
              onClick={() => setsampleNo(2)}
              className={sampleNo === 2 ? "active" : ""}
            >
              Sample 2
            </li>
            <li
              onClick={() => setsampleNo(3)}
              className={sampleNo === 3 ? "active" : ""}
            >
              Sample 3
            </li>
            <li
              onClick={() => setsampleNo(4)}
              className={sampleNo === 4 ? "active" : ""}
            >
              Sample 4 {newFlag === true ? "(New)" : ""}
            </li>
          </ul>
        </div>
        {pdfName !== "" ? (
          <embed
            src={require(`../../../../assets/pdfs/${pdfNumber}.pdf`).default}
            width="100%"
            style={{ minHeight: "70vh" }}
            type="application/pdf"
          ></embed>
        ) : (
          <div
            role="alert"
            className={`alert_message  text-center mt-0 pt-5 rollnumber_error_adjustment `}
          >
            <h2> PDF NOT FOUND</h2>
          </div>
        )}
      </div>
    </>
  );
}
