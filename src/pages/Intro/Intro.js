import React, { useContext, useState, useEffect } from "react";
import { IntroContext } from "../../dataProviders";
import { Link } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
import { Carousel, CarouselItem } from "reactstrap";
import styles from "./Intro.module.scss";

const Intro = () => {
  const introSteps = useContext(IntroContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const onExiting = () => {
    setAnimating(true);
  };

  const onExited = () => {
    setAnimating(false);
  };

  const next = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === introSteps.length + 1 - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === 0 ? introSteps.length + 1 - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  return (
    <div className="w-100 h-100 position-relative">
      <div className={styles.container}>
        <div className={styles.top}>
          {introSteps && introSteps.length > 0 && (
            <Carousel
              activeIndex={activeIndex}
              next={next}
              previous={previous}
              interval={false}
            >
              {[
                <CarouselItem
                  onExiting={onExiting}
                  onExited={onExited}
                  key={"animation"}
                  className={styles.carouselItem}
                >
                  <div className={styles.svgContainer}>
                    <svg className={styles.svg}>
                      <text
                        textAnchor="middle"
                        x="50%"
                        y="50%"
                        className={styles.title}
                      >
                        Accessing Campscapes
                      </text>
                    </svg>
                  </div>
                </CarouselItem>
              ].concat(
                introSteps.map((step, i) => {
                  return (
                    <CarouselItem
                      onExiting={onExiting}
                      onExited={onExited}
                      key={i}
                      className={styles.carouselItem}
                    >
                      <div
                        className={styles.introStep}
                        dangerouslySetInnerHTML={{ __html: step }}
                      ></div>
                    </CarouselItem>
                  );
                })
              )}
            </Carousel>
          )}
          <div className={styles.nextButton} onClick={next}>
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
