import React, { useContext } from "react";
import { CampsContext } from "../../dataProviders";
import { Link } from "react-router-dom";
import Menu from "../../components/Menu";

const Camps = () => {
  const camps = useContext(CampsContext);
  console.log("camps data", camps);

  return (
    <div>
      <h2>Camps page</h2>
      {camps.map(camp => (
        <p key={camp.id}>
          <Link to={`/camps/${camp.data.siteName}`}>{camp.data.siteName}</Link>
        </p>
      ))}
      <Menu></Menu>
    </div>
  );
};

export default Camps;
