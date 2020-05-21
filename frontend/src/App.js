import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./components/navbar/navbar";
import Settings from "./components/settings/settings";
import Graph from "./components/graph/graph";
import "./App.css";

const requests = require("./components/requests/requests");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: 0,
      graphData: { nodes: [], links: [] },
      selectedNode: { type: "none", id: "" , activeFilters: []}, //when type = none, navbar is selected
      initialSearchFilter: "",
      groupIndex: 1,
      nodeInfo: undefined
    };

    this.toggleSettings = this.toggleSettings.bind(this);
    this.setSelectedNode = this.setSelectedNode.bind(this);
    this.search = this.search.bind(this);
    this.setInitialSearchFilter = this.setInitialSearchFilter.bind(this);
    this.addFilterNodes = this.addFilterNodes.bind(this);
  }

  render() {
    return (
      <div id="content">
        <Navbar
          search={this.search}
          setSelectedNode={this.setSelectedNode}
        />
        <FontAwesomeIcon
          id="settings-icon"
          icon={faCog}
          onClick={this.toggleSettings}
        />
        <Row>
          <Col md={2}>
            <Settings
              selectedNode={this.state.selectedNode}
              opacity={this.state.settings}
              nodeInfo={this.state.nodeInfo}
              initialSearchFilter={this.state.initialSearchFilter}
              setInitialSearchFilter={this.setInitialSearchFilter}
              setSelectedNode={this.setSelectedNode}
              addFilterNodes={this.addFilterNodes}
              // removeFilterNodes={removeFilterNodes}
            />
          </Col>
          <Col md={10} className="justify-content-center">
            <Graph
              id="graph"
              graphData={this.state.graphData}
              selectedNode={this.state.selectedNode}
              setSelectedNode={this.setSelectedNode}
            />
          </Col>
        </Row>
      </div>
    );
  }

  componentDidMount() {
    requests.get("nodeInfo", undefined, (result) => {
      this.setState({ nodeInfo: result });
    });
  }

  search(searchString) {
    requests.post(
      "search",
      { search_string: searchString, node_type: this.state.selectedNode.type },
      (result) => {
        console.log(result);

        if (result.type.toUpperCase() !== "NULL") {
          result.group = this.state.groupIndex;
          // this.setState({groupIndex: this.state.groupIndex+1});
          this.addNode(result);
        }
      }
    );
  }

  addNode(node) {
    this.setState({
      graphData: {
        nodes: this.state.graphData.nodes.concat([node]),
        links: this.state.graphData.links,
      },
    });
  }

  addLink(parentId, targetId) {

    let link = { source: parentId, target: targetId, value: 1 };

    this.setState({
      graphData: {
        nodes: this.state.graphData.nodes,
        links: this.state.graphData.links.concat([link]),
      },
    });
  }


  addFilterNodes(filter) {

    let filters = this.state.nodeInfo[this.state.selectedNode.type].filters;
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].name.toUpperCase() === filter.toUpperCase()) {

        filter = filters[i];

        if (!filter.reverse) {
          requests.get("values", {
            entities: this.state.selectedNode.id,
            properties: filter.property,
          }, (result, passedFilter) => {

              let bindings = result.results.bindings;

              for (let i = 0; i < bindings.length; i++) {
                let link = bindings[i][passedFilter.property.replace(':', '')].value;

                if (link !== undefined)
                  this.addNodeChildren(this.state.selectedNode.id, {id: link.substr(link.lastIndexOf('/')+1), type:"none"});
              }
          }, filter)
        }
        else {
          requests.get("entities", {
            value: `${this.state.selectedNode.id},${filter.property}`,
            ofilter: filter.validationKey,

            }, (result, passedFilter) => {
              let bindings = result.results.bindings;
              let added = [];

              for (let i = 0; i < bindings.length; i++) {
                let entityName =  bindings[i]["entities"].value
                entityName = entityName.substr(entityName.lastIndexOf('/')+1);
                let link = bindings[i][passedFilter.validationKey.replace(':', '')]?.value;

                if (!added.includes(entityName) && link !== undefined && link.toUpperCase().includes(passedFilter.validationValue.toUpperCase())) {
                  added.push(entityName);
                  
                  // TODO: get type of child node
                  this.addNodeChildren(this.state.selectedNode.id, {id: entityName, type:"none"});
                }
              }
            }, filter)
        }

        return;
      }
    }
  }

  addNodeChildren(parentNode, newNode) {
    this.addNode(newNode);

    this.addLink(parentNode, newNode.id);
    
  }

    /*
  addNodeFilter(filter) {
    const filters = this.state.nodeFilters;

    if (filters.has(this.state.selectedNode.id)) {
      const selectedFilters = filters.get(this.state.selectedNode.id);

      if (!selectedFilters.includes(filter)) {
        selectedFilters.push(filter);
        filters.set(this.state.selectedNode.id, selectedFilters);
      } else {
        console.log(
          `The selected node ${this.state.selectedNode.id} already has ${filter} filter active!`
        );
        return;
      }
    } else filters.set(this.state.selectedNode.id, [filter]);

    this.setState({ nodeFilters: filters });
    console.log(this.state.nodeFilters);

    this.addNodeFilterGraph(filter);
  } */

  /*
  removeNodeFilter(filter) {
    const filters = this.state.nodeFilters;

    if (filters.has(this.state.selectedNode.id)) {
      let selectedFilters = filters.get(this.state.selectedNode.id);

      if (selectedFilters.includes(filter)) {
        selectedFilters = selectedFilters.filter((f) => f !== filter);
        filters.set(this.state.selectedNode.id, selectedFilters);
        this.setState({ nodeFilters: filters });
      } else
        console.log(
          `The selected node ${this.state.selectedNode.id} doesn't have ${filter} filter active!`
        );
    } else
      console.log(
        `The selected node ${this.state.selectedNode.id} doesn't have any filters active!`
      );
    console.log(this.state.nodeFilters);
  } */

  setInitialSearchFilter(filter) {
    this.setState({initialSearchFilter: filter});
  }

  setSelectedNode(node) {
    this.setState({selectedNode: node});
  }

  setSelectedNodeFilters(filters) {
    const sn = this.state.selectedNode;

    sn.filters = filters;

    this.setState({ selectedNode: sn });
  }

  toggleSettings() {
    this.setState({ settings: 1 - this.state.settings });
  }
}

export default App;
