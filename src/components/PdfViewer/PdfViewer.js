import React, { Component } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  MdZoomIn,
  MdZoomOut,
  MdYoutubeSearchedFor,
  MdArrowBack,
  MdArrowForward
} from "react-icons/md";
import styles from "./PdfViewer.module.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default class PdfViewer extends Component {
  state = {
    height: null,
    pageNumber: 1,
    numPages: null,
    scale: 1
  };

  componentDidMount() {
    if (this.container) {
      this.setState({
        height: this.container.offsetHeight
      });
    }
  }

  handlePageChange = e => {
    const { numPages } = this.state;
    const pageNumber = e.target.value;
    if (+pageNumber <= numPages) {
      this.setState({ pageNumber });
    }
  };

  handlePageZoomIn = () => {
    const { scale } = this.state;
    const newScale = scale + 0.25;
    if (newScale <= 3) {
      this.setState({ scale: newScale });
    }
  };

  handlePageZoomOut = () => {
    const { scale } = this.state;
    const newScale = scale - 0.25;
    if (newScale >= 1) {
      this.setState({ scale: newScale });
    }
  };

  resetZoom = () => {
    this.setState({ scale: 1 });
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  render() {
    const { file } = this.props;
    const { height, numPages, pageNumber, scale } = this.state;
    return (
      <div className={styles["pdf-viewer"]}>
        <div
          className={`${styles["pdf-container"]} m-3`}
          ref={r => (this.container = r)}
        >
          {height && (
            <Document onLoadSuccess={this.onDocumentLoadSuccess} file={file}>
              <Page
                height={height}
                pageNumber={pageNumber ? +pageNumber : 1}
                scale={scale}
              />
            </Document>
          )}
        </div>
        <div className={`${styles["pdf-controls"]} pb-3`}>
          <button
            onClick={() =>
              this.setState({
                pageNumber: pageNumber - 1
              })
            }
            disabled={pageNumber <= 1}
            className="btn btn-light bg-white border-dark mr-2"
          >
            <MdArrowBack size="1.4rem"></MdArrowBack>
          </button>
          <input
            className={`${styles["page-input"]} mr-2`}
            type="number"
            onChange={this.handlePageChange}
            value={pageNumber}
            min="1"
            max="numPages"
          />
          {" of "}
          {numPages}
          <button
            onClick={() =>
              this.setState({
                pageNumber: pageNumber + 1
              })
            }
            disabled={pageNumber >= numPages}
            className="btn btn-light bg-white ml-2 border-dark"
          >
            <MdArrowForward size="1.4rem"></MdArrowForward>
          </button>
          <div className="btn-group ml-3" role="group">
            <button
              type="button"
              className="btn btn-light bg-white border-dark"
              onClick={this.handlePageZoomOut}
              disabled={scale <= 1}
            >
              <MdZoomOut size="1.4rem"></MdZoomOut>
            </button>
            <button
              type="button"
              className="btn btn-light bg-white border-dark"
              onClick={this.resetZoom}
            >
              <MdYoutubeSearchedFor size="1.4rem"></MdYoutubeSearchedFor>
            </button>
            <button
              type="button"
              className="btn btn-light bg-white border-dark"
              onClick={this.handlePageZoomIn}
              disabled={scale >= 3}
            >
              <MdZoomIn size="1.4rem"></MdZoomIn>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
