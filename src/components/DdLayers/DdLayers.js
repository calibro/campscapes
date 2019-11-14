import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import styles from "./DdLayers.module.scss";

const DdLayers = ({ layers, setYear, year }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  return (
    <Dropdown
      direction="up"
      isOpen={dropdownOpen}
      toggle={toggle}
      size="sm"
      className={styles.dd}
    >
      <DropdownToggle caret>{year}</DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          onClick={() => {
            setYear("none");
          }}
          className={styles.dropdownItem}
        >
          none
        </DropdownItem>
        {layers.map((l, i) => {
          return (
            <DropdownItem
              key={i}
              onClick={() => {
                setYear(l.year);
              }}
              className={styles.dropdownItem}
            >
              {l.year}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DdLayers;
