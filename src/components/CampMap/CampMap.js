import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactMapboxGl, {
  Marker,
  GeoJSONLayer,
  Popup,
  MapContext
} from "react-mapbox-gl";
import { point, featureCollection } from "@turf/helpers";
import Bbox from "@turf/bbox";
import styles from "./CampMap.module.scss";
import geojsontest from "./westerbork.json";

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const Map = ReactMapboxGl({
  accessToken: ACCESS_TOKEN
  // maxZoom: 7,
  // minZoom: 2
});

const CampMap = ({ camp, selectedIcon }) => {
  const iconsFeatures = camp.relations.icon
    .filter(icon => icon.data.longitude && icon.data.latitude)
    .map(icon =>
      point([icon.data.longitude, icon.data.latitude], {
        id: icon.id,
        ...icon.data
      })
    );
  const geojsonFeatures = featureCollection(iconsFeatures);

  const campCenter = [camp.data.longitude, camp.data.latitude];

  const [element, setElement] = useState(false);
  const [center, setCenter] = useState(campCenter);
  const [zoom, setZoom] = useState([14]);
  const [mapInstance, setMapInstance] = useState(null);

  const geojsonOnMouseMove = (cursor, map) => {
    map.getCanvas().style.cursor = cursor;
  };

  const geojsonOnMouseLeave = (cursor, map) => {
    map.getCanvas().style.cursor = cursor;
  };

  const geojsonOnClick = (element, zoom) => {
    setElement(element);
    setCenter(element.coordinates);
    setZoom([zoom]);
  };

  useEffect(() => {
    if (selectedIcon) {
      console.log(
        mapInstance.project([
          selectedIcon.data.longitude,
          selectedIcon.data.latitude
        ])
      );
    }
  }, [selectedIcon, mapInstance]);

  return (
    <div className={styles.mapContainer}>
      <Map
        style="mapbox://styles/mapbox/satellite-v9"
        containerStyle={{
          height: "100%",
          width: "100%"
        }}
        center={center}
        zoom={zoom}
      >
        <MapContext.Consumer>
          {map => {
            setMapInstance(map);
          }}
        </MapContext.Consumer>

        {/*layerOptions={{ filter: ["==", "complextype", "bouwput"] }}*/}
        <GeoJSONLayer
          data={geojsontest}
          fillExtrusionLayout={{
            visibility: "visible"
          }}
          fillExtrusionPaint={{
            "fill-extrusion-height": 4,
            "fill-extrusion-opacity": 0.8,
            "fill-extrusion-color": "#c82727"
          }}
          fillExtrusionOnMouseMove={e => {
            geojsonOnMouseMove("pointer", e.target);
          }}
          fillExtrusionOnMouseLeave={e => {
            geojsonOnMouseLeave("", e.target);
          }}
          fillExtrusionOnClick={e => {
            geojsonOnClick(
              {
                coordinates: e.lngLat,
                properties: e.features[0].properties
              },
              e.target.getZoom()
            );
          }}
        />
        <GeoJSONLayer
          circleLayout={{ visibility: "visible" }}
          circlePaint={{ "circle-color": "white", "circle-radius": 8 }}
          data={geojsonFeatures}
        ></GeoJSONLayer>

        <GeoJSONLayer
          circleLayout={{ visibility: "visible" }}
          circlePaint={{
            "circle-color": "white",
            "circle-radius": 6,
            "circle-stroke-width": 1
          }}
          data={geojsonFeatures}
        ></GeoJSONLayer>
        {element && (
          <Popup key={element.properties.ID} coordinates={element.coordinates}>
            <div style={{ color: "black" }}>
              <p>{element.properties.complextype}</p>
              <div
                onClick={() => {
                  setElement(false);
                }}
              >
                CLOSE
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default CampMap;
