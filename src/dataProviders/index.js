import React, { useState, useEffect, useContext } from "react";
import { matchPath, __RouterContext } from "react-router-dom";
import axios from "axios";

const emptyList = [];

const useLoadJSON = (url, loadOn) => {
  const [data, setData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  const { location } = useContext(__RouterContext);
  let shouldLoad = true;
  if (loadOn && Array.isArray(loadOn)) {
    shouldLoad = loadOn.some(path => matchPath(location.pathname, { path }));
  }

  useEffect(() => {
    if (shouldLoad && !data && !dataLoading) {
      setDataLoading(true);
      axios.get(url).then(response => {
        setData(response.data);
        setDataLoading(false);
      });
    }
  }, [shouldLoad, data, dataLoading, url]);

  return data;
};

export const CampsContext = React.createContext([]);

export const CampsProvider = ({ children, loadOn }) => {
  const data = useLoadJSON(
    `${process.env.PUBLIC_URL}/campscapes-data/camps.json`,
    loadOn
  );
  return (
    <CampsContext.Provider value={data || emptyList}>
      {children}
    </CampsContext.Provider>
  );
};

export const CampsNetworksContext = React.createContext([]);

export const CampsNetworksProvider = ({ children, loadOn }) => {
  const data = useLoadJSON(
    `${process.env.PUBLIC_URL}/campscapes-data/campsNetworks.json`,
    loadOn
  );

  return (
    <CampsNetworksContext.Provider value={data || emptyList}>
      {children}
    </CampsNetworksContext.Provider>
  );
};

export const ThemesContext = React.createContext([]);

export const ThemesProvider = ({ children, loadOn }) => {
  const data = useLoadJSON(
    `${process.env.PUBLIC_URL}/campscapes-data/themes.json`,
    loadOn
  );
  return (
    <ThemesContext.Provider value={data || emptyList}>
      {children}
    </ThemesContext.Provider>
  );
};

export const StoriesContext = React.createContext([]);

export const StoriesProvider = ({ children, loadOn }) => {
  const data = useLoadJSON(
    `${process.env.PUBLIC_URL}/campscapes-data/stories.json`,
    loadOn
  );
  return (
    <StoriesContext.Provider value={data || emptyList}>
      {children}
    </StoriesContext.Provider>
  );
};

export const SimplePagesContext = React.createContext([]);

export const SimplePagesProvider = ({ children, loadOn }) => {
  const data = useLoadJSON(
    `${process.env.PUBLIC_URL}/campscapes-data/simplePages.json`,
    loadOn
  );
  return (
    <SimplePagesContext.Provider value={data || emptyList}>
      {children}
    </SimplePagesContext.Provider>
  );
};
