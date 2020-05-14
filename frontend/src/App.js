import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
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
      graphData: {nodes: nodes, links: links},
      selectedNode: {}
    };

    this.toggleSettings = this.toggleSettings.bind(this);
    this.setSelectedNode = this.setSelectedNode.bind(this);
  }

  render() {
    return (
      <div id="content">
        <Navbar setSelectedNode={this.setSelectedNode} search={this.search}/>
        {this.state.selectedNode.hasOwnProperty('type') ? 
          <FontAwesomeIcon id="settings-icon" icon={faCog} onClick={this.toggleSettings}/>
          : ''}
        <Row>
          <Col md={2} >
          <Settings 
            selectedNodeType={this.state.selectedNode.type} 
            opacity={this.state.settings} 
            callback={this.addGraphNode}
          />
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

  setSelectedNode(node) {
    this.setState({selectedNode: node});
  }

  search(searchString) {
    console.log(searchString);
  }

  toggleSettings() {
    this.setState({settings: 1 - this.state.settings});
  }
}

export default App;
