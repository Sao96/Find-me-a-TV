import React from "react";
import "./App.css";
import "./stylesheets/itembox.css";

import HomeContainer from "./components/homecontainer";
import MainBanner from "./components/mainbanner";
function background_color() {
  return;
}

function App() {
  document.body.classList.add("main-bg");
  return (
    <div>
      <MainBanner />

      <div className="App">
        <br></br>
        <HomeContainer />
      </div>
    </div>
  );
}

export default App;
