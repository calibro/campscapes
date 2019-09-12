import React from "react";
import { Link } from "react-router-dom";

const Intro = () => {
  return (
    <div>
      <h2>Intro page</h2>
      <div>
        <Link to="/home">Home</Link>
      </div>
    </div>
  );
};

export default Intro;
