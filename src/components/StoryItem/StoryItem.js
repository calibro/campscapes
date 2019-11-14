import React from "react";
import {
  StoryItemResource,
  StoryItemHyperlink,
  StoryItemReference
} from "./StoryItemTypes";

const StoryItem = ({ attachment, slug, index }) => {
  const item = attachment.item;
  const item_type = item ? item.item_type : null;

  const renderSwitch = item_type => {
    switch (item_type) {
      case "resource":
        return (
          <StoryItemResource
            attachment={attachment}
            slug={slug}
            index={index}
          ></StoryItemResource>
        );
      case "icon":
        return (
          <StoryItemResource
            attachment={attachment}
            slug={slug}
            index={index}
          ></StoryItemResource>
        );
      case "hyperlink":
        return (
          <StoryItemHyperlink
            attachment={attachment}
            slug={slug}
            index={index}
          ></StoryItemHyperlink>
        );
      case "reference":
        return (
          <StoryItemReference
            attachment={attachment}
            slug={slug}
            index={index}
          ></StoryItemReference>
        );
      default:
        return <div>Missing item type {item_type}</div>;
    }
  };
  return renderSwitch(item_type);
};

export default StoryItem;
