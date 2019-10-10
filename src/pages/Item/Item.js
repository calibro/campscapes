import React, { useContext, useMemo } from "react";
import { ItemsContext } from "../../dataProviders";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import find from "lodash/find";
import FileViewer from "../../components/FileViewer";
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
      {item && (
        <React.Fragment>
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
              </div>
              <div className="col-4">
                <h6 className={styles.metadata}>description</h6>
                <p>{item.data.description}</p>
              </div>
              <div className="col-4">
                <h6 className={styles.metadata}>related storylines</h6>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
