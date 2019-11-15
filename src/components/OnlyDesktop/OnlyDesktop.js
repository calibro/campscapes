import React from "react";
import styles from "./OnlyDesktop.module.scss";

const OnlyDesktop = () => {
  return (
    <div
      className={`${styles.messageContainer} d-flex align-items-center justify-content-center d-md-none`}
    >
      <div>
        <h2>Sorry...</h2>
        <p>
          This website is optimized only for{" "}
          <span style={{ color: "var(--red-cs)" }}>desktop</span>.
        </p>
      </div>
    </div>
  );
};

export default OnlyDesktop;
