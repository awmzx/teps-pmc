import React from "react";
import AppRouter from "./router/AppRouter";
import ThemeProvider from "./Components/Dashboard/ContextHooks/ThemeProvider";

function App() {
  return (
    <>
      <ThemeProvider>
        <div className="App">
          <AppRouter />
        </div>
      </ThemeProvider>
    </>
  );
}
export default App;
