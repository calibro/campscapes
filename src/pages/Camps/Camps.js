import React, { useContext, useMemo } from "react";
import { CampsContext } from "../../dataProviders";
import Menu from "../../components/Menu";
import CampsMap from "../../components/CampsMap";
import styles from "./Camps.module.scss";
import { SimplePagesContext } from "../../dataProviders";
import OnlyDesktop from "../../components/OnlyDesktop";
import find from "lodash/find";
import get from "lodash/get";

const Camps = () => {
  const camps = useContext(CampsContext);
  const simplePages = useContext(SimplePagesContext);

  const page = useMemo(() => {
    return find(simplePages, item => item.slug === "camps");
  }, [simplePages]);

  const pageText = get(page, "text");

  return (
    <div className={styles.campsContainer}>
      <OnlyDesktop></OnlyDesktop>
      <Menu></Menu>
      {camps.length > 0 && <CampsMap camps={camps}></CampsMap>}
      <div className={styles.bkg}>
        <div className="container">
          <div className="row align-items-baseline">
            <div className={`col-12 col-md-3`}>
              <h1>Camps</h1>
              {pageText && (
                <div dangerouslySetInnerHTML={{ __html: pageText }}></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camps;
