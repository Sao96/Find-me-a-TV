import React from "react";
import "./App.css";
import "./stylesheets/styles.css";

import HomeContainer from "./components/homecontainer";

function App() {
  document.body.classList.add("main-bg");
  return (
    <div>
      <div className="App">
        <br></br>
        <HomeContainer />
      </div>
    </div>
  );
}

export default App;
