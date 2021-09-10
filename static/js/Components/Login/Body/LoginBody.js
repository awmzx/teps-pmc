import "../Login.scss";
import centerimage from "../../../assets/images/login-centerimg.png";

export default function LoginBody({ children, usertype }) {
  return (
    // <div
    //   className={`screen_wrapper ${usertype === "pmc" ? "pmcbranding" : ""}`}
    // >
    <div className={`screen_wrapper pmcbranding`}>
      <div>
        <div className="row m-0">
          <div
            className={`col-lg-7 left_section ${
              usertype === "pmc"
                ? "pmcbranding d-none d-lg-block"
                : "d-none d-lg-block"
            }`}
          >
            <div className="left_sec_inner ">
              {/* <Header usertype={usertype} /> */}
              <div>
                <div className="center-img py-3 d-none d-lg-block">
                  <img
                    src={centerimage}
                    alt="Logo"
                    className="img-fluid  d-block mx-auto"
                  />
                </div>
                <div className="welcome_txt text-center py-3 px-3">
                  <h1>WELCOME</h1>
                  <p className="pt-2">
                    Transforming the way you prepare for the most important
                    <br />
                    exams in your career.
                  </p>
                </div>
                <div className="poweredby text-center d-none ">
                  <div>
                    <p className=" font-14">
                      P o w e r e d&nbsp;&nbsp; b y &nbsp; T E P S
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 min-100vh">{children}</div>
        </div>
      </div>
    </div>
  );
}
