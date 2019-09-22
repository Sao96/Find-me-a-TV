import React from "react";

// the main banner at the top of the page
// @return: a component which contains a banner at top over a linear gradient for decorative purposes.
function MainBanner() {
  return (
    <div className="banner">
      <img
        alt="A banner with a TV and the text Find Me a TV"
        className="banner_size"
        src="banner.png"
      ></img>
    </div>
  );
}

export default MainBanner;
