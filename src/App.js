import React from "react";
import { CampsProvider } from "./dataProviders/camps";
import Camps from "./pages/Camps";

function App() {
  return (
    <CampsProvider>
      <Camps />
    </CampsProvider>
  );
}

export default App;
