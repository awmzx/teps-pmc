import React from "react";
import "./LinkBody.scss";
import DoughnutChart from "../../Common/Charts/DoughnutChart";
import ShoppingBag from "../../../../assets/images/shopping-bag.svg";
import LinesEllipsis from "react-lines-ellipsis";

function LinkBody({
  courseNumber,
  courseHeading,
  courseDesc,
  chartDataValues1,
  chartDataValues2,
  cart1Color,
  percentageGraph,
  viewResultsLink,
  newCourse,
  unPaid,
  buyNow,
  Bought,
  Waiting,
  Pending,
}) {
  // console.log(percentageGraph);
  return (
    <React.Fragment>
      <div className="testname_wrapper mb-3">
        <div className="row m-0 align-items-center">
          <div className="col-1 p-0">
            <div className="digit-inner">{courseNumber}</div>
          </div>
          <div className="col-8 col-md-9 p-0">
            <div className="test_details">
              <div className="testname">{courseHeading}</div>
              <div className="testdesc">
                <LinesEllipsis
                  text={courseDesc}
                  maxLine="2"
                  ellipsis="..."
                  trimRight
                  basedOn="letters"
                />
              </div>
            </div>
          </div>
          <div className="col-3 col-md-2 p-0 align-self-center">
            {percentageGraph && !newCourse && !viewResultsLink ? (
              <div className="chart-inner ml-auto">
                <DoughnutChart
                  chartDataValues1={chartDataValues1}
                  chartDataValues2={chartDataValues2}
                  cart1Color={cart1Color}
                />
              </div>
            ) : viewResultsLink ? (
              <div className="viewResults_link">View Result</div>
            ) : newCourse && !viewResultsLink ? (
              <div className="d-flex text-right">
                <div className="new_course mr-2 py-2 py-md-0 ">New</div>

                {unPaid ? (
                  <div className="mr-md-2 py-2 py-md-0 text-center shopppingbag">
                    <img src={ShoppingBag} alt="shopping bag" />
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : unPaid && newCourse === false ? (
              <div className="text-right pr-3">
                <div className="mr-md-2 ml-auto py-2 py-md-0 ">
                  <img src={ShoppingBag} alt="shopping bag" />
                </div>
              </div>
            ) : buyNow === true ? (
              <div className="mr-md-0 py-2 py-md-0 text-center buyNowBtn">
                <div className="new_course mr-2 py-2 py-md-0 ">BUY</div>
              </div>
            ) : Bought === true ? (
              <div className="mr-md-0 py-2 py-md-0 text-center ">
                <div className="new_course mr-2 py-2 py-md-0 paid_btn">
                  BOUGHT
                </div>
              </div>
            ) : Waiting === true ? (
              <div className="mr-md-0 py-2 py-md-0 text-center ">
                <div className="new_course ml-4 py-2 py-md-0 waiting_btn">
                  BUY
                </div>
              </div>
            ) : Pending === true ? (
              <div className="mr-md-0 py-2 py-md-0 text-center ">
                <div className="new_course mr-2 py-2 py-md-0 waiting_btn">
                  PENDING
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default LinkBody;
