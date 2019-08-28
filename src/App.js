import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import {
  CampsProvider,
  CampsNetworksProvider,
  ThemesProvider,
  StoriesProvider
} from "./dataProviders";

import Home from "./pages/Home";
import Camps from "./pages/Camps";
import Camp from "./pages/Camp";
import Icons from "./pages/Icons";
import Themes from "./pages/Themes";

function App() {
  return (
    <Router>
      <ThemesProvider>
        <Route exact path="/" component={Home} />

        <CampsProvider>
          <Route path="/camps" component={Camps} exact />

          <CampsNetworksProvider>
            <Route path="/camps/:name" component={Camp} />
          </CampsNetworksProvider>

          <Route path="/icons" component={Icons} />
        </CampsProvider>

        <StoriesProvider>
          <Route path="/themes" component={Themes} />
        </StoriesProvider>
      </ThemesProvider>
    </Router>
  );
}

export default App;
