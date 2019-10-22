import React, { useState, useEffect } from "react";
import ReactMapboxGl, { GeoJSONLayer, MapContext } from "react-mapbox-gl";
import { point, featureCollection } from "@turf/helpers";
import styles from "./CampMap.module.scss";

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const Map = ReactMapboxGl({
  accessToken: ACCESS_TOKEN,
  maxZoom: 17,
  minZoom: 10
});

const CampMap = ({
  camp,
  selectedIcon,
  yearRaster,
  yearVector,
  vectorLayers,
  rasterLayers,
  opacity
}) => {
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

  // const geojsonOnMouseMove = (cursor, map) => {
  //   map.getCanvas().style.cursor = cursor;
  // };
  //
  // const geojsonOnMouseLeave = (cursor, map) => {
  //   map.getCanvas().style.cursor = cursor;
  // };
  //
  // const geojsonOnClick = (element, zoom) => {
  //   setElement(element);
  //   setCenter(element.coordinates);
  //   setZoom([zoom]);
  // };

  useEffect(() => {
    if (selectedIcon && mapInstance) {
      // console.log(
      //   mapInstance.project([
      //     selectedIcon.data.longitude,
      //     selectedIcon.data.latitude
      //   ])
      // );
      setCenter([selectedIcon.data.longitude, selectedIcon.data.latitude]);
      setZoom([18]);
    }
  }, [selectedIcon, mapInstance]);

  useEffect(() => {
    if (mapInstance && rasterLayers) {
      const layers = mapInstance.getStyle().layers;
      let beforeLayerId = "";
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].id !== "background" && layers[i].id !== "satellite") {
          beforeLayerId = layers[i].id;
          break;
        }
      }

      rasterLayers.forEach(layer => {
        if (!mapInstance.getSource(`source-${layer.year}`)) {
          mapInstance.addSource(`source-${layer.year}`, {
            type: "image",
            url: layer.url,
            coordinates: layer.boundingbox
          });

          mapInstance.addLayer(
            {
              id: `aereal-${layer.year}`,
              type: "raster",
              source: `source-${layer.year}`,
              layout: {
                visibility: "none"
              },
              paint: {
                "raster-opacity": opacity
              }
            },
            beforeLayerId
          );
        }
      });
    }
  }, [mapInstance, rasterLayers]);

  useEffect(() => {
    if (mapInstance && opacity >= 0 && rasterLayers) {
      rasterLayers.forEach(layer => {
        mapInstance.setPaintProperty(
          `aereal-${layer.year}`,
          "raster-opacity",
          opacity
        );
      });
    }
  }, [mapInstance, opacity, rasterLayers, yearRaster]);

  useEffect(() => {
    if (mapInstance && yearRaster) {
      if (yearRaster === "none") {
        rasterLayers.forEach(layer => {
          mapInstance.setLayoutProperty(
            `aereal-${layer.year}`,
            "visibility",
            "none"
          );
        });
      } else {
        rasterLayers.forEach(layer => {
          if (yearRaster === layer.year) {
            mapInstance.setLayoutProperty(
              `aereal-${layer.year}`,
              "visibility",
              "visible"
            );
          } else {
            mapInstance.setLayoutProperty(
              `aereal-${layer.year}`,
              "visibility",
              "none"
            );
          }
        });
      }
    }
  }, [mapInstance, yearRaster, rasterLayers]);
  return (
    <React.Fragment>
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

          {vectorLayers &&
            vectorLayers.length > 0 &&
            vectorLayers.map((layer, i) => {
              return (
                <GeoJSONLayer
                  key={i}
                  data={layer.url}
                  fillExtrusionLayout={{
                    visibility: layer.year === yearVector ? "visible" : "none"
                  }}
                  fillExtrusionPaint={{
                    "fill-extrusion-height": 4,
                    "fill-extrusion-opacity": 1,
                    "fill-extrusion-color": "#c82727"
                  }}
                />
              );
            })}
          {geojsonFeatures && (
            <React.Fragment>
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
            </React.Fragment>
          )}

          {/*{element && (
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
  )}*/}
        </Map>
      </div>
      {/*<div className="container">
        <div className="row">
          <div className="col">
            <DdLayers
              year={yearRaster}
              setYear={setYearRaster}
              layers={rasterLayers}
            ></DdLayers>
          </div>
          <div className="col">
            <DdLayers
              year={yearVector}
              setYear={setYearVector}
              layers={vectorLayers}
            ></DdLayers>
          </div>
        </div>
      </div>*/}
    </React.Fragment>
  );
};

export default CampMap;
