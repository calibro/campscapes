import React, { useContext, useMemo } from "react";
import { IconsContext, CampsContext } from "../../dataProviders";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import find from "lodash/find";
import get from "lodash/get";
import sortBy from "lodash/sortBy";
import findIndex from "lodash/findIndex";
import { MdClose, MdArrowBack, MdArrowForward, MdAdd } from "react-icons/md";
import FileViewer from "../../components/FileViewer";
import OnlyDesktop from "../../components/OnlyDesktop";
import styles from "./Icon.module.scss";

export default function Icon({ match, location }) {
  const { params } = match;

  const icons = useContext(IconsContext);
  const camps = useContext(CampsContext);

  const icon = useMemo(() => {
    return find(icons, item => item.id === +params.id);
  }, [icons, params.id]);

  const camp = useMemo(() => {
    if (!icon) {
      return null;
    }
    const campId = get(icon, "subjectsRelations.site[0].id");
    // getting the camp from camps as the camp on icon is not complete (no relations)
    return campId && find(camps, item => item.id === campId);
  }, [icon, camps]);

  const prevNextIcons = useMemo(() => {
    if (!camp || !icon) {
      return {};
    }
    const allCampIcons = sortBy(
      get(camp, "relations.icon", []),
      "data.startDate"
    );
    const currentIndex = findIndex(allCampIcons, item => item.id === icon.id);
    // this should never happen ... no links anyway
    if (currentIndex === -1) {
      return {};
    }

    return {
      prevIcon: currentIndex > 0 ? allCampIcons[currentIndex - 1] : undefined,
      nextIcon:
        currentIndex < allCampIcons.length - 1
          ? allCampIcons[currentIndex + 1]
          : undefined
    };
  }, [camp, icon]);

  const backLink = useMemo(() => {
    return location.state && location.state.from
      ? location.state.from
      : "/icons";
  }, [location.state]);

  return (
    <div className={styles.iconContainer}>
      <OnlyDesktop></OnlyDesktop>
      {icon && (
        <Helmet>
          <title>{icon.data.title}</title>
        </Helmet>
      )}

      {icon && (
        <div className="container h-100 d-flex flex-column">
          <div className="row">
            <div className="col-10 offset-1">
              <h6 className={styles.subtitle}>
                {camp && (
                  <Link to={`/camps/${camp.data.siteName}`}>
                    {camp.data.title}
                  </Link>
                )}{" "}
                - {new Date(icon.data.startDate).getFullYear()}
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
              {prevNextIcons.prevIcon && (
                <Link
                  to={{
                    pathname: `/icons/${prevNextIcons.prevIcon.id}`,
                    state: location.state
                  }}
                  className={styles.circleButton}
                >
                  <MdArrowBack size="1.5rem"></MdArrowBack>
                </Link>
              )}
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
                <div className="overflow-auto">
                  <p className={styles.description}>{icon.data.description}</p>
                </div>
              </div>
              {icon.linkedPages.length > 0 && (
                <div className={styles.storylinesContainer}>
                  <h6 className={styles.metadata}>related storylines</h6>
                  {icon.linkedPages
                    .filter(d => d.exhibitSlug !== "intro--do-not-remove-")
                    .map((page, i) => (
                      <div key={i} className="mb-2">
                        <Link
                          to={{
                            pathname: `/stories/${page.exhibitSlug}`,
                            search: `paragraph=${page.paragraph}&itemId=${icon.id}`,
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
            <div className="col-1 d-flex align-items-center">
              {prevNextIcons.nextIcon && (
                <Link
                  to={{
                    pathname: `/icons/${prevNextIcons.nextIcon.id}`,
                    state: location.state
                  }}
                  className={styles.circleButton}
                >
                  <MdArrowForward size="1.5rem"></MdArrowForward>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
