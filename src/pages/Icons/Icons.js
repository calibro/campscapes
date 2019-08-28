import React, { useContext } from "react";
import { CampsContext } from "../../dataProviders";
import Menu from "../../components/Menu";

const Icons = () => {
  const camps = useContext(CampsContext);
  console.log("camps data", camps);

  return (
    <div>
      <h2>Icons page</h2>
      <Menu></Menu>
    </div>
  );
};

export default Icons;
