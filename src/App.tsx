import React from "react";
import HomePage from "./pages/HomePage";
import TestPage from "./pages/ManageVaccine";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={HomePage} />
        <Route path="/manage" component={TestPage} />
      </div>
    </Router>
  );
}

export default App;
