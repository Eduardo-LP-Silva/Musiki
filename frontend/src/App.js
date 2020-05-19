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
      selectedNode: { type: "none", id: "" }, // id
      nodeFilters: new Map(),
      groupIndex: 1,
      nodeInfo: undefined
    };

    this.toggleSettings = this.toggleSettings.bind(this);
    this.addNodeFilter = this.addNodeFilter.bind(this);
    this.removeNodeFilter = this.removeNodeFilter.bind(this);
    this.search = this.search.bind(this);
    this.onNodeClick = this.onNodeClick.bind(this);
    this.onNodeHover = this.onNodeHover.bind(this);
    this.paintRing = this.paintRing.bind(this);
  }

  paintRing(node, ctx) {
    console.log("HELO");
    // paint highlighted nodes
    ctx.beginPath();
    ctx.arc(
      node.x,
      node.y,
      ctx.measureText(node.id).width * 0.8,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = "orange";
    ctx.fill();
  }

  render() {
    return (
      <div id="content">
        <Navbar
          search={this.search}
          selectedNode={this.state.selectedNode}
          nodeFilters={this.state.nodeFilters}
          setNodeFilters={this.removeNodeFilter}
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
              callback={this.addGraphNode}
              filters={this.state.nodeFilters}
              addFilter={this.addNodeFilter}
              removeFilter={this.removeNodeFilter}
              nodeInfo={this.state.nodeInfo}
              ref="settings"
            />
          </Col>
          <Col md={10} className="justify-content-center">
            <Graph
              id="graph"
              graphData={this.state.graphData}
              nodeCanvasObjectMode={(node) =>
                (node === this.state.selectedNode) ? "before" : undefined
              }
              nodeCanvasObject={this.paintRing}
              onNodeClick={this.onNodeClick}
              onNodeHover={this.onNodeHover}
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
    console.log(searchString);

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

  addNodeChildren(parentNode, newNode) {
    this.addNode(newNode);

    let link = { source: parentNode, target: newNode.id, value: 1 };

    this.setState({
      graphData: {
        nodes: this.state.graphData.nodes,
        links: this.state.graphData.links.concat([link]),
      },
    });
  }

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
  }

  addNodeFilterGraph(filter) {
    let filters = this.state.nodeInfo[this.state.selectedNode.type].filters;
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].name.toUpperCase() === filter.toUpperCase()) {
        filter = filters[i];

        if (!filter.reverse) {
          requests.get(
            "values",
            {
              entities: this.state.selectedNode.id,
              properties: filter.property,
            },
            (result) => {
              let bindings = result.results.bindings;

              for (let i = 0; i < bindings.length; i++) {
                let link = bindings[i][filter.property.replace(":", "")].value;

                this.addNodeChildren(this.state.selectedNode.id, {
                  id: link.substr(link.lastIndexOf("/") + 1),
                  type: "none",
                });
              }
            }
          );
        }

        return;
      }
    }
  }

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
  }

  setSelectedNodeFilters(filters) {
    const sn = this.state.selectedNode;

    sn.filters = filters;

    this.setState({ selectedNode: sn });
  }

  toggleSettings() {
    this.setState({ settings: 1 - this.state.settings });
  }

  onNodeClick(node) {
    console.log(node);

    this.setState({ selectedNode: node });
  }

  onNodeHover(node) {
   
    if (node)   
      this.state.selectedNode = node;
  }
}

export default App;
