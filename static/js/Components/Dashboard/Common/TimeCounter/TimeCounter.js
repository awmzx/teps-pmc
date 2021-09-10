/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from "react";
import "./TimeCounter.scss";
import Countdown from "react-countdown";
import HoursGlass from "../../../../assets/images/hourglass.svg";
import { withStyles } from "@material-ui/core/styles";

import Switch from "@material-ui/core/Switch";

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: "#f8d9d4",
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: "#b36c63",
        borderColor: "#9c5d55",
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid #e8b8b1`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: "#e1a098",
  },
  checked: {},
}))(Switch);
export default function TimeCounter({
  CounterTotal,
  CounterCallback,
  CounterHandelPause,
  practiceTestOrderId,
}) {
  var ls = require("local-storage");
  const checkTimerMode = ls.get(`timerMode`) || "";
  const [state, setState] = React.useState({
    checkedC: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  // Renderer callback with condition
  const [total, settotal] = React.useState(CounterTotal);
  const PTQATimer = ls.get(`PTQATimer${practiceTestOrderId}`) || null;

  React.useEffect(() => {
    if (PTQATimer === null || PTQATimer === "") {
      settotal(CounterTotal);
    } else {
      settotal(PTQATimer);
    }

    if (checkTimerMode) {
      if (checkTimerMode === "enabled") {
        setState({ ...state, checkedC: true });
      } else if (checkTimerMode === null) {
        setState({ ...state, checkedC: true });
      } else {
        setState({ ...state, checkedC: false });
      }
    }
  }, []);

  const clockRef = useRef();
  React.useEffect(() => {
    if (state.checkedC) {
      if (CounterHandelPause === true) {
        clockRef.current.pause();
      } else {
        clockRef.current.start();
      }
    }
  }, [CounterHandelPause]);

  // Renderer callback with condition

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (seconds > 0) {
      ls.set(
        `PTQATimer${practiceTestOrderId}`,
        hours * 60 * 60 * 1000 + minutes * 60000 + seconds * 1000
      );
    }

    return (
      <span>
        {hours < 10 ? "0" + hours : hours}:
        {minutes < 10 ? "0" + minutes : minutes}:
        {seconds < 10 ? "0" + seconds : seconds}
      </span>
    );
  };
  const rendereComplete = ({ completed }) => {
    if (completed && state.checkedC === true) {
      CounterCallback();
    }
  };

  React.useEffect(() => {
    if (state.checkedC === false && checkTimerMode !== null) {
      settotal(CounterTotal);
      ls.set("timerMode", "disabled");
      ls.remove(`PTQATimer${practiceTestOrderId}`);
    } else if (state.checkedC === true && checkTimerMode !== null) {
      ls.set("timerMode", "enabled");
    }
  }, [state.checkedC]);
  // const handleStart = () => clockRef.current.start();
  // const handlePause = () => clockRef.current.pause();
  return (
    <React.Fragment>
      {/* <ul>
        {values.map((val) => (
          <li onClick={() => setActiveId(val.id)}>{val.text} --</li>
        ))}
      </ul> */}

      <div className="counter_wrapper d-flex">
        <div className="p-1 pr-3">
          {" "}
          <AntSwitch
            checked={state.checkedC}
            onChange={handleChange}
            name="checkedC"
          />
        </div>

        {state.checkedC ? (
          <div>
            <span className="hoursglass">
              <img
                src={`${window.location.origin.toString()}/${HoursGlass}`}
                alt="hours glass"
              />
            </span>
            <span className="pr-1">Time Remaining: {renderer}</span>
            <strong>
              <Countdown
                date={Date.now() + total}
                ref={clockRef}
                zeroPadTime={0}
                precision={0}
                renderer={renderer}
                onComplete={rendereComplete}
              />{" "}
            </strong>
          </div>
        ) : (
          ""
        )}
      </div>
    </React.Fragment>
  );
}
