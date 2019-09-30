import React, { useContext, useMemo, useState } from "react";
import { StoriesContext } from "../../dataProviders";
import find from "lodash/find";
import get from "lodash/get";
import sortBy from "lodash/sortBy";
import Menu from "../../components/Menu";
import { Waypoint } from "react-waypoint";
import styles from "./Story.module.scss";

const StoryParagraph = ({ page, index, wayPointCallback, style }) => {
  const text = get(page, "page_blocks[0].text", null);
  return (
    text && (
      <>
        <Waypoint
          bottomOffset={"80%"}
          onEnter={e => {
            wayPointCallback && wayPointCallback(index, true, e);
          }}
          onLeave={e => {
            wayPointCallback && wayPointCallback(index, false, e);
          }}
        />
        <div dangerouslySetInnerHTML={{ __html: text }} style={style} />
      </>
    )
  );
};

const PageDots = ({ page, index, currentParagraph }) => {
  const attachments = get(page, "page_blocks[0].attachments", []);
  return (
    <div
      className={styles.dotsRect}
      style={{ background: index === currentParagraph ? "black" : undefined }}
    >
      {attachments.length > 0 &&
        attachments.map((a, i) => <div key={i} className={styles.dot}></div>)}
    </div>
  );
};

const Story = ({ match }) => {
  const stories = useContext(StoriesContext);
  const { params } = match;
  const story = useMemo(() => {
    return find(stories, item => item.slug === params.slug);
  }, [stories, params.slug]);

  const pages = useMemo(() => {
    return sortBy(get(story, "pages", []), "order");
  }, [story]);

  const [currentParagraph, setCurrentParagraph] = useState(1);

  console.log(story);

  return (
    <div className={styles.storyContainer}>
      {/* #TODO: menu should be white */}
      <Menu></Menu>

      {story && (
        <>
          <div className={styles.titleContainer}>
            <div className="container py-3">
              <h2>{story.title}</h2>
              {story.tags && (
                <div>
                  {story.tags.length > 0 &&
                    story.tags.map(tag => (
                      <span key={tag} className={styles.storyTag}>
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* story content */}
          <div className={`container ${styles.contentContainer}`}>
            <div className={styles.paragraphs}>
              {pages.length > 0 &&
                pages.map((page, i) => (
                  <StoryParagraph
                    style={{
                      backgroundColor:
                        i === currentParagraph ? "yellow" : undefined
                    }}
                    wayPointCallback={(index, enter, e) => {
                      if (enter) {
                        setCurrentParagraph(index);
                      } else if (!enter && e.currentPosition === "below") {
                        setCurrentParagraph(index - 1);
                      }
                    }}
                    index={i}
                    key={page.order}
                    page={page}
                  />
                ))}
            </div>
            <div className={styles.dots}>
              {pages.length > 0 &&
                pages.map((page, i) => (
                  <PageDots
                    key={page.order}
                    page={page}
                    index={i}
                    currentParagraph={currentParagraph}
                  ></PageDots>
                ))}
            </div>
            <div className={styles.attachments}></div>
          </div>
        </>
      )}
    </div>
  );
};

export default Story;
