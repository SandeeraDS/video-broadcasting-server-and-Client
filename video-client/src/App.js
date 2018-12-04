import React, { Component } from 'react';
import './App.css';
import { Link } from "react-router";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { endpoint: "http://localhost:4001" }
  }
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/Broadcast">Broadcast</Link></li>
          <li><Link to="/Watch">Watch</Link></li>
        </ul>
      </div>);
  }
}

export default App;
