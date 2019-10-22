import React, { Component } from "react";
import ReactWaves from "@dschoon/react-waves";
import { MdPlayArrow, MdPause, MdVolumeOff, MdVolumeUp } from "react-icons/md";
import styles from "./AudioPlayer.module.scss";

class AudioPlayer extends React.Component {
  state = {
    playing: false,
    volume: 1
  };

  handleVolumeChange = e => {
    this.setState({ volume: e.target.value });
  };

  render() {
    const { audioFile, title } = this.props;
    return (
      <div className={styles.audioContainer}>
        {/* play button */}
        <div className="d-flex align-items-center p-2 bg-white">
          <div
            onClick={() => {
              this.setState({ playing: !this.state.playing });
            }}
            className={styles.audioControlButton}
          >
            {this.state.playing ? <MdPause /> : <MdPlayArrow />}
          </div>

          {/* volume control */}
          <div
            onClick={() => {
              this.setState({ volume: this.state.volume === 1 ? 0 : 1 });
            }}
            className={styles.audioControlButton}
          >
            {this.state.volume ? <MdVolumeOff /> : <MdVolumeUp />}
          </div>
          <div className={`${styles.audioTitle} text-truncate`}>{title}</div>
        </div>

        {/* wave */}
        <ReactWaves
          audioFile={audioFile}
          className={styles.objectContentAudio}
          options={{
            fillParent: true,
            barHeight: 2,
            barWidth: 3,
            cursorWidth: 10,
            cursorColor: "rgba(0,0,0,0.2)",
            hideScrollbar: true,
            progressColor: "#00041b",
            responsive: true,
            waveColor: "#D1D6DA"
          }}
          volume={this.state.volume}
          zoom={1}
          playing={this.state.playing}
        />
      </div>
    );
  }
}

export default AudioPlayer;
