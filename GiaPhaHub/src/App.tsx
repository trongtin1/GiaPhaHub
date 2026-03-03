import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { FamilyProvider } from "./context/FamilyContext";
import AppRoutes from "./router";
import ScrollToTop from "./components/common/ScrollToTop";
import "./index.css";

function App(): React.ReactElement {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <FamilyProvider>
          <ScrollToTop />
          <AppRoutes />
        </FamilyProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
