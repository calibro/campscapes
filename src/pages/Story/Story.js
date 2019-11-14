import React, { useEffect, useContext, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { MdArrowBack, MdAddCircle } from "react-icons/md";
import { StoriesContext } from "../../dataProviders";
import find from "lodash/find";
import get from "lodash/get";
import sortBy from "lodash/sortBy";
import { Waypoint } from "react-waypoint";
import useDimensions from "react-use-dimensions";
import Menu from "../../components/Menu";
import useUrlParam from "../../hooks/useUrlParam";
import StoryItem from "../../components/StoryItem";
import styles from "./Story.module.scss";

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
        {!text && <div style={style}>sorry no text here</div>}
      </div>
    );
  }
);

const PageDots = ({ page, index, currentParagraph, onClick }) => {
  const [ref, { height }] = useDimensions();
  const attachments = get(page, "page_blocks[0].attachments", []);
  const dotHeight = 8;
  const dotMargin = 2;

  const maxDots = useMemo(() => {
    if (height) {
      return Math.floor(height / (dotHeight + dotMargin * 2));
    } else {
      return 0;
    }
  }, [height]);

  return (
    <div
      className={styles.dotsRect}
      onClick={onClick}
      style={{ opacity: index === currentParagraph ? 1 : 0.5 }}
      ref={ref}
    >
      {attachments.length > 0 &&
        maxDots &&
        attachments.slice(0, maxDots).map((a, i) => {
          if (i + 1 === maxDots) {
            return (
              <div
                key={i}
                className="d-flex align-items-center justify-center"
                style={{ height: "8px", marginBottom: "1px" }}
              >
                <MdAddCircle
                  size="12px"
                  style={{ color: "var(--red-cs)" }}
                ></MdAddCircle>
              </div>
            );
          } else {
            return <div key={i} className={styles.dot}></div>;
          }
        })}
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
  /*
    Using our custom "useUrlParam" hook
    to manage currentParagraph state from url
  */
  const validateUrl = x => {
    return pages && Number.isInteger(x) && x <= pages.length && x > 0;
  };
  const [currentParagraph, setCurrentParagraph] = useUrlParam(
    // param name in url
    "paragraph",
    // default value
    0,
    // encoding currentParagraph to url: index + 1
    x => x + 1,
    // decoding currentParagraph from url : paragraph query parameter - 1
    x => +x - 1,
    // query-string stringify options
    {},
    // validation function to get param from url. if not valid it's set to default value
    validateUrl
  );

  const containerRef = useRef();
  const itemsContainerRef = useRef();
  let pagesRef = useRef([]);
  const firstScroll = useRef(false);

  useEffect(() => {
    firstScroll.current = false;
  }, [location.pathname]);

  useEffect(() => {
    if (currentParagraph) {
      const node = pagesRef.current[currentParagraph];
      containerRef.current.scrollTo({
        top: node.offsetTop
        // behavior: "smooth"
      });
    }
  }, [pages, pagesRef, location.pathname]);

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

  //reset items section scroll after paragraph change
  useEffect(() => {
    if (itemsContainerRef.current) {
      //itemsContainerRef.current.scrollTo(0);
      itemsContainerRef.current.scrollTo(0, 0);
    }
  }, [currentParagraph]);

  return (
    <div className={styles.storyContainer}>
      <Menu light></Menu>

      {story && (
        <React.Fragment>
          <div className={styles.titleContainer}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <h6 className={styles.campLink}>
                    <Link to={`/camps/${story.camp.data.siteName}`}>
                      {story.camp.data.title}
                    </Link>
                    {story.creator.length > 0 && (
                      <span className={styles.authorsCont}>
                        {" • "}
                        <span className={styles.authorsLabel}>
                          authors
                        </span>: {story.creator.join(", ")}
                      </span>
                    )}
                  </h6>
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
              <div className="col-1 d-flex flex-column align-items-center border-left border-right position-relative">
                <div className={styles.vertLabel}>
                  <h6>index</h6>
                </div>
                <div className={styles.dots}>
                  {pages.length > 0 &&
                    pages.map((page, i) => (
                      <PageDots
                        key={page.order}
                        page={page}
                        index={i}
                        currentParagraph={currentParagraph}
                        onClick={() => {
                          const node = pagesRef.current[i];
                          containerRef.current.scrollTo({
                            top: node.offsetTop,
                            behavior: "smooth"
                          });
                        }}
                      ></PageDots>
                    ))}
                </div>
              </div>
              <div className="col-6 d-flex flex-column overflow-hidden position-relative">
                <div className={styles.vertLabel}>
                  <h6>story</h6>
                </div>
                <div className={styles.paragraphs} ref={containerRef}>
                  {pages.length > 0 &&
                    pages.map((page, i) => (
                      <StoryParagraph
                        ref={node => (pagesRef.current[i] = node)}
                        style={{
                          opacity: i === currentParagraph ? 1 : 0.5
                        }}
                        wayPointCallback={(index, enter, e) => {
                          if (!firstScroll.current) {
                            if (currentParagraph === index) {
                              firstScroll.current = true;
                            }
                            return;
                          }

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
              <div className="col-5 d-flex flex-column overflow-hidden position-relative px-0">
                <div className={styles.vertLabel}>
                  <h6>items</h6>
                </div>
                <div className={styles.attachments} ref={itemsContainerRef}>
                  {currentAttachments &&
                    currentAttachments.length > 0 &&
                    currentAttachments.map((attachment, i) => (
                      <StoryItem
                        key={i}
                        index={i + 1}
                        attachment={attachment}
                        slug={params.slug}
                      />
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

const StoryRemountable = props => {
  const pathname = props.location.pathname;
  return <Story key={pathname} {...props} />;
};

export default StoryRemountable;
