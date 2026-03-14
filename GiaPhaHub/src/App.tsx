import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./features";
import AppRoutes from "./router";
import ScrollToTop from "./components/common/ScrollToTop";
import "./index.css";

function App(): React.ReactElement {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;

