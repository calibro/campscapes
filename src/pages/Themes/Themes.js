import React, { useContext } from "react";
import { ThemesContext } from "../../dataProviders";
import Menu from "../../components/Menu";

const Themes = () => {
  const themes = useContext(ThemesContext);
  console.log(themes);
  return (
    <div>
      <h2>Themes page</h2>
      <Menu></Menu>
    </div>
  );
};

export default Themes;
