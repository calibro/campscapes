import React, { useContext, useMemo } from "react";
import { ItemsContext } from "../../dataProviders";
import { MdClose, MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import find from "lodash/find";
import FileViewer from "../../components/FileViewer";
import OnlyDesktop from "../../components/OnlyDesktop";
import { Helmet } from "react-helmet";
import styles from "./Item.module.scss";

const ItemDate = ({ item }) => {
  const dateSwitch = item => {
    if (item.data.endDate) {
      return `form ${item.data.startDate} to ${item.data.endDate}`;
    } else if (item.data.startDate) {
      return item.data.startDate;
    } else if (item.data.year) {
      return item.data.year;
    } else {
      return "unknown";
    }
  };

  return <p>{dateSwitch(item)}</p>;
};

export default function Item({ match, location }) {
  const { params } = match;

  const items = useContext(ItemsContext);
  const item = useMemo(() => {
    return find(items, item => item.id === +params.id);
  }, [items, params.id]);

  const backLink = useMemo(() => {
    return location.state && location.state.from
      ? location.state.from
      : "/home";
  }, [location.state]);

  return (
    <div className={styles.itemContainer}>
      <OnlyDesktop></OnlyDesktop>
      {item && (
        <React.Fragment>
          <Helmet>
            <title>{item.data.title}</title>
          </Helmet>
          <div className={styles.titleContainer}>
            <div className="container">
              <div className="row">
                <div className="col-11">
                  <h1 className={styles.title}> {item.data.title}</h1>
                </div>
                <div className="col-1">
                  <Link to={backLink} className={styles.circleButton}>
                    <MdClose size="1.5rem"></MdClose>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.itemViewerBg}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className={styles.itemViewerContainer}>
                    <FileViewer
                      item={item.data.files[0]}
                      zoom
                      alt={item.data.title}
                      fullHeight
                    ></FileViewer>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-4">
                <div className={styles.metadataContainer}>
                  <h6 className={styles.metadata}>date</h6>
                  <ItemDate item={item}></ItemDate>
                </div>

                {item.data.provenance && (
                  <div className={styles.metadataContainer}>
                    <h6 className={styles.metadata}>provenance</h6>
                    <p>{item.data.provenance}</p>
                  </div>
                )}

                {item.data.copyright && (
                  <div className={styles.metadataContainer}>
                    <h6 className={styles.metadata}>copyright</h6>
                    <p>{item.data.copyright}</p>
                  </div>
                )}
                {item.linkedPages.length > 0 && (
                  <div>
                    <h6 className={styles.metadata}>related storylines</h6>
                    {item.linkedPages.map((page, i) => (
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
                          className={`${styles.link} d-flex align-items-center`}
                        >
                          <div>
                            <MdAdd
                              size="1.5rem"
                              className={styles.plus}
                            ></MdAdd>
                          </div>
                          <p className={styles.storyTitle}>
                            {page.exhibitTitle}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="col-8">
                <h6 className={styles.metadata}>description</h6>
                <p>{item.data.description}</p>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
