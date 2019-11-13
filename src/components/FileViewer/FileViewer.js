import React from "react";
import get from "lodash/get";
import {
  DriverPdf,
  DriverImage,
  DriverVideo,
  DriverAudio,
  DriverMarkdown
} from "./FileViewerDrivers";

const FileViewer = ({ item, zoom, alt, fullHeight }) => {
  const mime_type = get(item, "mime_type");

  const renderSwitch = mime_type => {
    switch (mime_type) {
      case "image/jpeg":
        return <DriverImage item={item} zoom={zoom} alt={alt}></DriverImage>;
      case "image/png":
        return <DriverImage item={item} zoom={zoom} alt={alt}></DriverImage>;
      case "application/pdf":
        return <DriverPdf item={item} zoom={zoom} alt={alt}></DriverPdf>;
      case "audio/mpeg":
        return <DriverAudio item={item}></DriverAudio>;
      case "video/mp4":
        return <DriverVideo item={item}></DriverVideo>;
      case "text/plain":
        return (
          <DriverMarkdown item={item} fullHeight={fullHeight}></DriverMarkdown>
        );
      default:
        return <div>Missing mime type {mime_type}</div>;
    }
  };

  return renderSwitch(mime_type);
};

export default FileViewer;
