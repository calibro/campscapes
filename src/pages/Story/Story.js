import React, {
  useEffect,
  useContext,
  useMemo,
  useState,
  useRef,
  createRef
} from "react";
import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { StoriesContext } from "../../dataProviders";
import find from "lodash/find";
import get from "lodash/get";
import sortBy from "lodash/sortBy";
import { Waypoint } from "react-waypoint";
import Menu from "../../components/Menu";
import useUrlParam from "../../hooks/useUrlParam";
import StoryItem from "../../components/StoryItem";
import styles from "./Story.module.scss";
import { validate } from "@babel/types";

const StoryParagraph = React.forwardRef(
  ({ page, index, wayPointCallback, style }, ref) => {
    const text = get(page, "page_blocks[0].text", null);
    return (
      <div ref={ref}>
        <Waypoint
          bottomOffset={"80%"}
          onEnter={e => {
            wayPointCallback && wayPointCallback(index, true, e);
          }}
          onLeave={e => {
            wayPointCallback && wayPointCallback(index, false, e);
          }}
        />
        {text && (
          <div dangerouslySetInnerHTML={{ __html: text }} style={style} />
        )}
      </div>
    );
  }
);

const PageDots = ({ page, index, currentParagraph, onClick }) => {
  const attachments = get(page, "page_blocks[0].attachments", []);
  return (
    <div
      className={styles.dotsRect}
      onClick={onClick}
      style={{ opacity: index === currentParagraph ? 1 : 0.5 }}
    >
      {attachments.length > 0 &&
        attachments.map((a, i) => <div key={i} className={styles.dot}></div>)}
    </div>
  );
};

const Story = ({ match, location, history }) => {
  const stories = useContext(StoriesContext);
  const { params } = match;
  const story = useMemo(() => {
    return find(stories, item => item.slug === params.slug);
  }, [stories, params.slug]);

  const pages = useMemo(() => {
    return sortBy(get(story, "pages", []), "order");
  }, [story]);

  //const [currentParagraph, setCurrentParagraph] = useState(null);
  const validateUrl = x => pages && Number.isInteger(x) && x < pages.length;
  const [currentParagraph, setCurrentParagraph] = useUrlParam(
    location,
    history,
    "paragraph",
    0,
    x => x,
    x => +x,
    {},
    validateUrl
  );

  const containerRef = useRef();
  let pagesRef = useRef([]);

  useEffect(() => {
    pagesRef.current = pages.map(createRef);
  }, [pages]);

  const currentAttachments = useMemo(() => {
    const currentPage = pages[currentParagraph];
    if (!currentPage) {
      return null;
    }
    return get(currentPage, "page_blocks[0].attachments", []);
  }, [pages, currentParagraph]);

  const backLink = useMemo(() => {
    return location.state && location.state.from
      ? location.state.from
      : "/themes";
  }, [location.state]);

  return (
    <div className={styles.storyContainer}>
      <Menu light></Menu>

      {story && (
        <React.Fragment>
          <div className={styles.titleContainer}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <h2>
                    <span className="d-flex mr-2">
                      <Link to={backLink}>
                        <MdArrowBack
                          style={{ color: "var(--dark-cs)" }}
                          size="1.5rem"
                        ></MdArrowBack>
                      </Link>
                    </span>
                    <span>{story.title}</span>
                  </h2>
                  {story.tags && (
                    <div>
                      {story.tags.length > 0 &&
                        story.tags.map(tag => (
                          <Link
                            to={`/themes?theme=${tag}`}
                            key={tag}
                            className={styles.storyTag}
                          >
                            {tag}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* story content */}
          <div className={`container ${styles.contentContainer}`}>
            <div className={`${styles.rowFill} row`}>
              <div className="col-6 d-flex flex-column overflow-hidden">
                <div className={styles.paragraphs} ref={containerRef}>
                  {pages.length > 0 &&
                    pages.map((page, i) => (
                      <StoryParagraph
                        ref={pagesRef.current[i]}
                        style={{
                          opacity: i === currentParagraph ? 1 : 0.5
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
              </div>
              <div className="col-1 d-flex flex-column overflow-hidden align-items-center">
                <div className={styles.dots}>
                  {pages.length > 0 &&
                    pages.map((page, i) => (
                      <PageDots
                        key={page.order}
                        page={page}
                        index={i}
                        currentParagraph={currentParagraph}
                        onClick={() => {
                          const node = pagesRef.current[i].current;
                          containerRef.current.scrollTo({
                            top: node.offsetTop,
                            behavior: "smooth"
                          });
                        }}
                      ></PageDots>
                    ))}
                </div>
              </div>
              <div className="col-5 d-flex flex-column overflow-hidden">
                <div className={styles.attachments}>
                  {currentAttachments &&
                    currentAttachments.length > 0 &&
                    currentAttachments.map((attachment, i) => (
                      <StoryItem key={i} attachment={attachment} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Story;
