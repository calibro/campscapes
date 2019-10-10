import React, { useContext, useMemo } from "react";
import { IconsContext, CampsContext } from "../../dataProviders";
import { Link } from "react-router-dom";
import find from "lodash/find";
import get from "lodash/get";
import { MdClose, MdArrowBack, MdArrowForward } from "react-icons/md";
import qs from "query-string";
import FileViewer from "../../components/FileViewer";
import styles from "./Icon.module.scss";

export default function Icon({ match, location }) {
  const { params } = match;
  const qsParams = qs.parse(location.search);

  const icons = useContext(IconsContext);
  const camps = useContext(CampsContext);

  const icon = useMemo(() => {
    return find(icons, item => item.data.timelineLabel === params.name);
  }, [icons, params.name]);

  const camp = useMemo(() => {
    if (!icon) {
      return null;
    }
    return get(icon, "subjectsRelations.site[0]");
  }, [icon]);

  const campIcons = useMemo(() => {
    if (camp) {
      return [];
    }
    return get(camp, "relations.icon", []);
  }, [camp]);

  const backLink = useMemo(() => {
    return location.state && location.state.from
      ? location.state.from
      : "/icons";
  }, [location.state]);

  console.log(campIcons, icon, camp);
  return (
    <div className={styles.iconContainer}>
      {icon && (
        <div className="container h-100 d-flex flex-column">
          <div className="row">
            <div className="col-10 offset-1">
              <h6 className={styles.subtitle}>
                {camp && camp.data.title} -{" "}
                {new Date(icon.data.startDate).getFullYear()}
              </h6>
              <h1 className={styles.title}> {icon.data.timelineLabel}</h1>
            </div>
            <div className="col-1">
              <Link to={backLink} className={styles.circleButton}>
                <MdClose size="1.5rem"></MdClose>
              </Link>
            </div>
          </div>
          <div className={`row ${styles.rowFill} mt-3`}>
            <div className="col-1 d-flex align-items-center">
              <Link to={backLink} className={styles.circleButton}>
                <MdArrowBack size="1.5rem"></MdArrowBack>
              </Link>
            </div>
            <div className="col-4 d-flex flex-column overflow-hidden">
              <div className={styles.fileContainer}>
                <div className={styles.fileViewerContainer}>
                  <FileViewer item={icon.data.files[0]}></FileViewer>
                </div>
                {icon.data.provenance && (
                  <div>
                    <h6 className={styles.metadata}>provenance</h6>
                    <h6 className={styles.subtitle}>{icon.data.provenance}</h6>
                  </div>
                )}
              </div>
            </div>
            <div className="col-6 d-flex flex-column overflow-hidden">
              <div>
                <h6 className={styles.metadata}>icon</h6>
                <h6 className={styles.subtitle}>{icon.data.title}</h6>
              </div>
              <div className={styles.descriptionContainer}>
                <p className={styles.description}>{icon.data.description}</p>
              </div>
              <div>
                <h6 className={styles.metadata}>related storylines</h6>
                {icon.linkedPages.map((page, i) => (
                  <div key={i}>
                    <Link
                      to={`/stories/${
                        page.exhibitSlug
                      }?paragraph=${page.paragraph - 1}`}
                    >
                      {page.exhibitTitle}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-1 d-flex align-items-center">
              <Link to={backLink} className={styles.circleButton}>
                <MdArrowForward size="1.5rem"></MdArrowForward>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
