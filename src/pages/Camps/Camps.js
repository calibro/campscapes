import React, { useContext, useEffect } from "react";
import { CampsContext } from "../../dataProviders/camps";

const Camps = () => {
  const camps = useContext(CampsContext);
  console.log("camps data", camps);

  return <div>camps here!</div>;
};

export default Camps;
