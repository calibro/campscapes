import React from "react";
import { Link } from "react-router-dom";
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
import { point, featureCollection } from "@turf/helpers";
import Bbox from "@turf/bbox";
import styles from "./CampsMap.module.scss";

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const Map = ReactMapboxGl({
  accessToken: ACCESS_TOKEN,
  maxZoom: 7,
  minZoom: 2
});

const CampsMap = ({ camps }) => {
  const features = camps.map(camp =>
    point([camp.data.longitude, camp.data.latitude], {
      id: camp.id,
      ...camp.data
    })
  );
  const geojson = featureCollection(features);
  const bbox = Bbox(geojson);

  console.log(camps, features);

  return (
    <div className={styles.mapContainer}>
      <Map
        style="mapbox://styles/mapbox/satellite-v9"
        containerStyle={{
          height: "100%",
          width: "100%"
        }}
        fitBounds={[[bbox[0], bbox[1]], [bbox[2], bbox[3]]]}
      >
        {features.map(feature => {
          return (
            <Marker
              key={feature.properties.id}
              coordinates={feature.geometry.coordinates}
              anchor="center"
              offset={[0, 20]}
            >
              <div className={styles.marker}>
                <svg width="31" height="31">
                  <circle
                    cx="50%"
                    cy="50%"
                    fill="white"
                    r="5"
                    className={styles.innerCircle}
                  ></circle>
                  <circle
                    cx="50%"
                    cy="50%"
                    fill="none"
                    r="15"
                    stroke="white"
                  ></circle>
                </svg>
                <p className="mt-1 mb-0">
                  <Link to={`/camps/${feature.properties.siteName}`}>
                    {feature.properties.title}
                  </Link>
                </p>
              </div>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
};

export default CampsMap;
