import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import {
  IntroProvider,
  CampsProvider,
  CampsNetworksProvider,
  ThemesProvider,
  StoriesProvider,
  SimplePagesProvider,
  IconsProvider,
  ItemsProvider,
  HomeImagesProvider
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
import About from "./pages/About";
import Publications from "./pages/Publications";
import Educational from "./pages/Educational";
import NotFound from "./pages/NotFound";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga";
import { createBrowserHistory } from "history";

const APP_PATHS = [
  "/",
  "/home",
  "/about",
  "/publications",
  "/educational",
  "/camps",
  "/camps/:name",
  "/icons",
  "/icons/:id",
  "/items/:id",
  "/themes",
  "/stories/:slug"
];

const history = createBrowserHistory();

history.listen(location => {
  ReactGA.pageview(location.pathname + location.hash + location.search);
});

function App() {
  return (
    <Router history={history}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Campscapes</title>
        <link rel="canonical" href="https://platform.campscapes.org" />
      </Helmet>
      <Switch>
        <Route
          exact
          path={APP_PATHS}
          render={() => (
            <SimplePagesProvider>
              <IntroProvider loadOn={["/"]}>
                <HomeImagesProvider loadOn={["/", "/home"]}>
                  <Route exact path="/" component={Intro} />
                  <Route exact path="/home" component={Home} />
                </HomeImagesProvider>
              </IntroProvider>

              <Route exact path="/about" component={About} />
              <Route exact path="/publications" component={Publications} />
              <Route exact path="/educational" component={Educational} />

              <CampsProvider loadOn={["/camps", "/icons"]}>
                <Route path="/camps" component={Camps} exact />

                <CampsNetworksProvider loadOn={["/camps/:name"]}>
                  <Route path="/camps/:name" component={Camp} />
                </CampsNetworksProvider>

                <IconsProvider loadOn={["/icons"]}>
                  <Route path="/icons" component={Icons} exact />
                  <Route path="/icons/:id" component={Icon} />
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
          )}
        ></Route>

        <Route path="/" component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
