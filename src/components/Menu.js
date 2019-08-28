import React from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <div>
      <Link to="/camps">Camps</Link> - <Link to="/icons">Icons</Link> -{" "}
      <Link to="/themes">Themes</Link>
    </div>
  );
};

export default Menu;
