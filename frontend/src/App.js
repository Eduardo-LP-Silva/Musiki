import React, { Component } from 'react';
import Navbar from './components/navbar/navbar';
import Filters from './components/filters/filters';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: "none"
    };
  }

  render() {
    return (
      <div id="content">
        <Navbar/>
        <div id="options-nav">
          
        </div>
        <Filters display={this.state.filters}/>
      </div>
    );
  }
}

export default App;
