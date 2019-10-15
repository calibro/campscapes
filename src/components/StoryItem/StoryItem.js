import React from "react";
import {
  StoryItemResource,
  StoryItemHyperlink,
  StoryItemReference
} from "./StoryItemTypes";

const StoryItem = ({ attachment, slug }) => {
  const item = attachment.item;
  const item_type = item.item_type;

  const renderSwitch = item_type => {
    switch (item_type) {
      case "resource":
        return (
          <StoryItemResource
            attachment={attachment}
            slug={slug}
          ></StoryItemResource>
        );
      case "icon":
        return (
          <StoryItemResource
            attachment={attachment}
            slug={slug}
          ></StoryItemResource>
        );
      case "hyperlink":
        return (
          <StoryItemHyperlink
            attachment={attachment}
            slug={slug}
          ></StoryItemHyperlink>
        );
      case "reference":
        return (
          <StoryItemReference
            attachment={attachment}
            slug={slug}
          ></StoryItemReference>
        );
      default:
        return <div>Missing item type {item_type}</div>;
    }
  };
  return renderSwitch(item_type);
};

export default StoryItem;
