import React, { useState } from "react";
import { MdLink, MdLibraryBooks, MdAdd, MdArrowForward } from "react-icons/md";
import { Link, withRouter } from "react-router-dom";
import classNames from "classnames";
import FileViewer from "../FileViewer";
import styles from "./StoryItem.module.scss";
import Cite from "citation-js";

const Citation = ({ bibTeX }) => {
  const citation = new Cite(bibTeX);
  const citationHtml = citation.format("bibliography", {
    format: "html",
    template: "citation-apa",
    lang: "en-US"
  });
  return (
    <div
      className="pl-1"
      dangerouslySetInnerHTML={{ __html: citationHtml }}
    ></div>
  );
};

const LinkedPages = withRouter(({ linkedPages, location }) => {
  const [open, setOpen] = useState(false);
  return (
    <React.Fragment>
      <div
        className={styles.linkedButton}
        onMouseOver={() => setOpen(true)}
        onMouseOut={() => setOpen(false)}
      >
        <MdArrowForward
          size="1.4rem"
          color="white"
          className={classNames(styles.linkedArrow, {
            [styles.rotated]: open
          })}
        ></MdArrowForward>
      </div>
      <div
        className={classNames(styles.linkedPagesContainer, {
          [styles.open]: open
        })}
        onMouseOver={() => setOpen(true)}
        onMouseOut={() => setOpen(false)}
      >
        <h6 className={styles.metadata}>Jump to</h6>
        {linkedPages.map((page, i) => (
          <div key={i} className="mb-2">
            <Link
              to={{
                pathname: `/stories/${page.exhibitSlug}`,
                search: `paragraph=${page.paragraph}`,
                state: {
                  from: {
                    pathname: location.pathname,
                    search: location.search
                  }
                }
              }}
              className={`${styles.linkStory} d-flex align-items-center`}
            >
              <div>
                <MdAdd size="1rem" className={styles.plus}></MdAdd>
              </div>
              <p className={styles.storyTitle}>{page.exhibitTitle}</p>
            </Link>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
});

export const StoryItemResource = withRouter(
  ({ attachment, location, slug, index }) => {
    const caption = attachment.caption;
    const title = attachment.item.data.title;
    const id = attachment.item.id;
    const linkedPages = attachment.item.linkedPages.filter(
      d => d.exhibitSlug !== slug && d.exhibitSlug !== "intro--do-not-remove-"
    );

    return (
      <div className={`${styles.wrapper}`}>
        <div className={`${styles.resourceContainer}`}>
          <div className={styles.dotNumber}>
            <div className={styles.number}>{index}</div>
          </div>
          <div className="flex-fill px-2">
            <div className={styles.fileContainer}>
              {attachment.file && (
                <FileViewer
                  item={attachment.file}
                  alt={caption ? caption : title}
                ></FileViewer>
              )}
            </div>
            <div className={styles.infoContainer}>
              <div className="col pl-0">
                <p className={styles.caption}>
                  <Link
                    to={{
                      pathname: `/items/${id}`,
                      state: {
                        from: {
                          pathname: location.pathname,
                          search: location.search
                        }
                      }
                    }}
                  >
                    {caption ? caption : title}{" "}
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className={styles.linkedPages}>
            {attachment.item && linkedPages.length > 0 && (
              <LinkedPages linkedPages={linkedPages}></LinkedPages>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export const StoryItemHyperlink = ({ attachment, slug, index }) => {
  const link = attachment.item.data.url;
  const title = attachment.item.data.title;
  const linkedPages = attachment.item.linkedPages.filter(
    d => d.exhibitSlug !== slug && d.exhibitSlug !== "intro--do-not-remove-"
  );

  return (
    <div className={`${styles.wrapper}`}>
      <div className={`${styles.hyperlinkContainer}`}>
        <div className={styles.dotNumber}>
          <div className={styles.number}>{index}</div>
        </div>
        <div className={`${styles.hyperlinkEllipsis} flex-fill px-2 d-flex`}>
          <a
            href={link}
            target="_blank"
            rel="noreferrer noopener"
            className={styles.link}
          >
            <MdLink style={{ color: "var(--red-cs)" }}></MdLink>
            <span className="ml-1">{title}</span>
          </a>
        </div>
        <div className={styles.linkedPages}>
          {attachment.item && linkedPages.length > 0 && (
            <LinkedPages linkedPages={linkedPages}></LinkedPages>
          )}
        </div>
      </div>
    </div>
  );
};

export const StoryItemReference = ({ attachment, slug, index }) => {
  const citation = attachment.item.data;
  const linkedPages = attachment.item.linkedPages.filter(
    d => d.exhibitSlug !== slug && d.exhibitSlug !== "intro--do-not-remove-"
  );

  return (
    <div className={`${styles.wrapper}`}>
      <div className={`${styles.referenceContainer}`}>
        <div className={styles.dotNumber}>
          <div className={styles.number}>{index}</div>
        </div>

        <div className="flex-fill px-2 d-flex">
          <MdLibraryBooks
            size="1rem"
            style={{ color: "var(--red-cs)", flex: "0 0 1rem", marginTop: 2 }}
          ></MdLibraryBooks>
          {/*// TODO: format citation*/}
          {citation.bibTeX ? (
            <Citation bibTeX={citation.bibTeX}></Citation>
          ) : (
            <p className={styles.cite}>
              <span>{citation.author}. </span>
              <span>“{citation.titleOfBookOrArticle}”, </span>
              {citation.titleOfNewspaper && (
                <span>
                  <i>{citation.titleOfNewspaper}</i>{" "}
                </span>
              )}
              {citation.publicationYear && (
                <span>
                  ({citation.publicationYear}
                  {citation.monthAndDay})
                </span>
              )}
              {citation.pageNumbers && <span>:{citation.pageNumbers}. </span>}
              {citation.publisher && <span> {citation.publisher} </span>}
              {citation.editor && <span>{citation.editor} </span>}
              {citation.cityOfPublication && (
                <span>. {citation.cityOfPublication} </span>
              )}
              {citation.dateOfAccess && <span>{citation.dateOfAccess} </span>}
              {citation.urlOrDOI && <span>{citation.urlOrDOI}.</span>}
            </p>
          )}
        </div>
        <div className={styles.linkedPages}>
          {attachment.item && linkedPages.length > 0 && (
            <LinkedPages linkedPages={linkedPages}></LinkedPages>
          )}
        </div>
      </div>
    </div>
  );
};
