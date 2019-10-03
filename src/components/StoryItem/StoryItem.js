import React from "react";
import {
  StoryItemResource,
  StoryItemHyperlink,
  StoryItemReference
} from "./StoryItemTypes";

const StoryItem = ({ attachment }) => {
  const item = attachment.item;
  const item_type = item.item_type;

  const renderSwitch = item_type => {
    switch (item_type) {
      case "resource":
        return <StoryItemResource attachment={attachment}></StoryItemResource>;
      case "hyperlink":
        return (
          <StoryItemHyperlink attachment={attachment}></StoryItemHyperlink>
        );
      case "reference":
        return (
          <StoryItemReference attachment={attachment}></StoryItemReference>
        );
      default:
        return <div>Missing item type {item_type}</div>;
    }
  };
  return renderSwitch(item_type);
};

export default StoryItem;
