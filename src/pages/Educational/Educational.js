import React, { useContext, useMemo } from "react";
import { SimplePagesContext } from "../../dataProviders";
import Menu from "../../components/Menu";
import get from "lodash/get";
import find from "lodash/find";
import OnlyDesktop from "../../components/OnlyDesktop";
import styles from "./Educational.module.scss";

const Educational = () => {
  const simplePages = useContext(SimplePagesContext);
  const page = useMemo(() => {
    return find(simplePages, item => item.slug === "educational");
  }, [simplePages]);

  const pageText = get(page, "text");

  return (
    <div className={styles.educationalContainer}>
      <OnlyDesktop></OnlyDesktop>
      <Menu></Menu>
      <div className="container">
        <div className="row align-items-baseline">
          <div className="col-12 col-md-3">
            <h1>Educational</h1>
          </div>
          <div className="col-12 col-md-9">
            {pageText && (
              <div dangerouslySetInnerHTML={{ __html: pageText }}></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Educational;
