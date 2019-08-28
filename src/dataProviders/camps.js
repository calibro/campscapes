import React, { useState, useEffect } from "react";
import axios from "axios";

export const CampsContext = React.createContext([]);

export const CampsProvider = ({ children }) => {
  const [camps, setCamps] = useState([]);
  useEffect(() => {
    axios.get("/campscapes-data/camps.json").then(response => {
      setCamps(response.data);
    });
  }, []);

  return (
    <CampsContext.Provider value={camps}>{children}</CampsContext.Provider>
  );
};
