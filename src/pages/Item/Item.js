import React, { useContext, useMemo } from "react";
import { ItemsContext } from "../../dataProviders";
import { Link } from "react-router-dom";
import find from "lodash/find";
import styles from "./Item.module.scss";

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

  console.log("item", item);

  return (
    <div className={styles.itemContainer}>
      Hello item
      <Link to={backLink}>BACK</Link>
    </div>
  );
}
