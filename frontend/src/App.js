import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Navbar from './components/navbar/navbar';
import Settings from './components/settings/settings';
import Graph from './components/graph/graph';
import {nodes, links} from './components/graph/miserables.json';
import './App.css';

const requests = require('./components/requests/requests');

class App extends Component {
  constructor(props) {
	 super(props);

	 this.state = {
		settings: 0,
		graphData: {nodes: [], links: []},
		selectedNode: {type: "none", id: ""}, // id
		nodeFilters: new Map(),
		groupIndex: 1,
	 };

	 this.toggleSettings = this.toggleSettings.bind(this);
	 this.addNodeFilter = this.addNodeFilter.bind(this);
	 this.removeNodeFilter = this.removeNodeFilter.bind(this);
   this.search = this.search.bind(this);
   this.onNodeClick = this.onNodeClick.bind(this);
  }

  render() {
    return (
      <div id="content">
        <Navbar 
          search={this.search} 
          selectedNode={this.state.selectedNode}
          nodeFilters={this.state.nodeFilters}
          setNodeFilters={this.removeNodeFilter}/>
          <FontAwesomeIcon id="settings-icon" icon={faCog} onClick={this.toggleSettings}/>
        <Row>
          <Col md={2} >
          <Settings 
            selectedNode={this.state.selectedNode} 
            opacity={this.state.settings} 
            callback={this.addGraphNode}
            filters={this.state.nodeFilters}
            addFilter={this.addNodeFilter}
            removeFilter={this.removeNodeFilter}
            ref="settings"
          />
          </Col>
          <Col md={10} className="justify-content-center">
			 <Graph 
			   graphData={this.state.graphData}
				 onNodeClick={this.onNodeClick}
			 />
          </Col>
        </Row>
      </div>
    );
  }

  addGraphNode(foobar) {
	 // TODO:
	 console.log(foobar);

  }

	search(searchString) {
		console.log(searchString);

    requests.post("search", { search_string: searchString, node_type: this.state.selectedNode.type}, (result) => {
      console.log(result);

      if (result.type.toUpperCase() !== "NULL") {
        result.group = this.state.groupIndex;
      // this.setState({groupIndex: this.state.groupIndex+1});
        this.addNode(result);
      }

    });
	}
	
  addNode(node) {
		this.setState({graphData: {nodes: this.state.graphData.nodes.concat([node]), links: this.state.graphData.links}});
  }

  addNodeFilter(filter) {
    const filters = this.state.nodeFilters;

    if(filters.has(this.state.selectedNode.id)) {
      const selectedFilters = filters.get(this.state.selectedNode.id);

      if(!selectedFilters.includes(filter)) {
        selectedFilters.push(filter);
        filters.set(this.state.selectedNode.id, selectedFilters);
      }
      else {
        console.log(`The selected node ${this.state.selectedNode.id} already has ${filter} filter active!`);
        return;
      }
    } 
    else
      filters.set(this.state.selectedNode.id, [filter]);

    this.setState({nodeFilters: filters});
    console.log(this.state.nodeFilters);
  }

  removeNodeFilter(filter) {
    const filters = this.state.nodeFilters;

    if(filters.has(this.state.selectedNode.id)) {
      let selectedFilters = filters.get(this.state.selectedNode.id);

      if(selectedFilters.includes(filter)) {
        selectedFilters = selectedFilters.filter(f => f !== filter);
        filters.set(this.state.selectedNode.id, selectedFilters);
        this.setState({nodeFilters: filters});
      }
      else
        console.log(`The selected node ${this.state.selectedNode.id} doesn't have ${filter} filter active!`);
    } 
    else
      console.log(`The selected node ${this.state.selectedNode.id} doesn't have any filters active!`);
      console.log(this.state.nodeFilters);
  }

  setSelectedNodeFilters(filters) {
	 const sn = this.state.selectedNode;
	 
	 sn.filters = filters;

	 this.setState({selectedNode: sn});
  }

  toggleSettings() {
	 this.setState({settings: 1 - this.state.settings});
  }


  onNodeClick(node) {
    console.log(node);
    
    this.setState({selectedNode: node});

    this.refs.settings.setFilters();
  }
}

export default App;
