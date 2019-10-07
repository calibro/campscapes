import React, { useContext, useMemo } from "react";
import { CampsContext } from "../../dataProviders";
import Menu from "../../components/Menu";
import CampsMap from "../../components/CampsMap";
import styles from "./Camps.module.scss";
import { SimplePagesContext } from "../../dataProviders";
import find from "lodash/find";
import get from "lodash/get";

const Camps = () => {
  const camps = useContext(CampsContext);
  const simplePages = useContext(SimplePagesContext);

  const page = useMemo(() => {
    return find(simplePages, item => item.slug === "camps");
  }, [simplePages]);

  const pageText = get(page, "text");
  pageText &&
    console.info('Voilà 🍸 le page text for slug "camps" 👉', pageText);

  return (
    <div className={styles.campsContainer}>
      <Menu></Menu>
      {camps.length > 0 && <CampsMap camps={camps}></CampsMap>}
      <div className="container">
        <div className="row align-items-baseline">
          <div className="col-12 col-md-3">
            <h1>Camps</h1>
          </div>
          <div className="col-12 col-md-9">
            {pageText ? (
              <div dangerouslySetInnerHTML={{ __html: pageText }}></div>
            ) : (
              <p>
                Nullam quis risus eget urna mollis ornare vel eu leo. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
                Cras mattis consectetur purus sit amet fermentum.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camps;