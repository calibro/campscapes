import React from "react";
import { MdLink, MdLibraryBooks, MdAdd } from "react-icons/md";
import { Link, withRouter } from "react-router-dom";
import FileViewer from "../FileViewer";
import styles from "./StoryItem.module.scss";

const LinkedPages = ({ linkedPages }) => {
  return (
    <div className="col-7 pr-0">
      <h6 className={styles.metadata}>Jump to storylines</h6>
      {linkedPages.map((page, i) => (
        <div key={i} className="mb-2">
          <Link
            to={`/stories/${page.exhibitSlug}?paragraph=${page.paragraph}`}
            className={`${styles.linkStory} d-flex align-items-center`}
          >
            <div>
              <MdAdd size="1.5rem" className={styles.plus}></MdAdd>
            </div>
            <p className={styles.storyTitle}>{page.exhibitTitle}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export const StoryItemResource = withRouter(
  ({ attachment, location, slug }) => {
    const caption = attachment.caption;
    const title = attachment.item.data.title;
    const id = attachment.item.id;
    const linkedPages = attachment.item.linkedPages.filter(
      d => d.exhibitSlug !== slug
    );

    return (
      <div className={`${styles.resourceContainer} ${styles.cont}`}>
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
          {attachment.item && linkedPages.length > 0 && (
            <LinkedPages linkedPages={linkedPages}></LinkedPages>
          )}
        </div>
      </div>
    );
  }
);

export const StoryItemHyperlink = ({ attachment, slug }) => {
  const link = attachment.item.data.url;
  const title = attachment.item.data.title;
  const linkedPages = attachment.item.linkedPages.filter(
    d => d.exhibitSlug !== slug
  );

  return (
    <div className={`${styles.hyperlinkContainer} ${styles.cont}`}>
      <a
        href={link}
        target="_blank"
        rel="noreferrer noopener"
        className={styles.link}
      >
        <MdLink style={{ color: "var(--red-cs)" }}></MdLink>
        <span className="ml-1">{title}</span>
      </a>
      {attachment.item && linkedPages.length > 0 && (
        <LinkedPages linkedPages={linkedPages}></LinkedPages>
      )}
    </div>
  );
};

export const StoryItemReference = ({ attachment, slug }) => {
  const citation = attachment.item.data;
  const linkedPages = attachment.item.linkedPages.filter(
    d => d.exhibitSlug !== slug
  );
  return (
    <div className={`${styles.referenceContainer} ${styles.cont}`}>
      <MdLibraryBooks
        size="1rem"
        style={{ color: "var(--red-cs)", flex: "0 0 1rem", marginTop: 2 }}
      ></MdLibraryBooks>
      {/*// TODO: format citation*/}
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
      {attachment.item && linkedPages.length > 0 && (
        <LinkedPages linkedPages={linkedPages}></LinkedPages>
      )}
    </div>
  );
};
