import React from "react";
import logo from "./logo.svg";
import "./App.css";
import TopNavbar from "./components/navbar";
import "./stylesheets/itembox.css";

import HomeContainer from "./components/homecontainer";

function background_color() {
  return;
}

function App() {
  document.body.classList.add("main-bg");
  return (
    <div className="App">
      <HomeContainer />
    </div>
  );
}

export default App;
