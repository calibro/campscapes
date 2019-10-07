import React, { useContext, useMemo } from "react";
import { ItemsContext } from "../../dataProviders";
import find from "lodash/find";
import styles from "./Item.module.scss";

export default function Item({ match }) {
  const { params } = match;

  const items = useContext(ItemsContext);
  const item = useMemo(() => {
    return find(items, item => +item.id === +params.id);
  }, [items, params.id]);

  console.log("item", item);

  return <div className={styles.itemContainer}>Hello item</div>;
}
