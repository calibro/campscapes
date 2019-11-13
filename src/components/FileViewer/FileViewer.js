import React from "react";
import get from "lodash/get";
import {
  DriverPdf,
  DriverImage,
  DriverVideo,
  DriverAudio,
  DriverMarkdown,
  DriverCitation
} from "./FileViewerDrivers";

const FileViewer = ({ item, file, zoom, alt }) => {
  const mime_type = get(file, "mime_type");

  const renderSwitch = mime_type => {
    switch (mime_type) {
      case "image/jpeg":
        return <DriverImage item={file} zoom={zoom} alt={alt}></DriverImage>;
      case "image/png":
        return <DriverImage item={file} zoom={zoom} alt={alt}></DriverImage>;
      case "application/pdf":
        return <DriverPdf item={file} zoom={zoom} alt={alt}></DriverPdf>;
      case "audio/mpeg":
        return <DriverAudio item={file}></DriverAudio>;
      case "video/mp4":
        return <DriverVideo item={file}></DriverVideo>;
      case "text/plain":
        return <DriverMarkdown item={file}></DriverMarkdown>;
      default:
        return <div>Missing mime type {mime_type}</div>;
    }
  };

  const renderCitation = bibTeX => {
    return <DriverCitation bibTeX={bibTeX}></DriverCitation>;
  };

  return mime_type
    ? renderSwitch(mime_type)
    : get(item, "item_type") === "reference"
    ? renderCitation(item.data.bibTeX)
    : null;
};

export default FileViewer;
