import React from "react";
import { MdLink, MdLibraryBooks } from "react-icons/md";
import styles from "./StoryItem.module.scss";

export const StoryItemResource = ({ attachment }) => {
  const caption = attachment.caption;
  const title = attachment.item.data.title;
  const mime = attachment.file.mime_type;

  return (
    <div className={styles.resourceContainer}>
      <div className={styles.fileContainer}>
        {mime === "image/jpeg" && (
          <img
            src={attachment.file.file_urls.original}
            alt={caption ? caption : title}
          ></img>
        )}
      </div>
      <div className={styles.infoContainer}>
        <div>
          <p className={styles.caption}>{caption ? caption : title}</p>
        </div>
        {/*<div>link to other storyes</div>*/}
      </div>
    </div>
  );
};

export const StoryItemHyperlink = ({ attachment }) => {
  const link = attachment.item.data.url;
  const title = attachment.item.data.title;
  return (
    <div className={styles.hyperlinkContainer}>
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
  );
};

export const StoryItemReference = ({ attachment }) => {
  const citation = attachment.item.data;
  return (
    <div className={styles.referenceContainer}>
      <MdLibraryBooks
        size="1.5rem"
        style={{ color: "var(--red-cs)" }}
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
    </div>
  );
};
