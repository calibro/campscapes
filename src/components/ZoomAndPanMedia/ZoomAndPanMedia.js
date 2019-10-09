import React, { Component } from "react";
import ReactHammer from "react-hammerjs";
import Hammer from "hammerjs";
import { MdZoomIn, MdZoomOut, MdYoutubeSearchedFor } from "react-icons/md";
import styles from "./ZoomAndPanMedia.module.scss";

const PINCH_TIMEOUT = 300;

class ZoomAndPanMedia extends Component {
  state = {
    zoom: 1,
    pinchingZoom: 1,
    lastPinchedAt: 0,
    deltaX: 0,
    deltaY: 0,
    panDeltaX: 0,
    panDeltaY: 0,
    maxWidth: 0,
    maxHeight: 0
  };

  boundsDeltas = (deltaX, deltaY, zoom) => {
    const { maxHeight, maxWidth } = this.state;

    const maxDeltaX = (maxWidth * (+zoom - 1)) / 2;
    const maxDeltaY = (maxHeight * (+zoom - 1)) / 2;

    const boundedDeltaX = Math.max(Math.min(deltaX, maxDeltaX), -maxDeltaX);
    const boundedDeltaY = Math.max(Math.min(deltaY, maxDeltaY), -maxDeltaY);

    return {
      deltaX: boundedDeltaX,
      deltaY: boundedDeltaY
    };
  };

  handleZoom = e => {
    const { deltaX, deltaY } = this.state;
    const zoom = +e.target.value;
    this.setState({
      pinchingZoom: 1,
      zoom,
      ...this.boundsDeltas(deltaX, deltaY, zoom)
    });
  };

  handleZoomNew = param => () => {
    const { deltaX, deltaY, zoom } = this.state;

    const nextZoom = param + zoom > 4 || param + zoom < 1 ? zoom : param + zoom;
    this.setState({
      pinchingZoom: 1,
      zoom: nextZoom,
      ...this.boundsDeltas(deltaX, deltaY, nextZoom)
    });
  };

  resetZoom = () => {
    const { deltaX, deltaY } = this.state;
    const zoom = 1;
    this.setState({
      pinchingZoom: 1,
      zoom,
      ...this.boundsDeltas(deltaX, deltaY, zoom)
    });
  };

  handlePinch = e => {
    const pinchingZoom = +e.scale;
    this.setState({
      pinchingZoom
    });
  };

  handlePinchEnd = e => {
    const { deltaX, deltaY, zoom } = this.state;
    let newZoom = zoom * e.scale;
    newZoom = Math.max(Math.min(newZoom, 4), 1);

    this.setState({
      pinchingZoom: 1,
      lastPinchedAt: new Date().getTime(),
      zoom: newZoom,
      ...this.boundsDeltas(deltaX, deltaY, newZoom)
    });
  };

  handlePan = e => {
    if (
      this.state.pinchingZoom !== 1 ||
      new Date().getTime() - this.state.lastPinchedAt < PINCH_TIMEOUT
    ) {
      return;
    }
    this.setState({
      panDeltaX: +e.deltaX,
      panDeltaY: +e.deltaY
    });
  };

  handlePanEnd = e => {
    if (
      this.state.pinchingZoom !== 1 ||
      new Date().getTime() - this.state.lastPinchedAt < PINCH_TIMEOUT
    ) {
      return;
    }
    const { zoom, pinchingZoom } = this.state;

    let deltaX = +e.deltaX + this.state.deltaX;
    let deltaY = +e.deltaY + this.state.deltaY;

    this.setState({
      panDeltaX: 0,
      panDeltaY: 0,
      ...this.boundsDeltas(deltaX, deltaY, zoom * pinchingZoom)
    });
  };

  getTransform = () => {
    const {
      deltaX,
      deltaY,
      panDeltaY,
      panDeltaX,
      zoom,
      pinchingZoom
    } = this.state;
    const translateDeltaX = deltaX + panDeltaX;
    const translateDeltaY = deltaY + panDeltaY;
    const scale = zoom * pinchingZoom;
    return `translate(${translateDeltaX}px, ${translateDeltaY}px) scale(${scale})`;
  };

  onLoadImage = e => {
    this.setState({
      maxWidth: e.target.width,
      maxHeight: e.target.height
    });
  };

  render() {
    const { src } = this.props;
    return (
      <div className={styles["zoom-and-pan-media"]}>
        <div className={styles["zoom-and-pan-media-container"]}>
          <ReactHammer
            options={{
              recognizers: {
                pan: {
                  enable: true,
                  direction: Hammer.DIRECTION_ALL
                },
                pinch: {
                  enable: true
                }
              }
            }}
            onPinch={this.handlePinch}
            onPinchEnd={this.handlePinchEnd}
            onPan={this.handlePan}
            onPanEnd={this.handlePanEnd}
          >
            <img
              alt="Zoom and pan"
              onWheel={e => {
                this.handleZoomNew(e.deltaY * -0.01)();
              }}
              onDragStart={e => {
                e.preventDefault();
                return false;
              }}
              onLoad={this.onLoadImage}
              draggable="false"
              style={{ transform: this.getTransform() }}
              className={styles.zoomable}
              src={src}
            />
          </ReactHammer>
        </div>
        <div className={styles.controls}>
          <div className="btn-group-vertical" role="group">
            <button
              type="button"
              className="btn btn-light"
              onClick={this.handleZoomNew(-0.1)}
            >
              <MdZoomOut size="1.4rem"></MdZoomOut>
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={this.resetZoom}
            >
              <MdYoutubeSearchedFor size="1.4rem"></MdYoutubeSearchedFor>
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={this.handleZoomNew(0.1)}
            >
              <MdZoomIn size="1.4rem"></MdZoomIn>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ZoomAndPanMedia;
