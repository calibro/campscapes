import React, { useState, useEffect, useMemo } from "react";
import ReactMapboxGl, {
  GeoJSONLayer,
  MapContext,
  Popup,
  ZoomControl,
  RotationControl,
  Layer,
  Source
} from "react-mapbox-gl";
import { point, featureCollection } from "@turf/helpers";
import { MdClose } from "react-icons/md";
import { proxyDevUrl } from "../../utils";
import ExtrusionButton from "../ExtrusionButton";
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
  setSelectedIcon,
  yearRaster,
  yearVector,
  vectorLayers,
  rasterLayers,
  opacity
}) => {
  const iconsFeatures = useMemo(() => {
    if (camp && camp.relations.icon) {
      return camp.relations.icon
        .filter(icon => icon.data.longitude && icon.data.latitude)
        .map(icon =>
          point([icon.data.longitude, icon.data.latitude], {
            id: icon.id,
            ...icon.data
          })
        );
    } else {
      return [];
    }
  }, [camp]);

  const geojsonFeatures = featureCollection(iconsFeatures);
  const GEOJSON_SOURCE_OPTIONS = {
    type: "geojson",
    data: geojsonFeatures
  };

  const campCenter = [camp.data.longitude, camp.data.latitude];

  const [overFeature, setOverFeature] = useState(false);
  const [center, setCenter] = useState(campCenter);
  const [zoom, setZoom] = useState([14]);
  const [pitch, setPitch] = useState([0]);
  const [mapInstance, setMapInstance] = useState(null);

  const geojsonOnMouseMove = (cursor, map, features) => {
    if (
      features.length &&
      features[0].properties &&
      Object.keys(features[0].properties).length > 0
    ) {
      map.getCanvas().style.cursor = cursor;
    } else {
      map.getCanvas().style.cursor = "";
    }
  };

  const geojsonOnMouseLeave = (cursor, map) => {
    map.getCanvas().style.cursor = cursor;
  };

  const geojsonOnClick = e => {
    if (
      e.features.length &&
      e.features[0].properties &&
      Object.keys(e.features[0].properties).length > 0
    ) {
      setOverFeature({
        coordinates: e.lngLat,
        properties: e.features[0].properties,
        id: e.features[0].id
      });
    }
  };

  const closePopup = () => {
    setOverFeature(false);
  };

  const iconOnMouseMove = (cursor, map, features) => {
    map.getCanvas().style.cursor = cursor;
    if (features.length > 0) {
      const icon = camp.relations.icon.filter(
        d => d.id === features[0].properties.id
      );
      setSelectedIcon({ icon: icon[0] });
    }
  };

  const mouseLeaveListener = e => {
    e.target.getCanvas().style.cursor = "";
    setSelectedIcon(null);
  };

  useEffect(() => {
    if (
      selectedIcon &&
      selectedIcon.icon.data.longitude &&
      selectedIcon.icon.data.latitude &&
      mapInstance
    ) {
      if (selectedIcon.zoom) {
        setCenter([
          selectedIcon.icon.data.longitude,
          selectedIcon.icon.data.latitude
        ]);
        setZoom([selectedIcon.zoom]);
      }
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
            url: proxyDevUrl(layer.url),
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
    <div className={styles.mapContainer}>
      <Map
        style="mapbox://styles/mapbox/satellite-v9"
        containerStyle={{
          height: "100%",
          width: "100%"
        }}
        center={center}
        zoom={zoom}
        pitch={pitch}
      >
        <MapContext.Consumer>
          {map => {
            map.on("mouseleave", "icons-layer", mouseLeaveListener);
            setMapInstance(map);
          }}
        </MapContext.Consumer>
        <ZoomControl style={{ top: 75 }} />
        <RotationControl style={{ top: 130 }}></RotationControl>
        <ExtrusionButton pitch={pitch} setPitch={setPitch}></ExtrusionButton>
        {vectorLayers &&
          vectorLayers.length > 0 &&
          vectorLayers.map((layer, i) => {
            return (
              <GeoJSONLayer
                key={i}
                data={proxyDevUrl(layer.url)}
                fillExtrusionLayout={{
                  visibility: layer.year === yearVector ? "visible" : "none"
                }}
                fillExtrusionPaint={{
                  "fill-extrusion-height": [
                    "case",
                    ["boolean", ["has", "height"], true],
                    ["get", "height"],
                    3
                  ],
                  "fill-extrusion-opacity": 0.8,
                  "fill-extrusion-color": "#c82727"
                }}
                fillExtrusionOnClick={geojsonOnClick}
                fillExtrusionOnMouseMove={e => {
                  geojsonOnMouseMove("pointer", e.target, e.features);
                }}
                fillExtrusionOnMouseLeave={e => {
                  geojsonOnMouseLeave("", e.target);
                }}
                sourceOptions={{ generateId: true }}
                layerOptions={{ filter: ["==", "$type", "Polygon"] }}
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

            <Source id="source_id" geoJsonSource={GEOJSON_SOURCE_OPTIONS} />
            <Layer
              type="circle"
              id="icons-layer"
              sourceId="source_id"
              layout={{ visibility: "visible" }}
              paint={{
                "circle-color": "white",
                "circle-radius": 6,
                "circle-stroke-width": 1
              }}
              onMouseMove={e => {
                iconOnMouseMove("pointer", e.target, e.features);
              }}
            />
          </React.Fragment>
        )}
        {overFeature && (
          <Popup key={overFeature.id} coordinates={overFeature.coordinates}>
            <div className="d-flex justify-content-end mb-2">
              <MdClose
                color="black"
                size="1.2rem"
                onClick={closePopup}
                style={{ cursor: "pointer" }}
              ></MdClose>
            </div>
            <div className={styles.tableContainer}>
              <div className="table-responsive">
                <table className="table table-sm table-striped">
                  <tbody>
                    {overFeature.properties &&
                      Object.entries(overFeature.properties)
                        .filter(
                          (values, i) => values[1] !== "null" && values[1]
                        )
                        .map((values, i) => {
                          return (
                            <tr key={i}>
                              <td>{values[0]}:</td>
                              <td>
                                <b>{values[1]}</b>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default CampMap;
