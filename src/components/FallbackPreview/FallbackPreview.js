import React from "react";
import {
  MdImage,
  MdPictureAsPdf,
  MdAudiotrack,
  MdVideoLibrary,
  MdNote
} from "react-icons/md";

const FallbackPreview = ({ mimetype, color, size }) => {
  const renderSwitch = mimetype => {
    switch (mimetype) {
      case "image/jpeg":
        return <MdImage color={color} size={size}></MdImage>;
      case "image/png":
        return <MdImage color={color} size={size}></MdImage>;
      case "application/pdf":
        return <MdPictureAsPdf color={color} size={size}></MdPictureAsPdf>;
      case "audio/mpeg":
        return <MdAudiotrack color={color} size={size}></MdAudiotrack>;
      case "video/mp4":
        return <MdVideoLibrary color={color} size={size}></MdVideoLibrary>;
      default:
        return <MdNote color={color} size={size}></MdNote>;
    }
  };
  return renderSwitch(mimetype);
};

export default FallbackPreview;
