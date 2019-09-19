import React, { useContext } from "react";
import { ThemesContext } from "../../dataProviders";
import { StoriesContext } from "../../dataProviders";
import Menu from "../../components/Menu";
import ThemesCircles from "../../components/ThemesCircles";
import styles from "./Themes.module.scss";
import keyBy from "lodash/keyBy";
import get from "lodash/get";

const Themes = () => {
  const themes = useContext(ThemesContext);
  const stories = useContext(StoriesContext);

  console.log(themes, stories);

  const weightedThemes = themes.map(theme => ({
    name: theme.name,
    stories: stories
      .filter(story => get(story, "tags", []).indexOf(theme.name) !== -1)
      .map(story => story.id)
  }));
  console.log("weightedThemes", weightedThemes);

  return (
    <div className={styles.themesContainer}>
      <Menu></Menu>

      <div className="container">
        <div className="row align-items-baseline">
          <div className="col-12 col-md-3">
            <h1>Themes</h1>
          </div>
          <div className="col-12 col-md-9">
            <p>
              Nullam quis risus eget urna mollis ornare vel eu leo. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit. Vivamus sagittis
              lacus vel augue laoreet rutrum faucibus dolor auctor. Cras mattis
              consectetur purus sit amet fermentum.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-9">
            <ThemesCircles themes={weightedThemes} />
          </div>
          <div className="col-12 col-md-3">
            {stories.length > 0 &&
              stories.map(story => (
                <div key={story.id} className="mb-2">
                  {story.title}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Themes;
