import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h2>Home page</h2>
      <div>
        <Link to="/camps">Camps</Link> - <Link to="/icons">Icons</Link> -{" "}
        <Link to="/themes">Themes</Link>
      </div>
    </div>
  );
};

export default Home;
