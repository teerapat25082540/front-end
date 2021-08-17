import React from "react";
import HomePage from "./pages/HomePage";
import TestPage from "./pages/Test";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={HomePage} />
        <Route path="/test" component={TestPage} />
      </div>
    </Router>
  );
}

export default App;
