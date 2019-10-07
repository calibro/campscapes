import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import {
  CampsProvider,
  CampsNetworksProvider,
  ThemesProvider,
  StoriesProvider,
  SimplePagesProvider,
  IconsProvider,
  ItemsProvider
} from "./dataProviders";
import Intro from "./pages/Intro";
import Home from "./pages/Home";
import Camps from "./pages/Camps";
import Camp from "./pages/Camp";
import Icons from "./pages/Icons";
import Icon from "./pages/Icon";
import Themes from "./pages/Themes";
import Story from "./pages/Story";
import Item from "./pages/Item";

function App() {
  return (
    <Router>
      <SimplePagesProvider>
        <Route exact path="/" component={Intro} />
        <Route exact path="/home" component={Home} />

        <CampsProvider loadOn={["/camps", "/icons"]}>
          <Route path="/camps" component={Camps} exact />

          <CampsNetworksProvider loadOn={["/camps/:name"]}>
            <Route path="/camps/:name" component={Camp} />
          </CampsNetworksProvider>

          <IconsProvider loadOn={["/icons"]}>
            <Route path="/icons" component={Icons} exact />
            <Route path="/icons/:name" component={Icon} />
          </IconsProvider>

          <ItemsProvider loadOn={["/items"]}>
            <Route path="/items/:id" component={Item} />
          </ItemsProvider>
        </CampsProvider>

        <ThemesProvider loadOn={["/themes"]}>
          <StoriesProvider loadOn={["/themes", "/stories/:slug"]}>
            <Route path="/themes" component={Themes} />
            <Route path="/stories/:slug" component={Story} />
          </StoriesProvider>
        </ThemesProvider>
      </SimplePagesProvider>
    </Router>
  );
}

export default App;
