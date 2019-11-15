import React from "react";
import { withRouter } from "react-router-dom";
import ReactMapboxGl, {
  GeoJSONLayer,
  ZoomControl,
  RotationControl
} from "react-mapbox-gl";
import { point, featureCollection } from "@turf/helpers";
import Bbox from "@turf/bbox";
import styles from "./CampsMap.module.scss";

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const Map = ReactMapboxGl({
  accessToken: ACCESS_TOKEN || "NO-TOKEN??",
  maxZoom: 7,
  minZoom: 2
});

const CampsMap = ({ camps, history }) => {
  let hover = null;
  const features = camps.map(camp =>
    point([camp.data.longitude, camp.data.latitude], {
      id: camp.id,
      ...camp.data
    })
  );
  const geojson = featureCollection(features);
  const bbox = Bbox(geojson);

  const geojsonOnMouseMove = (cursor, map, features) => {
    map.getCanvas().style.cursor = cursor;
    if (features.length > 0) {
      if (hover) {
        map.setFeatureState(
          { source: features[0].source, id: hover.id },
          { hover: false }
        );
      }
      hover = features[0];
      map.setFeatureState(
        { source: features[0].source, id: features[0].id },
        { hover: true }
      );
    }
  };

  const geojsonOnMouseLeave = (cursor, map) => {
    map.getCanvas().style.cursor = cursor;
    if (hover) {
      map.setFeatureState(
        { source: hover.source, id: hover.id },
        { hover: false }
      );
    }
    hover = null;
  };

  const geojsonOnClick = camp => {
    history.push(`/camps/${camp}`);
  };

  return (
    <div className={styles.mapContainer}>
      <Map
        style="mapbox://styles/mapbox/satellite-v9"
        containerStyle={{
          height: "100%",
          width: "100%"
        }}
        fitBounds={[[bbox[0], bbox[1]], [bbox[2], bbox[3]]]}
        fitBoundsOptions={{ padding: 100 }}
      >
        <ZoomControl style={{ top: 75 }} />
        <RotationControl style={{ top: 130 }}></RotationControl>
        <GeoJSONLayer
          data={geojson}
          circlePaint={{
            "circle-color": "transparent",
            "circle-stroke-width": 1,
            "circle-radius": 10,
            "circle-stroke-color": "white"
          }}
        />
        <GeoJSONLayer
          data={geojson}
          symbolPaint={{
            "text-color": "white",
            "text-halo-width": 1,
            "text-halo-color": "black"
          }}
          circlePaint={{
            "circle-color": "white",
            "circle-radius": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              8,
              5
            ]
          }}
          symbolLayout={{
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.9],
            "text-variable-anchor": ["top", "bottom", "left", "right"],
            "text-radial-offset": 0.9,
            "text-justify": "auto",
            "text-size": 12
          }}
          circleOnMouseMove={e => {
            geojsonOnMouseMove("pointer", e.target, e.features);
          }}
          circleOnMouseLeave={e => {
            geojsonOnMouseLeave("", e.target);
          }}
          circleOnClick={e => {
            if (e.features.length > 0) {
              geojsonOnClick(e.features[0].properties.siteName);
            }
          }}
          sourceOptions={{ generateId: true }}
        />
      </Map>
    </div>
  );
};

export default withRouter(CampsMap);
