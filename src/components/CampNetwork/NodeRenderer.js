import React from "react";
import {
  MdAdd,
  MdLink,
  MdLibraryBooks,
  MdImage,
  MdPictureAsPdf,
  MdAudiotrack,
  MdVideoLibrary,
  MdNote
} from "react-icons/md";
import { Link, withRouter, useLocation } from "react-router-dom";
import useDimensions from "react-use-dimensions";
import { Text } from "@vx/text";

const CustomNodeResource = withRouter(props => {
  const {
    node,
    className,
    cx,
    cy,
    fill,
    location,
    history,
    match,
    staticContext,
    ...spreadable
  } = props;
  const { radius = 5 } = node;
  const translateX = cx ? cx - radius : 0;
  const translateY = cy ? cy - radius : 0;
  const thumbnail =
    node.data.fileUrls && node.data.fileUrls.square_thumbnail
      ? node.data.fileUrls.square_thumbnail
      : null;
  return (
    <React.Fragment>
      {thumbnail && (
        <defs>
          <pattern
            id={node.id}
            width="100%"
            height="100%"
            patternContentUnits="objectBoundingBox"
          >
            <image
              href={thumbnail}
              preserveAspectRatio="xMidYMin slice"
              width="1"
              height="1"
            ></image>
          </pattern>
        </defs>
      )}
      <Link
        to={{
          pathname: `/items/${node.id.replace("node_", "")}`,
          state: {
            from: {
              pathname: location.pathname,
              search: location.search
            }
          }
        }}
      >
        <circle
          className={`rv-force__node ${className}`}
          cx={cx}
          cy={cy}
          r={radius}
          fill={thumbnail ? `url(#${node.id})` : "white"}
          {...spreadable}
        />
        {!thumbnail && (
          <g transform={`translate(${translateX},${translateY})`}>
            <MdImage
              size={radius * 1.5 + "px"}
              style={{ color: "black", pointerEvents: "none" }}
              x={radius - (radius * 1.5) / 2}
              y={radius - (radius * 1.5) / 2}
            ></MdImage>
          </g>
        )}
      </Link>
    </React.Fragment>
  );
});

const CustomNodeStory = props => {
  const { node, className, cx, cy, fill, ...spreadable } = props;
  const { radius = 5 } = node;
  const translateX = cx ? cx - radius : 0;
  const translateY = cy ? cy - radius : 0;
  const padding = 2;
  const [ref, { height, width }] = useDimensions({ liveMeasure: false });
  let location = useLocation();

  return (
    <g
      {...spreadable}
      className={`rv-force__node ${className}`}
      transform={`translate(${translateX},${translateY})`}
    >
      <MdAdd
        size={radius * 2 + "px"}
        style={{ color: "var(--red-cs)" }}
      ></MdAdd>
      <Link
        to={{
          pathname: `/stories/${node.data.slug}`,
          state: {
            from: {
              pathname: location.pathname,
              search: location.search
            }
          }
        }}
      >
        <rect
          x={radius + radius / 2}
          y={-padding * 2}
          width={width ? width : 0}
          height={height ? height + padding * 2 : 0}
          fill={"#101012"}
        ></rect>
        <Text
          style={{ fill: "white", fontFamily: "'Inter', sans-serif" }}
          width={200}
          x={radius + radius / 2 + 5}
          y={radius}
          verticalAnchor="middle"
          innerRef={ref}
        >
          {node.data.title}
        </Text>
      </Link>
    </g>
  );
};

const CustomNodeOther = props => {
  const { node, className, cx, cy, fill, ...spreadable } = props;
  const { radius = 5 } = node;
  const translateX = cx ? cx - radius : 0;
  const translateY = cy ? cy - radius : 0;
  const iconSize = radius * 1.5;

  const switchIcon = type => {
    switch (type) {
      case "reference":
        return (
          <MdLibraryBooks
            size={radius * 1.5 + "px"}
            style={{ color: "var(--red-cs)" }}
            x={radius - (radius * 1.5) / 2}
            y={radius - (radius * 1.5) / 2}
          ></MdLibraryBooks>
        );
      case "hyperlink":
        return (
          <g transform={`translate(${radius / 3},${radius / 3})`}>
            <MdLink
              size={iconSize + "px"}
              style={{ color: "var(--red-cs)" }}
            ></MdLink>
          </g>
        );
      default:
        return (
          <MdNote
            size={radius * 1.5 + "px"}
            style={{ color: "var(--red-cs)" }}
            x={radius - (radius * 1.5) / 2}
            y={radius - (radius * 1.5) / 2}
          ></MdNote>
        );
    }
  };

  return (
    <g
      {...spreadable}
      className={`rv-force__node ${className}`}
      transform={`translate(${translateX},${translateY})`}
    >
      <circle cx={radius} cy={radius} r={radius} fill={fill} />
      {switchIcon(node.data.itemType)}
    </g>
  );
};

const NodeRenderer = props => {
  const type = props.node.data.itemType;

  const renderSwitch = type => {
    switch (type) {
      case "story":
        return <CustomNodeStory {...props}></CustomNodeStory>;
      case "resource":
        return <CustomNodeResource {...props}></CustomNodeResource>;
      case "reference":
        return <CustomNodeOther {...props}></CustomNodeOther>;
      case "hyperlink":
        return <CustomNodeOther {...props}></CustomNodeOther>;
      default:
        return <CustomNodeOther {...props}></CustomNodeOther>;
    }
  };

  return renderSwitch(type);
};

export default NodeRenderer;
