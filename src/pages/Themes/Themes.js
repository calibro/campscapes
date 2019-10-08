import React, { useContext, useState, useMemo, useEffect } from "react";
import {
  ThemesContext,
  SimplePagesContext,
  StoriesContext
} from "../../dataProviders";
import useUrlParam from "../../hooks/useUrlParam";
import { Link, withRouter } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import get from "lodash/get";
import find from "lodash/find";
import Menu from "../../components/Menu";
import ThemesCircles from "../../components/ThemesCircles";
import styles from "./Themes.module.scss";

const Themes = ({ location, history }) => {
  const themes = useContext(ThemesContext);
  const stories = useContext(StoriesContext);
  const simplePages = useContext(SimplePagesContext);

  const page = useMemo(() => {
    return find(simplePages, item => item.slug === "themes");
  }, [simplePages]);

  const pageText = get(page, "text");

  //const [selected, setSelected] = useState(null);

  const encodeArray = v => (v ? v.join(",") : "");
  const decodeArray = v => (v ? v.split(",").map(x => +x) : null);
  const [selected, setSelected] = useUrlParam(
    location,
    history,
    "theme",
    null,
    encodeArray,
    decodeArray,
    { encode: false }
  );
  const [filteredStories, setFilteredStories] = useState([]);

  const setSelectedClick = ids => {
    setSelected(prev => {
      if (JSON.stringify(prev) === JSON.stringify(ids)) {
        return null;
      } else {
        return ids;
      }
    });
  };

  useEffect(() => {
    if (selected) {
      setFilteredStories(stories.filter(d => selected.includes(d.id)));
    } else {
      setFilteredStories(stories);
    }
  }, [selected, stories]);

  const themesWithStories = themes.map(theme => ({
    name: theme.name,
    stories: stories
      .filter(story => get(story, "tags", []).indexOf(theme.name) !== -1)
      .map(story => story.id)
  }));

  console.log("selected", selected);

  return (
    <div className={styles.themesContainer}>
      <Menu></Menu>

      <div className="container h-100 d-flex flex-column">
        <div className="row align-items-baseline">
          <div className="col-12 col-md-3">
            <h1>Themes</h1>
          </div>
          <div className="col-12 col-md-9">
            <div
              className={styles.pageText}
              dangerouslySetInnerHTML={{ __html: pageText }}
            ></div>
          </div>
        </div>

        <div className={`${styles.rowFill} row`}>
          <div className="col-12 col-md-8">
            <ThemesCircles
              themes={themesWithStories}
              setSelected={setSelectedClick}
              selected={selected}
            />
          </div>
          <div className="col-12 col-md-4 d-flex flex-column overflow-hidden">
            <div className="d-flex">
              <h6 className={styles.storiesTitle}>
                stories ({filteredStories.length}/{stories.length})
              </h6>
              {selected && (
                <div className={styles.reset} onClick={() => setSelected(null)}>
                  Reset
                </div>
              )}
            </div>

            <div className={styles.storiesScroll}>
              {filteredStories.length > 0 &&
                filteredStories.map(story => (
                  <div key={story.id} className="mb-2">
                    <Link
                      to={{
                        pathname: `/stories/${story.slug}`,
                        state: {
                          from: {
                            pathname: location.pathname,
                            search: location.search
                          }
                        }
                      }}
                      className={`${styles.link} d-flex align-items-center`}
                    >
                      <div>
                        <MdAdd size="1.5rem" className={styles.plus}></MdAdd>
                      </div>
                      <p className={styles.storyTitle}>{story.title}</p>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Themes);
