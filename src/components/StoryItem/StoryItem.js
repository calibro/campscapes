import React from "react";
import {
  StoryItemResource,
  StoryItemHyperlink,
  StoryItemReference
} from "./StoryItemTypes";

const StoryItem = ({ attachment, slug, index }, ref) => {
  const item = attachment.item;
  const item_type = item ? item.item_type : null;

  const renderSwitch = item_type => {
    switch (item_type) {
      case "resource":
        return (
          <StoryItemResource
            ref={ref}
            attachment={attachment}
            slug={slug}
            index={index}
          ></StoryItemResource>
        );
      case "icon":
        return (
          <StoryItemResource
            ref={ref}
            attachment={attachment}
            slug={slug}
            index={index}
          ></StoryItemResource>
        );
      case "hyperlink":
        return (
          <StoryItemHyperlink
            ref={ref}
            attachment={attachment}
            slug={slug}
            index={index}
          ></StoryItemHyperlink>
        );
      case "reference":
        return (
          <StoryItemReference
            ref={ref}
            attachment={attachment}
            slug={slug}
            index={index}
          ></StoryItemReference>
        );
      default:
        return <div ref={ref}>Missing item type {item_type}</div>;
    }
  };
  return renderSwitch(item_type);
};

export default React.forwardRef(StoryItem);
