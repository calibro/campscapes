import React, { useContext, useMemo } from "react";
import { IconsContext, CampsContext } from "../../dataProviders";
import find from "lodash/find";
import get from "lodash/get";
import styles from "./Icon.module.scss";
import qs from "query-string";

export default function Icon({ match, location }) {
  const { params } = match;
  const qsParams = qs.parse(location.search);

  const icons = useContext(IconsContext);
  const camps = useContext(CampsContext);

  const icon = useMemo(() => {
    return find(icons, item => item.data.timelineLabel === params.name);
  }, [icons, params.name]);

  const campIcons = useMemo(() => {
    if (!qsParams.camp) {
      return [];
    }
    const camp = find(camps, item => +item.id === +qsParams.camp);
    if (!camp) {
      return [];
    }
    return get(camp, "relations.icon", []);
  }, [camps, qsParams.camp]);

  return <div className={styles.iconContainer}>Hello icon</div>;
}
