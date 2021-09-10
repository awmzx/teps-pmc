import React, { useContext } from "react";
import BaseURL from "../../../CommonUniversal/api";
// custom hook context  theme value (true or false)
const ThemeContext = React.createContext();
// another  custom context to run function name (toggleTheme)
const ThemeUpdateContext = React.createContext();
const ThemeDisabledContext = React.createContext();
const ThemeDisabledUpdateContext = React.createContext();
const ThemeLoading = React.createContext();
const ThemeLoadingDispatch = React.createContext();
const RefreshTokenAgain = React.createContext();
const SinginCallinProgress = React.createContext();

// Custom hook for useing and triggering theme values
export function useTheme() {
  return useContext(ThemeContext);
}
export function useThemeUpdate() {
  return useContext(ThemeUpdateContext);
}

export function useThemeDisabledContext() {
  return useContext(ThemeDisabledContext);
}

export function useThemeDisabledUpdateContext() {
  return useContext(ThemeDisabledUpdateContext);
}
export function useThemeLoading() {
  return useContext(ThemeLoading);
}

export function useThemeLoadingDispatch() {
  return useContext(ThemeLoadingDispatch);
}

export function useRefreshToken() {
  return useContext(RefreshTokenAgain);
}
export function useSinginCallinProgress() {
  return useContext(SinginCallinProgress);
}

// Global variable that will be accessable within all export futnions we are triggering theme on bases of this variable

// Export theme values and states for apply dark mode and light mode

// Theme provider use context to provide theme mode accorss all the component it is declared in dashboard.js

export default function ThemeProvider({ children }) {
  var ls = require("local-storage");
  //const userCredentials = ls.get("userCredentials") || "";

  const [darkTheme, setdarkTheme] = React.useState(true);
  const [themeDisabledMode, setthemeDisabledMode] = React.useState(false);
  const [loadingScreenState, setLoadingScreenState] = React.useState(false);

  function toggleTheme(value) {
    if (value === false) {
      setdarkTheme(false);
    } else {
      setdarkTheme(true);
    }
  }

  function disableTheme(value) {
    if (value === false) {
      setthemeDisabledMode(false);
    } else {
      setthemeDisabledMode(true);
    }
  }
  function loadingScreen(value) {
    if (value === false) {
      setLoadingScreenState(false);
    } else {
      setLoadingScreenState(true);
    }
  }
  const [isSignInCall, setisSignInCall] = React.useState(false);

  // Auth jwt token refresh hook
  function refreshToken(singinNow) {
    setisSignInCall(singinNow);

    const data = {
      userName: ls.get("userCredentials").username || "",
      password: ls.get("userCredentials").password || "",
    };
    BaseURL.post("/auth/signin", data)
      .then((res) => {
        ls("token", res.data);
        setisSignInCall(false);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            ls.remove("token");
            ls.remove("userCredentials");
            ls.remove("isValidate");
            ls.remove("userinfo");
            window.location.reload();
          }
        }
      });
  }
  // Auth jwt token refresh hook ended

  return (
    <ThemeContext.Provider value={darkTheme}>
      <ThemeUpdateContext.Provider value={toggleTheme}>
        <ThemeDisabledContext.Provider value={themeDisabledMode}>
          <ThemeDisabledUpdateContext.Provider value={disableTheme}>
            <ThemeLoading.Provider value={loadingScreenState}>
              <ThemeLoadingDispatch.Provider value={loadingScreen}>
                <RefreshTokenAgain.Provider value={refreshToken}>
                  <SinginCallinProgress.Provider value={isSignInCall}>
                    {children}
                  </SinginCallinProgress.Provider>
                </RefreshTokenAgain.Provider>
              </ThemeLoadingDispatch.Provider>
            </ThemeLoading.Provider>
          </ThemeDisabledUpdateContext.Provider>
        </ThemeDisabledContext.Provider>
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
}
