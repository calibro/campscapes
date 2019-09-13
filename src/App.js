import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {
  CampsProvider,
  CampsNetworksProvider,
  ThemesProvider,
  StoriesProvider
} from "./dataProviders";
import Intro from "./pages/Intro";
import Home from "./pages/Home";
import Camps from "./pages/Camps";
import Camp from "./pages/Camp";
import Icons from "./pages/Icons";
import Themes from "./pages/Themes";
import Story from "./pages/Story";

function App() {
  return (
    <Router>
      <Route exact path="/" component={Intro} />
      <Route exact path="/home" component={Home} />

      <CampsProvider loadOn={["/camps", "/icons"]}>
        <Route path="/camps" component={Camps} exact />

        <CampsNetworksProvider loadOn={["/camps/:name"]}>
          <Route path="/camps/:name" component={Camp} />
        </CampsNetworksProvider>

        <Route path="/icons" component={Icons} />
      </CampsProvider>
      <ThemesProvider loadOn={["/themes"]}>
        <StoriesProvider loadOn={["/themes", "/stories/:slug"]}>
          <Route path="/themes" component={Themes} />
          <Route path="/stories/:slug" component={Story} />
        </StoriesProvider>
      </ThemesProvider>
    </Router>
  );
}

export default App;
