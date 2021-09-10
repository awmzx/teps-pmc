import "./Login.scss";
import LoginForm from "./LoginForm";
import LoginBody from "./Body/LoginBody";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const LoginScreen = () => {
  let query = useQuery();

  return (
    <>
    <LoginBody usertype={query.get("user")} >
      <LoginForm usertype={query.get("user")}  />
    </LoginBody>
    </>
  );
};

export default LoginScreen;
