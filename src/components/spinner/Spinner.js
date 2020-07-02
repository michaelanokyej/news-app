import React from "react";
import "./Spinner.css";

const spinner = () => (
  <div className="spinner__div">
    <div className="lds-circle">
      <div></div>
    </div>
  </div>
);

export default spinner;
