import React from "react";
import { Link } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
// import { Text } from "@vx/text";
import styles from "./Intro.module.scss";

const Intro = () => {
  return (
    <div className="w-100 h-100 position-relative">
      <div className={styles.container}>
        <div className={styles.top}>
          <div>
            <svg className={styles.svg}>
              <text
                textAnchor="middle"
                x="50%"
                y="50%"
                className={styles.title}
              >
                Accessing Campscapes
              </text>
              {/*<Text
                verticalAnchor="start"
                className={styles.title}
                fontSize="5rem"
                fontFamily="'CeraStencilPRO', sans-serif;"
              >
                Accessing Campscapes
              </Text>*/}
            </svg>
          </div>
          <div className={styles.nextButton}>
            <MdArrowForward color="white" size="1.5rem"></MdArrowForward>
          </div>
        </div>
        <div className={styles.skip}>
          <Link to="/home">Skip</Link>
        </div>
      </div>
    </div>
  );
};

export default Intro;
