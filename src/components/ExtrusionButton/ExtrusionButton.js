import React, { useState } from "react";
import { MdMenu, MdClose, Md3DRotation } from "react-icons/md";
import classNames from "classnames";
import styles from "./ExtrusionButton.module.scss";

const ExtrusionButton = ({ pitch, setPitch }) => {
  const changePitch = () => {
    return pitch[0] ? setPitch([0]) : setPitch([45]);
  };
  return (
    <div className={styles.buttonContainer}>
      <div className={styles.button} onClick={changePitch}>
        <Md3DRotation
          style={{ color: pitch[0] ? "var(--red-cs)" : "#ccc" }}
          size="20px"
        ></Md3DRotation>
      </div>
    </div>
  );
};

export default ExtrusionButton;
