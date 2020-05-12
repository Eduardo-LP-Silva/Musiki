import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Navbar from './components/navbar/navbar';
import Settings from './components/settings/settings';
import Graph from './components/graph/graph';
import {nodes, links} from './components/graph/miserables.json'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: 0,
      graphData: {nodes: nodes, links: links}
    };

    this.toggleSettings = this.toggleSettings.bind(this);
  }

  render() {
    return (
      <div id="content">
        <Navbar/>
        <FontAwesomeIcon id="settings-icon" icon={faCog} onClick={this.toggleSettings}/>
        <Row>
          <Col md={2} >
          <Settings opacity={this.state.settings} callback={this.addGraphNode}/>
          </Col>
          <Col md={10} className="justify-content-center">
          <Graph graphData={this.state.graphData}/>
          </Col>
        </Row>
      </div>
    );
  }

  addGraphNode(foobar) {
    // TODO:
    console.log(foobar);

  }

  toggleSettings() {
    this.setState({settings: 1 - this.state.settings});
  }
}

export default App;
