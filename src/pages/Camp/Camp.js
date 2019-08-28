import React, { useContext, useMemo } from "react";
import { CampsContext } from "../../dataProviders";
import Menu from "../../components/Menu";
import find from "lodash/find";

const Camp = ({ match }) => {
  const camps = useContext(CampsContext);

  const { params } = match;

  const camp = useMemo(() => {
    return find(camps, item => item.data.siteName === params.name);
  }, [camps, params.name]);

  console.log("camp data", camp);

  return (
    <div>
      <h2>Camp detail page</h2>
      {camp && (
        <div>
          <h3>{camp.data.siteName}</h3>
          <p>{camp.data.inceptionDate}</p>
        </div>
      )}
      <Menu></Menu>
    </div>
  );
};

export default Camp;
