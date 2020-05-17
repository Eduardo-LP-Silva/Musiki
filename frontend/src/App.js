import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Navbar from './components/navbar/navbar';
import Settings from './components/settings/settings';
import Graph from './components/graph/graph';
import {nodes, links} from './components/graph/miserables.json';
import { env } from './environments/env';
import './App.css';

class App extends Component {
  constructor(props) {
	 super(props);

	 this.state = {
		settings: 0,
		graphData: {nodes: nodes, links: links},
		selectedNode: {type: "", name: ""}, //type, name
		nodeFilters: new Map()
	 };

	 this.toggleSettings = this.toggleSettings.bind(this);
	 this.setSelectedNode = this.setSelectedNode.bind(this);
	 this.addNodeFilter = this.addNodeFilter.bind(this);
	 this.removeNodeFilter = this.removeNodeFilter.bind(this);
	 this.search = this.search.bind(this);
  }

  render() {
    return (
      <div id="content">
        <Navbar 
          setSelectedNode={this.setSelectedNode} 
          search={this.search} 
          selectedNode={this.state.selectedNode}
          nodeFilters={this.state.nodeFilters}
          setNodeFilters={this.removeNodeFilter}/>
        {this.state.selectedNode.hasOwnProperty('type') ? 
          <FontAwesomeIcon id="settings-icon" icon={faCog} onClick={this.toggleSettings}/>
          : ''}
        <Row>
          <Col md={2} >
          <Settings 
            selectedNode={this.state.selectedNode} 
            opacity={this.state.settings} 
            callback={this.addGraphNode}
            filters={this.state.nodeFilters}
            addFilter={this.addNodeFilter}
            removeFilter={this.removeNodeFilter}
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

	search(searchString) {
		console.log(searchString);

		if(this.state.selectedNode.hasOwnProperty('type')) {
			fetch(`${env.API_URL}/search/`, {
				method: 'POST', // *GET, POST, PUT, DELETE, etc.
				headers: {
				  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
				},
				body: this.searchParams({
					search_string: searchString,
					node_type: this.state.selectedNode.type
				}) // body data type must match "Content-Type" header
			})
			.then(response => response.json())
			.then(data => {
				console.log(data); // JSON data parsed by `response.json()` call
			 }); 
		}
		else
		console.log('No node / search bar selected');
	}

	searchParams(params) {
		return Object.keys(params).map((key) => {
			return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
		 }).join('&');
	}

  setSelectedNode(node) {
	 this.setState({selectedNode: node});
  }

  addNodeFilter(filter) {
    const filters = this.state.nodeFilters;

    if(filters.has(this.state.selectedNode.name)) {
      const selectedFilters = filters.get(this.state.selectedNode.name);

      if(!selectedFilters.includes(filter)) {
        selectedFilters.push(filter);
        filters.set(this.state.selectedNode.name, selectedFilters);
      }
      else {
        console.log(`The selected node ${this.state.selectedNode.name} already has ${filter} filter active!`);
        return;
      }
    } 
    else
      filters.set(this.state.selectedNode.name, [filter]);

    this.setState({nodeFilters: filters});
    console.log(this.state.nodeFilters);
  }

  removeNodeFilter(filter) {
    const filters = this.state.nodeFilters;

    if(filters.has(this.state.selectedNode.name)) {
      let selectedFilters = filters.get(this.state.selectedNode.name);

      if(selectedFilters.includes(filter)) {
        selectedFilters = selectedFilters.filter(f => f !== filter);
        filters.set(this.state.selectedNode.name, selectedFilters);
        this.setState({nodeFilters: filters});
      }
      else
        console.log(`The selected node ${this.state.selectedNode.name} doesn't have ${filter} filter active!`);
    } 
    else
      console.log(`The selected node ${this.state.selectedNode.name} doesn't have any filters active!`);
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
}

export default App;
