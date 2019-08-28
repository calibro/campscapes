import React, { useState, useEffect } from "react";
import axios from "axios";

export const CampsContext = React.createContext([]);

export const CampsProvider = ({ children }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("/campscapes-data/camps.json").then(response => {
      setData(response.data);
    });
  }, []);

  return <CampsContext.Provider value={data}>{children}</CampsContext.Provider>;
};

export const CampsNetworksContext = React.createContext([]);

export const CampsNetworksProvider = ({ children }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("/campscapes-data/campsNetworks.json").then(response => {
      setData(response.data);
    });
  }, []);

  return (
    <CampsNetworksContext.Provider value={data}>
      {children}
    </CampsNetworksContext.Provider>
  );
};

export const ThemesContext = React.createContext([]);

export const ThemesProvider = ({ children }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("/campscapes-data/themes.json").then(response => {
      setData(response.data);
    });
  }, []);

  return (
    <ThemesContext.Provider value={data}>{children}</ThemesContext.Provider>
  );
};

export const StoriesContext = React.createContext([]);

export const StoriesProvider = ({ children }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("/campscapes-data/stories.json").then(response => {
      setData(response.data);
    });
  }, []);

  return (
    <StoriesContext.Provider value={data}>{children}</StoriesContext.Provider>
  );
};
